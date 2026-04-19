import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Co-Curricular Activities | MP Public School',
    description: 'Explore beyond the classroom with our wide range of co-curricular activities including music, dance, robotics, sports, and leadership clubs at MP Public School.',
    keywords: ['school activities', 'co-curricular', 'robotics club', 'school sports', 'music academy', 'MP Public School extracurricular'],
};

export default function CoCurricularLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
