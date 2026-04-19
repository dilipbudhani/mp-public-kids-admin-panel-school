"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import * as gtag from "@/lib/gtag";

const contactSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    phone: z.string().regex(/^[0-9]{10}$/, "Phone number must be exactly 10 digits"),
    enquiryType: z.enum(["Admission", "Fee", "Transport", "Academic", "General"], {
        message: "Please select an enquiry type",
    }),
    message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export function ContactForm() {
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = async (data: ContactFormData) => {
        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Failed to submit form");

            setSubmitted(true);
            reset();

            // Track submission
            gtag.event({
                action: "submit_contact_form",
                category: "Marketing",
                label: data.enquiryType,
                value: 1,
            });

            // Hide success overlay after 5 seconds
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error("Submission error:", error);
            alert("Something went wrong. Please try again later.");
        }
    };

    return (
        <div className="relative">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Full Name</label>
                        <input
                            {...register("name")}
                            className={`w-full bg-surface border ${errors.name ? 'border-red-500' : 'border-gray-200'} rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all`}
                            placeholder="Enter your full name"
                        />
                        {errors.name && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.name.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Email Address</label>
                        <input
                            {...register("email")}
                            className={`w-full bg-surface border ${errors.email ? 'border-red-500' : 'border-gray-200'} rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all`}
                            placeholder="your.email@example.com"
                        />
                        {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Phone Number</label>
                        <input
                            {...register("phone")}
                            maxLength={10}
                            className={`w-full bg-surface border ${errors.phone ? 'border-red-500' : 'border-gray-200'} rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all`}
                            placeholder="10-digit mobile number"
                        />
                        {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.phone.message}</p>}
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Enquiry Type</label>
                        <select
                            {...register("enquiryType")}
                            className={`w-full bg-surface border ${errors.enquiryType ? 'border-red-500' : 'border-gray-200'} rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all appearance-none cursor-pointer`}
                        >
                            <option value="">Select Category</option>
                            <option value="Admission">Admission</option>
                            <option value="Fee">Fee</option>
                            <option value="Transport">Transport</option>
                            <option value="Academic">Academic</option>
                            <option value="General">General</option>
                        </select>
                        {errors.enquiryType && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.enquiryType.message}</p>}
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-primary/60 ml-1">Message</label>
                    <textarea
                        {...register("message")}
                        rows={5}
                        className={`w-full bg-surface border ${errors.message ? 'border-red-500' : 'border-gray-200'} rounded-xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all resize-none`}
                        placeholder="Tell us how we can help you..."
                    />
                    {errors.message && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.message.message}</p>}
                </div>

                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#002147] text-white py-4 flex items-center justify-center gap-3 rounded-xl font-bold transition-all shadow-lg shadow-primary/20 hover:bg-[#003366]"
                >
                    {isSubmitting ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <>
                            <Send className="w-4 h-4" />
                            Send Message
                        </>
                    )}
                </motion.button>
            </form>

            {/* Success Toast */}
            <AnimatePresence>
                {submitted && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="absolute inset-0 z-30 bg-white/95 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center text-center p-8 border-2 border-[#D4AF37]/20 shadow-2xl"
                    >
                        <div className="w-16 h-16 bg-[#D4AF37] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-[#D4AF37]/20">
                            <CheckCircle2 className="w-8 h-8 text-[#002147]" />
                        </div>
                        <h4 className="text-2xl font-playfair font-bold text-[#002147] mb-2">Success!</h4>
                        <p className="text-slate-600 font-inter text-md">
                            Thank you! We will contact you within 24 hours.
                        </p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-6 text-xs font-bold uppercase tracking-widest text-[#D4AF37] hover:underline"
                        >
                            Send another message
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
