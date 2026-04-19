import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notice Board | MP Kids School',
    description: 'Stay updated with the latest official announcements, circulars, exam schedules, and holiday notifications from MP Kids School.',
    keywords: 'school notices, MP Kids School circulars, exam schedule, school events, admission notices',
};

export default function NoticeLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
