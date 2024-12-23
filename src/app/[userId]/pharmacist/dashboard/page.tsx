"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  BriefcaseMedical,
  Database,
  Newspaper,
  Pill,
  Receipt,
  User,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import RequestedPrescriptions from "@/components/pharmacist/RequestedPrescriptions";
import PharmacistProfile from "@/components/pharmacist/PharmacistProfile";
import VisitorPrescription from "@/components/pharmacist/VisitorPrescription";
import CompletedPrescriptions from "@/components/pharmacist/CompletedPrescriptions";
import MedicineWarehouse from "@/components/admin/MedicineWarehouse";
import Invoices from "@/components/pharmacist/Invoices";
export default function Page() {
  const [activeSection, setActiveSection] = useState("prescriptions");

  const renderMainContent = () => {
    switch (activeSection) {
      case "prescriptions":
        return <RequestedPrescriptions />;
      case "profile":
        return <PharmacistProfile />;
      case "visitor":
        return <VisitorPrescription />;
      case "completed":
        return <CompletedPrescriptions />;
      case "medicine-warehouse":
        return <MedicineWarehouse />;
      case "invoices":
        return <Invoices />;
      default:
        return null;
    }
  };

  return (
    <div className="mt-4">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-base">DƯỢC SĨ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="text-base text-blue-500">
              DASHBOARD
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="grid w-full md:grid-cols-[220px_1fr] lg:grid-cols-[200px_1fr] gap-3 mt-8">
        <div className="hidden min-h-full h-full border bg-background md:block rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm lg:px-4">
                <div
                  className={
                    activeSection === "prescriptions" ||
                    activeSection === "visitor" ||
                    activeSection === "completed"
                      ? "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-blue-500 font-semibold"
                      : "flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-slate-500"
                  }
                >
                  <Pill className="h-4 w-4" />
                  Đơn thuốc
                </div>
                <Link
                  href="#"
                  onClick={() => setActiveSection("prescriptions")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "prescriptions"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Kê theo toa</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("visitor")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all ${
                    activeSection === "visitor"
                      ? "bg-muted text-blue-500"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Khách vãng lai</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("completed")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "completed"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Hoàn thành</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("invoices")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all hover:text-primary ${
                    activeSection === "invoices"
                      ? "bg-muted text-blue-500 hover:text-blue-700"
                      : "text-slate-500"
                  }`}
                >
                  <Receipt className="h-4 w-4" />
                  Hoá đơn
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("medicine-warehouse")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all hover:text-primary ${
                    activeSection === "medicine-warehouse"
                      ? "bg-muted text-blue-500 hover:text-blue-700"
                      : "text-slate-500"
                  }`}
                >
                  <Pill className="h-4 w-4" />
                  Kho thuốc
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("profile")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all ${
                    activeSection === "profile"
                      ? "bg-muted text-blue-500"
                      : "text-slate-500"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Tài khoản
                </Link>
              </nav>
            </div>
          </div>
        </div>
        <div className="flex flex-col rounded-md min-h-screen">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
