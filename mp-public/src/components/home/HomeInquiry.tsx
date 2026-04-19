"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Send, Loader2, CheckCircle2, Phone, Mail, MapPin, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const inquirySchema = z.object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email").optional().or(z.literal("")),
    phone: z.string().regex(/^[0-9]{10}$/, "10-digit number required"),
    enquiryType: z.string().min(1, "Please select an option"),
    message: z.string().min(10, "Brief message required"),
});

type InquiryFormData = z.infer<typeof inquirySchema>;

export function HomeInquiry() {
    const [submitted, setSubmitted] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<InquiryFormData>({
        resolver: zodResolver(inquirySchema),
    });

    const onSubmit = async (data: InquiryFormData) => {
        try {
            const response = await fetch("/api/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...data,
                    source: "Home Page Quick Inquiry"
                }),
            });

            if (!response.ok) throw new Error("Failed to submit");

            setSubmitted(true);
            toast.success("Inquiry sent successfully!");
            reset();
            setTimeout(() => setSubmitted(false), 5000);
        } catch (error) {
            console.error("Submission error:", error);
            toast.error("Failed to send inquiry. Please check your connection.");
        }
    };

    return (
        <section className="py-16 md:py-24 bg-surface relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-primary/5 -skew-x-12 translate-x-1/2 pointer-events-none" />

            <div className="container relative z-10 px-4 mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 items-center">
                    {/* Content Column */}
                    <div className="lg:w-1/2 space-y-8">
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-6"
                            >
                                <Sparkles className="w-3.5 h-3.5" />
                                Get in Touch
                            </motion.div>
                            <h2 className="text-3xl md:text-5xl font-bold font-playfair text-primary leading-tight">
                                Have Questions? <br />
                                <span className="text-accent italic">Let's connect.</span>
                            </h2>
                            <p className="mt-6 text-slate-600 text-lg leading-relaxed max-w-xl">
                                Whether you're interested in admissions, need academic details, or just want to learn more about our school, our team is here to help you every step of the way.
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-50">
                                <Phone className="w-6 h-6 text-accent mb-4" />
                                <h4 className="font-bold text-primary mb-1">Call Us</h4>
                                <p className="text-slate-500 text-sm">+91 12345 67890</p>
                            </div>
                            <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-50">
                                <Mail className="w-6 h-6 text-accent mb-4" />
                                <h4 className="font-bold text-primary mb-1">Email Us</h4>
                                <p className="text-slate-500 text-sm">info@mpkidsschool.edu.in</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h5 className="font-bold text-primary text-sm">Visit Our Campus</h5>
                                <p className="text-slate-500 text-xs">Education Hub, State 123456</p>
                            </div>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="lg:w-1/2 w-full">
                        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <div className="mb-8">
                                            <h3 className="text-2xl font-bold text-primary font-playfair">Quick Inquiry Form</h3>
                                            <p className="text-slate-500 text-sm">Fill in the details below and we'll reach out to you.</p>
                                        </div>

                                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
                                            <div className="space-y-1.5">
                                                <input
                                                    {...register("name")}
                                                    placeholder="Parent/Student Name"
                                                    className={cn(
                                                        "w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm",
                                                        errors.name ? "border-red-200" : "border-slate-100"
                                                    )}
                                                />
                                                {errors.name && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.name.message}</p>}
                                            </div>

                                            <div className="grid sm:grid-cols-2 gap-5">
                                                <div className="space-y-1.5">
                                                    <input
                                                        {...register("phone")}
                                                        placeholder="Phone Number (10 digits)"
                                                        className={cn(
                                                            "w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm",
                                                            errors.phone ? "border-red-200" : "border-slate-100"
                                                        )}
                                                    />
                                                    {errors.phone && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.phone.message}</p>}
                                                </div>
                                                <div className="space-y-1.5 text-left">
                                                    <select
                                                        {...register("enquiryType")}
                                                        className={cn(
                                                            "w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm appearance-none",
                                                            errors.enquiryType ? "border-red-200" : "border-slate-100"
                                                        )}
                                                    >
                                                        <option value="">Query Type</option>
                                                        <option value="Admission">Admission Inquiry</option>
                                                        <option value="Fee">Fee Structure</option>
                                                        <option value="Academic">Academic Program</option>
                                                        <option value="Transport">Transport Facility</option>
                                                        <option value="Other">Other</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <textarea
                                                    {...register("message")}
                                                    placeholder="How can we help you?"
                                                    rows={4}
                                                    className={cn(
                                                        "w-full px-5 py-4 bg-slate-50 border rounded-2xl outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm resize-none",
                                                        errors.message ? "border-red-200" : "border-slate-100"
                                                    )}
                                                />
                                                {errors.message && <p className="text-[10px] text-red-500 font-bold ml-2">{errors.message.message}</p>}
                                            </div>

                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-4 bg-primary text-white rounded-2xl font-bold tracking-widest uppercase text-xs flex items-center justify-center gap-3 hover:bg-primary-dark transition-all disabled:opacity-70 shadow-xl shadow-primary/20 mt-2"
                                            >
                                                {isSubmitting ? (
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4" />
                                                        Submit Request
                                                    </>
                                                )}
                                            </button>
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="py-12 flex flex-col items-center text-center"
                                    >
                                        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                                            <CheckCircle2 className="w-10 h-10 text-green-500" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-primary font-playfair mb-3">Inquiry Sent Successfully</h3>
                                        <p className="text-slate-500 max-w-xs">
                                            Thank you for reaching out! Our team will get back to you within 24 hours.
                                        </p>
                                        <button
                                            onClick={() => setSubmitted(false)}
                                            className="mt-8 text-primary font-bold text-xs uppercase tracking-widest hover:underline"
                                        >
                                            Send another inquiry
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
