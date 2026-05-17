"use client";

import Image from "next/image";
import { useTransition } from "../hooks/useTransition";
import { useCallback } from "react";

interface FooterLink {
	label: string;
	href: string;
	isExternal?: boolean;
}

const NAVIGATION_LINKS: FooterLink[] = [
	{ label: "Our Story", href: "/company" },
	{ label: "Student Forum", href: "/forum" },
	{ label: "Careers", href: "/careers" }
];

const ENGAGEMENT_LINKS: FooterLink[] = [
	{ label: "sobre.co@gmail.com", href: "mailto:sobre.co@gmail.com", isExternal: true },
	{ label: "Privacy Policy", href: "/privacy" }
];

export default function Footer() {
	const currentYear = new Date().getFullYear();
	const { startTransition } = useTransition();

    const handleNavigation = useCallback((href: string, isExternal?: boolean) => {
		if (isExternal) {
			window.location.href = href;
			return;
		} else startTransition(href);
	}, [startTransition]);

	return (
		<footer className="relative bg-[#263127] pt-24 pb-12 border-t border-white/5 overflow-hidden">
			<div className="absolute -bottom-10 -right-10 select-none pointer-events-none opacity-[0.02]">
				<h2 className="text-[20vw] font-black leading-none uppercase text-white">Sobre</h2>
			</div>

			<div className="container mx-auto px-8 md:px-16 relative z-10 flex flex-col items-center">
				<div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20 w-full">
					<div className="md:col-span-1">
						<div className="flex items-center gap-2 mb-6">
							<div className="size-8 relative">
								<Image src="/favicon.ico" alt="Sobre Logo" fill className="object-contain" />
							</div>
							<span className="font-black uppercase tracking-tighter text-xl text-white">Sobre</span>
						</div>
						<p className="text-white/50 text-sm leading-relaxed max-w-xs">
							Optimizing the bridge between local talent and institutional opportunity through verified data and personalized guidance.
						</p>
					</div>
					<div>
						<h4 className="font-bold uppercase text-[10px] tracking-[0.2em] text-mint-light mb-6">Navigation</h4>
						<ul className="space-y-4 text-sm font-medium text-white/70">
							{NAVIGATION_LINKS.map((link) => (
								<li key={link.label}>
									<button 
										onClick={() => handleNavigation(link.href, link.isExternal)} 
										className="cursor-pointer hover:text-mint-light transition-colors magnetic text-left rounded-full"
									>
										{link.label}
									</button>
								</li>
							))}
						</ul>
					</div>
					<div>
						<h4 className="font-bold uppercase text-[10px] tracking-[0.2em] text-mint-light mb-6">Engagement</h4>
						<ul className="space-y-4 text-sm font-medium text-white/70">
							{ENGAGEMENT_LINKS.map((link) => (
								<li key={link.label}>
									<button 
										onClick={() => handleNavigation(link.href, link.isExternal)} 
										className="cursor-pointer hover:text-mint-light transition-colors magnetic text-left rounded-full"
									>
										{link.label}
									</button>
								</li>
							))}
							<li className="text-white/40 font-normal list-none">+63 963 412 9856</li>
						</ul>
					</div>
				</div>
				<div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/5 gap-4 w-full">
					<p className="text-[10px] text-white/30 font-medium uppercase tracking-widest">
						© 2024-{currentYear} Sobre Consultancy Group. All Rights Reserved.
					</p>
				</div>
			</div>
		</footer>
	);
}