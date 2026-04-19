'use client';

import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle2, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface BulkNoticePanelProps {
    isOpen: boolean;
    onClose: () => void;
    selectedCount: number;
    selectedIds: string[];
    onSuccess: () => void;
}

export function BulkNoticePanel({ isOpen, onClose, selectedCount, selectedIds, onSuccess }: BulkNoticePanelProps) {
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [step, setStep] = useState<'edit' | 'confirm' | 'success'>('edit');
    const [results, setResults] = useState<{ sent: number; failed: number; total: number } | null>(null);

    const handleSend = async () => {
        if (!message.trim()) {
            toast.error("Please enter a message");
            return;
        }

        setIsSending(true);
        try {
            const res = await fetch('/api/notifications/bulk', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    target: 'selected',
                    studentId: selectedIds,
                    message: message.trim()
                })
            });

            if (!res.ok) throw new Error("Failed to send notifications");

            const data = await res.json();
            setResults(data);
            setStep('success');
            onSuccess();
        } catch (error) {
            toast.error("Failed to send WhatsApp notices");
        } finally {
            setIsSending(false);
        }
    };

    const reset = () => {
        setMessage('');
        setStep('edit');
        setResults(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-60"
                    />
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-70 flex flex-col"
                    >
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-primary/5">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5 text-primary" />
                                    Send WhatsApp Notice
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Sending to {selectedCount} selected students
                                </p>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            {step === 'edit' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3">
                                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div className="text-xs text-amber-800 leading-relaxed">
                                            <p className="font-bold mb-1 uppercase tracking-wider">Communication Notice</p>
                                            <p>This will send an automated WhatsApp message to parents. Please ensure the message is professional and concise.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 uppercase tracking-wider">Message Content</label>
                                        <textarea
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            placeholder="Write your notice here..."
                                            className="w-full h-40 p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-gray-800"
                                        />
                                        <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold uppercase tracking-widest px-1">
                                            <span>Variable: {'{student_name}'} is added automatically</span>
                                            <span>{message.length} characters</span>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Live Preview</p>
                                        <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100 text-sm">
                                            <p className="text-gray-900 leading-relaxed italic">
                                                "Notice for [Student Name]: {message || '[Your message will appear here]'} - Regards, MP Kids School"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 'success' && results && (
                                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                                    <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                                        <CheckCircle2 className="w-10 h-10" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900">Notices Sent!</h3>
                                    <div className="grid grid-cols-3 gap-4 w-full max-w-xs mt-6">
                                        <div className="p-3 bg-gray-50 rounded-xl">
                                            <p className="text-xl font-bold text-gray-900">{results.total}</p>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Total</p>
                                        </div>
                                        <div className="p-3 bg-emerald-50 rounded-xl">
                                            <p className="text-xl font-bold text-emerald-600">{results.sent}</p>
                                            <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest">Sent</p>
                                        </div>
                                        <div className="p-3 bg-rose-50 rounded-xl">
                                            <p className="text-xl font-bold text-rose-600">{results.failed}</p>
                                            <p className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Failed</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={reset}
                                        className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-all"
                                    >
                                        Back to Students
                                    </button>
                                </div>
                            )}
                        </div>

                        {step === 'edit' && (
                            <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3">
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 px-4 bg-white border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSend}
                                    disabled={isSending || !message.trim()}
                                    className="flex-1 py-3 px-4 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSending ? (
                                        <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    Send Now
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
