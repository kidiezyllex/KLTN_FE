"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  ArrowUpFromLine,
  Calendar,
  Cat,
  CircleHelp,
  Dog,
  FlaskConical,
  Mail,
  MapPin,
  Phone,
  ReceiptText,
  RefreshCw,
  RotateCcw,
  SearchIcon,
  Stethoscope,
  TestTube,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import axios from "axios";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatDate2 } from "../../../lib/utils";
import { Patient, TestType, RequestTest } from "../../../lib/entity-types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "../ui/separator";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { usePathname } from "next/navigation";
import TestBill from "../bill/TestBill";
import test from "node:test";

export default function RequestedTests() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [requestTests, setRequestTests] = useState<RequestTest[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [selectedRequestTest, setSelectedRequestTest] =
    useState<RequestTest | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientId, setSelectedPatientId] = useState("");
  const [performedTests, setPerformedTests] = useState<TestType[]>([]);
  const [filterType, setFilterType] = useState("all");
  const userId = usePathname().split("/")[1];
  const [viewDoctorName, setViewDoctorName] = useState({
    doctorName: "",
    id: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState<
    Array<{
      testName: string;
      testResult: string;
      referenceRange: string;
      measurementUnit: string;
      equipment: string;
      price: number;
    }>
  >([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  // Filter Data
  const filteredRequestTests = requestTests
    .filter((item) => {
      const searchTermLower = searchTerm.toLowerCase();
      if (filterType === "today")
        return formatDate(item.requestDate) === formatDate(new Date());
      return (
        item?.patientId?._id?.toLowerCase().includes(searchTermLower) ||
        item?.patientId?.fullName?.toLowerCase().includes(searchTermLower) ||
        item?.patientId?.email?.toLowerCase().includes(searchTermLower) ||
        item?.patientId?.phone?.toLowerCase().includes(searchTermLower) ||
        item.testTypes.some((it) => {
          return it.testName.toLowerCase().includes(searchTermLower);
        })
      );
    })
    .sort((a, b) => {
      if (filterType === "old") {
        return (
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        );
      } else if (filterType === "new") {
        return (
          new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime()
        );
      }
      return 0;
    });

  const totalPages = Math.ceil(filteredRequestTests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequestTests = filteredRequestTests.slice(startIndex, endIndex);
  // Fetch Data
  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/request-tests`
    );
    const res2 = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/patients/${selectedPatientId}`
    );
    setRequestTests(res.data);
    setSelectedPatient(res2.data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [selectedPatientId]);

  const handleToggleCheckbox = (test: TestType) => {
    setPerformedTests((prevTests) => {
      const testIndex = prevTests.findIndex((t) => t._id === test._id);
      if (testIndex > -1) {
        setTestResults((prev) =>
          prev.filter((r) => r.testName !== test.testName)
        );
        return prevTests.filter((t) => t._id !== test._id);
      } else {
        setTestResults((prev) => {
          if (!prev.some((r) => r.testName === test.testName)) {
            return [
              ...prev,
              {
                testName: test.testName,
                testResult: "",
                referenceRange: "",
                measurementUnit: "",
                equipment: "",
                price: test.price,
              },
            ];
          }
          return prev;
        });
        return [...prevTests, test];
      }
    });
  };

  const handleTestResultChange = (
    testName: string,
    field: string,
    value: string
  ) => {
    setTestResults((prev) => {
      const existingIndex = prev.findIndex((r) => r.testName === testName);
      if (existingIndex > -1) {
        // Update existing result
        const updatedResults = [...prev];
        updatedResults[existingIndex] = {
          ...updatedResults[existingIndex],
          [field]: value,
        };
        return updatedResults;
      } else {
        return [
          ...prev,
          {
            testName,
            [field]: value,
            testResult: "",
            referenceRange: "",
            measurementUnit: "",
            equipment: "",
            price: 0,
          },
        ];
      }
    });
  };

  const handleCompleteTest = async () => {
    try {
      const payload = {
        patientId: selectedRequestTest?.patientId,
        doctorId: selectedRequestTest?.doctorId,
        labTestId: "PTN-01",
        technicianId: userId,
        results: testResults,
        reasonByDoctor: selectedRequestTest?.reason,
        datePerformed: new Date(),
        dateRequested: selectedRequestTest?.requestDate,
        status: "Completed",
        appointmentId: selectedRequestTest?.appointmentId,
      };
      // Post lên Test
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/tests`,
        payload
      );
      // Xoá khỏi TestRequest
      const res2 = await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/request-tests/${selectedRequestTest?._id}`
      );
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      setIsOpen(false);
      setPerformedTests([]);
      setSelectedRequestTest(null);
      setTestResults([]);
      toast({
        variant: "default",
        title: "Thành công!",
        description: "Đã hoàn thành một xét nghiệm!",
      });
      fetchData();
    }
  };

  const handleViewDoctorName = async (doctorId: string, id: string) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/${doctorId}`
      );
      setViewDoctorName({ doctorName: response.data.fullName, id: id });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 bg-background border rounded-md p-4 h-[100%]">
      <p className="text-base font-semibold text-blue-500 uppercase">
        {userId.includes("LT")
          ? "Danh sách xét nghiệm cần tạo hoá đơn"
          : "Danh sách các xét nghiệm được yêu cầu"}
      </p>
      <div className="flex flex-row gap-3">
        <div className="relative flex-grow">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Nhập mã, tên, email, sđt bệnh nhân hoặc tên loại xét nghiệm..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Lọc theo ngày" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="today">
              Hôm nay ({formatDate(new Date())})
            </SelectItem>
            <SelectItem value="new">Gần nhất</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="icon"
          onClick={fetchData}
          disabled={isLoading}
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
        </Button>
      </div>
      <div className="grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        {currentRequestTests.map((requestTest) => (
          <Card
            key={(requestTest as any)._id}
            className="flex flex-col gap-6 items-center p-4 bg-primary-foreground "
          >
            <div className="flex flex-col gap-4 w-full">
              <div className="flex flex-row gap-4 items-center w-full">
                {requestTest?.patientId?.gender?.toLowerCase() === "male" ||
                requestTest?.patientId?.gender?.toLowerCase() === "nam" ? (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-blue-500 bg-blue-200">
                    <Dog className="text-blue-500" />
                  </div>
                ) : (
                  <div className="h-12 w-12 rounded-full flex flex-row justify-center items-center border border-pink-500 bg-pink-200">
                    <Cat className="text-pink-500" />
                  </div>
                )}
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-sm text-slate-700 dark:text-white">
                    Tên BN:{" "}
                    <span className="text-muted-foreground font-normal">
                      {requestTest.patientId.fullName}
                    </span>
                  </p>
                  <p className="font-semibold text-sm text-slate-700 dark:text-white">
                    Ngày yêu cầu:{" "}
                    <span className="text-muted-foreground font-normal">
                      {formatDate2(requestTest.requestDate)}
                    </span>
                  </p>
                </div>
              </div>
              <Separator></Separator>
              <div className="flex flex-col gap-3">
                <div className="flex flex-row gap-2 items-center">
                  <Stethoscope className="h-4 w-4 text-blue-500"></Stethoscope>
                  <div className="font-semibold text-sm text-slate-700 dark:text-white">
                    Bác sĩ yêu cầu:{" "}
                    <Badge
                      className="bg-slate-600 dark:bg-slate-700 dark:text-white ml-2 cursor-pointer"
                      onClick={() =>
                        handleViewDoctorName(
                          requestTest.doctorId,
                          requestTest._id
                        )
                      }
                    >
                      {viewDoctorName.id === requestTest._id &&
                      viewDoctorName.doctorName !== ""
                        ? viewDoctorName.doctorName
                        : "Xem tên BS"}
                    </Badge>
                  </div>
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <CircleHelp className="h-4 w-4 text-blue-500"></CircleHelp>
                  <span className="font-semibold text-sm text-slate-700 dark:text-white">
                    Lý do xét nghiệm:
                  </span>
                </div>
                <div className="text-sm text-muted-foreground border rounded-md p-3">
                  {requestTest.reason}
                </div>
                <div className="flex flex-row gap-2 items-center">
                  <TestTube className="h-4 w-4 text-blue-500"></TestTube>
                  <span className="font-semibold text-sm text-slate-700 dark:text-white">
                    Loại xét nghiệm:
                  </span>
                </div>
                <div className="flex flex-row flex-wrap gap-2">
                  {requestTest?.testTypes?.map((test, index) => (
                    <Badge
                      className="bg-slate-600 dark:bg-slate-700 dark:text-white"
                      key={index}
                    >
                      {test.testName}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex-grow flex flex-col justify-end">
              {requestTest?.isTestInvoiceCreated ? (
                <Button className="flex items-center space-x-2 bg-green-500 hover:bg-green-600 text-white dark:text-white dark:bg-green-500 dark:hover:bg-green-600 pointer-events-none">
                  Đã xuất hoá đơn
                  <ReceiptText className="h-4 w-4" />
                </Button>
              ) : null}
              {userId.includes("LT") ? (
                <Button
                  className={
                    requestTest?.isTestInvoiceCreated
                      ? "hidden"
                      : "flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  }
                  onClick={() => {
                    setSelectedRequestTest(requestTest);
                    setSelectedPatientId(requestTest?.patientId._id + "");
                    setIsOpen2(true);
                  }}
                >
                  Tạo hoá đơn
                  <ReceiptText className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  className="flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                  onClick={() => {
                    setSelectedRequestTest(requestTest);
                    setSelectedPatientId(requestTest?.patientId._id + "");
                    setIsOpen(true);
                  }}
                >
                  Nhập kết quả
                  <FlaskConical className="h-4 w-4" />
                </Button>
              )}
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
                      <span className="text-blue-500">
                        {selectedPatient?.fullName}
                      </span>
                    ) : (
                      <span className="text-pink-500">
                        {selectedPatient?.fullName}
                      </span>
                    )}
                  </p>
                  <p className="text-slate-500">
                    Mã bệnh nhân: {selectedRequestTest?.patientId._id}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-3">
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
                <div className="flex flex-col gap-3">
                  <p className="text-md font-semibold">
                    Thông tin yêu cầu xét nghiệm
                  </p>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <Stethoscope className="h-4 w-4 text-blue-500"></Stethoscope>
                      <span className="text-sm">
                        Bác sĩ yêu cầu: {selectedRequestTest.doctorId}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <TestTube className="h-4 w-4 text-blue-500"></TestTube>
                      <span className="text-sm">Loại xét nghiệm:</span>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                      {selectedRequestTest.testTypes.map((test, index) => (
                        <Badge variant={"secondary"} key={index}>
                          {test.testName}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-row gap-2 items-center">
                      <CircleHelp className="h-4 w-4 text-blue-500"></CircleHelp>
                      <span className="text-sm">Lý do:</span>
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
              <div className="border rounded-md p-4 mr-4">
                <div className="flex flex-col gap-1 w-full">
                  <h3 className="text-md font-semibold mr-4 self-center uppercase mb-4">
                    Nhập kết quả xét nghiệm
                  </h3>
                  <div className="flex flex-col gap-4">
                    <p className="text-sm font-semibold">
                      Xét nghiệm đã thực hiện:
                    </p>
                    <div className="grid grid-cols-1 gap-4">
                      {selectedRequestTest.testTypes.map((test) => (
                        <div
                          key={test._id}
                          className="border rounded-md p-4 cursor-pointer bg-primary-foreground"
                        >
                          <Label className="flex items-center justify-between space-x-2 mb-2">
                            <Checkbox
                              className="h-7 w-7"
                              id={`test-${test._id}`}
                              checked={performedTests.some(
                                (t) => t._id === test._id
                              )}
                              onCheckedChange={() => handleToggleCheckbox(test)}
                            />
                            <Badge className="bg-slate-600 dark:bg-slate-700 dark:text-white ml-2 cursor-pointer">
                              {test.testName}
                            </Badge>
                          </Label>
                          {performedTests.some((t) => t._id === test._id) && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              <div className="space-y-2">
                                <Label htmlFor={`testResult-${test._id}`}>
                                  Kết quả
                                </Label>
                                <Input
                                  id={`testResult-${test._id}`}
                                  value={
                                    testResults.find(
                                      (r) => r.testName === test.testName
                                    )?.testResult || ""
                                  }
                                  onChange={(e) =>
                                    handleTestResultChange(
                                      test.testName,
                                      "testResult",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`referenceRange-${test._id}`}>
                                  Phạm vi tham chiếu
                                </Label>
                                <Input
                                  id={`referenceRange-${test._id}`}
                                  value={
                                    testResults.find(
                                      (r) => r.testName === test.testName
                                    )?.referenceRange || ""
                                  }
                                  onChange={(e) =>
                                    handleTestResultChange(
                                      test.testName,
                                      "referenceRange",
                                      e.target.value
                                    )
                                  }
                                />
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`measurementUnit-${test._id}`}>
                                  Đơn vị đo
                                </Label>
                                <Select
                                  value={
                                    testResults.find(
                                      (r) => r.testName === test.testName
                                    )?.measurementUnit || ""
                                  }
                                  onValueChange={(value) =>
                                    handleTestResultChange(
                                      test.testName,
                                      "measurementUnit",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger
                                    id={`measurementUnit-${test._id}`}
                                  >
                                    <SelectValue placeholder="Chọn đơn vị đo" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="mg/dL">mg/dL</SelectItem>
                                    <SelectItem value="mmol/L">
                                      mmol/L
                                    </SelectItem>
                                    <SelectItem value="g/L">g/L</SelectItem>
                                    <SelectItem value="ng/mL">ng/mL</SelectItem>
                                    <SelectItem value="mEq/L">mEq/L</SelectItem>
                                    <SelectItem value="IU/L">IU/L</SelectItem>
                                    <SelectItem value="pg/mL">pg/mL</SelectItem>
                                    <SelectItem value="fL">fL</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor={`equipment-${test._id}`}>
                                  Thiết bị
                                </Label>
                                <Select
                                  value={
                                    testResults.find(
                                      (r) => r.testName === test.testName
                                    )?.equipment || ""
                                  }
                                  onValueChange={(value) =>
                                    handleTestResultChange(
                                      test.testName,
                                      "equipment",
                                      value
                                    )
                                  }
                                >
                                  <SelectTrigger id={`equipment-${test._id}`}>
                                    <SelectValue placeholder="Chọn thiết bị" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Hematology Analyzer HA-3000">
                                      Hematology Analyzer HA-3000
                                    </SelectItem>
                                    <SelectItem value="BioChem Spectrum 700">
                                      BioChem Spectrum 700
                                    </SelectItem>
                                    <SelectItem value="ImmunoAssay Pro X100">
                                      ImmunoAssay Pro X100
                                    </SelectItem>
                                    <SelectItem value="MicroScan ID/AST">
                                      MicroScan ID/AST
                                    </SelectItem>
                                    <SelectItem value="PathoLab MX-200">
                                      PathoLab MX-200
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button
                      className="w-fit self-end flex items-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white dark:text-white dark:bg-blue-500 dark:hover:bg-blue-600"
                      onClick={handleCompleteTest}
                    >
                      Hoàn thành
                      <ArrowUpFromLine className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={isOpen2} onOpenChange={setIsOpen2}>
        <DialogTitle></DialogTitle>
        <DialogContent className="max-w-[900px] w-[90%] h-[90%] overflow-y-auto">
          <TestBill
            selectedTest={selectedRequestTest}
            fetchData={fetchData}
          ></TestBill>
        </DialogContent>
      </Dialog>
      <Pagination className="self-end flex-grow items-end">
        <PaginationContent>
          <PaginationItem>
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="ghost"
            >
              <PaginationPrevious />
            </Button>
          </PaginationItem>
          {[...Array(totalPages)].map((_, i) => (
            <PaginationItem key={i}>
              <PaginationLink
                onClick={() => setCurrentPage(i + 1)}
                isActive={currentPage === i + 1}
              >
                {i + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              variant="ghost"
            >
              <PaginationNext />
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
