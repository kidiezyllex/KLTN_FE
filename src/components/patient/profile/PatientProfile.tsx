import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  CalendarIcon,
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  UserIcon,
  Trash2Icon,
  PencilIcon,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import axios from "axios";
interface Patient {
  numberId?: string;
  fullName?: string;
  dateOfBirth?: Date;
  gender?: string;
  address?: string;
  phone?: string;
  email?: string;
}
export default function PatientProfile() {
  const { userId } = useAuth();
  const [patient, setPatient] = useState<Patient>({});

  useEffect(() => {
    const fetchPatientByAccountId = async () => {
      const response = await axios.get<Patient>(
        `http://localhost:3000/patients/by-account/${userId}`
      );
      console.log(response.data);
      setPatient(response.data);
    };

    fetchPatientByAccountId();
  }, [userId]);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[90%]">
      <p className="text-base font-semibold text-blue-500">HỒ SƠ BỆNH NHÂN</p>
      <div className="flex items-center space-x-4 border rounded-md p-4 ">
        <Avatar className="w-14 h-14 border-white">
          <AvatarFallback className="text-base font-semibold bg-secondary">
            {/* {patient.fullName
              .split(" ")
              .map((n) => n[0])
              .join("")} */}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-base font-semibold">{patient.fullName}</p>
          <p className="text-slate-500">ID: {patient.numberId}</p>
        </div>
      </div>
      <CardContent className="mt-6 space-y-4">
        <div className="flex items-center space-x-3">
          <CalendarIcon className="text-blue-500 h-4 w-4" />
          <span className="text-slate-600 text-base">
            Date of Birth: {patient.dateOfBirth}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <UserIcon className="text-blue-500 h-4 w-4" />
          <span className="text-slate-600 text-base">
            Gender: {patient.gender}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <MapPinIcon className="text-blue-500 h-4 w-4" />
          <span className="text-slate-600 text-base">
            Address: {patient.address}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <PhoneIcon className="text-blue-500 h-4 w-4" />
          <span className="text-slate-600 text-base">
            Phone: {patient.phone}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <MailIcon className="text-blue-500 h-4 w-4" />
          <span className="text-slate-600 text-base">
            Email: {patient.email}
          </span>
        </div>
      </CardContent>
      <div className="flex justify-end space-x-4">
        <Button variant="destructive" className="flex items-center space-x-2">
          <Trash2Icon className="w-4 h-4" />
          <span>Xoá</span>
        </Button>
        <Button
          variant="outline"
          className="flex items-center space-x-2 border-blue-500 text-blue-500 hover:bg-blue-50"
        >
          <PencilIcon className="w-4 h-4" />
          <span>Chỉnh sửa</span>
        </Button>
      </div>
    </div>
  );
}