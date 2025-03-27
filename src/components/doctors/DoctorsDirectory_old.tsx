// src/components/doctors/DoctorsDirectory.tsx
'use client';
import React, { useState, useMemo } from 'react';
import { DoctorCard } from './DoctorCard';
import { Doctor } from '@/types/doctor';
import { Search } from 'lucide-react';
import Image from 'next/image';

interface DoctorsDirectoryProps {
  doctors: Doctor[];
}

export const DoctorsDirectory: React.FC<DoctorsDirectoryProps> = ({ doctors }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filtered and grouped doctors
  const filteredAndGroupedDoctors = useMemo(() => {
    // Filter doctors based on search query
    const filteredDoctors = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Group filtered doctors by specialization
    return filteredDoctors.reduce((acc, doctor) => {
      if (!acc[doctor.specialization]) {
        acc[doctor.specialization] = [];
      }
      acc[doctor.specialization].push(doctor);
      return acc;
    }, {} as Record<string, Doctor[]>);
  }, [doctors, searchQuery]);

  return (
    <div className="container mx-auto p-6">
      {/* Header with Logo and Search Bar */}
      <header className="flex justify-between items-center mb-8">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <Image 
            src="/logo.png"  // Replace with your actual logo path
            alt="Doctors Directory Logo" 
            width={50} 
            height={50} 
            className="rounded-full"
          />
          <span className="text-xl font-bold text-blue-600">
            Doctors Directory
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search size={20} />
          </div>
        </div>
      </header>

      <h1 className="text-3xl font-bold mb-6 text-center">
        {searchQuery 
          ? `Search Results for "${searchQuery}"` 
          : 'Our Doctors'
        }
      </h1>

      {Object.keys(filteredAndGroupedDoctors).length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          No doctors found matching your search.
        </div>
      ) : (
        Object.entries(filteredAndGroupedDoctors).map(([specialization, doctorList]) => (
          <div key={specialization} className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
              {specialization} Specialists
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {doctorList.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};
