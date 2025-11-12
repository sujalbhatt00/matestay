import React, { useState, useRef } from 'react';
import axios from '@/api/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationCombobox } from './ui/LocationCombobox';
import { OccupationCombobox } from './ui/OccupationCombobox';
import { Loader2, Upload, X, ArrowLeft, ArrowRight } from 'lucide-react';
import { toast } from "sonner";

const lifestyleOptions = ["Early Bird", "Night Owl", "Quiet", "Social", "Vegetarian", "Non-Vegetarian", "Non-Smoker", "Smoker", "Pet-Friendly"];
const genderOptions = ["Male", "Female", "Non-binary", "Transgender", "Prefer not to say", "Other"];
const lookingForOptions = ["Any", "Male", "Female", "Non-binary", "Transgender", "Other"];

export default function MultiStepProfile({ initialData, onSaved }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    age: initialData.age || '',
    gender: initialData.gender || '',
    lookingFor: initialData.lookingFor || 'Any', // <-- Add new field
    location: initialData.location || '',
    occupation: initialData.occupation || '',
    budget: initialData.budget || '',
    bio: initialData.bio || '',
    lifestyle: initialData.lifestyle || [],
    profilePic: initialData.profilePic || '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLifestyleToggle = (tag) => {
    setFormData(prev => ({
      ...prev,
      lifestyle: prev.lifestyle.includes(tag)
        ? prev.lifestyle.filter(t => t !== tag)
        : [...prev.lifestyle, tag]
    }));
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsUploading(true);
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const uploadFormData = new FormData();
    uploadFormData.append('file', file);
    uploadFormData.append('upload_preset', uploadPreset);
    try {
      const res = await fetch(url, { method: 'POST', body: uploadFormData });
      const data = await res.json();
      setFormData(prev => ({ ...prev, profilePic: data.secure_url }));
      toast.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await axios.put('/user/update', formData);
      toast.success("Profile saved successfully!");
      onSaved();
    } catch (error) {
      console.error("Failed to save profile:", error);
      toast.error("Could not save profile. Please check your information.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="bg-card p-6 md:p-10 rounded-lg border shadow-lg max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Set Up Your Profile</h1>
      <p className="text-muted-foreground mb-6">Complete your profile to start connecting with roommates.</p>
      
      <div className="mb-6 flex items-center gap-4">
        <div className={`flex-1 h-1 rounded-full ${step >= 1 ? 'bg-primary' : 'bg-muted'}`}></div>
        <div className={`flex-1 h-1 rounded-full ${step >= 2 ? 'bg-primary' : 'bg-muted'}`}></div>
        <div className={`flex-1 h-1 rounded-full ${step >= 3 ? 'bg-primary' : 'bg-muted'}`}></div>
      </div>

      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Step 1: Personal Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name *</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" value={formData.age} onChange={handleChange} />
            </div>
            {/* --- THIS IS THE CHANGE: Gender Select --- */}
            <div>
              <Label>Gender *</Label>
              <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)} required>
                <SelectTrigger><SelectValue placeholder="Select your gender" /></SelectTrigger>
                <SelectContent>
                  {genderOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* --- END CHANGE --- */}
          </div>
          <div>
            <Label>Profile Picture</Label>
            <div className="flex items-center gap-4 mt-2">
              <img src={formData.profilePic || "https://i.imgur.com/6VBx3io.png"} alt="Avatar" className="w-20 h-20 rounded-full object-cover border" />
              <Button type="button" variant="outline" onClick={() => fileInputRef.current.click()} disabled={isUploading}>
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {isUploading ? 'Uploading...' : 'Upload Photo'}
              </Button>
              <input type="file" ref={fileInputRef} onChange={handlePhotoUpload} className="hidden" accept="image/*" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Step 2: Roommate Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Location *</Label>
              <LocationCombobox value={formData.location} onChange={(value) => handleSelectChange('location', value)} />
            </div>
            <div>
              <Label>Occupation</Label>
              <OccupationCombobox value={formData.occupation} onChange={(value) => handleSelectChange('occupation', value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="budget">Monthly Budget (₹)</Label>
              <Input id="budget" name="budget" type="number" value={formData.budget} onChange={handleChange} />
            </div>
            {/* --- THIS IS THE CHANGE: Looking For Select --- */}
            <div>
              <Label>Looking for a Roommate Who Is</Label>
              <Select name="lookingFor" value={formData.lookingFor} onValueChange={(value) => handleSelectChange('lookingFor', value)}>
                <SelectTrigger><SelectValue placeholder="Select gender preference" /></SelectTrigger>
                <SelectContent>
                  {lookingForOptions.map(option => <SelectItem key={option} value={option}>{option}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            {/* --- END CHANGE --- */}
          </div>
          <div>
            <Label>Lifestyle</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {lifestyleOptions.map(tag => (
                <Button key={tag} type="button" variant={formData.lifestyle.includes(tag) ? 'default' : 'outline'} size="sm" onClick={() => handleLifestyleToggle(tag)}>
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Step 3: About You</h2>
          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us a bit about yourself, your habits, and what you're looking for in a roommate." rows={5} maxLength={200} />
            <p className="text-xs text-muted-foreground mt-1">{200 - formData.bio.length} characters remaining</p>
          </div>
        </div>
      )}

      <div className="mt-8 pt-6 border-t flex justify-between">
        <Button type="button" variant="outline" onClick={prevStep} disabled={step === 1}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Previous
        </Button>
        {step < 3 ? (
          <Button type="button" onClick={nextStep}>
            Next <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Saving...' : 'Save Profile'}
          </Button>
        )}
      </div>
    </div>
  );
};