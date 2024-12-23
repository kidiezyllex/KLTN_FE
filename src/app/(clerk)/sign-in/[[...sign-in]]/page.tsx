"use client";
import { SignIn } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useAuthContext } from "@/app/auth-context";
import { Loader2, LogIn } from "lucide-react";
import { renderRole } from "../../../../../lib/utils";
export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { setToken, setEmail2, setPassword2, setRole, setCurrentId } =
    useAuthContext();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/auth/login`,
        { email, password }
      );
      const data = response.data;
      const dummyToken =
        "dummy_token_" + Math.random().toString(36).substr(2, 9);
      setToken(dummyToken);
      setEmail2((data as any)?.data?.email);
      setPassword2(password);
      setEmail2((data as any)?.data?.email);
      setRole((data as any)?.data?.role);

      if (data.status === "success") {
        // Tìm hồ sơ = email
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/${
            data.data?.role
          }s/?email=${(data as any)?.data?.email}`
        );

        if (data.data?.role === "patient") {
          router.push("/");
        } else router.push(`/${res?.data?._id}/${data.data?.role}/dashboard`);
        // Nếu có hồ sơ
        if (res?.data?._id) {
          setCurrentId(res?.data?._id);
        } else {
          setCurrentId(`user_${(data as any)?.data?.id}`);
        }

        toast({
          variant: "default",
          title: "Thành công!",
          description: `Đăng nhập với quyền ${renderRole(data.data?.role)}!`,
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
    <div className="max-w-fit bg-white sm:w-[500px] w-[340px] shadow-xl border rounded-xl p-4 py-8">
      <div className="text-2xl font-bold text-blue-500 text-center">
        Đăng nhập
      </div>
      <div className="flex flex-col items-center">
        <SignIn
          appearance={{
            elements: {
              formButtonPrimary: "hidden",
              cardBox: "w-[320px] sm:w-[400px] shadow-none p-0 border-none",
              card: "shadow-none p-0 border-none",
              header: "hidden",
              formFieldInput: "hidden",
              formFieldLabel: "hidden",
              formField: "hidden",
              footer: "hidden",
              socialButtons: "flex flex-row items-center p-2",
              socialButtonsBlockButton: "zIndex: 100 w-full self-center py-2",
            },
          }}
        />
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full">
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
      </div>
    </div>
  );
}
