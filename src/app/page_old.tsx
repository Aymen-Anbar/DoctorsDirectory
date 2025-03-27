// src/app/page.tsx
import React from 'react';
import { DoctorsDirectory } from '@/components/doctors/DoctorsDirectory';
import doctorsData from '../../public/doctors.json';

export default function Home() {
  return (
    <main>
      <DoctorsDirectory doctors={doctorsData.doctors} />
    </main>
  );
}
