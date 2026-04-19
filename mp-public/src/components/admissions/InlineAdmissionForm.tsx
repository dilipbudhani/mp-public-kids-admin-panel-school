import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { admissionSchema, AdmissionFormData } from '@/lib/validations/admission';
import { toast } from 'sonner';
import { Loader2, CheckCircle2 } from 'lucide-react';

// Inline form for quick admission apply
export default function InlineAdmissionForm({ defaultClass }: { defaultClass: string }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        resolver: zodResolver(admissionSchema.pick({ studentName: true, gender: true, applyingForClass: true, phone: true, email: true })),
        mode: 'onChange',
        defaultValues: { applyingForClass: defaultClass },
    });

    const onSubmit = async (data: any) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/admissions/apply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...data, isQuickForm: true, documents: [] }),
            });
            const result = await response.json();
            if (result.success) {
                toast.success('Application submitted! ID: ' + result.applicationNo);
            } else {
                toast.error(result.error || 'Submission failed');
            }
        } catch (e) {
            toast.error('Network error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded-xl shadow-md border border-slate-100">
            <h3 className="text-xl font-semibold mb-4 text-primary">Apply for {defaultClass}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input {...register('studentName')} placeholder="Student Name" className={`input-field ${errors.studentName ? 'border-red-500' : ''}`} />
                {errors.studentName?.message && <p className="text-red-500 text-xs">{errors.studentName.message as string}</p>}
                <select {...register('gender')} className="input-field">
                    <option value="">Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
                {errors.gender?.message && <p className="text-red-500 text-xs">{errors.gender.message as string}</p>}
                <input {...register('phone')} placeholder="Phone" className={`input-field ${errors.phone ? 'border-red-500' : ''}`} />
                {errors.phone?.message && <p className="text-red-500 text-xs">{errors.phone.message as string}</p>}
                <input {...register('email')} placeholder="Email" className={`input-field ${errors.email ? 'border-red-500' : ''}`} />
                {errors.email?.message && <p className="text-red-500 text-xs">{errors.email.message as string}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full flex items-center justify-center gap-2">
                {isSubmitting ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
        </form>
    );
}
