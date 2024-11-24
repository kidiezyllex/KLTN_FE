"use client";
import { SignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuthContext } from "@/app/auth-context";
import { LoginResponse } from "../../../../../lib/entity-types";
import { Loader2, LogIn } from "lucide-react";

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setToken } = useAuthContext();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data: LoginResponse = await response.json();
      const dummyToken =
        "dummy_token_" + Math.random().toString(36).substr(2, 9);
      setToken(dummyToken);
      localStorage.setItem("currentEmail", (data as any)?.data?.email);
      localStorage.setItem("role", (data as any)?.data?.role);

      if (data.status === "success") {
        if (data.data?.role === "doctor") {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/doctors/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/doctor/dashboard`);
          localStorage.setItem("currentId", res.data._id);
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Bác sĩ.",
          });
        } else if (data.data?.role === "receptionist") {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/receptionists/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/receptionist/dashboard`);
          localStorage.setItem("currentId", res.data._id);
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Lễ tân.",
          });
        } else if (data.data?.role === "pharmacist") {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/pharmacists/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/pharmacist/dashboard`);
          localStorage.setItem("currentId", res.data._id);
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Dược sĩ.",
          });
        } else if (data.data?.role === "laboratory-technician") {
          const res = await axios.get(
            `${
              process.env.NEXT_PUBLIC_BACKEND_API_URL
            }/laboratory-technicians/?email=${(data as any)?.data?.email}`
          );
          router.push(`/${res.data._id}/laboratory-technician/dashboard`);
          localStorage.setItem("currentId", res.data._id);
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Y tá xét nghiệm.",
          });
        } else if (data.data?.role === "cashier") {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/cashiers/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/cashier/dashboard`);
          localStorage.setItem("currentId", res.data._id);
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Thu ngân.",
          });
        } else if (data.data?.role === "admin") {
          const res = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/admins/?email=${
              (data as any)?.data?.email
            }`
          );
          router.push(`/${res.data._id}/admin/dashboard`);
          localStorage.setItem("currentId", res.data._id);
          toast({
            variant: "default",
            title: "Thành công!",
            description: "Đăng nhập với quyền Quản trị viên.",
          });
        } else router.push("/");
      } else {
        toast({
          variant: "destructive",
          title: "Thất bại!",
          description: data.message,
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Thất bại!",
        description: error + "",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-fit max-w-full bg-white">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold text-blue-400">
          Đăng nhập
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "hidden",
              card: "shadow-none p-0 border-none",
              cardBox: "shadow-none p-0 border-none",
              header: "hidden",
              formFieldInput: "hidden",
              formFieldLabel: "hidden",
              formField: "hidden",
              footer: "hidden",
              socialButtons: "p-2",
              socialButtonsBlockButton: "zIndex: 100",
            },
          }}
        />
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div className="space-y-2 text-black">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Nhập email của bạn..."
              className="dark:bg-white border border-slate-200"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2 text-black">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              type="password"
              className="dark:bg-white border border-slate-200"
              placeholder="Nhập mật khẩu của bạn..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full flex items-center self-center space-x-2 bg-blue-500 hover:bg-blue-600 dark:text-white text-white dark:bg-blue-500 dark:hover:bg-blue-600"
            disabled={isLoading}
            variant={"default"}
          >
            {isLoading ? (
              <>
                Đang đăng nhập
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Đăng nhập
                <LogIn className="h-4 w-4" />
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
