'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login if there's no token
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
    else {
      router.push('/dashboard');
    }


  }, [router]);


  return null; // Render nothing. The redirection happens in useEffect
}