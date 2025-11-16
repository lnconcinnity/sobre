"use client";

import clsx from "clsx";
import Image from "next/image";
import gsap, { useGSAP } from "@/modules/gsap";
import Enquire from "@/components/Enquire";
import { useTransition } from "@/hooks/useTransition";
import AppearingText from "@/components/AppearingText";

function HeroCard({ className, src }: { className?: string, src?: string }) {
    return (
        <div
            className={clsx(
                "relative w-full pb-[100%] overflow-hidden",
                className
            )}
        >
            { src && (
                <Image
                    src={src}
                    alt=""
                    className="object-cover object-center hero-grid-image scale-0"
                    fill
                    sizes="(min-width: 66em) 80vw,
                        (min-width: 44em) 50vw,
                        100vw"
                    loading="eager"
                    decoding="async"
                />
            )}
        </div>
    );
}

export default function IndexHero() {
    const { totalDuration } = useTransition();
    useGSAP(() => {
        gsap.fromTo(gsap.utils.toArray<HTMLImageElement>(".hero-grid-image"), { scale: 0, opacity: 0 }, {
            scale: 1,
            opacity: 1,
            ease: "power3.out",
            delay: totalDuration,
            stagger: {
                each: 0.125,
                from: "start",
            }
        })
    }, [ totalDuration ])
    return (
        <section className="relative h-auto overflow-hidden">
            <div className="w-screen h-[50vh]">
                <div data-speed="auto" className="relative origin-center z-0 h-[105%] grid md:grid-rows-2 grid-cols-3 md:grid-cols-6 auto-rows-fr">
                    {/* row 1 */}
                    <HeroCard className="bg-[#CFD7D0]" src="/images/hd/pexels-hson-12885638.jpg" />
                    <HeroCard className="bg-[#B0CFB4]" />
                    <HeroCard className="bg-[#8D9D8F]" src="/images/hd/pexels-pavel-danilyuk-8382386.jpg" />
                    <HeroCard className="bg-[#A3A3A3]" />
                    <HeroCard className="bg-[#9FAFA1]" src="/images/hd/pexels-rdne-7683817.jpg"/>
                    <HeroCard className="bg-[#B0CFB4]" />
                    {/* row 2 */}
                    <HeroCard className="hidden md:block bg-[#CFD7D0]" />
                    <HeroCard className="hidden md:block bg-[#8D9D8F]" src="/images/hd/pexels-rdne-7104319.jpg" />
                    <HeroCard className="hidden md:block bg-[#9FB6A2]" />
                    <HeroCard className="hidden md:block bg-[#8D9D8F]" src="/images/hd/pexels-zachary-vessels-26649727-6794181.jpg" />
                    <HeroCard className="hidden md:block bg-[#CFD7D0]" />
                    <HeroCard className="hidden md:block bg-[#9FAFA1]" src="/images/hd/pexels-jeswin-5265274.jpg" />
                </div>
            </div>
            <section className="relative z-1 bg-gray-50 pb-10 pt-10 sm:pt-20">
                <div className="relative w-screen h-auto gap-10 sm:gap-20 md:gap-30 mb-15 px-10 md:px-20 grid place-items-center select-text">
                    <div className="min-h-[35vh] grid sm:gap-5 grid-cols-1 md:grid-cols-3 place-items-center">
                        <div className="flex flex-col items-start p-5 col-span-2">
                            <AppearingText as="h3" split="words" className="font-medium text-lg sm:text-xl md:text-2xl mb-2 sm:mb-7 text-neutral-600" delay={totalDuration} stagger={0.1}>
                                Sobre Consultancy Group
                            </AppearingText>
                            <AppearingText delay={totalDuration} stagger={0.15}>
                                <div className="uppercase font-black text-2xl sm:text-4xl md:text-6xl max-w-4xl text-neutral-800">
                                    <div className="overflow-hidden"><h1 className="leading-none"> Opportunity-to-Outcome </h1></div>
                                    <div className="overflow-hidden"><h1 className="leading-none"> Strategy for Academic </h1></div>
                                    <div className="overflow-hidden"><h1 className="leading-none"> Futures </h1></div>
                                </div>
                            </AppearingText>
                        </div>
                        <div className="p-5 text-neutral-900 text-sm sm:text-base">
                            <AppearingText delay={totalDuration} className="items-center md:items-start flex flex-col">
                                <div className="overflow-hidden">
                                    <p className="mb-4">
                                        Sobre offers pronounced holistic, aspiring, and leading consultation to guide every client through complex academic and career applications.
                                    </p>
                                </div>
                                <div className="overflow-hidden">
                                    <p className="mb-6">
                                        Our mission is to simplify these demanding processes, providing the clarity and dedicated support needed for clients to make bold, confident decisions about their futures.
                                    </p>
                                </div>
                                <div className="overflow-hidden">
                                    <Enquire />
                                </div>
                            </AppearingText>
                        </div>
                    </div>
                </div>
                <div className="min-h-[12vh] flex flex-col justify-center items-center text-center">
                    <AppearingText as="p" enableScrollTrigger split="words" stagger={0.05} duration={1.2} className="text-lg sm:text-xl md:text-2xl text-neutral-600">
                        Your future mapped
                    </AppearingText>
                    <AppearingText as="p" enableScrollTrigger split="chars" stagger={0.05} duration={1.5} delay={0.1} className="whitespace-nowrap text-3xl sm:text-5xl md:text-7xl uppercase text-neutral-800 font-black mt-2">
                        How it&apos;s done
                    </AppearingText>
                </div>
            </section>
        </section>
    );
}
