"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, MessageSquare, AlertCircle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import * as gtag from "@/lib/gtag";

type Tab = "feedback" | "complaint";

export default function FeedbackPage() {
    const [activeTab, setActiveTab] = useState<Tab>("feedback");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            type: activeTab,
            name: formData.get("name"),
            email: formData.get("email"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            rating: activeTab === "feedback" ? rating : undefined,
        };

        try {
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Track event
            gtag.event({
                action: "submit_feedback",
                category: "Marketing",
                label: activeTab,
                value: rating,
            });

            setIsSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="min-h-screen pt-24 pb-20 bg-surface">
            <section className="container px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-playfair font-bold text-primary mb-4">
                            Your Voice Matters
                        </h1>
                        <p className="text-text/70 text-lg">
                            We value your feedback to help us grow and provide a better environment for our students.
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Tabs */}
                        <div className="flex border-b border-gray-100">
                            <button
                                onClick={() => setActiveTab("feedback")}
                                className={cn(
                                    "flex-1 py-5 text-center font-bold transition-all flex items-center justify-center gap-2",
                                    activeTab === "feedback"
                                        ? "bg-white text-accent border-b-4 border-accent"
                                        : "bg-gray-50 text-text/40 hover:text-text/60"
                                )}
                            >
                                <MessageSquare className="w-5 h-5" />
                                General Feedback
                            </button>
                            <button
                                onClick={() => setActiveTab("complaint")}
                                className={cn(
                                    "flex-1 py-5 text-center font-bold transition-all flex items-center justify-center gap-2",
                                    activeTab === "complaint"
                                        ? "bg-white text-secondary border-b-4 border-secondary"
                                        : "bg-gray-50 text-text/40 hover:text-text/60"
                                )}
                            >
                                <AlertCircle className="w-5 h-5" />
                                Lodge a Complaint
                            </button>
                        </div>

                        <div className="p-8 md:p-12">
                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-12"
                                >
                                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-primary mb-4">
                                        Thank you for your response!
                                    </h2>
                                    <p className="text-text/70 mb-8 max-w-md mx-auto">
                                        We have received your {activeTab}. Our team will review it and get back to you if necessary.
                                    </p>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="btn btn-primary px-8"
                                    >
                                        Send Another
                                    </button>
                                </motion.div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-primary">Full Name</label>
                                            <input
                                                name="name"
                                                required
                                                type="text"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                                                placeholder="John Doe"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-primary">Email Address</label>
                                            <input
                                                name="email"
                                                required
                                                type="email"
                                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                                                placeholder="john@example.com"
                                            />
                                        </div>
                                    </div>

                                    {activeTab === "feedback" && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-primary block">How would you rate us?</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="transition-transform hover:scale-110 active:scale-95"
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "w-10 h-10 transition-colors",
                                                                (hoverRating || rating) >= star
                                                                    ? "fill-gold text-gold"
                                                                    : "text-gray-200"
                                                            )}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary">Subject</label>
                                        <input
                                            name="subject"
                                            required
                                            type="text"
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
                                            placeholder="What is this regarding?"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-primary">Your Message</label>
                                        <textarea
                                            name="message"
                                            required
                                            rows={5}
                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all resize-none"
                                            placeholder={activeTab === "feedback" ? "Tell us what you like or what we can improve..." : "Please provide details of your concern..."}
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className={cn(
                                            "btn w-full py-4 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all",
                                            activeTab === "feedback" ? "bg-accent hover:bg-accent/90" : "bg-secondary hover:bg-secondary/90",
                                            isSubmitting && "opacity-70 cursor-not-allowed"
                                        )}
                                    >
                                        {isSubmitting ? (
                                            "Sending..."
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                Submit {activeTab === "feedback" ? "Feedback" : "Complaint"}
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
