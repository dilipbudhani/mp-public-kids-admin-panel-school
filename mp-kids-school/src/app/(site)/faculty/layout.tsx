import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Our Faculty | MP Kids School',
    description: 'Meet our dedicated team of highly qualified educators and academic leaders committed to excellence in education.',
};

export default function FacultyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
