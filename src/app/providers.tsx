'use client';

import React from 'react';
import { HeroUIProvider } from '@heroui/react';

type ProvidersProps = {
	children: React.ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
	return (
		<HeroUIProvider>
			{children}
		</HeroUIProvider>
	);
}


