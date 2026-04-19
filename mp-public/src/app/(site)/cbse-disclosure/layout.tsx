import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CBSE Mandatory Public Disclosure | MP Public School',
    description: 'Mandatory public disclosure as per CBSE norms for MP Public School.',
};

export default function CBSEDisclosureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
