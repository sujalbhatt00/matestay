import React, { useContext, useState } from "react";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User } from "lucide-react";

export default function AuthModal({ onClose }) {
  const { login } = useContext(AuthContext);
  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (tab === "signup" && !form.name.trim()) {
      newErrors.name = "Name is required";
    }
    
    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (tab === "signup" && form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleResendVerification = async (email) => {
    try {
      const { data } = await axios.post("/auth/resend-verification", { email });
      toast.success(data.message || "Verification email resent!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend email");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting registration...");
      const { data } = await axios.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      
      console.log("Registration response:", data);
      toast.success(data.message || "Registration successful! Check your email.");
      setTab("login");
      setForm({ name: "", email: form.email, password: "" });
    } catch (err) {
      console.error("Registration error:", err);
      const errorMsg = err.response?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      console.log("Attempting login...");
      const { data } = await axios.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      
      console.log("Login response:", data);
      login(data.user, data.token);
      toast.success("Login successful!");
      onClose?.();
    } catch (err) {
      console.error("Login error:", err);
      const errorData = err.response?.data;
      
      if (errorData?.needsVerification) {
        toast.error(
          <div className="flex flex-col gap-2">
            <p>{errorData.message}</p>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleResendVerification(errorData.email)}
            >
              Resend Verification Email
            </Button>
          </div>,
          { duration: 8000 }
        );
      } else {
        toast.error(errorData?.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 m-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">{tab === "login" ? "Welcome Back" : "Create Account"}</h3>
          <button 
            className="text-muted-foreground hover:text-foreground transition-colors" 
            onClick={() => onClose?.()}
          >
            ✖
          </button>
        </div>

        <div className="flex gap-2 mb-6 bg-muted p-1 rounded-lg">
          <button
            className={`flex-1 py-2 rounded-md transition-all ${
              tab === "login" 
                ? "bg-background shadow-sm text-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setTab("login");
              setErrors({});
            }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition-all ${
              tab === "signup" 
                ? "bg-background shadow-sm text-foreground font-medium" 
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => {
              setTab("signup");
              setErrors({});
            }}
          >
            Sign Up
          </button>
        </div>

        {tab === "signup" ? (
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <div className="relative">
                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  name="name" 
                  placeholder="Full name" 
                  value={form.name} 
                  onChange={handleChange} 
                  disabled={loading}
                  className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  value={form.email} 
                  onChange={handleChange} 
                  disabled={loading}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="Password (min 6 characters)" 
                  value={form.password} 
                  onChange={handleChange} 
                  disabled={loading}
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              You'll receive a verification email. Check your inbox and spam folder.
            </p>
          </form>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  name="email" 
                  type="email" 
                  placeholder="Email" 
                  value={form.email} 
                  onChange={handleChange} 
                  disabled={loading}
                  className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  name="password" 
                  type="password" 
                  placeholder="Password" 
                  value={form.password} 
                  onChange={handleChange} 
                  disabled={loading}
                  className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              Make sure you've verified your email before logging in.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}