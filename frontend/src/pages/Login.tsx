import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { createClient } from "@supabase/supabase-js";

interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  message: string;
  token: string;
  themeMode: boolean;
}

const Login = () => {
  const navigate = useNavigate();
  const { setTheme } = useTheme();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Function for handling user login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        formData
      );
      localStorage.setItem("token", response.data.token);

      setTheme(response.data.themeMode ? "dark" : "light");

      toast.success(response.data.message);
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Google login handler
  // const handleGoogleLogin = async () => {
  //   setLoading(true);
  //   try {
  //     const { error } = await supabase.auth.signInWithOAuth({
  //       provider: "google",
  //       options: {
  //         redirectTo: window.location.origin + "/login",
  //       },
  //     });
  //     if (error) throw error;
  //   } catch (err: any) {
  //     toast.error(err.message || "Google login failed");
  //     setLoading(false);
  //   }
  // };

  // Handle Supabase session after redirect
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      console.log("Supabase session:", session);
      if (session) {
        try {
          const response = await axiosInstance.post("/auth/google", {
            access_token: session.access_token,
          });
          console.log("Backend /auth/google response:", response.data);
          localStorage.setItem("token", response.data.token);
          setTheme("light");
          navigate("/dashboard");
        } catch (err: any) {
          toast.error(err.response?.data?.message || err.message);
        } finally {
          setLoading(false);
        }
      } else {
        console.log("No Supabase session found after redirect.");
      }
      // Clean up the URL (remove access_token, etc. from both search and hash)
      window.location.hash = "";
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname + window.location.search
      );
    };
    checkSession();
    // eslint-disable-next-line
  }, [navigate, setTheme]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md space-y-8 border rounded-lg p-4 shadow-md">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight">
              {/* <span className="text-primary">d8a</span> */}
            </h1>
            <h2 className="mt-6 text-2xl font-semibold">Welcome back</h2>
            <p className="mt-2 text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>
          <Card className="border-none shadow-none">
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">
                      Email address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                {/* <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in with Google...
                    </>
                  ) : (
                    <>Sign in with Google</>
                  )}
                </Button> */}
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-sm text-center text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary hover:underline">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Login;
