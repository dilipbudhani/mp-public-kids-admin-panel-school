import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'School Transport | MP Kids School',
    description: 'Learn about our safe and reliable school transport facility. GPS-tracked buses, trained personnel, and comprehensive city-wide route coverage at MP Kids School.',
    keywords: ['school transport', 'bus routes', 'MP Kids School bus', 'safe school travel', 'GPS tracked buses', 'school bus safety'],
};

export default function TransportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
