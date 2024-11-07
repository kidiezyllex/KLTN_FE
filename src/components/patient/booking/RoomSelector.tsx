"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Clock, FileCog, Stethoscope, User, Warehouse } from "lucide-react";
import ArrowButton from "@/components/animata/button/arrow-button";
import { Schedule } from "../../../../lib/entity-types";
import { generateTimeSlots, getDayOfWeek } from "../../../../lib/utils";
export default function RoomSelector({
  setActiveSection,
  selectedSpe,
  selectedDate,
}: {
  setActiveSection: (section: string) => void;
  selectedSpe: number | null;
  selectedDate: Date;
}) {
  const [doctorsBySpecialization, setDoctorsBySpecialization] = useState<[]>(
    []
  );

  useEffect(() => {
    const fetchDoctors = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors?specialization=${selectedSpe}`
      );
      const getDoctorsByDay = response.data.filter(
        (doctor: { schedule: any[] }) =>
          doctor.schedule.some(
            (schedule: { dayOfWeek: string }) =>
              schedule.dayOfWeek === getDayOfWeek(selectedDate)
          )
      );
      console.log(getDoctorsByDay);
      setDoctorsBySpecialization(getDoctorsByDay);
    };

    fetchDoctors();
  }, []);

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH PHÒNG KHÁM, BÁC SĨ, GIỜ KHÁM BẠN SẼ VÀO
      </p>
      <div className="w-full gap-4">
        {doctorsBySpecialization.map((doctor) => (
          <div
            key={(doctor as any)._id}
            className="overflow-hidden transition-shadow duration-300 rounded-md mb-4 bg-background border"
          >
            <div className="p-6">
              <div className="items-center mb-4 grid grid-cols-3">
                <div className="flex flex-row gap-3 items-center">
                  <Stethoscope className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Bác sĩ: {(doctor as any)?.fullName}
                  </p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <Warehouse className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Phòng khám: {(doctor as any)?.roomNumber}
                  </p>
                </div>
                <div className="flex flex-row gap-3 items-center">
                  <FileCog className="w-6 h-6 text-blue-500" />
                  <p className="text-sm font-semibold">
                    Chuyên khoa: {(doctor as any)?.specialization}
                  </p>
                </div>
              </div>
              <div className="space-y-4 ">
                {(doctor as any).schedule.map((scheduleItem: Schedule) => (
                  <div
                    key={scheduleItem._id}
                    className={
                      scheduleItem.dayOfWeek === getDayOfWeek(selectedDate)
                        ? "p-3 border-2 border-blue-500 "
                        : "p-3 border"
                    }
                  >
                    <h3 className="font-medium text-slate-500 mb-2 flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      <p className="text-sm"> {scheduleItem.dayOfWeek}</p>
                    </h3>
                    <div className="grid grid-cols-4 gap-2 ">
                      {generateTimeSlots(
                        (scheduleItem as any).startTime,
                        (scheduleItem as any).endTime
                      ).map((slot) => (
                        <Button key={slot} variant={"secondary"}>
                          {slot}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between">
        <Button
          className="w-fit dark:hover:bg-slate-900"
          onClick={() => {
            setActiveSection("specialtySelector");
          }}
          variant={"outline"}
        >
          Quay lại
        </Button>
        <ArrowButton
          className="w-fit"
          text={"Tiếp tục"}
          onClick={() => {
            setActiveSection("payment");
          }}
        ></ArrowButton>
      </div>
    </div>
  );
}
