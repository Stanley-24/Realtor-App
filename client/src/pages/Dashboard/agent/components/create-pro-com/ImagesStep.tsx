// src/pages/Dashboard/agent/components/ImagesStep.tsx
import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

type Props = {
  images: File[];
  setImages: (images: File[] | ((prev: File[]) => File[])) => void;
};

export default function ImagesStep({ images, setImages }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files);
    if (images.length + newFiles.length > 10) {
      toast({
        title: "Too many images",
        description: "Maximum 10 images allowed",
        variant: "destructive",
      });
      return;
    }
    
    setImages((prev) => [...prev, ...newFiles]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="border-2 border-dashed rounded-xl p-10 text-center">
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground mb-4">
          Drag & drop images here, or click to select
        </p>
        <Input
          type="file"
          multiple
          accept="image/*"
          onChange={handleChange}
          className="max-w-xs mx-auto"
        />
        <p className="text-xs text-muted-foreground mt-3">
          Up to 10 images (JPG, PNG, WebP)
        </p>
      </div>

      {images.length < 2 && (
        <p className="text-destructive font-medium mt-4">
          ⚠️ Please upload at least 2 images to continue
        </p>
      )}


      {images.length > 0 && (
        <div>
          <p className="text-sm font-medium mb-4">{images.length} image{images.length > 1 ? "s" : ""} selected</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((file, i) => (
              <div key={i} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${i + 1}`}
                  className="rounded-lg object-cover w-full h-40"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}