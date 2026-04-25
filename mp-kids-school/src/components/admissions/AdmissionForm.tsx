'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { admissionSchema, AdmissionFormData } from '@/lib/validations/admission';
import {
    User,
    Users,
    MapPin,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    GraduationCap,
    Upload,
    FileText,
    X,
    Loader2,
} from 'lucide-react';

import { toast } from 'sonner';
import * as gtag from '@/lib/gtag';

const steps = [
    { id: 'student', title: 'Student Info', icon: User },
    { id: 'parent', title: 'Parent Info', icon: Users },
    { id: 'academic', title: 'Academic & Address', icon: GraduationCap },
    { id: 'documents', title: 'Documents', icon: Upload },
    { id: 'review', title: 'Review & Submit', icon: CheckCircle2 },
];

interface AdmissionFormProps {
    availableClasses?: string[];
    schoolName?: string;
}

export default function AdmissionForm({
    availableClasses = ['Nursery', 'KG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '11'],
    schoolName = 'MP Kids School'
}: AdmissionFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [applicationNo, setApplicationNo] = useState('');
    const [uploadedDocs, setUploadedDocs] = useState<{ type: string, url: string, publicId: string, uploadedAt: string }[]>([]);
    const [uploadingDocs, setUploadingDocs] = useState<Record<string, boolean>>({});

    const {
        register,
        handleSubmit,
        trigger,
        watch,
        formState: { errors },
    } = useForm<AdmissionFormData>({
        resolver: zodResolver(admissionSchema),
        mode: 'onChange',
    });

    const applyingForClass = watch('applyingForClass');

    const documentDefinitions = [
        { id: 'birth_certificate', label: 'Birth Certificate', required: true },
        { id: 'address_proof', label: 'Address Proof (Aadhar/Voter ID)', required: true },
        { id: 'report_card', label: 'Previous Class Report Card', required: !['Nursery', 'KG'].includes(applyingForClass) && !!applyingForClass },
        { id: 'transfer_certificate', label: 'Transfer Certificate', required: !['Nursery', 'KG'].includes(applyingForClass) && !!applyingForClass },
        { id: 'photo', label: 'Passport Size Photo', required: true },
        { id: 'other', label: 'Other Documents', required: false, multiple: true },
    ];

    const requiredDocs = documentDefinitions.filter(d => d.required).map(d => d.id);

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (currentStep === 0) fieldsToValidate = ['studentName', 'dateOfBirth', 'gender', 'applyingForClass'];
        if (currentStep === 1) fieldsToValidate = ['parentName', 'email', 'phone', 'occupation'];
        if (currentStep === 2) fieldsToValidate = ['address', 'city'];

        const isStepValid = await trigger(fieldsToValidate);

        // Required documents validation for step 3 (Documents)
        if (currentStep === 3) {
            const requiredUploaded = requiredDocs.every(type =>
                uploadedDocs.some(doc => doc.type === type)
            );
            if (!requiredUploaded) {
                toast.error('Please upload all required documents');
                return;
            }
        }

        if (isStepValid) setCurrentStep((prev) => prev + 1);
    };

    const prevStep = () => setCurrentStep((prev) => prev - 1);

    const onSubmit = async (data: AdmissionFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/admissions/apply', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...data,
                    documents: uploadedDocs
                }),
            });

            const result = await response.json();

            if (result.success) {
                setApplicationNo(result.applicationNo);
                setIsSubmitted(true);
                toast.success('Application submitted successfully!');

                // Track submission
                gtag.event({
                    action: 'submit_admission_form',
                    category: 'Admissions',
                    label: data.applyingForClass,
                    value: 1,
                });
            } else {
                toast.error(result.error || 'Failed to submit application');
            }
        } catch (error) {
            console.error('Submission Error:', error);
            toast.error('An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-20 bg-white rounded-3xl shadow-xl p-12 max-w-2xl mx-auto border-t-8 border-t-secondary transition-all duration-500 animate-in fade-in zoom-in">
                <div className="w-20 h-20 bg-secondary/20 text-secondary rounded-full flex items-center justify-center mx-auto mb-8">
                    <CheckCircle2 size={48} />
                </div>
                <h2 className="text-4xl font-serif text-accent font-bold mb-4">Application Received!</h2>
                <p className="text-slate-600 text-lg mb-8">
                    Thank you for choosing {schoolName}. Our admissions team will review your application and contact you within 48 working hours.
                </p>
                <div className="p-6 bg-slate-50 rounded-2xl mb-8 border border-slate-100">
                    <p className="text-sm text-slate-500 mb-1 uppercase tracking-wider font-bold">Your Application ID</p>
                    <p className="text-3xl font-mono font-bold text-accent">#{applicationNo}</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button className="btn btn-primary px-10" onClick={() => window.location.href = `/admissions/status?applicationNo=${applicationNo}`}>
                        Track Status
                    </button>
                    <button className="btn bg-slate-100 text-accent hover:bg-slate-200 px-10" onClick={() => window.location.href = '/'}>
                        Return Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress Stepper */}
            <div className="flex justify-between mb-12 relative px-4">
                {/* Connection Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -translate-y-6 z-0" />

                {steps.map((step, idx) => {
                    const Icon = step.icon;
                    const isActive = idx === currentStep;
                    const isCompleted = idx < currentStep;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${isActive ? 'bg-primary text-white scale-110 shadow-lg' :
                                isCompleted ? 'bg-secondary text-accent' : 'bg-white border-2 border-slate-100 text-slate-400'
                                }`}>
                                {isCompleted ? <CheckCircle2 size={20} /> : <Icon size={20} />}
                            </div>
                            <span className={`text-[10px] uppercase font-bold tracking-widest ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                                {step.title}
                            </span>
                        </div>
                    );
                })}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-3xl shadow-2xl border border-slate-100">
                <AnimatePresence mode="wait">
                    {/* Step 1: Student Details */}
                    {currentStep === 0 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-serif text-accent font-bold mb-8">Student Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Full Name</label>
                                    <input {...register('studentName')} className={`input-field ${errors.studentName ? 'border-red-500' : ''}`} placeholder="As per birth certificate" />
                                    {errors.studentName && <p className="text-red-500 text-xs mt-1">{errors.studentName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Date of Birth</label>
                                    <input type="date" {...register('dateOfBirth')} className={`input-field ${errors.dateOfBirth ? 'border-red-500' : ''}`} />
                                    {errors.dateOfBirth && <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Gender</label>
                                    <select {...register('gender')} className="input-field">
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Applying For Class</label>
                                    <select {...register('applyingForClass')} className={`input-field ${errors.applyingForClass ? 'border-red-500' : ''}`}>
                                        <option value="">Select Class</option>
                                        {availableClasses.map(c => (
                                            <option key={c} value={c}>Class {c}</option>
                                        ))}
                                    </select>
                                    {errors.applyingForClass && <p className="text-red-500 text-xs mt-1">{errors.applyingForClass.message}</p>}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 2: Parent Details */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-serif text-accent font-bold mb-8">Parent / Guardian Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Primary Parent Name</label>
                                    <input {...register('parentName')} className={`input-field ${errors.parentName ? 'border-red-500' : ''}`} placeholder="Full Name" />
                                    {errors.parentName && <p className="text-red-500 text-xs mt-1">{errors.parentName.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Phone Number</label>
                                    <input {...register('phone')} className={`input-field ${errors.phone ? 'border-red-500' : ''}`} placeholder="10 Digit Number" maxLength={10} />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Email Address</label>
                                    <input {...register('email')} className={`input-field ${errors.email ? 'border-red-500' : ''}`} placeholder="email@example.com" />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Occupation</label>
                                    <input {...register('occupation')} className={`input-field ${errors.occupation ? 'border-red-500' : ''}`} placeholder="e.g. Professional, Business" />
                                    {errors.occupation && <p className="text-red-500 text-xs mt-1">{errors.occupation.message}</p>}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Academic & Address */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-serif text-accent font-bold mb-8">Address & Background</h3>
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Communication Address</label>
                                    <textarea {...register('address')} rows={3} className={`input-field ${errors.address ? 'border-red-500' : ''}`} placeholder="Full street address, landmark" />
                                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">City</label>
                                        <input {...register('city')} className="input-field" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="block text-sm font-bold text-slate-500 uppercase tracking-wide mb-1">Previous School (if any)</label>
                                        <input {...register('previousSchool')} className="input-field" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Documents Upload */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step_docs"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-6"
                        >
                            <h3 className="text-2xl font-serif text-accent font-bold mb-4">Document Upload</h3>
                            <p className="text-slate-500 mb-8">Please upload clear copies of the following documents. (PDF, JPG or PNG. Max 5MB each)</p>

                            <div className="space-y-4">
                                {documentDefinitions.map((doc) => {
                                    const isUploaded = uploadedDocs.some(u => u.type === doc.id);
                                    const isUploading = uploadingDocs[doc.id];
                                    const uploadedFile = uploadedDocs.find(u => u.type === doc.id);

                                    return (
                                        <div key={doc.id} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="font-bold text-accent">{doc.label}</span>
                                                    {doc.required ? (
                                                        <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Required</span>
                                                    ) : (
                                                        <span className="text-[10px] bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full font-bold uppercase">Optional</span>
                                                    )}
                                                </div>
                                                {isUploaded && (
                                                    <div className="flex items-center gap-2 text-sm text-green-600 font-medium">
                                                        <CheckCircle2 size={14} /> Uploaded
                                                        {uploadedFile?.url && (
                                                            <a href={uploadedFile.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline ml-2 flex items-center gap-1">
                                                                <FileText size={12} /> View
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3">
                                                {isUploading ? (
                                                    <div className="flex items-center gap-2 text-primary text-sm font-bold">
                                                        <Loader2 size={18} className="animate-spin" /> Uploading...
                                                    </div>
                                                ) : (
                                                    <div className="relative">
                                                        <input
                                                            type="file"
                                                            accept=".pdf,.jpg,.jpeg,.png"
                                                            onChange={async (e) => {
                                                                const file = e.target.files?.[0];
                                                                if (!file) return;

                                                                setUploadingDocs(prev => ({ ...prev, [doc.id]: true }));
                                                                const formData = new FormData();
                                                                formData.append('file', file);
                                                                formData.append('documentType', doc.id);
                                                                formData.append('applicationNo', 'TEMP-' + Date.now());

                                                                try {
                                                                    const res = await fetch('/api/admissions/upload', {
                                                                        method: 'POST',
                                                                        body: formData,
                                                                    });
                                                                    const result = await res.json();
                                                                    if (result.success) {
                                                                        setUploadedDocs(prev => [
                                                                            ...prev.filter(u => u.type !== doc.id),
                                                                            {
                                                                                type: doc.id,
                                                                                url: result.url,
                                                                                publicId: result.publicId,
                                                                                uploadedAt: new Date().toISOString()
                                                                            }
                                                                        ]);
                                                                        toast.success(`${doc.label} uploaded!`);
                                                                    } else {
                                                                        toast.error(result.error || 'Upload failed');
                                                                    }
                                                                } catch (err) {
                                                                    toast.error('Upload failed. Please check your connection.');
                                                                } finally {
                                                                    setUploadingDocs(prev => ({ ...prev, [doc.id]: false }));
                                                                }
                                                            }}
                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                                        />
                                                        <button type="button" className={`btn ${isUploaded ? 'bg-white text-accent border-slate-200' : 'btn-primary'} btn-sm px-6 flex items-center gap-2 pr-4`}>
                                                            {isUploaded ? 'Replace' : 'Upload'} <Upload size={14} />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 5: Review */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step_review"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <h3 className="text-2xl font-serif text-accent font-bold mb-4">Review Your Application</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-slate-50 p-8 rounded-2xl border border-dashed border-slate-300">
                                <div className="space-y-2">
                                    <p className="text-xs uppercase font-bold text-slate-400">Student</p>
                                    <p className="font-bold text-accent">{watch('studentName') || 'N/A'}</p>
                                    <p className="text-sm">Applying for Class {watch('applyingForClass')}</p>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-xs uppercase font-bold text-slate-400">Parent / Contact</p>
                                    <p className="font-bold text-accent">{watch('parentName') || 'N/A'}</p>
                                    <p className="text-sm">{watch('phone')} | {watch('email')}</p>
                                </div>
                                <div className="space-y-2 md:col-span-2 pt-4 border-t border-slate-200">
                                    <p className="text-xs uppercase font-bold text-slate-400">Uploaded Documents</p>
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {uploadedDocs.length > 0 ? (
                                            uploadedDocs.map(doc => (
                                                <span key={doc.type} className="bg-secondary/10 text-secondary text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                                                    <CheckCircle2 size={10} /> {documentDefinitions.find(d => d.id === doc.type)?.label}
                                                </span>
                                            ))
                                        ) : (
                                            <span className="text-red-500 text-sm italic">No documents uploaded</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-500 italic">
                                By submitting this form, you certify that all information provided is accurate to the best of your knowledge.
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Form Navigation */}
                <div className="mt-12 flex justify-between border-t border-slate-100 pt-8">
                    {currentStep > 0 ? (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="btn bg-slate-100 text-accent hover:bg-slate-200 px-8 flex items-center gap-2"
                        >
                            <ChevronLeft size={20} /> Back
                        </button>
                    ) : (
                        <div />
                    )}

                    {currentStep < steps.length - 1 ? (
                        <button
                            type="button"
                            onClick={nextStep}
                            className="btn btn-primary px-8 flex items-center gap-2 group"
                        >
                            Next Step <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn btn-secondary px-12 py-4 font-bold shadow-xl shadow-secondary/20 flex items-center gap-2 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                'Submit Application'
                            )}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
