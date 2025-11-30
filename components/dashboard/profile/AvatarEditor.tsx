"use client";

import React, { useState, useRef, useCallback, useEffect, useTransition } from "react";
import Cropper, { type Area } from 'react-easy-crop';
import { Camera, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCroppedImg } from "@/lib/utils/imageUtils"; 
import { Slider } from "@/components/ui/slider";
import { useCurrentUser } from "@/hooks/use-CurrentUser";
import { api } from "@/lib/api"; 
import imageCompression from "browser-image-compression";

async function dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], fileName, { type: blob.type || "image/jpeg" });
}

const AvatarEditor = () => {  
  const { user, update } = useCurrentUser();

  const [isPending, startTransition] = useTransition();

  const [displayImage, setDisplayImage] = useState<string | null>(null);

  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    setDisplayImage(user?.image || "/icons/user.svg");
  }, [user?.image]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImageToCrop(reader.result as string);
        setIsModalOpen(true);
      };
      e.target.value = '';
    }
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const closeModal = useCallback(() => {
    if (isPending) return;
    setIsModalOpen(false);
  }, [isPending]);

  const handleSaveChanges = () => {
    if (!imageToCrop || !croppedAreaPixels || !user?.id) {
      toast.error("An error occurred. Please try again.");
      return;
    }

startTransition(async () => {
  try {
    const croppedImageBase64 = await getCroppedImg(imageToCrop, croppedAreaPixels);

    setDisplayImage(croppedImageBase64);

    const file = await dataUrlToFile(croppedImageBase64, `avatar-${user.id}.jpg`);

    const compressedFile = await imageCompression(file, {
      maxSizeMB: 0.1,        
      maxWidthOrHeight: 500,  
      useWebWorker: true,
    });

    const formData = new FormData();
    formData.append("file", compressedFile);

    const uploadRes = await fetch("/api/upload", { method: "POST", body: formData });
    const uploadResult = await uploadRes.json();

    if (!uploadRes.ok || !uploadResult.success) throw new Error(uploadResult.error || "Upload failed");
    
    const cloudinaryUrl = uploadResult.data.secure_url;

    const updateResponse = await api.users.update(user.id, { image: cloudinaryUrl });

    if (!updateResponse.success) throw new Error(updateResponse.message || "Failed to update");

    await update({ image: cloudinaryUrl });

    toast.success("Avatar updated successfully!");
  } catch (e) {
    setDisplayImage(user?.image || "/icons/user.svg");
    toast.error(e instanceof Error ? e.message : "Unexpected error");
  } finally {
    closeModal();
  }
});

  };

  return (
    <div className="flex flex-col items-center gap-4">
      <label className="font-medium text-lg">Avatar</label>
      <div 
        className="relative w-32 h-32 group cursor-pointer" 
        onClick={() => !isPending && fileInputRef.current?.click()}
      >
        <img
          src={displayImage || "/icons/user.svg"}
          alt="Avatar"
          className="w-full h-full object-cover rounded-full border-2 border-gray-200 transition-all"
        />
        <div className="absolute inset-0 bg-black bg-opacity-40 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="w-8 h-8" />
          <span className="text-sm font-semibold mt-1">Edit</span>
        </div>
      </div>
      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={onFileChange}
        className="hidden"
        disabled={isPending}
      />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent onInteractOutside={(e) => { if(isPending) e.preventDefault() }}>
          <DialogHeader>
            <DialogTitle>Edit Avatar</DialogTitle>
          </DialogHeader>
          
          <div className="relative h-96 w-full bg-gray-100">
            {imageToCrop && (
              <Cropper
                image={imageToCrop}
                crop={crop}
                zoom={zoom}
                aspect={1}
                cropShape="round"
                showGrid={false}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            )}
          </div>
          
          <div className="flex items-center gap-4 py-4">
            <span className="text-sm">Zoom</span>
            <Slider
              value={[zoom]}
              min={1}
              max={3}
              step={0.1}
              onValueChange={(value) => setZoom(value[0])}
              disabled={isPending}
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={closeModal} disabled={isPending}>Cancel</Button>
            <Button onClick={handleSaveChanges} disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AvatarEditor;