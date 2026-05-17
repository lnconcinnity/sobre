"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, Search } from "lucide-react"; // Premium clean iconography
import gsap, { useGSAP } from "../modules/gsap";
import { useNavStore } from "../store/useNavStore";
import SearchDropdown from "./SearchDropdown";
import { useTransition } from "../hooks/useTransition";

const NAV_LINKS = [
	{ label: "Company", href: "/company" },
	{ label: "Forum", href: "/forum" },
	{ label: "Contact", href: "/contact" },
];

const VALID_ROUTES = [...NAV_LINKS.map(link => link.href), "/", "/search"];
const HIDDEN_NAV_AT_ROUTES = new Set(["/", "/search", "/company"]);

interface TrendingSearchItem {
	id: string | number;
	query: string;
	label: string;
}

export default function Navbar() {
	const navRef = useRef<HTMLHeadingElement>(null);
	const mobileMenuRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [trendingSearches, setTrendingSearches] = useState<TrendingSearchItem[]>([]);
	
	const isHeroVisible = useNavStore((state) => state.isHeroVisible);
	const { startTransition } = useTransition();

	const shouldShow = VALID_ROUTES.includes(pathname) && (!HIDDEN_NAV_AT_ROUTES.has(pathname) || !isHeroVisible);

	useEffect(() => {
		let isMounted = true;
		const fetchTrends = async () => {
			try {
				const res = await fetch("/api/analytics/trends");
				if (!res.ok) throw new Error("Network latency caught");
				const data = await res.json();
				if (Array.isArray(data) && isMounted) setTrendingSearches(data);
			} catch (err) {
				console.error("Navbar analytics trend fetch dropped:", err);
			}
		};
		fetchTrends();
		return () => { isMounted = false; };
	}, []);

	useEffect(() => {
		setIsMenuOpen(false);
	}, [pathname]);

	useGSAP(() => {
		gsap.to(navRef.current, { 
			y: shouldShow ? 0 : -120, 
			opacity: shouldShow ? 1 : 0, 
			duration: 0.5, 
			ease: shouldShow ? "power4.out" : "power2.in",
			overwrite: "auto",
			onStart: () => {
				if (shouldShow) gsap.set(navRef.current, { pointerEvents: "auto" });
			},
			onComplete: () => {
				if (!shouldShow) gsap.set(navRef.current, { pointerEvents: "none" });
			}
		});
	}, [shouldShow, pathname]);

	useGSAP(() => {
		if (!mobileMenuRef.current) return;
		if (isMenuOpen) {
			gsap.to(mobileMenuRef.current, {
				opacity: 1,
				y: 0,
				duration: 0.4,
				ease: "power3.out",
				pointerEvents: "auto"
			});
			gsap.fromTo(".mobile-nav-link", 
				{ opacity: 0, y: 15 },
				{ opacity: 1, y: 0, stagger: 0.08, duration: 0.3, ease: "power2.out", delay: 0.1 }
			);
		} else {
			gsap.to(mobileMenuRef.current, {
				opacity: 0,
				y: -20,
				duration: 0.3,
				ease: "power2.in",
				pointerEvents: "none"
			});
		}
	}, [isMenuOpen]);

	const handleLink = (href: string) => {
		if (href === pathname) return;
		setIsMenuOpen(false);
		startTransition(href);
	};

	const execSearch = (q: string) => {
		if (!q.trim()) return;
		setIsMenuOpen(false);
		startTransition(`/search?q=${encodeURIComponent(q.trim())}`);
	};
	return (
		<>
		<nav 
			ref={navRef}
			className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 max-w-lg flex items-center justify-center gap-5 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full border border-black/5 bg-white/75 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.04)] opacity-0 -translate-y-40 pointer-events-none select-none transition-shadow duration-300"
		>
			<button 
				onClick={() => handleLink("/")} 
				className="rounded-full cursor-pointer magnetic shrink-0 size-8 overflow-hidden relative"
			>
				<Image 
					src="/favicon.ico" 
					alt="Sobre Premium Logo Asset" 
					fill
					className="object-contain"
				/>
			</button>
			<div className="hidden md:flex items-center gap-4">
				{NAV_LINKS.map((link) => (
					<button
						key={link.label}
						onClick={() => handleLink(link.href)}
						className="cursor-pointer magnetic rounded-full text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 hover:text-mint-dark transition-colors relative"
					>
						{link.label}
					</button>
				))}
			</div>
			<div className="hidden md:block w-64">
				<SearchDropdown 
					label="Search database..." 
					name="nav-search" 
					variant="lean" 
					suggestions={trendingSearches} 
					onSearch={(q) => execSearch(q)} 
				/>
			</div>
			<div className="flex md:hidden items-center gap-2">
				<button 
					onClick={() => setIsMenuOpen(!isMenuOpen)}
					className="p-2 text-neutral-700 active:bg-black/5 rounded-full transition-colors cursor-pointer"
					aria-label="Toggle structural layout view navigation menu"
				>
					{isMenuOpen ? <X strokeWidth={1.25} className="size-5 text-neutral-900" /> : <Menu strokeWidth={1.25} className="size-5 text-neutral-900" />}
				</button>
			</div>
		</nav>
		{/* ==================== GLASSMORPHIC MOBILE OVERLAY DRAWER SYSTEM ==================== */}
		<div 
			ref={mobileMenuRef}
			className="fixed top-20 left-4 right-4 z-40 md:hidden overflow-hidden rounded-4xl border border-white/20 bg-white/80 backdrop-blur-3xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.02)] opacity-0 -translate-y-4 pointer-events-none p-5 sm:p-6 flex flex-col gap-5 transform-gpu will-change-transform"
		>
			<div className="absolute top-0 left-0 w-full h-20 bg-linear-to-b from-mint-dark/5 via-transparent to-transparent pointer-events-none" />
			<div className="relative z-10 flex flex-col gap-2 w-full">
				<span className="text-[9px] font-black tracking-[0.3em] uppercase text-neutral-400 block mb-2 px-3">
					Navigation Menu
				</span>
				
				{NAV_LINKS.map((link) => {
					const isActive = pathname === link.href;
					return (
						<button
							key={link.label}
							onClick={() => handleLink(link.href)}
							className={`mobile-nav-link group w-full text-left py-3 rounded-2xl text-xs font-semibold uppercase tracking-[0.18em] flex items-center justify-between transition-all duration-300 ease-out transform-gpu cursor-pointer select-none active:scale-[0.98]
								${isActive 
									? "bg-neutral-900 text-white shadow-md shadow-neutral-900/10" 
									: "text-neutral-700 hover:text-mint-dark hover:bg-mint-dark/10 bg-black/1 border border-black/2"
								}`}
						>
							<span className="flex items-center gap-2.5 transition-transform duration-300 group-hover:translate-x-1">
								<span className={`size-1.5 rounded-full transition-all duration-300 
									${isActive ? "bg-mint-dark animate-pulse" : "bg-neutral-300 group-hover:bg-mint-dark group-hover:scale-125"}`} 
								/>
								{link.label}
							</span>
							<span className={`text-[10px] opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 font-light text-mint-dark
								${isActive ? "hidden" : "block"}`}
							>
								GO
							</span>
						</button>
					);
				})}
			</div>
			<div className="w-full h-px bg-linear-to-r from-transparent via-black/5 to-transparent relative z-10" />
			<div className="relative z-10 flex flex-col gap-2.5 w-full px-3">
				<div className="flex items-center gap-2 text-[9px] font-black tracking-[0.3em] uppercase text-neutral-400">
					<Search className="size-3 text-neutral-400 shrink-0" /> Search the Database
				</div>
				<SearchDropdown 
					label="Search courses, guides, requirements..." 
					name="mobile-nav-search" 
					variant="lean" 
					onSearch={(q) => execSearch(q)} 
				/>
			</div>
		</div>
		</>
	);
}