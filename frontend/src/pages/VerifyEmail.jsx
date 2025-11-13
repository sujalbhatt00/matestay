import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus("error");
        setMessage("No verification token found");
        return;
      }

      try {
        const { data } = await axios.get(`/auth/verify-email?token=${token}`);
        setStatus("success");
        setMessage(data.message || "Email verified successfully!");
        
        // Redirect to home after 3 seconds
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Invalid or expired verification token");
      }
    };
    
    verify();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md w-full bg-card p-8 rounded-lg border shadow-lg">
        {status === "loading" && (
          <>
            <Loader2 className="h-16 w-16 animate-spin text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Verifying Your Email</h2>
            <p className="text-muted-foreground">Please wait while we verify your email address...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-green-600">Email Verified!</h2>
            <p className="text-muted-foreground mb-4">{message}</p>
            <p className="text-sm text-muted-foreground">Redirecting you to the homepage...</p>
            <Button onClick={() => navigate("/")} className="mt-4">
              Go to Homepage
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-red-600">Verification Failed</h2>
            <p className="text-muted-foreground mb-4">{message}</p>
            <Button onClick={() => navigate("/")} variant="outline" className="mt-4">
              Return to Homepage
            </Button>
          </>
        )}
      </div>
    </div>
  );
}