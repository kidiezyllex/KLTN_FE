"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  BriefcaseMedical,
  ContactRound,
  Newspaper,
  Pill,
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
import ViewPrescription from "@/components/pharmacist/ViewPrescription";
import PharmacistProfile from "@/components/pharmacist/PharmacistProfile";
import Visitor from "@/components/pharmacist/Visitor";
// import Notification from "@/components/pharmacist/Notification";
export default function Page() {
  const [activeSection, setActiveSection] = useState("appoinments");

  const renderMainContent = () => {
    switch (activeSection) {
      case "appoinments":
        return <ViewPrescription />;
      case "profile":
        return <PharmacistProfile />;
      case "visitor":
        return <Visitor />;
      // case "manage":
      //   return <Notification />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/components" className="text-base">
              DƯỢC SĨ
            </BreadcrumbLink>
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
                <Link
                  href="#"
                  onClick={() => setActiveSection("appoinments")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "appoinments"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Pill className="h-4 w-4" />
                  Đơn thuốc
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("visitor")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "visitor"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Pill className="h-4 w-4" />
                  Khách vãng lai
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("manage")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "manage"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <BriefcaseMedical className="h-4 w-4" />
                  Kho thuốc
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("report")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "report"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <Newspaper className="h-4 w-4" />
                  Báo cáo
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("profile")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "profile"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
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
