import { Area } from 'react-easy-crop';

/**
 * Resize một ảnh (dưới dạng File hoặc base64) xuống một kích thước tối đa
 * trong khi vẫn giữ nguyên tỉ lệ. Trả về một base64 data URL.
 */
export const resizeImage = (imageSrc: string, maxSize: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      let { width, height } = image;

      if (width > height) {
        if (width > maxSize) {
          height = Math.round((height * maxSize) / width);
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = Math.round((width * maxSize) / height);
          height = maxSize;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }
      ctx.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg'));
    };
    image.onerror = (error) => reject(error);
  });
};

/**
 * Cắt ảnh, có thêm tùy chọn chất lượng đầu ra.
 */
export const getCroppedImg = (
  imageSrc: string,
  pixelCrop: Area,
  quality: number = 0.92 // Mặc định chất lượng 92%
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Could not get canvas context"));
        return;
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      // Trả về ảnh với chất lượng được chỉ định
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    image.onerror = (error) => reject(error);
  });
};