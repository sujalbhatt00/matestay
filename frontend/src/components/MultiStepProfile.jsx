import React, { useState, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "@/api/axiosInstance";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Camera,
  Loader2,
  User,
  Phone,
  MapPin,
  Briefcase,
  DollarSign,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const lifestyleOptions = [
  "Early Bird",
  "Night Owl",
  "Quiet",
  "Social",
  "Vegetarian",
  "Non-Vegetarian",
  "Non-Smoker",
  "Smoker",
  "Pet-Friendly",
];
const genderOptions = [
  "Male",
  "Female",
  "Non-binary",
  "Transgender",
  "Prefer not to say",
  "Other",
];
const lookingForOptions = [
  "Any",
  "Male",
  "Female",
  "Non-binary",
  "Transgender",
  "Other",
];

export default function MultiStepProfile({ initialData, onSaved }) {
  const { refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    name: initialData.name || "",
    phone: initialData.phone || "",
    age: initialData.age || "",
    gender: initialData.gender || "",
    lookingFor: initialData.lookingFor || "Any",
    location: initialData.location || "",
    occupation: initialData.occupation || "",
    budget: initialData.budget || "",
    bio: initialData.bio || "",
    lifestyle: initialData.lifestyle || [],
    profilePic: initialData.profilePic || "",
  });

  const [previousPhotoUrl, setPreviousPhotoUrl] = useState(
    initialData.profilePic || ""
  );

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Upload a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onloadend = async () => {
        const uploadData = new FormData();
        uploadData.append("file", reader.result);
        uploadData.append(
          "upload_preset",
          import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
        );
        uploadData.append("folder", "matestay/profiles");

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${
            import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
          }/image/upload`,
          { method: "POST", body: uploadData }
        );

        const data = await cloudinaryResponse.json();
        const newPhotoUrl = data.secure_url;

        setFormData((prev) => ({ ...prev, profilePic: newPhotoUrl }));

        if (previousPhotoUrl?.includes("cloudinary")) {
          const publicId = previousPhotoUrl.split("/").pop().split(".")[0];
          await axios.post("/user/delete-cloudinary-image", { publicId });
        }

        setPreviousPhotoUrl(newPhotoUrl);
        toast.success("Profile picture updated!");
      };
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) return toast.error("Name is required");
    if (!formData.gender) return toast.error("Please select gender");
    if (!formData.age || formData.age < 18)
      return toast.error("Age must be 18+");
    if (!formData.location.trim())
      return toast.error("Location is required");

    setIsSubmitting(true);
    try {
      await axios.put("/user/update", formData);
      await refreshUser();
      toast.success("Profile updated successfully!");

      onSaved?.();
    } catch (e) {
      toast.error("Failed to save profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => setStep((s) => Math.min(s + 1, 3));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  return (
    <div className="max-w-2xl mx-auto bg-card p-8 rounded-xl border shadow-xl space-y-8">

      {/* PROGRESS INDICATOR */}
      <div>
        <div className="flex justify-between text-xs font-medium mb-2">
          {[1, 2, 3].map((s) => (
            <span
              key={s}
              className={`transition ${
                step >= s ? "text-primary" : "text-muted-foreground"
              }`}
            >
              Step {s}
            </span>
          ))}
        </div>

        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* STEP 1 */}
      {step === 1 && (
        <div className="animate-fadeIn space-y-6">

          <h2 className="text-2xl font-bold">Basic Information</h2>

          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={formData.profilePic || "https://i.imgur.com/6VBx3io.png"}
                className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 shadow-lg"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-lg"
              >
                {isUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
            </div>

            <p className="text-xs text-muted-foreground mt-2">
              Upload a photo that clearly shows your face.
            </p>
          </div>

          <div>
            <Label>Full Name *</Label>
            <Input name="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
          </div>

          <div>
            <Label>Phone (optional)</Label>
            <Input name="phone" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Gender *</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) =>
                  setFormData((prev) => ({ ...prev, gender: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions.map((g) => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Age *</Label>
              <Input
                type="number"
                min="18"
                value={formData.age}
                onChange={(e) =>
                  setFormData({ ...formData, age: e.target.value })
                }
              />
            </div>
          </div>

          <Button className="w-full" onClick={nextStep}>
            Continue
          </Button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div className="animate-fadeIn space-y-6">

          <h2 className="text-2xl font-bold">Location & Work</h2>

          <div>
            <Label>Location *</Label>
            <Input
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Occupation</Label>
            <Input
              value={formData.occupation}
              onChange={(e) =>
                setFormData({ ...formData, occupation: e.target.value })
              }
            />
          </div>

          <div>
            <Label>Monthly Budget (₹)</Label>
            <Input
              type="number"
              min="0"
              value={formData.budget}
              onChange={(e) =>
                setFormData({ ...formData, budget: e.target.value })
              }
            />
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button onClick={nextStep}>Continue</Button>
          </div>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div className="animate-fadeIn space-y-6">

          <h2 className="text-2xl font-bold">About You</h2>

          <div>
            <Label>Bio</Label>
            <Textarea
              rows={4}
              maxLength={200}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Tell something interesting about yourself…"
            />
            <p className="text-xs text-muted-foreground">
              {200 - (formData.bio.length || 0)} characters left
            </p>
          </div>

          <div>
            <Label>Lifestyle</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {lifestyleOptions.map((tag) => (
                <Badge
                  key={tag}
                  variant={
                    formData.lifestyle.includes(tag) ? "default" : "outline"
                  }
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      lifestyle: prev.lifestyle.includes(tag)
                        ? prev.lifestyle.filter((t) => t !== tag)
                        : [...prev.lifestyle, tag],
                    }))
                  }
                  className="cursor-pointer transition"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <Button variant="outline" onClick={prevStep}>
              Back
            </Button>
            <Button disabled={isSubmitting} onClick={handleSubmit}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                  Saving…
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
