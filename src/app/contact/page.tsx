"use client";

import { useState, FormEvent, ChangeEvent } from "react";
import { Mail, Phone, MapPin, Send, ChevronDown } from "lucide-react";

interface FormState {
    name: string;
    email: string;
    subject: string;
    message: string;
}

export default function ContactPage() {
    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        subject: "General Inquiry",
        message: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 1200));
        setIsSubmitting(false);
        setForm({ name: "", email: "", subject: "General Inquiry", message: "" });
    };

    return (
        <div className="relative min-h-screen bg-[#fbfdfb] pt-32 pb-24 px-6 md:px-16 overflow-hidden">
            <div 
                className="absolute inset-0 z-0 bg-architectural-grid bg-size-[4rem_4rem] opacity-40 pointer-events-none" 
                style={{
                    maskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 50%, #000 70%, transparent 100%)",
                    willChange: "transform",
                    transform: "translateZ(0)"
                }}
            />

            <div className="relative z-10 max-w-7xl mx-auto">
                <div className="mb-24">
                    <span className="text-[10px] font-black text-mint-dark uppercase tracking-[0.3em] mb-4 block">
                        Get in Touch
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-black uppercase leading-[0.9] tracking-tighter">
                        Let&apos;s talk <br /> 
                        <span 
                            className="text-transparent italic font-serif font-light tracking-wide pl-1" 
                            style={{ WebkitTextStroke: "1px #263127" }}
                        >
                            strategy.
                        </span>
                    </h1>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    <div className="space-y-12">
                        <p className="text-lg md:text-xl text-neutral-500 font-medium leading-relaxed max-w-md">
                            Whether you&apos;re a student charting your track or an institution looking to optimize placement mapping, our team is positioned to accelerate your direction.
                        </p>

                        <div className="space-y-6">
                            <div className="magnetic group flex items-center gap-5">
                                <div className="p-4 bg-white border border-neutral-200 rounded-2xl group-hover:border-neutral-900 group-hover:shadow-md transition-all duration-300">
                                    <Mail size={20} className="text-neutral-800" />
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Email Us</h4>
                                    <a href="mailto:sobre.co@gmail.com" className="text-lg font-bold text-neutral-800 hover:text-mint-dark transition-colors">
                                        sobre.co@gmail.com
                                    </a>
                                </div>
                            </div>

                            <div className="magnetic group flex items-center gap-5">
                                <div className="p-4 bg-white border border-neutral-200 rounded-2xl group-hover:border-neutral-900 group-hover:shadow-md transition-all duration-300">
                                    <Phone size={20} className="text-neutral-800" />
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Call Us</h4>
                                    <p className="text-lg font-bold text-neutral-800">+63 963 412 9856</p>
                                </div>
                            </div>

                            <div className="magnetic group flex items-center gap-5">
                                <div className="p-4 bg-white border border-neutral-200 rounded-2xl group-hover:border-neutral-900 group-hover:shadow-md transition-all duration-300">
                                    <MapPin size={20} className="text-neutral-800" />
                                </div>
                                <div>
                                    <h4 className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">HQ</h4>
                                    <p className="text-lg font-bold text-neutral-800">Metro Manila, Philippines</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-neutral-200 p-8 md:p-12 rounded-4xl shadow-xl shadow-neutral-100/40 backdrop-blur-sm">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Full Name</label>
                                    <input 
                                        type="text" 
                                        name="name"
                                        value={form.name}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="Juan Dela Cruz" 
                                        className="w-full px-5 py-4 bg-neutral-50/60 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 transition-all text-sm font-medium text-neutral-800 placeholder:text-neutral-400" 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={form.email}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="juan@example.com" 
                                        className="w-full px-5 py-4 bg-neutral-50/60 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 transition-all text-sm font-medium text-neutral-800 placeholder:text-neutral-400" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Subject Matter</label>
                                <div className="relative w-full">
                                    <select 
                                        name="subject"
                                        value={form.subject}
                                        onChange={handleInputChange}
                                        className="w-full px-5 py-4 bg-neutral-50/60 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 transition-all text-sm font-medium text-neutral-800 appearance-none pr-12 cursor-pointer"
                                    >
                                        <option value="General Inquiry">General Inquiry</option>
                                        <option value="Partnership Proposal">Partnership Proposal</option>
                                        <option value="Student Support">Student Support</option>
                                        <option value="Press">Press / Media</option>
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-1">Message Context</label>
                                <textarea 
                                    name="message"
                                    rows={4} 
                                    value={form.message}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Outline your objectives or questions here..." 
                                    className="w-full px-5 py-4 bg-neutral-50/60 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-4 focus:ring-neutral-100 transition-all text-sm font-medium text-neutral-800 placeholder:text-neutral-400 resize-none"
                                />
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="magnetic w-full py-4.5 bg-neutral-900 text-white disabled:bg-neutral-400 rounded-xl font-bold uppercase tracking-[0.15em] text-[11px] flex items-center justify-center gap-3 hover:bg-neutral-800 transition-all duration-300 hover:shadow-lg hover:shadow-neutral-950/10 hover:-translate-y-0.5 group active:translate-y-0 disabled:pointer-events-none hover:cursor-pointer"
                            >
                                {isSubmitting ? "Transmitting Fields..." : "Dispatch Message"}
                                {!isSubmitting && (
                                    <Send size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300 text-mint-dark" />
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}