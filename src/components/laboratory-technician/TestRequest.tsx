"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Calendar,
  Cat,
  CircleHelp,
  Dog,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
  SearchIcon,
  TestTube,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "../../../lib/utils";
import { Patient } from "../../../lib/entity-types";
import { RequestTest } from "../../../lib/entity-types";
import { reqTestData } from "../../../lib/hardcoded-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
export default function TestRequest() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestTests, setRequestTests] = useState<RequestTest[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedRequestTest, setSelectedRequestTest] =
    useState<RequestTest | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const filteredRequestTests = requestTests.filter((requestTest) => {
    const searchTermLower = searchTerm.toLowerCase();
    return requestTest.patientId.toLowerCase().includes(searchTermLower);
  });

  const fetchData = async () => {
    // const response = await axios.get(
    //   `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/requestTest`
    // );
    // setRequestTests(response.data);

    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedPatientId}`
    );
    setSelectedPatient(response.data);
    setRequestTests(reqTestData);
  };
  useEffect(() => {
    fetchData();
  }, [selectedPatientId]);

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500">
        DANH SÁCH CÁC XÉT NGHIỆM ĐƯỢC YÊU CẦU
      </p>
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="search"
          placeholder="Nhập mã bệnh nhân"
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
        {filteredRequestTests.map((requestTest) => (
          <Card
            key={(requestTest as any)._id}
            className="flex flex-col gap-6 justify-center items-center p-4"
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-4 items-center">
                <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border-2 border-blue-500 ">
                  <User className="text-blue-500" />
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base">Mã bệnh nhân</span>
                  <span className="text-sm text-muted-foreground">
                    {requestTest.patientId}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row gap-2 items-center">
                  <CircleHelp className="h-4 w-4 text-blue-500"></CircleHelp>
                  <span className="font-semibold text-sm">Lý do:</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {requestTest.reason}
                </span>
              </div>
              <div className="flex flex-row gap-2 items-center">
                <TestTube className="h-4 w-4 text-blue-500"></TestTube>
                <span className="font-semibold text-sm">Loại xét nghiệm:</span>
              </div>
              <div className="flex flex-row flex-wrap gap-2">
                {requestTest.test.map((test, index) => (
                  <Badge variant={"secondary"} key={index}>
                    {test}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="flex flex-row gap-2">
              <Button
                className="w-fit bg-blue-500 hover:bg-blue-600"
                onClick={() => {
                  setSelectedRequestTest(requestTest);
                  setSelectedPatientId(requestTest?.patientId + "");
                  setIsOpen(true);
                }}
              >
                <FlaskConical className="mr-2 h-4 w-4" /> Tạo xét nghiệm
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          {selectedRequestTest && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center space-x-4 border rounded-md p-4 mr-4">
                {selectedPatient?.gender?.toLowerCase() === "male" ? (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-blue-200 border-2 border-blue-500">
                    <Dog className="text-blue-500" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center bg-pink-200 border-2 border-pink-500">
                    <Cat className="text-pink-500" />
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold ">
                    {selectedPatient?.gender?.toLowerCase() === "male" ? (
                      <p className="text-blue-500">
                        {selectedPatient?.fullName}
                      </p>
                    ) : (
                      <p className="text-pink-500">
                        {selectedPatient?.fullName}
                      </p>
                    )}
                  </p>
                  <p className="text-slate-500">
                    Mã bệnh nhân: {selectedRequestTest?.patientId}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-3 mb-6">
                  <h3 className="text-md font-semibold">Thông tin bệnh nhân</h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Ngày sinh: {formatDate(selectedPatient?.dateOfBirth)}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Giới tính:{" "}
                      {selectedPatient?.gender?.toLowerCase() === "female"
                        ? "Nữ"
                        : "Nam"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Địa chỉ: {selectedPatient?.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Số ĐT: {selectedPatient?.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="text-sm">
                      Email: {selectedPatient?.email}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-3 mb-6">
                  <p className="text-md font-semibold">
                    Thông tin yêu cầu xét nghiệm
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <TestTube className="h-4 w-4 text-blue-500"></TestTube>
                      <span className="font-semibold text-sm">
                        Loại xét nghiệm:
                      </span>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                      {selectedRequestTest.test.map((test, index) => (
                        <Badge variant={"secondary"} key={index}>
                          {test}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <CircleHelp className="h-4 w-4 text-blue-500"></CircleHelp>
                      <span className="font-semibold text-sm">Lý do:</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {selectedRequestTest.reason}
                    </span>
                  </div>
                </div>
              </div>
              <div className="border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-1 w-full">
                  <h3 className="text-md font-semibold">Lịch sử khám bệnh</h3>
                  {selectedPatient?.medicalHistory?.length === 0 ? (
                    <p className="text-slate-500 text-sm">
                      Chưa có lịch sử khám bệnh
                    </p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Ngày khám</TableHead>
                          <TableHead>Tiền sử bệnh</TableHead>
                          <TableHead>Chẩn đoán bệnh</TableHead>
                          <TableHead>Kết quả xét nghiệm (nếu có)</TableHead>
                          <TableHead>Điều trị</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {selectedPatient?.medicalHistory?.map((history) => (
                          <TableRow key={(history as any).diagnosisDate}>
                            <TableCell>
                              {formatDate(
                                new Date((history as any).diagnosisDate)
                              )}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[1]}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[0]}
                            </TableCell>
                            <TableCell>
                              {history.disease.split("_")[2]}
                            </TableCell>
                            <TableCell>
                              {history.treatment.split("_")[0] +
                                history.treatment.split("_")[1]}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
