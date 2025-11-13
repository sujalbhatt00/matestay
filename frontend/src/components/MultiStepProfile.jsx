import React, { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import axios from '@/api/axiosInstance';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Camera, Loader2, User, Phone, MapPin, Briefcase, DollarSign } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const lifestyleOptions = ["Early Bird", "Night Owl", "Quiet", "Social", "Vegetarian", "Non-Vegetarian", "Non-Smoker", "Smoker", "Pet-Friendly"];
const genderOptions = ["Male", "Female", "Non-binary", "Transgender", "Prefer not to say", "Other"];
const lookingForOptions = ["Any", "Male", "Female", "Non-binary", "Transgender", "Other"];

export default function MultiStepProfile({ initialData, onSaved }) {
  const { refreshUser } = useAuth(); // Add refreshUser
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    phone: initialData.phone || '',
    age: initialData.age || '',
    gender: initialData.gender || '',
    lookingFor: initialData.lookingFor || 'Any',
    location: initialData.location || '',
    occupation: initialData.occupation || '',
    budget: initialData.budget || '',
    bio: initialData.bio || '',
    lifestyle: initialData.lifestyle || [],
    profilePic: initialData.profilePic || '',
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previousPhotoUrl, setPreviousPhotoUrl] = useState(initialData.profilePic || '');
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

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onloadend = async () => {
        const base64String = reader.result;

        const uploadData = new FormData();
        uploadData.append('file', base64String);
        uploadData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        uploadData.append('folder', 'matestay/profiles');

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: uploadData,
          }
        );

        if (!cloudinaryResponse.ok) {
          throw new Error('Failed to upload to Cloudinary');
        }

        const cloudinaryData = await cloudinaryResponse.json();
        const newPhotoUrl = cloudinaryData.secure_url;

        console.log("✅ Photo uploaded to Cloudinary:", newPhotoUrl);

        // ✅ FIX: Update formData immediately
        setFormData(prev => ({ ...prev, profilePic: newPhotoUrl }));
        
        // Delete old photo from Cloudinary if it exists
        if (previousPhotoUrl && previousPhotoUrl.includes('cloudinary')) {
          try {
            const urlParts = previousPhotoUrl.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            
            await axios.post('/user/delete-cloudinary-image', { publicId });
            console.log("🗑️ Old photo deleted from Cloudinary");
          } catch (error) {
            console.error("Failed to delete old photo:", error);
          }
        }

        setPreviousPhotoUrl(newPhotoUrl);
        toast.success("Profile photo uploaded successfully!");
      };

      reader.onerror = () => {
        throw new Error('Failed to read file');
      };

    } catch (error) {
      console.error("Photo upload error:", error);
      toast.error("Failed to upload photo. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!formData.gender) {
      toast.error("Please select your gender");
      return;
    }
    if (!formData.age || formData.age < 18) {
      toast.error("Age must be 18 or older");
      return;
    }
    if (!formData.location) {
      toast.error("Location is required");
      return;
    }

    setIsSubmitting(true);

    try {
      console.log("📤 Submitting profile data:", formData);
      
      const response = await axios.put('/user/update', formData);
      
      console.log("✅ Profile updated:", response.data);
      toast.success("Profile saved successfully!");
      
      // ✅ FIX: Refresh user data in AuthContext
      await refreshUser();
      
      if (onSaved) {
        onSaved();
      }
    } catch (error) {
      console.error("❌ Profile update error:", error);
      const errorMsg = error.response?.data?.message || "Failed to save profile";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  return (
    <div className="max-w-2xl mx-auto bg-card p-6 md:p-8 rounded-lg border shadow-lg">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className={`text-sm font-medium ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Step 1</span>
          <span className={`text-sm font-medium ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Step 2</span>
          <span className={`text-sm font-medium ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Step 3</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Basic Information</h2>

          {/* Profile Picture */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              <img
                src={formData.profilePic || "https://i.imgur.com/6VBx3io.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full hover:bg-primary/90 disabled:opacity-50"
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>
            <p className="text-sm text-muted-foreground">Click the camera icon to upload a photo</p>
          </div>

          <div>
            <Label htmlFor="name"><User className="inline h-4 w-4 mr-1" /> Full Name *</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="phone"><Phone className="inline h-4 w-4 mr-1" /> Phone Number (Optional)</Label>
            <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 XXXXX XXXXX" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="gender">Gender *</Label>
              <Select value={formData.gender} onValueChange={(value) => handleSelectChange('gender', value)}>
                <SelectTrigger id="gender">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map(option => (
                    <SelectItem key={option} value={option}>{option}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="age">Age *</Label>
              <Input id="age" name="age" type="number" min="18" value={formData.age} onChange={handleChange} required />
            </div>
          </div>

          <div>
            <Label htmlFor="lookingFor">Looking For</Label>
            <Select value={formData.lookingFor} onValueChange={(value) => handleSelectChange('lookingFor', value)}>
              <SelectTrigger id="lookingFor">
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                {lookingForOptions.map(option => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end">
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 2: Location & Occupation */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">Location & Work</h2>

          <div>
            <Label htmlFor="location"><MapPin className="inline h-4 w-4 mr-1" /> Location *</Label>
            <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="City, State" required />
          </div>

          <div>
            <Label htmlFor="occupation"><Briefcase className="inline h-4 w-4 mr-1" /> Occupation</Label>
            <Input id="occupation" name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Student, Working Professional, etc." />
          </div>

          <div>
            <Label htmlFor="budget"><DollarSign className="inline h-4 w-4 mr-1" /> Monthly Budget (₹)</Label>
            <Input id="budget" name="budget" type="number" min="0" value={formData.budget} onChange={handleChange} placeholder="10000" />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {/* Step 3: Bio & Lifestyle */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold mb-6">About You</h2>

          <div>
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} placeholder="Tell us about yourself..." maxLength={200} rows={4} />
            <p className="text-xs text-muted-foreground mt-1">{200 - (formData.bio?.length || 0)} characters remaining</p>
          </div>

          <div>
            <Label>Lifestyle Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {lifestyleOptions.map(tag => (
                <Badge
                  key={tag}
                  variant={formData.lifestyle.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => handleLifestyleToggle(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Profile"
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}