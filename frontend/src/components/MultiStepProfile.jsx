import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import { Camera, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const lifestyleOptions = [
  "Early Bird", "Night Owl", "Quiet", "Social",
  "Vegetarian", "Non-Vegetarian", "Non-Smoker",
  "Smoker", "Pet-Friendly",
];

const genderOptions = [
  "Male", "Female", "Non-binary", "Transgender",
  "Prefer not to say", "Other",
];

export default function MultiStepProfile({ initialData, onSaved }) {
  const { refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    phone: initialData?.phone || "",
    age: initialData?.age || "",
    gender: initialData?.gender || "",
    location: initialData?.location || "",
    occupation: initialData?.occupation || "",
    budget: initialData?.budget || "",
    bio: initialData?.bio || "",
    lifestyle: initialData?.lifestyle || [],
    profilePic: initialData?.profilePic || "",
  });

  const [previousPhotoUrl, setPreviousPhotoUrl] = useState(initialData?.profilePic || "");

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) return toast.error("Upload a valid image");
    if (file.size > 5 * 1024 * 1024) return toast.error("Image must be < 5MB");

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const uploadData = new FormData();
        uploadData.append("file", reader.result);
        uploadData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
        uploadData.append("folder", "matestay/profiles");

        const uploadRes = await fetch(
          `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: uploadData }
        );

        const data = await uploadRes.json();
        const newUrl = data.secure_url;

        setFormData((prev) => ({ ...prev, profilePic: newUrl }));

        if (previousPhotoUrl?.includes("cloudinary")) {
          const id = previousPhotoUrl.split("/").pop().split(".")[0];
          await axios.post("/user/delete-cloudinary-image", { publicId: id });
        }

        setPreviousPhotoUrl(newUrl);
        toast.success("Photo Updated!");
      };
    } catch {
      toast.error("Upload Failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.gender) return toast.error("Select gender");
    if (!formData.age || formData.age < 18) return toast.error("Age must be 18+");
    if (!formData.location.trim()) return toast.error("Location required");

    setIsSubmitting(true);

    try {
      await axios.put("/user/update", formData);
      await refreshUser();
      toast.success("Profile updated!");
      onSaved?.();
    } catch {
      toast.error("Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl border shadow-xl space-y-8">

      {/* Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-medium mb-2">
          {[1, 2, 3].map((s) => (
            <span key={s} className={step >= s ? "text-primary" : "text-muted-foreground"}>
              Step {s}
            </span>
          ))}
        </div>
        <div className="w-full h-2 bg-muted rounded-full">
          <div className="h-full bg-primary" style={{ width: `${(step / 3) * 100}%` }} />
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold">Basic Information</h2>

          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={formData.profilePic || "https://i.imgur.com/6VBx3io.png"}
                className="w-32 h-32 rounded-full border-4 border-primary/20 object-cover shadow-lg"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-primary p-2 rounded-full text-white shadow-md"
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Camera className="h-5 w-5" />}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>
          </div>

          <div>
            <Label>Name *</Label>
            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div>
            <Label>Phone (optional)</Label>
            <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Gender *</Label>
              <Select value={formData.gender} onValueChange={(v) => setFormData({ ...formData, gender: v })}>
                <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                <SelectContent>
                  {genderOptions.map((g) => <SelectItem key={g} value={g}>{g}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Age *</Label>
              <Input type="number" min="18" value={formData.age} onChange={(e) => setFormData({ ...formData, age: e.target.value })} />
            </div>
          </div>

          <Button className="w-full" onClick={nextStep}>Continue</Button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold">Location & Work</h2>

          {/* ✔ NEW — LocationCombobox used here */}
          <div>
            <Label>Location *</Label>
            <LocationCombobox
              value={formData.location}
              onChange={(v) => setFormData({ ...formData, location: v })}
              placeholder="Select your city"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Occupation</Label>
            <Input value={formData.occupation} onChange={(e) => setFormData({ ...formData, occupation: e.target.value })} />
          </div>

          <div>
            <Label>Monthly Budget (₹)</Label>
            <Input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Continue</Button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="space-y-6 animate-fadeIn">
          <h2 className="text-2xl font-bold">About You</h2>

          <div>
            <Label>Bio</Label>
            <Textarea
              rows={4}
              maxLength={200}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              {200 - (formData.bio?.length || 0)} characters left
            </p>
          </div>

          <div>
            <Label>Lifestyle</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {lifestyleOptions.map((tag) => (
                <Badge
                  key={tag}
                  variant={formData.lifestyle.includes(tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: prev.lifestyle.includes(tag)
                        ? prev.lifestyle.filter((t) => t !== tag)
                        : [...prev.lifestyle, tag],
                    }))
                  }
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : "Save Profile"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
