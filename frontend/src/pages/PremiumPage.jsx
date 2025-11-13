import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from '@/api/axiosInstance';
import { Loader2, Check, Crown, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

const PremiumPage = () => {
  const { user, refreshUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const navigate = useNavigate();

  // ✅ UPDATED: New pricing structure
  const plans = [
    {
      id: 'free',
      name: 'Free Plan',
      price: 0,
      duration: 'Forever',
      features: [
        'Create basic profile',
        'Browse properties',
        '10 messages per conversation',
        'Basic search filters',
        'View public profiles',
      ],
      isCurrent: !user?.isPremium,
      disabled: true,
    },
    {
      id: 'monthly',
      name: 'Monthly Premium',
      price: 1,
      duration: '1 Month',
      features: [
        'Unlimited messaging',
        'Priority customer support',
        'Featured profile on search',
        'Advanced search filters',
        'See who viewed your profile',
        'Ad-free experience',
      ],
    },
    {
      id: 'yearly',
      name: 'Yearly Premium',
      price: 10,
      duration: '12 Months',
      savings: 'Save ₹2',
      features: [
        'Everything in Monthly',
        'Save 17% with annual billing',
        'Exclusive yearly member badge',
        'Early access to new features',
        'Priority listing placement',
        'Dedicated account manager',
      ],
      popular: true,
    },
  ];

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('✅ Razorpay script loaded');
        resolve(true);
      };
      script.onerror = () => {
        console.error('❌ Failed to load Razorpay script');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  const handleSubscribe = async (plan) => {
    if (plan.disabled) return;
    
    if (!user) {
      toast.error('Please log in to subscribe');
      navigate('/');
      return;
    }

    console.log('🔵 Starting subscription for plan:', plan.id);
    setSelectedPlan(plan.id);
    setLoading(true);

    try {
      console.log('📥 Loading Razorpay script...');
      const scriptLoaded = await loadRazorpayScript();
      
      if (!scriptLoaded) {
        toast.error('Failed to load payment gateway. Please check your internet connection.');
        setLoading(false);
        setSelectedPlan(null);
        return;
      }

      console.log('📤 Creating payment order for plan:', plan.id);
      const { data: orderData } = await axios.post('/payments/create-order', {
        plan: plan.id,
      });

      console.log('✅ Order created:', orderData);

      if (!orderData.keyId) {
        throw new Error('Payment gateway not configured. Please contact support.');
      }

      if (!orderData.orderId) {
        throw new Error('Failed to create payment order');
      }

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Matestay',
        description: `${plan.name} Subscription`,
        order_id: orderData.orderId,
        handler: async (response) => {
          try {
            console.log('✅ Payment successful:', response.razorpay_payment_id);
            const verifyData = await axios.post('/payments/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            console.log('✅ Payment verified:', verifyData.data);
            toast.success('Payment successful! Welcome to Premium!');
            await refreshUser();
            navigate('/profile');
          } catch (error) {
            console.error('❌ Payment verification failed:', error);
            toast.error('Payment verification failed. Please contact support.');
          } finally {
            setLoading(false);
            setSelectedPlan(null);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('⚠️ Payment cancelled by user');
            toast.info('Payment cancelled');
            setLoading(false);
            setSelectedPlan(null);
          },
          escape: true,
          backdropclose: false
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: {
          color: '#5b5dda',
        },
        retry: {
          enabled: true,
          max_count: 3
        }
      };

      console.log('🚀 Opening Razorpay checkout');
      const paymentObject = new window.Razorpay(options);
      
      paymentObject.on('payment.failed', function (response) {
        console.error('❌ Payment failed:', response.error);
        toast.error(`Payment failed: ${response.error.description}`);
        setLoading(false);
        setSelectedPlan(null);
      });

      paymentObject.open();
      
    } catch (error) {
      console.error('❌ Subscription error:', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to process subscription';
      toast.error(errorMsg);
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  if (user?.isPremium) {
    const endDate = new Date(user.subscriptionEndDate).toLocaleDateString();
    return (
      <div className="container mx-auto px-4 py-12 pt-28">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <Crown className="h-16 w-16 text-yellow-500" />
            </div>
            <CardTitle className="text-3xl">You're a Premium Member!</CardTitle>
            <CardDescription className="text-lg mt-2">
              Your subscription is active until {endDate}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate('/profile')} className="mt-4">
              Go to Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-28">
      <div className="text-center mb-12">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Sparkles className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Choose Your Plan</h1>
        </div>
        <p className="text-lg text-muted-foreground">
          Unlock exclusive features and find your perfect roommate faster
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.popular ? 'border-primary shadow-lg scale-105' : ''
            } ${plan.isCurrent ? 'border-green-500' : ''}`}
          >
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary">
                Most Popular
              </Badge>
            )}
            {plan.isCurrent && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-500">
                Current Plan
              </Badge>
            )}
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription>{plan.duration}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold">₹{plan.price}</span>
                {plan.savings && (
                  <Badge variant="secondary" className="ml-2">
                    {plan.savings}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                onClick={() => handleSubscribe(plan)}
                disabled={loading || plan.disabled}
                className="w-full"
                variant={plan.popular ? 'default' : plan.disabled ? 'secondary' : 'outline'}
              >
                {loading && selectedPlan === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : plan.disabled ? (
                  'Current Plan'
                ) : (
                  'Subscribe Now'
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