"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "../../modules/gsap";
import gsap from "gsap";
import Image from "next/image";
import { Building2, Eye, Target, ArrowUpRight } from "lucide-react";
import { useNavStore } from "@/src/store/useNavStore";
import { useInView } from "@/src/hooks/useInView";

interface TeamMember {
	name: string;
	role: string;
	roster: string;
	bio: string;
}

const teamMembers: TeamMember[] = [
	{
		name: "Gian Dwayne Romero",
		role: "Chairman",
		roster: "/company-roster/romero.png",
		bio: "The chief architect of Sobre's strategic vision. He oversees the totality of company pipelines, ensuring every operational thread is woven into a singular, cohesive executive direction."
	},
	{
		name: "Zacci Pedrigal",
		role: "Vice Chairman",
		roster: "/company-roster/pedrigal.png",
		bio: "Spearheading external growth and institutional partnerships. She bridges the gap between internal strategy and global outreach, managing the vital flow of communication with the outside world."
	},
	{
		name: "Daniel Jose Bartolo",
		role: "Financial Manager",
		roster: "/company-roster/bartolo.png",
		bio: "The custodian of Sobre's fiscal integrity. He meticulously audits resources and monitors revenue streams to ensure the firm's economic foundation remains robust and sustainable."
	},
	{
		name: "Mark Joseph De Luna",
		role: "Human Resources Manager",
		roster: "/company-roster/deluna.png",
		bio: "The guardian of company ethos. He cultivates a culture of excellence and high morale, fostering healthy relationships across the organizational hierarchy to keep the collective spirit steady."
	},
	{
		name: "David Clark Raagas",
		role: "Head of Operations",
		roster: "/company-roster/raagas.png",
		bio: "The engine of efficiency. Under his oversight, day-to-day logistics are refined into a high-performance workflow, guaranteeing that every service delivered meets the Sobre standard of quality."
	},
	{
		name: "Laurence Jake Cayabyab",
		role: "Head of Affairs",
		roster: "/company-roster/cayabyab.png",
		bio: "The master of diplomacy and relations. He ensures that every interaction with clients, affiliates, and partners is handled with professional decency and modest, high-level communication."
	},
	{
		name: "Levian Ryel Banot",
		role: "Head of Marketing",
		roster: "/company-roster/banot.png",
		bio: "The voice of the brand. He orchestrates promotional narratives and content distribution, expanding the firm's presence and ensuring the 'Sobre' story resonates with a vast, global audience."
	},
	{
		name: "Agiellos Lyeojandro Biscocho",
		role: "Head Clientele Agent",
		roster: "/company-roster/biscocho.png",
		bio: "Leading the front-line engagement. He manages the firm's clientele en masse, ensuring rapid response times and maintaining the highest standard of service for our diverse subscriber base."
	},
	{
		name: "Jearvin Marcy Kabigting",
		role: "Clientele Agent",
		roster: "/company-roster/kabigting.png",
		bio: "Dedicated to hyper-local engagement. He processes regional-based requests with precision, providing tailored referrals and recommendations that align with local institutional nuances."
	},
	{
		name: "Clarence Benedict Gersava",
		role: "Field Supervisor",
		roster: "/company-roster/gersava.png",
		bio: "The analytical eye on the ground. He monitors regional logistics and daily activities, ensuring that the company's operational reach is managed with unwavering attention to detail."
	},
	{
		name: "Jeremie Garcia",
		role: "Field Supervisor",
		roster: "/company-roster/garcia.png",
		bio: "A strategic overseer of field operations. He manages the grinding daily activities of the firm's pipelines, ensuring regional logistical consistency across all service territories."
	}
];

export default function CompanyPage() {
	const setHeroVisible = useNavStore((state) => state.setHeroVisible);
	const container = useRef<HTMLDivElement>(null);
	const [headerContainer, inView] = useInView({ threshold: 0.4 });
	useGSAP(() => {
		if (!container.current) return;
		gsap.fromTo(".reveal-text", 
			{ 
				y: 25, 
				opacity: 0 
			},
			{ 
				y: 0, 
				opacity: 1, 
				stagger: 0.06, 
				duration: 0.6, 
				ease: "power3.out",
				scrollTrigger: {
					trigger: container.current,
					start: "top 85%",
					toggleActions: "play none none none"
				}
			}
		);
		const glassPanels = gsap.utils.toArray<HTMLElement>(".glass-panel-fade");
		glassPanels.forEach((panel) => {
			gsap.fromTo(panel,
				{ 
					backdropFilter: "blur(0px)", 
					backgroundColor: "rgba(255, 255, 255, 0)", 
					borderColor: "rgba(255, 255, 255, 0)",
					opacity: 0,
					y: 20
				},
				{ 
					backdropFilter: "blur(16px)", 
					backgroundColor: "rgba(255, 255, 255, 0.35)", 
					borderColor: "rgba(255, 255, 255, 0.45)",
					opacity: 1,
					y: 0,
					duration: 0.8, 
					ease: "power2.out",
					scrollTrigger: {
						trigger: panel,
						start: "top 88%",
						end: "bottom 12%",
						toggleActions: "play reverse play reverse",
					}
				}
			);
		});

		const rosterItems = gsap.utils.toArray<HTMLElement>(".roster-item");
		rosterItems.forEach((item) => {
			gsap.fromTo(item,
				{
					opacity: 0,
					scale: 0.94,
					filter: "blur(4px) grayscale(100%)",
					y: 30
				},
				{
					opacity: 1,
					scale: 1,
					filter: "blur(0px) grayscale(0%)",
					y: 0,
					duration: 0.9,
					ease: "power4.out",
					scrollTrigger: {
						trigger: item,
						start: "top 90%",
						end: "bottom 10%",
						toggleActions: "play reverse play reverse",
					}
				}
			);
		});
	}, { scope: container });

	useEffect(() => {
		setHeroVisible(inView);
		return () => {
			setHeroVisible(true);
		};
	}, [inView, setHeroVisible]);
	
	return (
		<div ref={container} className="w-full">
			<div className="max-w-6xl mx-auto relative z-10 px-3">
				<header ref={headerContainer} className="my-20 sm:my-28 md:mb-40">
					<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-start">
						<div className="lg:col-span-7 flex flex-col md:items-start items-center">
							<div className="reveal-text flex items-center gap-2 mb-4">
								<Building2 className="size-3.5 text-mint-dark" strokeWidth={2.5} />
								<span className="block text-mint-dark font-black tracking-[0.3em] uppercase text-[9px] sm:text-[10px]">
									Company Profile
								</span>
							</div>
							
							<h1 className="reveal-text text-4xl sm:text-6xl md:text-8xl font-black text-neutral-900 uppercase leading-[0.9] tracking-tighter mb-6 sm:mb-10 text-center md:text-left">
								The <br/>
								<span className="italic text-transparent select-none" style={{ WebkitTextStroke: "1px #263127" }}>Sobre</span> <br/>
								Legacy
							</h1>
							<div className="glass-panel-fade bg-white/35 backdrop-blur-md border border-white/45 p-6 sm:p-8 md:p-12 rounded-3xl sm:rounded-4xl shadow-[0_12px_40px_rgba(38,49,39,0.03)] relative overflow-hidden group">
								<div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity duration-300 pointer-events-none">
									<ArrowUpRight className="size-6 text-neutral-900" />
								</div>
								<p className="text-base sm:text-xl md:text-2xl text-neutral-700/90 leading-relaxed italic font-medium relative z-10">
									&quot;No matter whether they were accepted or not, the recipient, in the end, would receive a mailed message physically or digitally—often referred to as a <span className="text-neutral-900 font-bold rounded-full underline decoration-mint-dark/40 underline-offset-4">letter</span>.&quot;
								</p>
							</div>
						</div>

						<div className="lg:col-span-5 lg:pt-32">
							<div className="reveal-text space-y-4 sm:space-y-6 md:space-y-8 text-neutral-500 text-xs sm:text-base md:text-lg leading-relaxed border-l-2 border-neutral-200/60 pl-4 sm:pl-6">
								<p>
									Derived from the Tagalog word for <span className="text-neutral-900 font-bold italic">&quot;Envelope,&quot;</span> the name was chosen to capture the deep, passionate nuance of Filipino culture. We move away from generic terms like &apos;mail&apos; or &apos;letter&apos; to strike the literary hearts of our clients.
								</p>
								<p>
									Based in the heart of <span className="text-neutral-900 font-semibold">Bonifacio Global City</span>, Sobre operates as a private consulting and opportunities firm committed to bridging the gap between local talent and institutional opportunity.
								</p>
							</div>
						</div>
					</div>
				</header>
				<section className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 bg-transparent mb-20 sm:mb-28 md:mb-40">
					<div className="glass-panel-fade bg-white/35 backdrop-blur-md border border-white/45 p-6 sm:p-12 md:p-16 flex flex-col justify-between rounded-3xl sm:rounded-4xl shadow-xl transition-colors duration-500 hover:bg-white/50 hover:border-white/60 transform-gpu">
						<div className="mb-8 sm:mb-12">
							<div className="inline-flex items-center justify-center size-10 rounded-2xl bg-white/60 border border-white/80 shadow-xs mb-6 text-mint-dark">
								<Eye className="size-5" strokeWidth={2} />
							</div>
							<h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4">Vision Statement</h2>
							<p className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 uppercase leading-none tracking-tight">
								Leading a <br/>
								<span className="text-mint-dark">Student-First</span> <br/>
								Future.
							</p>
						</div>
						<p className="text-neutral-600 text-xs sm:text-base leading-relaxed max-w-sm font-medium">
							Promoting autonomous and confident decision-making on career and educational paths—ensuring everyone is seen as a student in a continuous journey of growth.
						</p>
					</div>
					<div className="glass-panel-fade bg-white/35 backdrop-blur-md border border-white/45 p-6 sm:p-12 md:p-16 flex flex-col justify-between rounded-3xl sm:rounded-4xl shadow-xl transition-colors duration-500 hover:bg-white/50 hover:border-white/60 transform-gpu">
						<div className="mb-8 sm:mb-12">
							<div className="inline-flex items-center justify-center size-10 rounded-2xl bg-white/60 border border-white/80 shadow-xs mb-6 text-mint-dark">
								<Target className="size-5" strokeWidth={2} />
							</div>
							<h2 className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400 mb-4">Mission Statement</h2>
							<p className="text-2xl sm:text-3xl md:text-4xl font-black text-neutral-900 uppercase leading-none tracking-tight italic">
								Simplifying <br/>
								The <span className="text-transparent select-none" style={{ WebkitTextStroke: "1px black" }}>Complex</span>
							</p>
						</div>
						<p className="text-neutral-600 text-xs sm:text-base leading-relaxed max-w-sm font-medium">
							Committed to delivering professional, holistic, and personal services catered to individual profiles that simplify the application entries for both academic and career pathways.
						</p>
					</div>
				</section>
				<section className="mb-12">
					<div className="mb-10 sm:mb-16 md:mb-20 flex flex-col items-center sm:items-start">
						<span className="reveal-text block text-mint-dark font-black tracking-[0.3em] uppercase text-[9px] sm:text-[10px] mb-2 sm:mb-4">
							Organizational Structure
						</span>
						<h2 className="reveal-text text-2xl sm:text-5xl md:text-7xl font-black text-neutral-900 uppercase leading-[0.95] tracking-tighter text-center md:text-left">
							The <span className="italic text-transparent select-none" style={{ WebkitTextStroke: "1px #263127" }}>Mindset</span> <br/>
							Behind Sobre
						</h2>
					</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                        {teamMembers.map((member, i) => (
                            <div 
                                key={i} 
                                className="magnetic locked roster-item group relative flex flex-col justify-between overflow-hidden rounded-3xl sm:rounded-4xl bg-neutral-95 shadow-md transition-shadow duration-500 sm:hover:shadow-2xl transform-gpu h-full sm:aspect-4/5"
                            >
                                <div className="relative sm:absolute inset-0 z-0 h-72 sm:h-full w-full sm:grayscale sm:group-hover:grayscale-0 sm:group-hover:scale-105 transition-all duration-700 ease-out transform-gpu">
                                    <div className="absolute inset-0 bg-neutral-900" />
                                    <Image
                                        src={member.roster} 
                                        alt={member.name}
                                        fill
                                        sizes="(max-w-640px) 100vw, (max-w-1024px) 50vw, 33vw"
                                        className="object-cover opacity-70 sm:opacity-60 sm:group-hover:opacity-100 transition-opacity duration-500"
                                        priority={i < 3}
                                    />
                                    <div className="absolute inset-0 bg-linear-to-t from-neutral-950 via-neutral-950/40 sm:via-neutral-900/20 to-transparent opacity-100 sm:opacity-80" />
                                </div>
                                <div className="relative z-10 w-full mt-auto p-8 transition-transform duration-500 ease-out transform-gpu sm:group-hover:-translate-y-38 lg:sm:group-hover:-translate-y-34 hidden sm:block">
                                    <p className="text-[9px] sm:text-[10px] font-black text-mint-light uppercase tracking-[0.2em] mb-1 sm:mb-2">
                                        {member.role}
                                    </p>
                                    <h4 className="text-xl sm:text-2xl md:text-3xl font-black text-white uppercase leading-[0.85] tracking-tighter drop-shadow-md">
                                        {member.name.split(' ').map((n, j) => (
                                            <span key={j} className="block">{n}</span>
                                        ))}
                                    </h4>
                                </div>
                                <div className="relative sm:absolute inset-x-0 sm:bottom-0 z-20 w-full p-6 sm:p-8 bg-neutral-900 sm:bg-neutral-950/90 backdrop-blur-xl border-t border-white/5 sm:border-white/10 h-auto sm:h-36 lg:sm:h-40 flex flex-col justify-center sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-500 ease-out pointer-events-auto sm:pointer-events-none">
                                    <div className="block sm:hidden mb-3">
                                        <p className="text-[9px] font-black text-mint-light uppercase tracking-[0.2em] mb-1">
                                            {member.role}
                                        </p>
                                        <h4 className="text-xl font-black text-white uppercase tracking-tight">
                                            {member.name}
                                        </h4>
                                    </div>
                                    <p className="text-[9px] font-bold text-mint-light uppercase mb-1 sm:mb-2 tracking-widest hidden sm:block">
                                        Profile Abstract
                                    </p>
                                    <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed font-medium">
                                        {member.bio}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
				</section>
			</div>
		</div>
	);
}