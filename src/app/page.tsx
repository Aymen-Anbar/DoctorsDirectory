// src/app/page.tsx
import { DoctorsDirectory } from '@/components/doctors/DoctorsDirectory';
import { supabase } from '@/lib/supabase';

export const revalidate = 60; // Revalidate every 60 seconds

async function fetchDoctors() {
  const { data: doctors, error } = await supabase
    .from('doctors')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching doctors:', error);
    return [];
  }

  return doctors;
}

export default async function Home() {
  const doctors = await fetchDoctors();

  return (
    <main>
      <DoctorsDirectory doctors={doctors} />
    </main>
  );
}