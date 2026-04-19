import * as z from 'zod';

export const admissionSchema = z.object({
    // Step 1: Student Information
    studentName: z.string().min(3, 'Name must be at least 3 characters'),
    dateOfBirth: z.string().min(1, 'Date of birth is required'),
    gender: z.enum(['male', 'female', 'other']),
    applyingForClass: z.string().min(1, 'Please select a class'),
    studentAadhar: z.string().length(12, 'Aadhar must be exactly 12 digits').optional().or(z.literal('')),

    // Step 2: Parent Information
    parentName: z.string().min(3, 'Parent name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().length(10, 'Phone must be exactly 10 digits'),
    occupation: z.string().min(2, 'Occupation is required'),

    // Step 3: Address & Academic Background
    address: z.string().min(10, 'Full address is required'),
    city: z.string().min(2, 'City is required'),
    previousSchool: z.string().optional(),
    lastClassAttended: z.string().optional(),
    percentage: z.string().optional(),
});

export type AdmissionFormData = z.infer<typeof admissionSchema>;
