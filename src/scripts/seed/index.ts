/* eslint-disable @typescript-eslint/no-explicit-any */
import { cacheImage } from "@/src/actions/imageCache";
import { db, firestore } from "../../actions/getAdmin";
import { getVector } from "../../actions/getVector";
import { seed_data as scholarshipData } from "./scholarshipData";
import { seed_data as universitySeedData } from "./universityData";

const getStrandAffinities = (slug: string, name: string, tags: string[] = []): string[] => {
    const strands: string[] = [];
    const lowerSlug = slug.toLowerCase();
    const lowerName = name.toLowerCase();
    const lowerTags = tags.map(t => t.toLowerCase());
    
    const tokenString = ` ${lowerSlug} ${lowerName} ${lowerTags.join(" ")} `;

    const hasEngineering = tokenString.includes("engineer");
    const hasEducation = tokenString.includes("education") || tokenString.includes("teacher") || tokenString.includes("sped");
    const hasPureScience = tokenString.includes("biology") || tokenString.includes("chemistry") || tokenString.includes("physics") || tokenString.includes("geodetic") || tokenString.includes("geology");
    const hasSocialScience = tokenString.includes("political science") || tokenString.includes("social science") || tokenString.includes("sociology");

    const isABM = (
        tokenString.includes("account") || 
        tokenString.includes("cpa") ||
        tokenString.includes("business") || 
        tokenString.includes("management") || 
        tokenString.includes("marketing") || 
        tokenString.includes("finance") || 
        tokenString.includes("financial") || 
        tokenString.includes("economics") || 
        tokenString.includes("entrepreneur") || 
        tokenString.includes("commerce") || 
        tokenString.includes("real estate") ||
        lowerTags.some(t => ["abm", "corporate", "business", "finance", "accounting"].includes(t))
    ) && !hasEngineering && !hasEducation && !hasPureScience;

    if (isABM) {
        strands.push(
            "abm strand exclusive", 
            "strictly for business students", 
            "accountancy business management track only", 
            "corporate finance executive track"
        );
    }

    const isSTEM = (
        hasEngineering || 
        tokenString.includes("computer") || 
        tokenString.includes("software") || 
        tokenString.includes("information technology") || 
        /\bit\b/.test(tokenString) || 
        tokenString.includes("math") || 
        tokenString.includes("actuarial") ||
        tokenString.includes("nursing") || 
        tokenString.includes("medical") || 
        tokenString.includes("pharmacy") || 
        tokenString.includes("biology") || 
        tokenString.includes("chemistry") || 
        tokenString.includes("tech") ||
        lowerTags.some(t => ["stem", "engineering", "technology", "sciences", "computing"].includes(t))
    ) && !hasSocialScience && !hasEducation;

    if (isSTEM) {
        strands.push(
            "stem strand exclusive", 
            "science technology engineering mathematics track", 
            "hard sciences and computing technical path"
        );
    }

    const isHUMSS = (
        tokenString.includes("arts") || 
        tokenString.includes("communication") || 
        hasSocialScience || 
        tokenString.includes("psychology") || 
        tokenString.includes("literature") || 
        tokenString.includes("history") || 
        tokenString.includes("law") || 
        tokenString.includes("legal") || 
        tokenString.includes("journalism") || 
        tokenString.includes("philosophy") || 
        tokenString.includes("foreign service") ||
        lowerTags.some(t => ["humss", "arts", "social-sciences", "humanities", "liberal-arts"].includes(t))
    ) && !hasEngineering;

    if (isHUMSS) {
        strands.push(
            "humss strand exclusive", 
            "humanities social sciences track", 
            "liberal arts and communication path"
        );
    }

    return strands;
};

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

    console.log("Wiping collections...");
    await clearCollections(["universities", "programs", "scholarships"]);

    const batch = db.batch();
    let opCount = 0;

    console.log("Seeding Scholarships...");
    for (const item of scholarshipData) {
        const vectorInput = `${item.name} by ${item.provider}. Support for: ${item.tags.join(", ")}. ${item.description}`.toLowerCase();
        const vectorValues = await getVector(vectorInput);
        const ref = db.collection("scholarships").doc(item.id);
        batch.set(ref, { ...item, embedding: firestore.FieldValue.vector(vectorValues) });
        
        if (++opCount >= 400) { await batch.commit(); opCount = 0; }
    }

    console.log("Seeding Universities and Programs...");
    for (const item of universitySeedData) {
        const { university, programs } = item;
        if (university.heroImage) university.heroImage = await cacheImage(university.heroImage, `sobre/universities`, university.slug);

        const allProgramSlugs = new Set<string>();
        const programKeywordsForVector: string[] = [];
        const collegeSummaries = programs.reduce((acc: any, prog: any) => {
            const collegeName = prog.collegeData.college_name;
            const { progSlug, majorSlug, baseTitle } = getProgramSlug(prog.title);
            allProgramSlugs.add(progSlug);
            programKeywordsForVector.push(baseTitle, ...(majorSlug ? [majorSlug] : []), ...prog.tags);
            if (!acc[collegeName]) acc[collegeName] = { name: collegeName, acronym: prog.collegeData.acronym, tuition_range: prog.collegeData.tuition_range, programs: new Set() };
            acc[collegeName].programs.add(progSlug + (majorSlug ? `-${majorSlug}` : ""));
            return acc;
        }, {});

        const finalColleges = Object.values(collegeSummaries).map((c: any) => ({ ...c, programs: Array.from(c.programs) }));
        const inferredAliases = inferUniversityAliases(university.name);
        const uniVectorInput = `${university.name} ${university.slug} ${inferredAliases.join(" ")} ${university.location.city} offered degrees: ${Array.from(new Set(programKeywordsForVector)).join(", ")}`.toLowerCase();
        const uniVectorValues = await getVector(uniVectorInput);

        const uniRef = db.collection("universities").doc(university.slug);
        batch.set(uniRef, { ...university, aliases: inferredAliases, colleges: finalColleges, programSlugs: Array.from(allProgramSlugs), embedding: firestore.FieldValue.vector(uniVectorValues) });
        if (++opCount >= 400) { await batch.commit(); opCount = 0; }

        for (const prog of programs) {
            const { progSlug, baseTitle, majorSlug } = getProgramSlug(prog.title);
            const progRef = db.collection("programs").doc(progSlug);
            const progSnap = await progRef.get();
            const newSchoolEntry = { universitySlug: university.slug, universityName: university.name, ...prog.collegeData, tags: prog.tags, offered_majors: majorSlug ? [majorSlug] : [], heroImage: university.heroImage };
            
            if (progSnap.exists) {
                const data = progSnap.data()!;
                const schools = data.schools || [];
                const idx = schools.findIndex((s: any) => s.universitySlug === university.slug);
                if (idx > -1) {
                    if (majorSlug && !schools[idx].offered_majors.includes(majorSlug)) schools[idx].offered_majors.push(majorSlug);
                    schools[idx].tags = Array.from(new Set([...(schools[idx].tags || []), ...prog.tags]));
                } else {
                    schools.push(newSchoolEntry);
                }
                const tags = Array.from(new Set(schools.flatMap((s: any) => s.tags)));
                const vec = await getVector(`degree: ${baseTitle}. fields: ${tags.join(", ")}. tracks: ${getStrandAffinities(progSlug, baseTitle, tags as string[]).join(", ")}`);
                batch.update(progRef, { schools, strandAffinities: Array.from(new Set([...(data.strandAffinities || []), ...getStrandAffinities(progSlug, baseTitle, prog.tags)])), embedding: firestore.FieldValue.vector(vec) });
            } else {
                const vec = await getVector(`degree: ${baseTitle}. fields: ${prog.tags.join(", ")}. tracks: ${getStrandAffinities(progSlug, baseTitle, prog.tags).join(", ")}`);
                batch.set(progRef, { slug: progSlug, name: baseTitle, schools: [newSchoolEntry], strandAffinities: getStrandAffinities(progSlug, baseTitle, prog.tags), embedding: firestore.FieldValue.vector(vec) });
            }
            if (++opCount >= 400) { await batch.commit(); opCount = 0; }
        }
    }
    await batch.commit();
    console.log("Seeding complete.");
};