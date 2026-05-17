/* eslint-disable @typescript-eslint/no-explicit-any */
import { db, firestore } from "../../actions/getAdmin";
import { getVector } from "../../actions/getVector";
import { seed_data as scholarshipData } from "./scholarshipData";
import { seed_data as universitySeedData } from "./universityData";

const inferUniversityAliases = (fullName: string): string[] => {
    const aliases = new Set<string>();
    const cleanName = fullName.trim();
    
    aliases.add(cleanName);
    aliases.add(cleanName.toLowerCase());

    const coreName = cleanName
        .replace(/\bUniversity\b/gi, "")
        .replace(/\bof\b/gi, "")
        .replace(/\bthe\b/gi, "")
        .replace(/\bPhilippines\b/gi, "")
        .replace(/-.*/g, "")
        .replace(/\s+/g, " ")
        .trim();

    if (coreName && coreName.length > 2) {
        aliases.add(coreName);
        aliases.add(coreName.toLowerCase());
        
        if (coreName.toLowerCase().startsWith("de la ")) {
            const chopped = coreName.substring(3).trim();
            aliases.add(chopped);
            aliases.add(chopped.toLowerCase());
        }
    }

	const words = cleanName.split(/[\s-]+/);
    const acronym = words
        .map(w => w.replace(/[^a-zA-Z]/g, ""))
        .filter(w => w && !["of", "the", "in", "at"].includes(w.toLowerCase()))
        .map(w => w[0])
        .join("")
        .toUpperCase();

    if (acronym && acronym.length >= 2) {
        aliases.add(acronym);
        aliases.add(acronym.toLowerCase());
    }

    return Array.from(aliases);
};

const clearCollections = async (collectionIds: string[]) => {
    for (const id of collectionIds) {
        const snapshot = await db.collection(id).get();
        if (snapshot.empty) continue;

        const batch = db.batch();
        snapshot.docs.forEach((doc) => batch.delete(doc.ref));
        await batch.commit();
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
};

export const pushUniversities = async () => {
    if (process.env.NODE_ENV === "production") return;

    await clearCollections(["universities", "programs", "scholarships"]);

    console.log("Seeding Scholarships...");
    for (const item of scholarshipData) {
        const vectorInput = `${item.name} by ${item.provider}. Support for: ${item.tags.join(", ")}. ${item.description}`.toLowerCase();
        const vectorValues = await getVector(vectorInput);

        await db.collection("scholarships").doc(item.id).set({
            ...item,
            embedding: firestore.FieldValue.vector(vectorValues)
        });
    }

    console.log("Seeding Universities...");
    for (const item of universitySeedData) {
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

        const inferredAliases = inferUniversityAliases(university.name);
        const aliasSearchString = inferredAliases.join(" ");

        const uniVectorInput = `${university.name} ${university.name.toLowerCase()} ${university.slug} ${aliasSearchString} ${university.location.city} ${university.location.city.toLowerCase()} ${university.tags.join(" ").toLowerCase()}`;
        const uniVectorValues = await getVector(uniVectorInput);
        
        await db.collection("universities").doc(university.slug).set({
            ...university,
            aliases: inferredAliases,
            colleges: finalColleges,
            programSlugs: Array.from(allProgramSlugs),
            embedding: firestore.FieldValue.vector(uniVectorValues)
        });

        console.log(`Seeding Programs of ${university.name}...`);
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

                const progVectorInput = `${baseTitle} ${baseTitle.toLowerCase()}. Focus fields: ${Array.from(aggregatedTags).join(", ").toLowerCase()}`;
                const progVectorValues = await getVector(progVectorInput);

                await progRef.update({
                    schools: schools,
                    embedding: firestore.FieldValue.vector(progVectorValues)
                });
            } else {
                const progVectorInput = `${baseTitle} ${baseTitle.toLowerCase()}. Focus fields: ${prog.tags.join(", ").toLowerCase()}`;
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