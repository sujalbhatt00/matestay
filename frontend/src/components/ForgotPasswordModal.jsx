import React, { useState } from "react";
import axios from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";

const ForgotPasswordModal = ({ onClose, onShowLogin }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await axios.post("/auth/forgot-password", { email });
      setMessage(response.data.message);
      toast.success(response.data.message);
    } catch (err) {
      console.error("Forgot Password Error:", err);
      const errorMsg = err.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMsg);
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md p-6 m-4" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Forgot Password</h3>
          <button 
            className="text-muted-foreground hover:text-foreground transition-colors" 
            onClick={onClose}
          >
            ✖
          </button>
        </div>

        {message ? (
          <div className="text-center">
            <p className="text-muted-foreground mb-4">{message}</p>
            <Button variant="link" onClick={onShowLogin}>
              Back to Login
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <div>
              <Label htmlFor="email" className="sr-only">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                <Input 
                  id="email"
                  name="email" 
                  type="email" 
                  placeholder="Your email address" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  required 
                  className="pl-10"
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-[#5b5dda] hover:bg-[#4a4ab5]" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {loading ? "Sending Link..." : "Send Reset Link"}
            </Button>
            <Button type="button" variant="ghost" onClick={onShowLogin} className="w-full">
              Back to Login
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;