export function getSchoolJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'School',
        name: 'MP Kids School',
        url: 'https://mpkidsschool.edu.in',
        logo: 'https://mpkidsschool.edu.in/logo.png',
        address: {
            '@type': 'PostalAddress',
            streetAddress: '123 Education Lane',
            addressLocality: 'New Delhi',
            postalCode: '110001',
            addressCountry: 'IN',
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: '28.6139',
            longitude: '77.2090',
        },
        telephone: '+91-11-23456789',
        description: 'A premier CBSE school in India dedicated to academic brilliance and holistic development.',
        sameAs: [
            'https://facebook.com/mpkidsschool',
            'https://twitter.com/mpkidsschool',
            'https://instagram.com/mpkidsschool',
        ],
    };
}

export function getAdmissionJsonLd() {
    return {
        '@context': 'https://schema.org',
        '@type': 'EducationalOccupationalCredential',
        name: 'CBSE Admissions 2024-25',
        educationalLevel: 'Nursery to Class 12',
        provider: {
            '@type': 'School',
            name: 'MP Kids School',
        },
        offers: {
            '@type': 'Offer',
            description: 'Admissions Open for Academic Session 2024-25',
            availability: 'https://schema.org/InStock',
        },
    };
}
