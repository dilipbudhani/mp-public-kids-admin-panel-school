// Shared interfaces for the application

export interface HeroSlide {
    _id: string;
    imageUrl: string;
    badge: string;
    title: string;
    highlight: string;
    description: string;
    cta1Text?: string;
    cta1Href?: string;
    cta2Text?: string;
    cta2Href?: string;
    statValue?: string;
    statLabel?: string;
    isActive: boolean;
    displayOrder: number;
}

export interface StatItem {
    label: string;
    value: number;
    suffix: string;
}

export interface Testimonial {
    _id: string;
    name: string;
    role: string;
    content: string;
    image?: string;
    rating?: number;
    isActive: boolean;
    displayOrder: number;
}

export interface NewsItem {
    _id: string;
    title: string;
    excerpt?: string;
    summary: string;
    content: string;
    imageUrl: string;
    image?: string; // For compatibility with components
    slug: string;
    category: string;
    isFeatured: boolean;
    isPublished: boolean;
    date: string | Date;
    publishedAt: string | Date;
}

export interface SchoolEvent {
    _id: string;
    title: string;
    description: string;
    date: string | Date;
    location: string;
    isActive: boolean;
    category: string;
    type: string; // Required by UpcomingEvents
}

export interface Circular {
    _id: string;
    id: string; // Required by NoticeCard
    title: string;
    description: string;
    date: string;
    fileUrl: string;
    pdfUrl: string; // Required by NoticeCard
    isActive: boolean;
    category: 'Academic' | 'Exam' | 'Holiday' | 'Event' | 'Admission' | 'General';
}

export interface Program {
    title: string;
    description: string;
    icon: string;
    href: string;
    color: string;
}

export interface Facility {
    title: string;
    description: string;
    icon: string;
    image: string;
}

export interface GalleryItem {
    id: string;
    image: string;
    caption: string;
    likes: number;
    comments: number;
}

export interface SiteSettings {
    _id: string;
    schoolName: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    socialMedia?: {
        facebook?: string;
        instagram?: string;
        twitter?: string;
        youtube?: string;
    };
    facebookUrl?: string;
    instagramUrl?: string;
    twitterUrl?: string;
    youtubeUrl?: string;
    admissionOpen?: boolean;
    announcement?: string;
    metaTitle?: string;
    metaDescription?: string;
    ogImage?: string;
    whatsappNumber?: string;
    mapEmbedUrl?: string;
    cbseAffiliation?: string;
}
