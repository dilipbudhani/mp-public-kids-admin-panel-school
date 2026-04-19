'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    User,
    BookOpen,
    Phone,
    MapPin,
    Calendar,
    Save,
    X,
    Loader2
} from 'lucide-react';

const studentSchema = z.object({
    fullName: z.string().min(3, 'Full name is required (min 3 chars)'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.string().min(1, 'Gender is required'),
    bloodGroup: z.string().optional(),
    aadhaarNo: z.string().optional(),
    class: z.string().min(1, 'Class is required'),
    section: z.string().optional(),
    rollNo: z.string().optional(),
    academicYear: z.string().optional(),
    admissionDate: z.string().min(1, 'Admission date is required'),
    fatherName: z.string().min(3, 'Father\'s name is required'),
    motherName: z.string().min(3, 'Mother\'s name is required'),
    primaryContact: z.string().min(10, 'Valid contact number is required'),
    email: z.string().email('Invalid email address'),
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(1, 'City is required'),
    pincode: z.string().min(6, 'Valid pincode is required'),
});

type StudentFormValues = z.infer<typeof studentSchema>;

interface StudentFormProps {
    initialData?: any;
}

export function StudentForm({ initialData }: StudentFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<StudentFormValues>({
        resolver: zodResolver(studentSchema),
        defaultValues: initialData || {
            section: 'A',
            academicYear: '2025-26',
        },
    });

    const onSubmit = async (data: StudentFormValues) => {
        try {
            setLoading(true);
            const response = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Failed to create student');
            }

            toast.success('Student record created successfully');
            router.push('/admin/students');
            router.refresh();
        } catch (error: any) {
            toast.error(error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-5xl">
            {/* Personal Details */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                        <User className="w-5 h-5 text-indigo-600" />
                    </div>
                    <h2 className="text-xl font-bold font-playfair">Personal Details</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Full Name *</label>
                        <input
                            {...register('fullName')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Enter full name"
                        />
                        {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Date of Birth *</label>
                        <input
                            type="date"
                            {...register('dateOfBirth')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        {errors.dateOfBirth && <p className="text-xs text-red-500">{errors.dateOfBirth.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Gender *</label>
                        <select
                            {...register('gender')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            <option value="">Select Gender</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                        {errors.gender && <p className="text-xs text-red-500">{errors.gender.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Blood Group</label>
                        <select
                            {...register('bloodGroup')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            <option value="">Select</option>
                            <option value="A+">A+</option>
                            <option value="A-">A-</option>
                            <option value="B+">B+</option>
                            <option value="B-">B-</option>
                            <option value="AB+">AB+</option>
                            <option value="AB-">AB-</option>
                            <option value="O+">O+</option>
                            <option value="O-">O-</option>
                        </select>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Aadhaar Number</label>
                        <input
                            {...register('aadhaarNo')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="12-digit Aadhaar number"
                        />
                    </div >
                </div>
            </section>

            {/* Academic Details */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                        <BookOpen className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold font-playfair">Academic Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Class *</label>
                        <select
                            {...register('class')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        >
                            <option value="">Select Class</option>
                            {[...Array(12)].map((_, i) => (
                                <option key={i + 1} value={(i + 1).toString()}>Class {i + 1}</option>
                            ))}
                            <option value="LKG">LKG</option>
                            <option value="UKG">UKG</option>
                            <option value="Nursery">Nursery</option>
                        </select>
                        {errors.class && <p className="text-xs text-red-500">{errors.class.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Section</label>
                        <input
                            {...register('section')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="e.g. A, B, C"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Roll Number</label>
                        <input
                            {...register('rollNo')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Roll Number"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Academic Year</label>
                        <input
                            {...register('academicYear')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="e.g. 2025-26"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Admission Date *</label>
                        <input
                            type="date"
                            {...register('admissionDate')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                        {errors.admissionDate && <p className="text-xs text-red-500">{errors.admissionDate.message}</p>}
                    </div>
                </div>
            </section>

            {/* Guardian & Contact */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-amber-50 rounded-lg">
                        <Phone className="w-5 h-5 text-amber-600" />
                    </div>
                    <h2 className="text-xl font-bold font-playfair">Guardian & Contact</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Father's Name *</label>
                        <input
                            {...register('fatherName')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Father's full name"
                        />
                        {errors.fatherName && <p className="text-xs text-red-500">{errors.fatherName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Mother's Name *</label>
                        <input
                            {...register('motherName')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="Mother's full name"
                        />
                        {errors.motherName && <p className="text-xs text-red-500">{errors.motherName.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Primary Contact *</label>
                        <input
                            {...register('primaryContact')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="10-digit mobile number"
                        />
                        {errors.primaryContact && <p className="text-xs text-red-500">{errors.primaryContact.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Email Address *</label>
                        <input
                            type="email"
                            {...register('email')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="email@example.com"
                        />
                        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
                    </div>
                </div>
            </section>

            {/* Address Details */}
            <section className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
                <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                    <div className="p-2 bg-rose-50 rounded-lg">
                        <MapPin className="w-5 h-5 text-rose-600" />
                    </div>
                    <h2 className="text-xl font-bold font-playfair">Address Information</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2 md:col-span-3">
                        <label className="text-sm font-medium text-gray-700">Full Address *</label>
                        <textarea
                            {...register('address')}
                            rows={3}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                            placeholder="Building, Street, Area..."
                        />
                        {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">City *</label>
                        <input
                            {...register('city')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="City"
                        />
                        {errors.city && <p className="text-xs text-red-500">{errors.city.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Pincode *</label>
                        <input
                            {...register('pincode')}
                            className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="6-digit Pincode"
                        />
                        {errors.pincode && <p className="text-xs text-red-500">{errors.pincode.message}</p>}
                    </div>
                </div>
            </section>

            {/* Actions */}
            <div className="flex items-center justify-end gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-2.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/20"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Creating...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Student
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
