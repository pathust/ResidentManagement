'use client'

import React from 'react';
import Loading from '@/components/Loading';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();
  router.replace('/dashboard');

  return (
    <Loading />
  );
}