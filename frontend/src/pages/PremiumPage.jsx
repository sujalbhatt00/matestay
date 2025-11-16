import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "@/api/axiosInstance";

import {
  Loader2,
  Check,
  Crown,
  Sparkles,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

const PremiumPage = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // ⭐ NEW CHEAP BUT PREMIUM PRICING
  const plans = [
    {
      id: "monthly",
      name: "Monthly Access",
      price: 29,
      duration: "30 Days",
      highlightNote: "Perfect for short-term use",
      features: [
        "Unlimited chat messages",
        "Advanced roommate filters",
        "Verified badge on profile",
        "Priority support",
        "Ad-free platform",
      ],
    },
    {
      id: "quarterly",
      name: "3-Month Access",
      price: 59,
      duration: "90 Days",
      popular: true,
      savings: "Save ₹28",
      highlightNote: "Most Value For Money",
      features: [
        "Everything in Monthly",
        "Top position in search",
        "Boosted visibility",
        "Higher trust score",
      ],
    },
    {
      id: "yearly",
      name: "1-Year Access",
      price: 149,
      duration: "365 Days",
      savings: "Save ₹199",
      highlightNote: "Best For Serious Finding",
      features: [
        "Everything in Quarterly",
        "Premium yearly badge",
        "Unlimited boosts",
        "Dedicated premium support",
      ],
    },
  ];

  const loadRazorpayScript = () =>
    new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handleSubscribe = async (plan) => {
    if (!user) {
      toast.error("Please log in first.");
      navigate("/");
      return;
    }

    setSelectedPlan(plan.id);
    setLoading(true);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Payment gateway failed to load.");
        return setLoading(false);
      }

      const { data: orderData } = await axios.post("/payments/create-order", {
        plan: plan.id,
      });

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: "INR",
        name: "Matestay Premium",
        description: plan.name,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            await axios.post("/payments/verify", response);
            toast.success("Welcome to Premium 🎉");
            await refreshUser();
            navigate("/profile");
          } catch (err) {
            toast.error("Verification failed.");
          } finally {
            setLoading(false);
            setSelectedPlan(null);
          }
        },
        theme: {
          color: "#6c63ff",
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      toast.error("Something went wrong.");
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  // ⭐ Already premium — show current plan
  if (user?.isPremium) {
    const endDate = new Date(user.subscriptionEndDate).toLocaleDateString();

    return (
      <div className="container mx-auto px-4 py-20 pt-32">
        <Card className="max-w-2xl mx-auto text-center p-8 shadow-xl border-primary/30">
          <Crown className="h-20 w-20 text-yellow-500 mx-auto" />

          <CardTitle className="text-3xl mt-4 font-bold">
            You’re Already Premium!
          </CardTitle>

          <CardDescription className="text-lg mt-2">
            Your subscription is active until:
            <br />
            <span className="font-semibold text-primary text-xl block mt-1">
              {endDate}
            </span>
          </CardDescription>

          <Button onClick={() => navigate("/profile")} className="mt-6 text-lg">
            Go to Profile
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-20 pt-32">
      {/* ⭐ HEADER */}
      <div className="text-center mb-14">
        <div className="flex justify-center items-center gap-3">
          <Sparkles className="h-10 w-10 text-primary" />
          <h1 className="text-4xl font-bold">Upgrade to Premium</h1>
        </div>
        <p className="text-muted-foreground text-lg mt-3">
          Cheap, powerful, and designed to help you find the perfect roommate faster.
        </p>
      </div>

      {/* ⭐ MODERN PLANS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative p-6 rounded-2xl border transition transform hover:-translate-y-1 hover:shadow-2xl 
              ${plan.popular ? "border-primary shadow-xl scale-[1.03]" : "border-border"}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-3 py-1 rounded-full">
                ⭐ Most Popular
              </Badge>
            )}

            <CardHeader>
              <CardTitle className="text-2xl font-semibold text-center">
                {plan.name}
              </CardTitle>
              <p className="text-center text-sm text-muted-foreground">
                {plan.duration}
              </p>

              <div className="text-center mt-4">
                <span className="text-5xl font-bold">₹{plan.price}</span>

                {plan.savings && (
                  <Badge variant="secondary" className="ml-2">
                    {plan.savings}
                  </Badge>
                )}

                <p className="mt-2 text-sm text-primary">{plan.highlightNote}</p>
              </div>
            </CardHeader>

            <CardContent>
              <ul className="space-y-3 mb-6 mt-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex gap-2 text-sm">
                    <Check className="h-5 w-5 text-primary" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className="w-full py-6 text-lg"
                onClick={() => handleSubscribe(plan)}
                disabled={loading && selectedPlan === plan.id}
              >
                {loading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" /> Processing…
                  </>
                ) : (
                  "Upgrade Now"
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PremiumPage;
