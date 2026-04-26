/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, firestore } from "../../app/actions/getAdmin";
import { getVector } from "../../app/actions/getVector";
import { seed_data } from "./data";

const clearCollections = async (collectionIds: string[]) => {
    for (const id of collectionIds) {
        const snapshot = await db.collection(id).get();
        if (snapshot.empty) continue;

        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
        console.log(`Cleared collection: ${id}`);
    }
};

const normalizeTitle = (title: string) => {
    return title
        .replace(/\bBachelor of Science (in )?\b/gi, "BS in ")
        .replace(/\bBachelor of Arts (in )?\b/gi, "BA in ")
        .replace(/\bAB in \b/gi, "BA in ")
        .replace(/\bBS in \b/gi, "BS in ")
        .replace(/\s+/g, ' ')
        .trim();
};

const getProgramSlug = (text: string) => {
    const titles = text.split(/\bmajor in\b/i);
    const rawBaseTitle = titles[0].trim();
    const rawMajorTitle = titles[1]?.trim() || "";
    const baseTitle = normalizeTitle(rawBaseTitle);
    const slugify = (str: string) => 
        str.toLowerCase()
           .replace(/\s+/g, '-')
           .replace(/[^a-z0-9-]/g, '')
           .replace(/-+/g, '-')
           .replace(/^-+|-+$/g, '');

    const progSlug = slugify(baseTitle);
    const majorSlug = rawMajorTitle ? slugify(rawMajorTitle) : null;
    return { progSlug, majorSlug, baseTitle };
}

export const pushUniversities = async () => {
    if (process.env.NODE_ENV === "production") return;

    await clearCollections(["universities", "programs"]);

    for (const item of seed_data) {
        const { university, programs } = item;
        const schoolKey = university.slug;
        const allProgramSlugs = new Set<string>();

            const collegeSummaries = programs.reduce((acc: any, prog: any) => {
            const collegeName = prog.collegeData.college_name;
            const { progSlug, majorSlug } = getProgramSlug(prog.title);
            allProgramSlugs.add(progSlug);
            if (!acc[collegeName]) {
                acc[collegeName] = {
                    name: collegeName,
                    acronym: prog.collegeData.acronym,
                    tuition_range: prog.collegeData.tuition_range,
                    programs: new Set()
                };
            }
            acc[collegeName].programs.add(progSlug + (majorSlug ? `-${majorSlug}` : ""));
            return acc;
        }, {});

        const finalColleges = Object.values(collegeSummaries).map((c: any) => ({
            ...c,
            programs: Array.from(c.programs)
        }));

        const uniVectorInput = `${university.name} (${university.slug || ''}) ${university.location.city} ${university.tags.join(" ")}`;
        const uniVectorValues = await getVector(uniVectorInput);
        
        await db.collection("universities").doc(university.slug).set({
            ...university,
            colleges: finalColleges,
            programSlugs: Array.from(allProgramSlugs),
            embedding: firestore.FieldValue.vector(uniVectorValues)
        });

        // 2. Process Programs
        for (const prog of programs) {
            const { progSlug, baseTitle, majorSlug } = getProgramSlug(prog.title); 
            const progRef = db.collection("programs").doc(progSlug);
            const progSnap = await progRef.get();

            const newSchoolEntry = {
                universitySlug: schoolKey,
                universityName: university.name,
                ...prog.collegeData,
                tags: prog.tags,
                offered_majors: majorSlug ? [majorSlug] : []
            };

            const aggregatedTags = new Set(prog.tags);
            if (progSnap.exists) {
                const existingData = progSnap.data();
                const schools = existingData?.schools || [];
                const schoolIndex = schools.findIndex((s: any) => s.universitySlug === schoolKey);

                if (schoolIndex > -1) {
                    if (majorSlug && !schools[schoolIndex].offered_majors.includes(majorSlug)) {
                        schools[schoolIndex].offered_majors.push(majorSlug);
                    }
                    schools[schoolIndex].tags = Array.from(new Set([...(schools[schoolIndex].tags || []), ...prog.tags]));
                } else {
                    schools.push(newSchoolEntry);
                }

                schools.forEach((s: any) => s.tags?.forEach((t: string) => aggregatedTags.add(t)));

                const progVectorInput = `${baseTitle}. Curriculum & Focus: ${Array.from(aggregatedTags).join(", ")}`;
                const progVectorValues = await getVector(progVectorInput);

                await progRef.update({
                    schools: schools,
                    embedding: firestore.FieldValue.vector(progVectorValues)
                });
            } else {
                const progVectorInput = `${baseTitle}. Curriculum & Focus: ${prog.tags.join(", ")}`;
                const progVectorValues = await getVector(progVectorInput);
                
                await progRef.set({
                    slug: progSlug,
                    name: baseTitle,
                    schools: [newSchoolEntry],
                    embedding: firestore.FieldValue.vector(progVectorValues)
                });
            }
        }
    }
};