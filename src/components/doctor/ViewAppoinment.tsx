"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  parseISO,
  subMonths,
  addMonths,
} from "date-fns";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  Cat,
  ChevronLeft,
  ChevronRight,
  Clock,
  Dog,
  FileText,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "../ui/separator";
import { usePathname } from "next/navigation";
import { ScrollArea } from "../ui/scroll-area";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface MedicalHistory {
  _id: string;
  disease: string;
  diagnosisDate: string;
  treatment: string;
}

interface Patient {
  _id: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  address: string;
  phone: string;
  email: string;
  medicalHistory: MedicalHistory[];
}

interface Appointment {
  id: string;
  patientId: Patient;
  appointmentDate: string;
  reason: string;
  status: string;
}

const FormSchema = z.object({
  roomNumber: z
    .string()
    .regex(/^\d+$/, { message: "Chỉ được nhập số." }) // Chỉ cho phép số
    .min(3, { message: "Room number phải có ít nhất 3 ký tự." }) // Tối thiểu 3 ký tự
    .max(3, { message: "Room number chỉ được tối đa 3 ký tự." }), // Tối đa 3 ký tự
});
// const appointments = [
//   {
//     patientId: {
//       id: "566777722918",
//       appointmentDateByPatient: "2024-10-11T17:00:00.000Z",
//       specialization: "Cardiology",
//       fullName: "Bui Tran Thien An",
//       dateOfBirth: "2004-09-10T17:00:00.000Z",
//       gender: "Male",
//       address: "Huyện Hàm Yên,Tỉnh Tuyên Quang",
//       phone: "+84904548277",
//       email: "benhnhan1@gmail.com",
//       medicalHistory: [],
//     },
//     appointmentDate: "2024-10-11T16:11:50.261Z",
//     reason: "Gặp bác sĩ 123",
//     specialization: "Cardiology",
//   },
//   {
//     patientId: {
//       id: "566777729999",
//       appointmentDateByPatient: "2024-10-11T17:00:00.000Z",
//       specialization: "Cardiology",
//       fullName: "Bui Tran Thien An",
//       dateOfBirth: "2004-09-10T17:00:00.000Z",
//       gender: "Female",
//       address: "Huyện Hàm Yên,Tỉnh Tuyên Quang",
//       phone: "+84904548277",
//       email: "benhnhan1@gmail.com",
//       medicalHistory: [],
//     },
//     appointmentDate: "2024-10-11T16:11:50.261Z",
//     reason: "Gặp bác sĩ 123",
//     specialization: "Cardiology",
//   },
//   {
//     patientId: {
//       id: "566777729999",
//       appointmentDateByPatient: "2024-10-12T17:00:00.000Z",
//       specialization: "Cardiology",
//       fullName: "Bui Tran Thien An",
//       dateOfBirth: "2004-09-10T17:00:00.000Z",
//       gender: "Female",
//       address: "Huyện Hàm Yên,Tỉnh Tuyên Quang",
//       phone: "+84904548277",
//       email: "benhnhan1@gmail.com",
//       medicalHistory: [],
//     },
//     appointmentDate: "2024-10-12T16:11:50.261Z",
//     reason: "Gặp bác sĩ 123",
//     specialization: "Cardiology",
//   },
// ];

const formatDate = (dateString: string) => {
  return format(parseISO(dateString), "dd/MM/yyyy");
};

export default function ViewAppointment() {
  const [selectedRoomNumber, setSelectedRoomNumber] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("Week");
  const doctorId = usePathname().split("/")[1];
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [appointments, setAppointments] =
    useState<Appointment[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isCreatePrescription, setIsCreatePrescription] = useState(false);

  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roomNumber: "000",
    },
  });
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  const togglePrescriptionForm = () => {
    setShowPrescriptionForm(!showPrescriptionForm);
  };

  // Handle submit cập nhật Phòng
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await axios.patch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`,
      {
        roomNumber: data.roomNumber,
      }
    );
    toast({
      title: "Thành công!",
      description: "Đã cập nhật số phòng!",
    });
    setIsOpen2(false);
  }

  // Fecth Appointments 1 lần
  useEffect(() => {
    const fetchAppointments = async () => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/queue/000`
      );

      const data = await response.json();
      console.log("render data::", data.data);
      setAppointments(data.data)
    };

    fetchAppointments();
    // getData Bác sĩ, nếu room khác mặc định thì set True
    setIsOpen2(false);
  }, []);

  const handlePreviousWeek = () => setCurrentDate(addDays(currentDate, -7));
  const handleNextWeek = () => setCurrentDate(addDays(currentDate, 7));

  const openAppointmentDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsOpen(true);
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center space-x-2">
          <Select
            value={format(currentDate, "MMMM yyyy")}
            onValueChange={(value) => setCurrentDate(new Date(value))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                value={format(subMonths(currentDate, 1), "MMMM yyyy")}
              >
                {format(subMonths(currentDate, 1), "MMMM yyyy")}
              </SelectItem>
              <SelectItem value={format(currentDate, "MMMM yyyy")}>
                {format(currentDate, "MMMM yyyy")}
              </SelectItem>
              <SelectItem
                value={format(addMonths(currentDate, 1), "MMMM yyyy")}
              >
                {format(addMonths(currentDate, 1), "MMMM yyyy")}
              </SelectItem>
            </SelectContent>
          </Select>
          <div className="flex space-x-1">
            <Button
              variant={view === "today" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setCurrentDate(new Date())}
            >
              Hôm nay
            </Button>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="icon" onClick={handlePreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="border rounded-md h-full ">
        <div className="inline-block min-w-full h-full">
          <div className="w-full grid grid-cols-7 h-full">
            {days.map((day, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 border-r-2"
                onClick={() => {
                  console.log("");
                }}
              >
                <div className="flex flex-row gap-2 items-center justify-center h-20 border-b-2">
                  <div className="font-semibold">{format(day, "EEE")}</div>
                  <div
                    className={`w-8 h-6 flex justify-center items-center rounded-md ${isSameDay(day, new Date())
                      ? "bg-blue-500 text-white"
                      : "text-foreground"
                      }`}
                  >
                    <p className="text-sm">{format(day, "d")}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-3 p-2 ">
                  {appointments
                    .filter((appointment) =>
                      isSameDay(
                        parseISO((appointment as any).appointmentDate),
                        day
                      )
                    )
                    .map((appointment) => (
                      <div
                        key={appointment.id}
                        className="rounded-sm border p-2 flex flex-col gap-2 items-center bg-secondary cursor-pointer"
                        onClick={() => openAppointmentDetails(appointment)}
                      >
                        {/* <div className="h-10 w-10 bg-primary-foreground rounded-full flex flex-row items-center justify-center">
                          <User className="text-blue-500 h-6 w-6" />
                        </div> */}
                        {/* {appointment.patientId.gender.toLowerCase() ===
                          "male" ||
                          appointment.patientId.gender.toLowerCase() === "nam" ? (
                          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200">
                            <Dog className="text-blue-500" />
                          </div>
                        ) : (
                          <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200">
                            <Cat className="text-pink-500" />
                          </div>
                        )} */}
                        <p className="text-xs font-semibold text-center">
                          {appointment.reason}
                        </p>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          {selectedAppointment && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500 text-white rounded-full"></div>
                <h2 className="text-md font-semibold">
                  {selectedAppointment.patientId.fullName}
                </h2>
              </div>
              <Separator />
              <div className="grid md:grid-cols-2 mb-2">
                <div className="grid gap-3">
                  <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Ngày sinh:{" "}
                      {formatDate(selectedAppointment.patientId.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Gender: {selectedAppointment.patientId.gender}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Address: {selectedAppointment.patientId.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Phone: {selectedAppointment.patientId.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Email: {selectedAppointment.patientId.email}
                    </span>
                  </div>
                </div>
                <div className="grid gap-3">
                  <h3 className="text-md font-semibold">Thông tin lịch hẹn</h3>
                  <div className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Date: {formatDate(selectedAppointment.appointmentDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Time:{" "}
                        {format(
                          parseISO(selectedAppointment.appointmentDate),
                          "HH:mm"
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Reason: {selectedAppointment.reason}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-5 text-blue-500" />
                      <span className="text-sm">
                        Status: {selectedAppointment.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid gap-3">
                <h3 className="text-md font-semibold">Lịch sử khám bệnh</h3>
                {selectedAppointment.patientId.medicalHistory.map((history) => (
                  <div key={history._id} className="grid gap-3">
                    <span className="text-sm">Disease: {history.disease}</span>
                    <span className="text-sm">
                      Diagnosis Date: {formatDate(history.diagnosisDate)}
                    </span>
                    <span className="text-sm">
                      Treatment: {history.treatment}
                    </span>
                  </div>
                ))}
              </div>
              {showPrescriptionForm && (
                <div className="">
                  <h3 className="text-md font-semibold mb-4">Tạo đơn thuốc</h3>
                  <form className="space-y-4 border p-4 rounded-md">
                    <div>
                      <Label
                        htmlFor="medication"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Thuốc
                      </Label>
                      <Input
                        type="text"
                        id="medication"
                        name="medication"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="dosage"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Liều lượng
                      </Label>
                      <Input
                        type="text"
                        id="dosage"
                        name="dosage"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <div>
                      <Label
                        htmlFor="instructions"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Hướng dẫn sử dụng
                      </Label>
                      <Textarea
                        id="instructions"
                        name="instructions"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                    </div>
                    <Button type="submit" variant="default">
                      Lưu đơn thuốc
                    </Button>
                  </form>
                </div>
              )}
              <div className="flex flex-row gap-3 justify-end items-end flex-grow">
                {showPrescriptionForm ? (
                  <Button
                    variant="destructive"
                    onClick={togglePrescriptionForm}
                  >
                    Huỷ
                  </Button>
                ) : (
                  <Button variant="outline" onClick={togglePrescriptionForm}>
                    Tạo đơn thuốc
                  </Button>
                )}
                <Button variant="secondary">Hoàn thành khám</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
        <DialogContent className="max-w-[900px] w-[50%] h-fit">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-2/3 space-y-6"
            >
              <FormField
                control={form.control}
                name="roomNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vui lòng nhập số phòng</FormLabel>
                    <FormControl>
                      <Input placeholder="Ví dụ: 024, 210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Cập nhật</Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
