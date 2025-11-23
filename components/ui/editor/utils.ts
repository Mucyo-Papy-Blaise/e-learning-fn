import { uploadApi } from "@/lib/api/upload";

// Image resize utility function
export const resizeImage = (
  file: File,
  maxWidth: number,
  maxHeight: number,
  quality: number = 0.8
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new window.Image();

    img.onload = () => {
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          } else {
            reject(new Error('Canvas to blob conversion failed'));
          }
        },
        'image/jpeg',
        quality
      );
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

// Upload image to backend
export const uploadImageToBackend = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await uploadApi.uploadFileOrImage(formData);
  if (!res?.url) throw new Error("No image URL returned");

  return res.url;
};

// Validate image file
export const validateImageFile = (file: File): string | null => {
  if (!file.type.startsWith("image/")) {
    return "Only image files are allowed.";
  }
  
  if (file.size > 10 * 1024 * 1024) {
    return "Image must be smaller than 10MB.";
  }
  
  return null;
}; 