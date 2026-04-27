
export interface TuitionRange {
    min: number;
    max: number;
    currency: "PHP";
    billing_cycle: "Semester" | "Quarterm" | "Trimester"; 
}

export interface Program {
    title: string;
    code: string;
    tags: string[];
    majors?: string[];
}

export interface CollegeInfo {
    college_name: string;
    acronym: string;
    tuition_range: TuitionRange;
    description?: string;
    accreditation?: string[];
    offered_majors?: string[]; 
}

export interface ProgramSchema {
    slug: string;
    name: string;
    heroImage: string;
    tags: string[];
    schools: Record<string, CollegeInfo & { universityName: string, universitySlug: string }>;
    embedding?: number[];
}

export interface UniversitySchema {
    name: string;
    slug: string;
    location: {
        campus: string;
        city: string;
        address: string;
    };
    links: {
        portal: string;
        scholarship: string;
        website: string;
    };
    tags: string[];
    heroImage: string;
    embedding?: number[];
}