import React, { useContext, useState } from "react";
import axios from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff
} from "lucide-react";
import ForgotPasswordModal from "./ForgotPasswordModal";

export default function AuthModal({ onClose }) {
  const { login } = useContext(AuthContext);

  const [tab, setTab] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const e = {};

    if (tab === "signup" && !form.name.trim()) e.name = "Name is required";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = "Enter a valid email";

    if (!form.password) e.password = "Password is required";
    else if (tab === "signup" && form.password.length < 6)
      e.password = "Minimum 6 characters";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/auth/register", form);
      toast.success("Account created! Check your inbox (Spam too).");
      setTab("login");
      setForm({ name: "", email: form.email, password: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed.");
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/auth/login", form);

      login(data.user, data.token);
      toast.success("Login successful!");
      onClose?.();
    } catch (err) {
      const error = err.response?.data;

      if (error?.needsVerification) {
        toast.error(
          <div>
            <p>{error.message}</p>
            <Button
              className="mt-2"
              onClick={() =>
                axios.post("/auth/resend-verification", { email: error.email })
              }
            >
              Resend Email
            </Button>
          </div>
        );
      } else toast.error(error?.message || "Login failed.");
    }
    setLoading(false);
  };

  if (showForgotPassword)
    return (
      <ForgotPasswordModal
        onClose={onClose}
        onShowLogin={() => setShowForgotPassword(false)}
      />
    );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
      bg-black/50 backdrop-blur-sm animate-fadeIn"
    >
      <div
        className="bg-card rounded-2xl w-full max-w-md p-6 mx-4
        shadow-xl border border-white/10 animate-scaleUp"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">
            {tab === "login" ? "Welcome Back" : "Create Account"}
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground text-xl"
          >
            ✖
          </button>
        </div>

        {/* TABS */}
        <div className="flex bg-muted p-1 rounded-xl mb-6">
          <button
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === "login"
                ? "bg-background shadow font-semibold"
                : "text-muted-foreground"
            }`}
            onClick={() => setTab("login")}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 rounded-lg transition-all ${
              tab === "signup"
                ? "bg-background shadow font-semibold"
                : "text-muted-foreground"
            }`}
            onClick={() => setTab("signup")}
          >
            Sign Up
          </button>
        </div>

        {/* SIGNUP FORM */}
        {tab === "signup" ? (
          <form onSubmit={handleSignup} className="space-y-4">

            {/* NAME */}
            <div>
              <div className="relative">
                <User className="auth-icon" />
                <Input
                  placeholder="Full Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`auth-input ${
                    errors.name ? "auth-error" : ""
                  }`}
                />
              </div>
              {errors.name && (
                <p className="auth-error-text">{errors.name}</p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <div className="relative">
                <Mail className="auth-icon" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`auth-input ${
                    errors.email ? "auth-error" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="auth-error-text">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD + TOGGLE */}
            <div>
              <div className="relative">
                <Lock className="auth-icon" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password (min 6 characters)"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`auth-input ${
                    errors.password ? "auth-error" : ""
                  }`}
                />

                <button
                  type="button"
                  className="toggle-icon"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="auth-error-text">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Create Account"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Verification email sent. Check inbox & spam folder.
            </p>
          </form>
        ) : (
          /* LOGIN FORM */
          <form onSubmit={handleLogin} className="space-y-4">

            {/* EMAIL */}
            <div>
              <div className="relative">
                <Mail className="auth-icon" />
                <Input
                  type="email"
                  placeholder="Email Address"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`auth-input ${
                    errors.email ? "auth-error" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="auth-error-text">{errors.email}</p>
              )}
            </div>

            {/* PASSWORD + TOGGLE */}
            <div>
              <div className="relative">
                <Lock className="auth-icon" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`auth-input ${
                    errors.password ? "auth-error" : ""
                  }`}
                />
                <button
                  type="button"
                  className="toggle-icon"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="auth-error-text">{errors.password}</p>
              )}
            </div>

            <div className="text-right">
              <Button
                type="button"
                variant="link"
                className="p-0 text-sm"
                onClick={() => setShowForgotPassword(true)}
              >
                Forgot Password?
              </Button>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-xl font-semibold"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              Didn’t get verification email? Check spam folder.
            </p>
          </form>
        )}
      </div>

      {/* INTERNAL CSS FOR PIXEL-PERFECT UI + ANIMATION */}
      <style>
        {`
          .auth-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--muted-foreground);
            width: 18px;
            height: 18px;
          }

          .toggle-icon {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--muted-foreground);
          }

          .auth-input {
            padding-left: 40px;
            height: 44px;
            border-radius: 12px;
          }

          .auth-error {
            border-color: #ef4444 !important;
          }

          .auth-error-text {
            color: #ef4444;
            font-size: 12px;
            margin-top: 4px;
          }

          .animate-fadeIn {
            animation: fadeIn 0.25s ease-out;
          }

          .animate-scaleUp {
            animation: scaleUp 0.3s ease-out;
          }

          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }

          @keyframes scaleUp {
            from { transform: scale(0.92); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}
