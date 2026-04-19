import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Fee Structure 2025-26 | MP Kids School',
    description: 'Detailed annual fee structure, transport charges, and payment policies for MP Kids School for the academic year 2025-26.',
};

export default function FeeStructureLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
