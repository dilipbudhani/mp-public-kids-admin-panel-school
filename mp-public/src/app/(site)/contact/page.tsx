"use client";

import React from "react";
import { ContactForm } from "@/components/contact/ContactForm";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    Facebook,
    Instagram,
    Train,
    Bus,
    Car,
    ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";
import { XIcon, YoutubeIcon } from "@/components/ui/Icons";

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <section data-hero-dark="true" className="bg-[#002147] pt-32 pb-40 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32" />
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF37]/20 rounded-full blur-3xl -ml-48 -mb-48" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="max-w-3xl">
                        <motion.h4
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-[#D4AF37] font-bold tracking-[0.3em] uppercase mb-4 text-sm"
                        >
                            Get In Touch
                        </motion.h4>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl font-playfair font-bold text-white mb-6"
                        >
                            Connect with Our <span className="text-[#D4AF37]">Campus</span>
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-300 font-inter leading-relaxed max-w-2xl"
                        >
                            Whether you&apos;re exploring admission for your child or need administrative assistance, our dedicated team is here to support you.
                        </motion.p>
                    </div>
                </div>
            </section>

            {/* Main Content Grid */}
            <section className="container mx-auto px-4 -mt-24 pb-20 relative z-20">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Left Column: Contact Info & Support */}
                    <div className="lg:col-span-4 space-y-6">
                        {/* Info Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100 h-full">
                            <h3 className="text-2xl font-playfair font-bold text-[#002147] mb-8 border-b border-slate-100 pb-4">
                                Contact Information
                            </h3>

                            <div className="space-y-8">
                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#002147] group-hover:text-white transition-all duration-300">
                                        <MapPin className="w-6 h-6 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#002147] mb-1 font-inter">Our Location</h5>
                                        <p className="text-sm text-slate-500 leading-relaxed font-inter">
                                            Airport Rd, Ashok Nagar, Indore,<br />Madhya Pradesh - 452005, India<br />
                                            <span className="text-[#D4AF37] font-semibold mt-1 inline-block">Ref: PRMC+W9 Indore</span>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#002147] group-hover:text-white transition-all duration-300">
                                        <Phone className="w-6 h-6 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#002147] mb-1 font-inter">Phone Numbers</h5>
                                        <p className="text-sm text-slate-500 font-inter">General: +91 98765 43210</p>
                                        <p className="text-sm text-[#D4AF37] font-bold mt-1 font-inter">Admissions: +91 98765 43211</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#002147] group-hover:text-white transition-all duration-300">
                                        <Mail className="w-6 h-6 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#002147] mb-1 font-inter">Email Addresses</h5>
                                        <p className="text-sm text-slate-500 font-inter">info@mpkidsschool.edu.in</p>
                                        <p className="text-sm text-slate-500 font-inter">admissions@mpkidsschool.edu.in</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 group">
                                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-[#002147] group-hover:text-white transition-all duration-300">
                                        <Clock className="w-6 h-6 text-[#D4AF37]" />
                                    </div>
                                    <div>
                                        <h5 className="font-bold text-[#002147] mb-1 font-inter">Office Hours</h5>
                                        <div className="space-y-1 text-sm text-slate-500 font-inter">
                                            <p>Mon - Sat: 8:00 AM – 4:00 PM</p>
                                            <p className="text-red-500 font-semibold">Sunday: Closed</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t border-slate-100">
                                <h5 className="font-bold text-xs uppercase tracking-widest text-[#002147]/40 mb-6">Social Connexions</h5>
                                <div className="flex gap-4">
                                    {[
                                        { Icon: Facebook, color: 'hover:bg-[#1877F2]' },
                                        { Icon: Instagram, color: 'hover:bg-[#E4405F]' },
                                        { Icon: YoutubeIcon, color: 'hover:bg-[#FF0000]' },
                                        { Icon: XIcon, color: 'hover:bg-black' }
                                    ].map(({ Icon, color }, i) => (
                                        <a
                                            key={i}
                                            href="#"
                                            className={`w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-[#002147] hover:text-white transition-all transform hover:-translate-y-1 ${color}`}
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Contact Form */}
                    <div className="lg:col-span-8">
                        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-slate-100">
                            <div className="mb-10">
                                <h3 className="text-3xl font-playfair font-bold text-[#002147] mb-4">Send us a Message</h3>
                                <p className="text-slate-500 font-inter">Fill out the form below and our response team will get back to you within 24 hours.</p>
                            </div>
                            <ContactForm />
                        </div>
                    </div>
                </div>
            </section>

            {/* Maps & Directions Section */}
            <section className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#002147] mb-4">Locate <span className="text-[#D4AF37]">Our Campus</span></h2>
                    <p className="text-slate-500 font-inter max-w-2xl mx-auto">We are centrally located with excellent connectivity via Metro, Bus, and Private Transport.</p>
                </div>

                {/* Map Embed */}
                <div className="bg-white rounded-4xl p-4 shadow-xl mb-12 border border-slate-100">
                    <div className="rounded-3xl overflow-hidden border border-slate-200 shadow-inner group relative">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d407.8712862162951!2d75.8208528!3d22.7347255!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd6d5c629411%3A0x445d486d9601c0cc!2sMP%20Kids%20School!5e1!3m2!1sen!2sin!4v1776000537132!5m2!1sen!2sin"
                            width="100%"
                            height="450"
                            style={{ border: 0 }}
                            allowFullScreen={true}
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="MP Public School Location"
                            className="h-[300px] md:h-[450px]"
                        ></iframe>
                    </div>
                    <div className="mt-6 flex justify-center">
                        <a
                            href="https://www.google.com/maps/place/MP+Kids+School/@22.7347255,75.8208528,87m/data=!3m1!1e3!4m6!3m5!1s0x3962fd6d5c629411:0x445d486d9601c0cc!8m2!3d22.734766!4d75.8209383!16s%2Fg%2F1thtbjns"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-[#002147] font-bold uppercase tracking-widest text-sm hover:text-[#D4AF37] transition-colors"
                        >
                            Open in Google Maps <ExternalLink className="w-4 h-4" />
                        </a>
                    </div>
                </div>

                {/* Reach Us Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: Train,
                            mode: "By Railway",
                            text: "Nearest: Indore Junction (Railway Station). Well-connected via app-based cabs and local transit (approx. 20-25 mins)."
                        },
                        {
                            icon: Bus,
                            mode: "By City Bus",
                            text: "Take AiCTSL City Bus routes directed towards Airport / Ashok Nagar. Frequent stops are available at the Airport Gate / Thana."
                        },
                        {
                            icon: Car,
                            mode: "By Private Transport",
                            text: "Easily accessible via Airport Road and the Super Corridor. Look for landmarks near Airport Thana for precise entry."
                        }
                    ].map((item, i) => (
                        <motion.div
                            key={i}
                            whileHover={{ y: -5 }}
                            className="bg-white rounded-3xl p-8 border border-slate-100 shadow-lg"
                        >
                            <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6">
                                <item.icon className="w-7 h-7 text-[#002147]" />
                            </div>
                            <h4 className="text-xl font-playfair font-bold text-[#002147] mb-4">{item.mode}</h4>
                            <p className="text-slate-500 font-inter text-sm leading-relaxed">{item.text}</p>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
