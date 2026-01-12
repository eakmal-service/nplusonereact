'use client';
import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    useEffect(() => {
        // Redirect to home with login modal trigger
        // Preserve the redirect intent via 'next' param which LoginModal understands
        router.replace(`/?login=true&next=${redirect}`);
    }, [router, redirect]);

    return <div className="bg-black min-h-screen flex items-center justify-center text-white">Loading Login...</div>;
}
