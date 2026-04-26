import { UniversitySchema, CollegeInfo } from "../../types/dataSchema";

interface SeedItem {
    university: UniversitySchema;
    programs: {
        title: string;
        code: string;
        tags: string[];
        collegeData: CollegeInfo;
    }[];
}

export const seed_data: SeedItem[] = [
    {
        university: {
            name: "University of the Philippines - Diliman",
            slug: "upd",
            heroImage: "https://smapse.com/storage/2020/05/diliman7.jpg",
            location: {
                campus: "Diliman Campus",
                city: "Quezon City",
                address: "Roxas Ave, Diliman, Quezon City, 1101 Metro Manila"
            },
            links: {
                portal: "https://upcat.up.edu.ph",
                scholarship: "https://slasonline.up.edu.ph",
                website: "https://upd.edu.ph"
            },
            tags: ["Semestral", "State University", "Free Tuition", "National University", "QS World Ranking: #404", "THE World Ranking: 801-1000", "CHED Autonomous Status", "ASEAN University Network Member", "Center of Excellence", "Top 1 Engineering School Philippines", "Premier Research Hub", "Public Sector Leader"]
        },
        programs: [
            { title: "BS in Computer Science", code: "BSCS", tags: ["Algorithms", "Artificial Intelligence", "Theory", "Data Structures", "CHED Center of Excellence", "COE", "Engineering Accreditation", "Research Track"], collegeData: { college_name: "College of Engineering", acronym: "COE", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "Washington Accord Equivalent"] } },
            { title: "BS in Geodetic Engineering", code: "BSGE", tags: ["Geomatics", "Remote Sensing", "GIS", "Land Management", "CHED Center of Excellence", "Board Exam Top Performing", "Satellite Imagery"], collegeData: { college_name: "College of Engineering", acronym: "COE", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } },
            { title: "BS in Industrial Engineering", code: "BSIE", tags: ["Operations Research", "Systems Optimization", "Supply Chain", "Ergonomics", "CHED Center of Excellence", "Management Science"], collegeData: { college_name: "College of Engineering", acronym: "COE", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } },
            { title: "BS in Chemical Engineering", code: "BSChE", tags: ["Process Design", "Biotechnology", "Material Science", "Thermodynamics", "CHED Center of Excellence", "Industrial Chemistry"], collegeData: { college_name: "College of Engineering", acronym: "COE", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } },
            { title: "BS in Molecular Biology and Biotechnology", code: "BSMBB", tags: ["Genetic Engineering", "Microbiology", "Bioinformatics", "Molecular Research", "CHED Center of Excellence", "Premier Science Program"], collegeData: { college_name: "College of Science", acronym: "CS", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } },
            { title: "BS in Applied Physics", code: "BSAP", tags: ["Instrumentation", "Photonics", "Materials Physics", "Computational Physics", "CHED Center of Excellence", "Advanced Research"], collegeData: { college_name: "College of Science", acronym: "CS", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } },
            { title: "BS in Mathematics", code: "BS-MATH", tags: ["Pure Mathematics", "Actuarial Science", "Statistics", "Number Theory", "CHED Center of Excellence", "Quantitative Analytics"], collegeData: { college_name: "College of Science", acronym: "CS", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } },
            { title: "Bachelor of Secondary Education", code: "BSEd", tags: ["Language Education", "Science Teaching", "Pedagogy", "Curriculum Design", "CHED Center of Excellence", "Premier Teacher Training"], collegeData: { college_name: "College of Education", acronym: "EDUC", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } }
        ]
    },
    {
        university: {
            name: "De La Salle University",
            slug: "dlsu",
            heroImage: "https://businessmirror.com.ph/wp-content/uploads/2020/10/dlsu01-102920-696x464.jpg",
            location: {
                campus: "Main Campus",
                city: "Malate, Manila",
                address: "2401 Taft Ave, Malate, Manila, 1004 Metro Manila"
            },
            links: {
                portal: "https://applyarchershub.dlsu.edu.ph/ApplicationLandingPage/index/DLSU",
                scholarship: "https://www.dlsu.edu.ph/admissions/scholarships/",
                website: "https://www.dlsu.edu.ph"
            },
            tags: ["Trimestral", "PAASCU Level IV", "Research-Heavy", "Private Catholic", "Center of Excellence", "QS World Ranking: #681-690", "THE World Ranking: 1201-1500", "ASEAN University Network Member", "Cintana Alliance Partner", "Business Excellence", "Top IT University", "Innovation Leader"]
        },
        programs: [
            { title: "BS in Computer Science major in Software Technology", code: "BSCS-ST", tags: ["Software Engineering", "Full-stack Development", "Algorithms", "Systems Architecture", "CHED Center of Excellence", "ABET Accredited", "High Salary Track"], collegeData: { college_name: "Gokongwei College of Computer Studies", acronym: "CCS", tuition_range: { min: 75000, max: 95000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "ABET Accredited", "PAASCU Level IV"] } },
            { title: "BS in Information Technology", code: "BS-IT", tags: ["Web Systems", "Mobile Development", "UX Design", "Cloud Computing", "CHED Center of Excellence", "Industry Partnership", "Digital Transformation"], collegeData: { college_name: "Gokongwei College of Computer Studies", acronym: "CCS", tuition_range: { min: 75000, max: 95000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "BS in Accountancy", code: "BSA", tags: ["Financial Audit", "Taxation", "CPA Track", "Management Accounting", "CHED Center of Excellence", "Top Performing School", "Global Finance"], collegeData: { college_name: "Andrew L. Tan College of Business", acronym: "RVR-COB", tuition_range: { min: 75000, max: 90000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "AACSB Member", "PAASCU Level IV"] } },
            { title: "BS in Applied Corporate Management", code: "BS-ACM", tags: ["Corporate Strategy", "Operations", "Leadership", "Business Ethics", "CHED Center of Excellence", "Management Training", "Industry Internship"], collegeData: { college_name: "Andrew L. Tan College of Business", acronym: "RVR-COB", tuition_range: { min: 75000, max: 90000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "BS in Civil Engineering", code: "BS-CE", tags: ["Structural Engineering", "Urban Planning", "Hydraulics", "Geotechnics", "CHED Center of Excellence", "ABET Engineering Accreditation"], collegeData: { college_name: "Gokongwei College of Engineering", acronym: "GCOE", tuition_range: { min: 78000, max: 95000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "ABET Accredited", "PAASCU Level IV"] } },
            { title: "BS in Manufacturing Engineering and Management", code: "BS-MEM", tags: ["Industrial Automation", "Supply Chain", "Mechatronics", "Lean Manufacturing", "CHED Center of Excellence", "Robotics Integration"], collegeData: { college_name: "Gokongwei College of Engineering", acronym: "GCOE", tuition_range: { min: 78000, max: 95000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } }
        ]
    },
    {
        university: {
            name: "Ateneo de Manila University",
            slug: "ateneo",
            heroImage: "https://sa.kapamilya.com/absnews/abscbnnews/media/2023/life/06/26/20230526-ateneo-de-manila-gcs151442.jpg",
            location: {
                campus: "Loyola Heights Campus",
                city: "Quezon City",
                address: "Katipunan Ave, Loyola Heights, Quezon City, 1108 Metro Manila"
            },
            links: {
                portal: "https://www.ateneo.edu/admissions",
                scholarship: "https://www.ateneo.edu/scholarships",
                website: "https://www.ateneo.edu"
            },
            tags: ["Semestral", "Jesuit Education", "Liberal Arts Core", "Magis", "PAASCU Level IV", "QS World Ranking: #563", "THE World Ranking: 1001-1200", "CHED Autonomous Status", "Premier Liberal Arts", "Social Justice Focused", "Strong Alumni Network", "Holistic Development"]
        },
        programs: [
            { title: "BS in Management Engineering", code: "BS-ME", tags: ["Operations Research", "Quantitative Management", "Decision Science", "Industrial Engineering", "CHED Center of Excellence", "Elite Business Track", "Data-Driven Management"], collegeData: { college_name: "John Gokongwei School of Management", acronym: "JGSOM", tuition_range: { min: 95000, max: 120000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "BS in Computer Science", code: "BSCS", tags: ["Software Engineering", "Artificial Intelligence", "Theory", "Computing Solutions", "CHED Center of Excellence", "PAASCU Level IV", "Digital Innovation"], collegeData: { college_name: "School of Science and Engineering", acronym: "SOSE", tuition_range: { min: 95000, max: 120000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "AB in Psychology", code: "AB-PSY", tags: ["Social Psychology", "Behavioral Research", "Counseling", "Human Development", "CHED Center of Excellence", "Clinical Track", "Mental Health advocacy"], collegeData: { college_name: "School of Social Sciences", acronym: "SOSS", tuition_range: { min: 90000, max: 110000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "AB in Economics", code: "AB-EC", tags: ["Macroeconomics", "Financial Economics", "Development Studies", "Policy Analysis", "CHED Center of Excellence", "Quantitative Economics", "Global Policy"], collegeData: { college_name: "School of Social Sciences", acronym: "SOSS", tuition_range: { min: 90000, max: 110000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "AB in Political Science", code: "AB-POS", tags: ["Diplomacy", "Public Governance", "International Relations", "Public Policy", "CHED Center of Excellence", "Law School Track", "Governance"], collegeData: { college_name: "School of Social Sciences", acronym: "SOSS", tuition_range: { min: 90000, max: 110000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } }
        ]
    },
    {
        university: {
            name: "University of Santo Tomas",
            slug: "ust",
            heroImage: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi5H5Hu-wLUPAYqW8GZ1LFX9xYsas8oBFbZqljj7Vxe8RgaJE4yWfAEyDNqrKrLvyCe6mXr6kfsx1Dsyyttaaoaxhi7GF2i7wX4v_b8S8yWFMwrZHPBJj4VzymKZZROAGhDpKeza8_CyOKD/w1200-h630-p-k-no-nu/University+of+Santo+Tomas+%2528Main+Building%2529+2.jpg",
            location: {
                campus: "Main Campus",
                city: "Sampaloc, Manila",
                address: "España Blvd, Sampaloc, Manila, 1008 Metro Manila"
            },
            links: {
                portal: "https://ustet.ust.edu.ph",
                scholarship: "https://ofad.ust.edu.ph/scholarships/",
                website: "https://www.ust.edu.ph"
            },
            tags: ["Semestral", "Center of Excellence", "Pontifical", "Oldest in Asia", "QS World Ranking: #801-850", "THE World Ranking: 1501+", "PAASCU Level IV", "QS 5-Star Rating", "CHED Autonomous Status", "Catholic Heritage", "Center of Development", "Top Health Science School"]
        },
        programs: [
            { title: "BS in Computer Science", code: "BSCS", tags: ["Data Science", "Core Programming", "Network Security", "Algorithms", "CHED Center of Development", "PAASCU Accredited", "Tech Innovation"], collegeData: { college_name: "College of Information and Computing Sciences", acronym: "CICS", tuition_range: { min: 60000, max: 75000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development", "AUN-QA Certified", "PAASCU Level II"] } },
            { title: "BS in Information Technology", code: "BSIT", tags: ["Web Development", "Mobile Applications", "Systems Administration", "Multimedia", "CHED Center of Development", "Digital Media", "Cloud Solutions"], collegeData: { college_name: "College of Information and Computing Sciences", acronym: "CICS", tuition_range: { min: 60000, max: 75000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development", "AUN-QA Certified", "PAASCU Level II"] } },
            { title: "BS in Chemical Engineering", code: "BSChE", tags: ["Industrial Chemistry", "Plant Design", "Unit Operations", "Thermodynamics", "CHED Center of Excellence", "ABET Engineering Accreditation"], collegeData: { college_name: "Faculty of Engineering", acronym: "ENG", tuition_range: { min: 65000, max: 80000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "ABET Accredited", "PAASCU Level III"] } },
            { title: "BS in Civil Engineering", code: "BSCE", tags: ["Structural Design", "Geotechnical", "Water Resources", "Construction Management", "CHED Center of Excellence", "Board Exam Performance"], collegeData: { college_name: "Faculty of Engineering", acronym: "ENG", tuition_range: { min: 65000, max: 80000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level III"] } },
            { title: "BS in Medical Technology", code: "BSMT", tags: ["Clinical Laboratory", "Diagnostic Science", "Histopathology", "Microbiology", "CHED Center of Excellence", "Board Top Performing", "Health Research"], collegeData: { college_name: "Faculty of Pharmacy", acronym: "PHARMA", tuition_range: { min: 70000, max: 85000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "BS in Pharmacy", code: "BS-PHARM", tags: ["Drug Development", "Pharmacology", "Clinical Pharmacy", "Regulatory Affairs", "CHED Center of Excellence", "Patient Counseling"], collegeData: { college_name: "Faculty of Pharmacy", acronym: "PHARMA", tuition_range: { min: 70000, max: 85000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } }
        ]
    },
    {
        university: {
            name: "Mapúa University",
            slug: "mapua",
            heroImage: "https://mapua.sgp1.cdn.digitaloceanspaces.com/cms_images/O7AFenu16K6m09rjtoVPsCDK1GLlQdDvgCoF4Ow1.webp",
            location: {
                campus: "Intramuros Campus",
                city: "Manila",
                address: "658 Muralla St, Intramuros, Manila, 1002 Metro Manila"
            },
            links: {
                portal: "https://admissions.mapua.edu.ph/portal",
                scholarship: "https://www.mapua.edu.ph/pages/admissions/mapua-scholarships",
                website: "https://www.mapua.edu.ph"
            },
            tags: ["Quarterm", "Cintana Alliance", "ABET Accredited", "STEM Focused", "Fast-Paced", "QS Asia Ranking: #601-650", "THE World Ranking: 1501+", "QS 4-Star Rating", "Engineering Excellence", "Research Leader", "Innovation Hub", "Industry-Integrated Learning"]
        },
        programs: [
            { title: "BS in Computer Engineering", code: "BS-CpE", tags: ["Embedded Systems", "VLSI Design", "Microprocessors", "Hardware Engineering", "CHED Center of Excellence", "ABET Engineering Accredited"], collegeData: { college_name: "School of EE-ECE-CoE", acronym: "EE-ECE-CoE", tuition_range: { min: 40000, max: 55000, currency: "PHP", billing_cycle: "Quarterm" }, accreditation: ["CHED Center of Excellence", "ABET Accredited"] } },
            { title: "BS in Electronics Engineering", code: "BS-ECE", tags: ["Telecommunications", "Semiconductors", "Control Systems", "Broadcasting", "CHED Center of Excellence", "ABET Engineering Accredited"], collegeData: { college_name: "School of EE-ECE-CoE", acronym: "EE-ECE-CoE", tuition_range: { min: 40000, max: 55000, currency: "PHP", billing_cycle: "Quarterm" }, accreditation: ["CHED Center of Excellence", "ABET Accredited"] } },
            { title: "BS in Computer Science", code: "BSCS", tags: ["Algorithm Analysis", "Artificial Intelligence", "Theory", "Security", "CHED Center of Excellence", "ABET Computing Accredited"], collegeData: { college_name: "School of IT", acronym: "SOIT", tuition_range: { min: 40000, max: 55000, currency: "PHP", billing_cycle: "Quarterm" }, accreditation: ["CHED Center of Excellence", "ABET Accredited"] } },
            { title: "BS in Data Science", code: "BSDS", tags: ["Predictive Analytics", "Big Data", "Statistical Computing", "Mining", "Cintana Partner Program", "Emerging Tech"], collegeData: { college_name: "School of IT", acronym: "SOIT", tuition_range: { min: 40000, max: 55000, currency: "PHP", billing_cycle: "Quarterm" }, accreditation: ["Cintana Certified"] } },
            { title: "BS in Civil Engineering", code: "BSCE", tags: ["Structural Analysis", "Geotechnical Engineering", "Water Resources", "Construction", "CHED Center of Excellence", "ABET Engineering Accredited"], collegeData: { college_name: "School of Civil, Environmental, and Geological Engineering", acronym: "SCEGE", tuition_range: { min: 40000, max: 55000, currency: "PHP", billing_cycle: "Quarterm" }, accreditation: ["CHED Center of Excellence", "ABET Accredited"] } },
            { title: "BS in Environmental and Sanitary Engineering", code: "BS-EnSE", tags: ["Wastewater Treatment", "Solid Waste Management", "Sustainability", "Public Health", "ABET Engineering Accredited"], collegeData: { college_name: "School of Civil, Environmental, and Geological Engineering", acronym: "SCEGE", tuition_range: { min: 40000, max: 55000, currency: "PHP", billing_cycle: "Quarterm" }, accreditation: ["ABET Accredited"] } }
        ]
    },
    {
        university: {
            name: "Far Eastern University",
            slug: "feu",
            heroImage: "https://manilasociety.com/wp-content/uploads/2024/06/1717385578.jpg",
            location: {
                campus: "Manila Campus",
                city: "Sampaloc, Manila",
                address: "Nicanor Reyes St, Sampaloc, Manila, 1008 Metro Manila"
            },
            links: {
                portal: "https://www.feu.edu.ph/admissions/freshmen-application/",
                scholarship: "https://www.feu.edu.ph/cost-and-aid/scholarship-grants/",
                website: "https://www.feu.edu.ph"
            },
            tags: ["Semestral", "Art Deco Campus", "Heritage Site", "PAASCU Level IV", "Pioneer in Accountancy", "QS Asia Ranking: #701-750", "CHED Autonomous Status", "Culture Focused", "Strong Business Programs", "Inclusive Education", "Center of Development", "ASEAN University Network Associate"]
        },
        programs: [
            { title: "BS in Accountancy", code: "BSA", tags: ["Audit", "External Reporting", "Financial Accounting", "CPA Track", "CHED Center of Development", "Board Performance"], collegeData: { college_name: "Institute of Accounts, Business, and Finance", acronym: "IABF", tuition_range: { min: 50000, max: 65000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development", "PAASCU Level IV"] } },
            { title: "BS in Business Administration major in Business Analytics", code: "BSBA-BA", tags: ["Data Mining", "Predictive Modeling", "Business Intelligence", "Spreadsheet Modeling", "Modern Business", "Tech-Integrated"], collegeData: { college_name: "Institute of Accounts, Business, and Finance", acronym: "IABF", tuition_range: { min: 50000, max: 65000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PAASCU Level III"] } },
            { title: "Bachelor of Secondary Education", code: "BSEd", tags: ["English Major", "Math Major", "Pedagogy", "Classroom Management", "CHED Center of Excellence", "Teacher Certification"], collegeData: { college_name: "Institute of Education", acronym: "IE", tuition_range: { min: 45000, max: 55000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Level IV"] } },
            { title: "Bachelor of Special Needs Education", code: "BSNEd", tags: ["Inclusive Education", "Behavioral Management", "Differentiation", "Child Development", "Niche Program"], collegeData: { college_name: "Institute of Education", acronym: "IE", tuition_range: { min: 45000, max: 55000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PAASCU Level II"] } },
            { title: "BA in Communication", code: "BA-COMM", tags: ["Digital Film", "Media Production", "Strategic Communication", "Journalism", "CHED Center of Development", "Creative Industry"], collegeData: { college_name: "Institute of Arts and Sciences", acronym: "IAS", tuition_range: { min: 45000, max: 60000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development", "PAASCU Level III"] } },
            { title: "BS in Psychology", code: "BS-PSY", tags: ["Clinical Psychology", "Industrial-Organizational", "Psychometrics", "Behavioral Research", "Mental Health Track"], collegeData: { college_name: "Institute of Arts and Sciences", acronym: "IAS", tuition_range: { min: 45000, max: 60000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PAASCU Level III"] } }
        ]
    },
    {
        university: {
            name: "University of the Philippines - Manila",
            slug: "upm",
            heroImage: "https://images.summitmedia-digital.com/candy/images/2022/04/25/university-of-the-philippines-manila.jpg",
            location: {
                campus: "Ermita Campus",
                city: "Ermita, Manila",
                address: "Pedro Gil St, Ermita, Manila, 1000 Metro Manila"
            },
            links: {
                portal: "https://upcat.up.edu.ph",
                scholarship: "https://slasonline.up.edu.ph",
                website: "https://www.upm.edu.ph"
            },
            tags: ["Semestral", "State University", "Health Sciences Center", "Free Tuition Eligible", "Philippine General Hospital Base", "Top Medical University", "Research Focused", "National Center for Health", "Premier Healthcare Education", "CHED Center of Excellence"]
        },
        programs: [
            { title: "Doctor of Medicine", code: "MD", tags: ["Medical Doctor", "Clinical Research", "Surgery", "Public Health", "Premier Medical Program", "CHED Center of Excellence", "PGH Residency"], collegeData: { college_name: "College of Medicine", acronym: "CM", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "WFME Recognition"] } },
            { title: "BS in Nursing", code: "BSN", tags: ["Clinical Practice", "Community Health", "Patient Care", "Nursing Research", "CHED Center of Excellence", "Top Performing in Boards"], collegeData: { college_name: "College of Nursing", acronym: "CN", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "WHO Collaborating Center"] } },
            { title: "BS in Occupational Therapy", code: "BSOT", tags: ["Rehabilitation", "Mental Health", "Pediatrics", "Physical Therapy", "CHED Center of Excellence", "Allied Health"], collegeData: { college_name: "College of Allied Medical Professions", acronym: "CAMP", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "WFOT Accredited"] } },
            { title: "BS in Speech Pathology", code: "BSSP", tags: ["Communication Disorders", "Audiology", "Swallowing Disorders", "Clinical Internship", "Niche Medical Track"], collegeData: { college_name: "College of Allied Medical Professions", acronym: "CAMP", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence"] } },
            { title: "BS in Public Health", code: "BSPH", tags: ["Epidemiology", "Biostatistics", "Health Policy", "Community Health", "CHED Center of Excellence", "Global Health"], collegeData: { college_name: "College of Public Health", acronym: "CPH", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "SEAMEO-TROPMED"] } }
        ]
    },
    {
        university: {
            name: "Adamson University",
            slug: "adu",
            heroImage: "https://i.pinimg.com/originals/d2/22/2e/d2222e6d63ca0664da64fdacfa3b2758.jpg",
            location: {
                campus: "Main Campus",
                city: "Ermita, Manila",
                address: "900 San Marcelino St, Ermita, Manila, 1000 Metro Manila"
            },
            links: {
                portal: "https://www.adamson.edu.ph/v1/?page=admission",
                scholarship: "https://www.adamson.edu.ph/v1/?page=offices&oid=7",
                website: "https://www.adamson.edu.ph"
            },
            tags: ["Semestral", "Vincentian Education", "Top in Chemical Engineering", "PAASCU Accredited", "ISO Certified", "Center of Excellence", "Board Exam Excellence", "Engineering Specialist", "Affordable Quality Education", "Catholic Identity"]
        },
        programs: [
            { title: "BS in Chemical Engineering", code: "BSChE", tags: ["Unit Operations", "Chemical Process Industries", "Reaction Kinetics", "Petrochemicals", "CHED Center of Excellence", "Board Top Ranker"], collegeData: { college_name: "College of Engineering", acronym: "ENG", tuition_range: { min: 50000, max: 65000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PAASCU Accredited"] } },
            { title: "BS in Mining Engineering", code: "BSMinE", tags: ["Mineral Processing", "Surface Mining", "Rock Mechanics", "Underground Mining", "Specialized Engineering", "Resource Management"], collegeData: { college_name: "College of Engineering", acronym: "ENG", tuition_range: { min: 50000, max: 65000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PAASCU Accredited"] } },
            { title: "BS in Architecture", code: "BS-ARCH", tags: ["Architectural Design", "History", "Building Technology", "Urban Planning", "CHED Center of Development", "Design Thinking"], collegeData: { college_name: "College of Architecture", acronym: "COA", tuition_range: { min: 55000, max: 70000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development", "PAASCU Accredited"] } },
            { title: "BA in Communication", code: "BA-COMM", tags: ["Public Relations", "Advertising", "Broadcasting", "Media Literacy", "Creative Content", "Social Advocacy"], collegeData: { college_name: "College of Education and Liberal Arts", acronym: "CELA", tuition_range: { min: 45000, max: 55000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PAASCU Level III"] } },
            { title: "BS in Pharmacy", code: "BS-PHARM", tags: ["Pharmacology", "Drug Manufacturing", "Clinical Pharmacy", "Regulatory Affairs", "Health Care", "Laboratory Research"], collegeData: { college_name: "College of Pharmacy", acronym: "PHARMA", tuition_range: { min: 55000, max: 70000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PAASCU Accredited"] } }
        ]
    },
    {
        university: {
            name: "Pamantasan ng Lungsod ng Maynila",
            slug: "plm",
            heroImage: "https://www.rappler.com/tachyon/r3-assets/612F469A6EA84F6BAE882D2B94A4B421/img/8C9C528B64444AC98381B504505B1DB1/pamantasan-lungsod-maynila.jpg",
            location: {
                campus: "Intramuros Campus",
                city: "Manila",
                address: "General Luna cor. Muralla St., Intramuros, Manila"
            },
            links: {
                portal: "https://web2.plm.edu.ph/gsp/applynow.php",
                scholarship: "https://www.plm.edu.ph/scholarshipdetails",
                website: "https://www.plm.edu.ph"
            },
            tags: ["Semestral", "City University", "Tuition-Free for Manileños", "Highly Competitive", "Center of Development", "Top Performing in Boards", "Public Service Orientation", "Local Government Funded", "Premier Local University", "Academic Excellence"]
        },
        programs: [
            { title: "BS in Computer Science", code: "BSCS", tags: ["Software Dev", "Data Science", "Algorithms", "Public Sector IT", "Coding Bootcamps"], collegeData: { college_name: "College of Engineering and Technology", acronym: "CET", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development"] } },
            { title: "BS in Civil Engineering", code: "BSCE", tags: ["Infrastructure", "Urban Design", "Structural Analysis", "Board Top Performing", "Public Works"], collegeData: { college_name: "College of Engineering and Technology", acronym: "CET", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development"] } },
            { title: "BS in Accountancy", code: "BSA", tags: ["CPA Track", "Auditing", "Taxation", "Government Accounting", "Board Excellence"], collegeData: { college_name: "College of Business Administration", acronym: "CBA", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Development"] } },
            { title: "Doctor of Medicine", code: "MD", tags: ["Medical Practice", "Community Medicine", "Clinical Clerkship", "Top Medical School", "Public Health"], collegeData: { college_name: "College of Medicine", acronym: "PLM-CM", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["Level III Accredited"] } },
            { title: "BS in Psychology", code: "BSPSY", tags: ["Behavioral Science", "Clinical Psychology", "Counseling", "Mental Health", "Public Sector Service"], collegeData: { college_name: "College of Science", acronym: "CS", tuition_range: { min: 0, max: 0, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["Level II Accredited"] } }
        ]
    },
    {
        university: {
            name: "National Teachers College",
            slug: "ntc",
            heroImage: "https://mb.com.ph/uploads/imported_images/NTC_Facade_551e8b1a43.jpg",
            location: {
                campus: "Quiapo Campus",
                city: "Manila",
                address: "629 Nepomuceno St, Quiapo, Manila"
            },
            links: {
                portal: "https://ntc.edu.ph/admissions",
                scholarship: "https://ntc.edu.ph/scholarships",
                website: "https://ntc.edu.ph"
            },
            tags: ["Semestral", "Teacher Training Legacy", "Affordable", "Private Education", "Center of Excellence", "Ayala Education Network", "Pioneer in Education", "Quality Instruction", "Accessible Education", "Niche Education Hub"]
        },
        programs: [
            { title: "Bachelor of Secondary Education", code: "BSEd", tags: ["English", "Mathematics", "Science", "Social Studies", "CHED Center of Excellence", "Teaching Heritage"], collegeData: { college_name: "School of Teacher Education", acronym: "STE", tuition_range: { min: 20000, max: 30000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PACUCOA Accredited"] } },
            { title: "Bachelor of Elementary Education", code: "BEEd", tags: ["Primary Teaching", "Child Literacy", "Early Education", "Pedagogy", "CHED Center of Excellence"], collegeData: { college_name: "School of Teacher Education", acronym: "STE", tuition_range: { min: 20000, max: 30000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["CHED Center of Excellence", "PACUCOA Accredited"] } },
            { title: "BS in Information Technology", code: "BSIT", tags: ["Web Systems", "Networking", "Database", "Tech for Education", "Digital Literacy"], collegeData: { college_name: "School of Arts, Sciences, and Technology", acronym: "SAST", tuition_range: { min: 22000, max: 32000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PACUCOA Accredited"] } },
            { title: "BS in Psychology", code: "BSPSY", tags: ["Educational Psychology", "Human Behavior", "Counseling", "HR Management", "Social Science"], collegeData: { college_name: "School of Arts, Sciences, and Technology", acronym: "SAST", tuition_range: { min: 22000, max: 32000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PACUCOA Accredited"] } },
            { title: "BS in Accountancy", code: "BSA", tags: ["Financial Reporting", "Audit", "Taxation", "Management Accounting", "Business Core"], collegeData: { college_name: "School of Business", acronym: "SOB", tuition_range: { min: 25000, max: 35000, currency: "PHP", billing_cycle: "Semester" }, accreditation: ["PACUCOA Accredited"] } }
        ]
    }
];