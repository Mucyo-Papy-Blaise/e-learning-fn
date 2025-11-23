import axiosInstance from "../axios";

export const uploadApi = {
  uploadFileOrImage: async (formData: FormData): Promise<{
    url?: string;
    imageUrl?: string;
    data?: { url?: string };
    src?: string;
  }> => {
    const response = await axiosInstance.post('/upload/file', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  uploadMultipleFiles: async (files: File[]): Promise<{
    success: boolean;
    urls?: string[];
    error?: string;
  }> => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append('files', file);
      });

      const response = await axiosInstance.post('/upload/multiple-files', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Handle the response format from our backend
      const data = response.data;
      let urls: string[] = [];

      if (data.urls && Array.isArray(data.urls)) {
        // Our backend returns { urls: string[] }
        urls = data.urls;
      } else if (Array.isArray(data)) {
        // Fallback: if response is an array of URLs
        urls = data.map((item: unknown) => {
          const urlItem = item as { url?: string; imageUrl?: string; data?: { url?: string }; src?: string };
          return urlItem.url || urlItem.imageUrl || urlItem.data?.url || urlItem.src || String(item);
        }).filter(Boolean);
      } else if (data.files && Array.isArray(data.files)) {
        // Fallback: if response has a files array
        urls = data.files.map((file: unknown) => {
          const fileItem = file as { url?: string; imageUrl?: string; data?: { url?: string }; src?: string };
          return fileItem.url || fileItem.imageUrl || fileItem.data?.url || fileItem.src;
        }).filter(Boolean);
      } else if (data.data && Array.isArray(data.data)) {
        // Fallback: if response has a data array
        urls = data.data.map((item: unknown) => {
          const dataItem = item as { url?: string; imageUrl?: string; data?: { url?: string }; src?: string };
          return dataItem.url || dataItem.imageUrl || dataItem.data?.url || dataItem.src;
        }).filter(Boolean);
      }

      return {
        success: true,
        urls: urls.filter(Boolean)
      };
    } catch (error) {
      console.error('Batch upload failed:', error);
      return {
        success: false,
        error: 'Batch upload not supported or failed'
      };
    }
  },
};
