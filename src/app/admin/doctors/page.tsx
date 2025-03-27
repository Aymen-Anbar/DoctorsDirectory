// src/app/admin/doctors/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { createClientSupabaseClient } from '@/lib/supabase-client';
import { Doctor } from '@/types/doctor';
import { toast } from 'react-hot-toast'; // Optional: for better notifications
import Image from 'next/image';

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [newDoctor, setNewDoctor] = useState<Partial<Doctor>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const supabase = createClientSupabaseClient();

  // Fetch doctors
  useEffect(() => {
    async function fetchDoctors() {
      setLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('doctors')
          .select('*');
        
        if (error) {
          console.error("Error fetching doctors:", {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
          });
          setError(`Failed to load doctors: ${error.message}`);
          return;
        }
        
        if (data) {
          setDoctors(data);
        }
      } catch (err: any) {
        console.error("Exception fetching doctors:", err);
        setError('An unexpected error occurred while loading doctors');
      } finally {
        setLoading(false);
      }
    }
    
    fetchDoctors();
  }, []);

// Add new doctor
// Update the handleAddDoctor function

const handleAddDoctor = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError(null);
  
  try {
    // Validate required fields
    const requiredFields = ['name', 'specialization', 'email', 'phone', 'address', 'bio'];
    for (const field of requiredFields) {
      if (!newDoctor[field as keyof typeof newDoctor]) {
        setError(`${field.charAt(0).toUpperCase() + field.slice(1)} is required`);
        setIsSubmitting(false);
        return;
      }
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (newDoctor.email && !emailRegex.test(newDoctor.email)) {
      setError('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }
    
    // Generate a unique ID - choose one of these approaches:
    
    // Option 1: Generate a UUID (recommended)
    const id = crypto.randomUUID();
    
    // Option 2: Generate a numeric ID (if your ID column is numeric)
    // const id = Date.now(); // Simple timestamp-based ID
    
    // Include the ID in the insert data
    const doctorToInsert = {
      id: id, // Add the generated ID
      name: newDoctor.name,
      specialization: newDoctor.specialization,
      email: newDoctor.email,
      phone: newDoctor.phone,
      address: newDoctor.address,
      bio: newDoctor.bio
    };
    
    console.log("Attempting to insert doctor:", doctorToInsert);
    
    const { data, error: supabaseError } = await supabase
      .from('doctors')
      .insert(doctorToInsert)
      .select();
    
    if (supabaseError) {
      console.error("Supabase error details:", {
        code: supabaseError.code,
        message: supabaseError.message,
        details: supabaseError.details,
        hint: supabaseError.hint
      });
      setError(`Failed to add doctor: ${supabaseError.message}`);
      return;
    }
    
    if (data && data.length > 0) {
      console.log("Successfully added doctor:", data[0]);
      setDoctors([...doctors, data[0]]);
      setNewDoctor({}); // Reset form
      toast?.success('Doctor added successfully!');
    } else {
      console.error("No data returned after insert");
      setError('Failed to add doctor: No data returned from database');
    }
  } catch (err: any) {
    console.error("Exception adding doctor:", err);
    setError(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
  } finally {
    setIsSubmitting(false);
  }
};

  // Delete doctor
  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('doctors')
        .delete()
        .eq('id', id);
      
      if (error) {
        console.error("Error deleting doctor:", {
          code: error.code,
          message: error.message,
          details: error.details,
          hint: error.hint
        });
        toast?.error(`Failed to delete doctor: ${error.message}`);
        return;
      }
      
      setDoctors(doctors.filter(doctor => doctor.id !== id));
      toast?.success('Doctor deleted successfully!');
    } catch (err: any) {
      console.error("Exception deleting doctor:", err);
      toast?.error(`An unexpected error occurred: ${err.message || 'Unknown error'}`);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewDoctor({...newDoctor, [name]: value});
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center space-x-2">
        <Image 
          src="/logo.png"  // Replace with your actual logo path
          alt="Doctors Directory Logo" 
          width={50} 
          height={50} 
          className="rounded-full"
        />
        <h1 className="text-xl font-bold text-blue-600">
          Doctors Directory Management
        </h1>
      </div>
      
      {/* Add New Doctor Form */}
      <form onSubmit={handleAddDoctor} className="mb-8 bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Add New Doctor</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Full Name"
              value={newDoctor.name || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
            <input
              id="specialization"
              name="specialization"
              type="text"
              placeholder="e.g. Cardiology"
              value={newDoctor.specialization || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="doctor@example.com"
              value={newDoctor.email || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={newDoctor.phone || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <textarea
              id="address"
              name="address"
              placeholder="Full address"
              value={newDoctor.address || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              rows={2}
            />
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
            <textarea
              id="bio"
              name="bio"
              placeholder="Professional background and expertise"
              value={newDoctor.bio || ''}
              onChange={handleInputChange}
              className="w-full border p-2 rounded"
              rows={3}
            />
          </div>
        </div>
        
        <button 
          type="submit" 
          className={`mt-4 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Adding...' : 'Add Doctor'}
        </button>
      </form>

      {/* Doctors List */}
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Current Doctors</h2>
        
        {loading ? (
          <p className="text-center py-4">Loading doctors...</p>
        ) : doctors.length === 0 ? (
          <p className="text-center py-4">No doctors found. Add your first doctor above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Specialization</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Phone</th>
                  <th className="p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {doctors.map((doctor) => (
                  <tr key={doctor.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">{doctor.name}</td>
                    <td className="p-2">{doctor.specialization}</td>
                    <td className="p-2">{doctor.email}</td>
                    <td className="p-2">{doctor.phone}</td>
                    <td className="p-2 text-center">
                      <button 
                        onClick={() => handleDeleteDoctor(doctor.id)}
                        className="bg-red-500 text-white p-1 px-2 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}