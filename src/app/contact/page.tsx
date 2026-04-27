"use client";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-neutral-50 pt-32 pb-24 px-8 md:px-16">
            <div className="max-w-7xl mx-auto">
                <div className="mb-24">
                    <span className="text-[10px] font-black text-mint-dark uppercase tracking-[0.3em] mb-4 block">
                        Get in Touch
                    </span>
                    <h1 className="text-7xl md:text-8xl font-black text-black uppercase leading-none tracking-tighter">
                        Let&apos;s talk <br /> 
                        <span className="text-transparent" style={{ WebkitTextStroke: "1px #263127" }}>strategy.</span>
                    </h1>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
                    <div className="space-y-12">
                        <p className="text-xl text-neutral-500 font-medium leading-relaxed max-w-md">
                            Whether you&apos;re a student looking for a path or an institution looking to partner, our consultants are ready to optimize your next move.
                        </p>

                        <div className="space-y-8">
                            <div className="magnetic group flex items-start gap-6">
                                <div className="p-4 bg-white border border-neutral-200 rounded-2xl group-hover:border-black transition-colors">
                                    <Mail size={24} className="text-black" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Email us</h4>
                                    <a href="mailto:sobre.co@gmail.com" className="text-xl font-bold hover:text-mint-dark transition-colors">sobre.co@gmail.com</a>
                                </div>
                            </div>

                            <div className="magnetic group flex items-start gap-6">
                                <div className="p-4 bg-white border border-neutral-200 rounded-2xl group-hover:border-black transition-colors">
                                    <Phone size={24} className="text-black" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">Call us</h4>
                                    <p className="text-xl font-bold">+63 963 412 9856</p>
                                </div>
                            </div>

                            <div className="magnetic group flex items-start gap-6">
                                <div className="p-4 bg-white border border-neutral-200 rounded-2xl group-hover:border-black transition-colors">
                                    <MapPin size={24} className="text-black" />
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-1">HQ</h4>
                                    <p className="text-xl font-bold">Metro Manila, Philippines</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white border border-neutral-200 p-8 md:p-12 rounded-[40px] shadow-2xl shadow-neutral-200/50">
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2">Full Name</label>
                                    <input type="text" placeholder="Juan Dela Cruz" className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:border-black transition-all text-sm font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2">Email</label>
                                    <input type="email" placeholder="juan@example.com" className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:border-black transition-all text-sm font-medium" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2">Subject</label>
                                <select className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:border-black transition-all text-sm font-medium appearance-none">
                                    <option>General Inquiry</option>
                                    <option>Partnership Proposal</option>
                                    <option>Student Support</option>
                                    <option>Press</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400 ml-2">Message</label>
                                <textarea rows={4} placeholder="What's on your mind?" className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl focus:outline-none focus:border-black transition-all text-sm font-medium resize-none"></textarea>
                            </div>

                            <button className="magnetic w-full py-5 bg-black text-white rounded-2xl font-black uppercase tracking-widest text-[12px] flex items-center justify-center gap-3 hover:bg-[#263127] transition-colors group">
                                Send Message
                                <Send size={16} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}