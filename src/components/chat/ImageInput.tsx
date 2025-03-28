
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface ImageInputProps {
  onSubmit: (imageUrl: string) => void;
  onCancel: () => void;
}

export function ImageInput({ onSubmit, onCancel }: ImageInputProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) handleImageSelect(file);
  };

  const handleImageSelect = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setSelectedImage(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div 
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging ? "border-purple-400 bg-purple-400/10" : "border-purple-500/30",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {selectedImage ? (
          <div className="space-y-4">
            <img 
              src={selectedImage} 
              alt="Selected" 
              className="max-h-64 mx-auto rounded-lg"
            />
            <div className="flex justify-center gap-2">
              <Button onClick={() => onSubmit(selectedImage)}>
                Send Image
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setSelectedImage(null)}
              >
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleImageSelect(file);
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="ghost"
              className="w-full h-32"
            >
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <p className="text-sm text-purple-300">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-purple-400/70 mt-1">
                  PNG, JPG up to 5MB
                </p>
              </div>
            </Button>
          </>
        )}
      </div>
      <Button
        variant="ghost"
        className="mt-2"
        onClick={onCancel}
      >
        Cancel
      </Button>
    </div>
  );
}
