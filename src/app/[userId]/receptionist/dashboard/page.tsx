"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Bell, CalendarRange, User } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ViewAppointment from "@/components/receptionist/OnlineAppointment";
import ReceptionistProfile from "@/components/receptionist/ReceptionistProfile";
import Notification from "@/components/receptionist/Notification";
import DirectAppoinment from "@/components/receptionist/DirectAppoinment";
export default function Page() {
  const [activeSection, setActiveSection] = useState("online");

  const renderMainContent = () => {
    switch (activeSection) {
      case "online":
        return <ViewAppointment />;
      case "offline":
        return <DirectAppoinment />;
      case "profile":
        return <ReceptionistProfile />;
      case "notification":
        return <Notification />;
      default:
        return null;
    }
  };

  return (
    <div>
      <Breadcrumb className="mt-4">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/" className="text-base">
              TRANG CHỦ
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink className="text-base">LỄ TÂN</BreadcrumbLink>
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
        <div className="hidden h-full border bg-background md:block rounded-md">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 pt-4">
              <nav className="grid items-start px-2 text-sm lg:px-4">
                <div
                  className={
                    activeSection === "online" || activeSection === "offline"
                      ? "flex items-center gap-3 rounded-md px-3 py-2 transition-all text-blue-500 font-semibold"
                      : "flex items-center gap-3 rounded-md px-3 py-2 font-semibold text-slate-500"
                  }
                >
                  <CalendarRange className="h-4 w-4" />
                  Lịch hẹn
                </div>
                <Link
                  href="#"
                  onClick={() => setActiveSection("online")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "online"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Online</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("offline")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all hover:text-primary ${
                    activeSection === "offline"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <p className="ml-7">Trực tiếp</p>
                </Link>
                <Link
                  href="#"
                  onClick={() => setActiveSection("notification")}
                  className={`flex items-center gap-3 rounded-md px-3 py-2 font-semibold transition-all ${
                    activeSection === "notification"
                      ? "bg-muted text-blue-500"
                      : "text-slate-500"
                  }`}
                >
                  <Bell className="h-4 w-4" />
                  Thông báo
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
