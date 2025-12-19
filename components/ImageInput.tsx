
import React, { useCallback, useState } from 'react';
import { Upload } from 'lucide-react';

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const ImageInput: React.FC<ImageInputProps> = ({ value, onChange, className }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [onChange]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, [handleFile]);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div 
        className={`relative w-full h-full flex items-center justify-center transition-all duration-200 
          ${isDragging ? 'bg-blue-50/50' : 'bg-transparent hover:bg-black/5'}
        `}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input 
          type="file" 
          accept="image/*"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
        />
        
        {value && (
          <img src={value} alt="Preview" className="absolute inset-0 w-full h-full object-cover pointer-events-none" />
        )}
      </div>
    </div>
  );
};

export default ImageInput;
