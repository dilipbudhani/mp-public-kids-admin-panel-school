import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Co-Curricular Activities | MP Kids School',
    description: 'Explore beyond the classroom with our wide range of co-curricular activities including music, dance, robotics, sports, and leadership clubs at MP Kids School.',
    keywords: ['school activities', 'co-curricular', 'robotics club', 'school sports', 'music academy', 'MP Kids School extracurricular'],
};

export default function CoCurricularLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
