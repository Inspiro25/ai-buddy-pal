
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DialogTitle } from "@radix-ui/react-dialog";

interface ImageInputProps {
  onSubmit: (imageUrl: string) => void;
  onCancel: () => void;
}

export function ImageInput({ onSubmit, onCancel }: ImageInputProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
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
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="py-4 px-4 animate-slide-up">
      <div className="max-w-3xl mx-auto">
        <div className="bg-purple-900/30 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-medium text-purple-100">Upload Image</h3>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-purple-300 hover:text-purple-100 hover:bg-purple-800/50"
              onClick={onCancel}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {selectedImage ? (
            <div className="relative">
              <img 
                src={selectedImage} 
                alt="Selected" 
                className="max-h-48 max-w-full mx-auto rounded-md object-contain"
              />
              <Button
                size="icon"
                variant="secondary"
                className="absolute top-2 right-2 h-6 w-6 bg-purple-950/80 hover:bg-purple-900 border border-purple-400/20"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-3 w-3" />
              </Button>
              
              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  className="mr-2 text-sm bg-purple-900/40 hover:bg-purple-800/60"
                  onClick={() => setSelectedImage(null)}
                >
                  Change
                </Button>
                <Button
                  className="text-sm bg-purple-700 hover:bg-purple-600"
                  onClick={() => onSubmit(selectedImage)}
                >
                  Send Image
                </Button>
              </div>
            </div>
          ) : (
            <div
              className={cn(
                "border-2 border-dashed border-purple-500/30 rounded-md p-6 text-center",
                isDragging && "border-purple-400/50 bg-purple-800/20"
              )}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <ImageIcon className="h-8 w-8 mx-auto text-purple-400/60" />
              <p className="mt-2 text-sm text-purple-200">Drag and drop an image here, or</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2 text-xs bg-purple-900/40 hover:bg-purple-800/60"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-3.5 w-3.5 mr-1" />
                Browse Files
              </Button>
              <p className="mt-2 text-xs text-purple-300/70">Maximum file size: 5MB</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
