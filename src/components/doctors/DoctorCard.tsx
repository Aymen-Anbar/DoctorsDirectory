  // src/components/doctors/DoctorCard.tsx
  import React from 'react';
  import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
  import { Users, Stethoscope, Mail, Phone, MapPin } from 'lucide-react';
  import { Doctor } from '@/types/doctor';
  
  interface DoctorCardProps {
    doctor: Doctor;
  }
  
  export const DoctorCard: React.FC<DoctorCardProps> = ({ doctor }) => {
    return (
      <Card className="w-full max-w-sm mb-4 shadow-md hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Stethoscope className="mr-2" />
            {doctor.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="flex items-center">
              <Users className="mr-2 text-gray-500" size={20} />
              {doctor.specialization}
            </p>
            <p className="flex items-center">
              <Mail className="mr-2 text-gray-500" size={20} />
              {doctor.email}
            </p>
            <p className="flex items-center">
              <Phone className="mr-2 text-gray-500" size={20} />
              {doctor.phone}
            </p>
            <p className="flex items-center">
              <MapPin className="mr-2 text-gray-500" size={20} />
              {doctor.address}
            </p>
          </div>
          {doctor.bio && (
            <div className="mt-4 text-sm text-gray-600">
              <p>{doctor.bio}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };
  
  