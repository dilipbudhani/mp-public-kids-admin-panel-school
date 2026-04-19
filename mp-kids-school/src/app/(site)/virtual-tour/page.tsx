import React from 'react';
import { Metadata } from 'next';
import VirtualTourClient from './VirtualTourClient';

export const metadata: Metadata = {
    title: 'Virtual Campus Tour | MP Kids School',
    description: 'Take a virtual walk through the MP Kids School campus. Explore our sprawling grounds, modern classrooms, and state-of-the-art facilities.',
    openGraph: {
        title: 'Virtual Campus Tour | MP Kids School',
        description: 'Take a virtual walk through the MP Kids School campus. Explore our sprawling grounds, modern classrooms, and state-of-the-art facilities.',
        type: 'website',
    }
};

export default function VirtualTourPage() {
    return <VirtualTourClient />;
}
