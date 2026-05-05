import React, { useState, useRef } from 'react';
import axios from '@/api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LocationCombobox } from "@/components/ui/LocationCombobox";
import { Loader2, Upload, X } from 'lucide-react';
import Footer from '@/components/Footer';

const defaultAmenities = ["Wifi", "Kitchen", "Parking", "AC", "Washer", "Dryer", "TV", "Heating"];

const CreatePropertyPage = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    propertyType: '',
    location: '',
    rent: '',
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    photos: [],
    availableFrom: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // ⭐ Frontend Validation
  const validate = () => {
    const newErrors = {};

    if (formData.title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters.";
    }

    if (formData.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters.";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Live Validation Update
    setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (value) => {
    setFormData(prev => ({ ...prev, location: value }));
  };

  const handleAmenityToggle = (amenity) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handlePhotoUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setIsUploading(true);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    const uploadedUrls = [];

    try {
      for (const file of files) {
        const formDataCloud = new FormData();
        formDataCloud.append("file", file);
        formDataCloud.append("upload_preset", uploadPreset);

        const response = await fetch(url, { method: "POST", body: formDataCloud });
        const result = await response.json();

        if (result.secure_url) uploadedUrls.push(result.secure_url);
        else throw new Error('Upload failed for one or more images.');
      }

      setFormData(prev => ({ ...prev, photos: [...prev.photos, ...uploadedUrls] }));
    } catch (error) {
      alert("Image upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePhoto = (urlToRemove) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter(url => url !== urlToRemove)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        rent: Number(formData.rent),
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
      };

      const response = await axios.post('/properties', payload);

      alert('Listing created successfully!');
      navigate(`/properties/${response.data._id}`);

    } catch (error) {
      alert(error.response?.data?.message || "Failed to create listing.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="pt-24 flex-grow bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-3xl font-bold mb-6">Create New Listing</h1>

          <form onSubmit={handleSubmit} className="space-y-6 bg-card p-6 rounded-lg border border-border shadow-sm">

            {/* Title */}
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" name="title" value={formData.title} onChange={handleChange} required />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea id="description" name="description" value={formData.description} onChange={handleChange} required rows={5} />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>

            {/* Type & Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Property Type *</Label>
                <Select value={formData.propertyType} onValueChange={(value) => handleSelectChange('propertyType', value)}>
                  <SelectTrigger><SelectValue placeholder="Select Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="House">House</SelectItem>
                    <SelectItem value="Room">Room</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="PG">PG</SelectItem>
                    <SelectItem value="Hostel">Hostel</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Location *</Label>
                <LocationCombobox value={formData.location} onChange={handleLocationChange} />
              </div>
            </div>

            {/* Rent, Bedrooms, Bathrooms */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Monthly Rent (₹) *</Label>
                <Input id="rent" name="rent" type="number" value={formData.rent} onChange={handleChange} required min="0" />
              </div>

              <div>
                <Label>Bedrooms</Label>
                <Input id="bedrooms" name="bedrooms" type="number" value={formData.bedrooms} onChange={handleChange} min="1" />
              </div>

              <div>
                <Label>Bathrooms</Label>
                <Input id="bathrooms" name="bathrooms" type="number" value={formData.bathrooms} onChange={handleChange} min="1" />
              </div>
            </div>

            {/* Available From */}
            <div>
              <Label>Available From *</Label>
              <Input id="availableFrom" name="availableFrom" type="date" value={formData.availableFrom} onChange={handleChange} />
            </div>

            {/* Amenities */}
            <div>
              <Label>Amenities</Label>
              <div className="flex flex-wrap gap-2">
                {defaultAmenities.map(amenity => (
                  <Button
                    key={amenity}
                    type="button"
                    variant={formData.amenities.includes(amenity) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleAmenityToggle(amenity)}
                    className={`rounded-full ${formData.amenities.includes(amenity) ? 'bg-primary text-white' : ''}`}
                  >
                    {amenity}
                  </Button>
                ))}
              </div>
            </div>

            {/* Photos */}
            <div>
              <Label>Photos (up to 5)</Label>
              <div className="flex flex-wrap gap-4 mb-4">
                {formData.photos.map(url => (
                  <div key={url} className="relative">
                    <img src={url} alt="Uploaded" className="w-24 h-24 object-cover rounded-lg border" />

                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                      onClick={() => removePhoto(url)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current.click()}
                disabled={isUploading || formData.photos.length >= 5}
              >
                {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {isUploading ? 'Uploading...' : 'Upload Photos'}
              </Button>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoUpload}
                className="hidden"
                accept="image/*"
                multiple
                disabled={formData.photos.length >= 5}
              />
            </div>

            {/* Submit */}
            <div className="pt-4 border-t border-border">
              <Button type="submit" disabled={isSubmitting || isUploading} className="w-full md:w-auto bg-[#5b5dda] hover:bg-[#4a4ab5]">
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
              </Button>
            </div>

          </form>
        </div>
      </div>

    
    </div>
  );
};

export default CreatePropertyPage;
