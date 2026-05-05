import React, { useContext, useState } from "react";
import { toast } from "sonner";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Loader2, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AuthModal({ onClose }) {
  const { login } = useContext(AuthContext);
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  // Handle email/password login
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      if (data.needsVerification) {
        toast.info("Please verify your email first. Check your inbox!");
        setMode("verify");
        return;
      }

      login(data.user, data.token);
      toast.success("Login successful!");
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Handle email/password registration
  const handleEmailRegister = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);
    console.log(`📝 Attempting registration for: ${formData.email}`);
    
    try {
      const { data } = await axios.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      console.log("✅ Registration successful:", data);
      toast.success(data.message || "Registration successful! Please check your email to verify your account.");
      toast.info("Verification email sent to your inbox. Check spam folder if not found.");
      setFormData({ email: "", password: "", name: "" });
      setMode("login");
    } catch (err) {
      console.error("❌ Registration error:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        error: err.response?.data?.error,
        details: err.response?.data?.details
      });
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {mode === "login" ? "Login" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-lg text-muted-foreground transition-colors hover:text-foreground"
            aria-label="Close auth modal"
          >
            ×
          </button>
        </div>

        {/* Email/Password Form */}
        <form onSubmit={mode === "login" ? handleEmailLogin : handleEmailRegister} className="space-y-4">
          {/* Name field (only for registration) */}
          {mode === "register" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10"
                  disabled={loading}
                />
              </div>
            </div>
          )}

          {/* Email field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password field */}
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
                placeholder={mode === "login" ? "Enter password" : "At least 6 characters"}
                value={formData.password}
                onChange={handleInputChange}
                className="pl-10"
                disabled={loading}
              />
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mode === "login" ? "Logging in..." : "Creating account..."}
              </>
            ) : mode === "login" ? (
              "Login"
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          {mode === "login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setFormData({ email: "", password: "", name: "" }) || setMode("register")}
                className="text-primary hover:underline font-medium"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setFormData({ email: "", password: "", name: "" }) || setMode("login")}
                className="text-primary hover:underline font-medium"
              >
                Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
