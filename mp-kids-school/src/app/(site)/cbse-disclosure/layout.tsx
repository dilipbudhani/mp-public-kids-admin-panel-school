import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'CBSE Mandatory Public Disclosure | MP Kids School',
    description: 'Mandatory public disclosure as per CBSE norms for MP Kids School.',
};

export default function CBSEDisclosureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
