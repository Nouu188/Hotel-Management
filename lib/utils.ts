import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function maskEmail(email: string): string {
    const [user, domain] = email.split("@");
    if (user.length <= 2) {
        return `${user[0]}***@${domain}`;
    }
    const first = user[0];
    const last = user[user.length - 1];
    const hidden = "*".repeat(user.length - 2);
    return `${first}${hidden}${last}@${domain}`;
}

export function maskPhoneNumber(phone: string): string {
    if (phone.length < 2) return "*".repeat(phone.length);
    const lastTwo = phone.slice(-2);
    const masked = "*".repeat(phone.length - 2);
    return masked + lastTwo;
}

// Logic resize ảnh ra một hàm tiện ích ---
export const resizeImage = (file: File, targetSize: number): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;

        // --- BƯỚC 1: TÍNH TOÁN KÍCH THƯỚC ĐẦU RA ---
        let targetWidth = width;
        let targetHeight = height;

        if (width > height) {
          if (width > targetSize) {
            targetHeight = Math.round(height * (targetSize / width));
            targetWidth = targetSize;
          }
        } else {
          if (height > targetSize) {
            targetWidth = Math.round(width * (targetSize / height));
            targetHeight = targetSize;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          return reject(new Error("Không thể lấy context của canvas"));
        }

        // Bật tính năng làm mịn ảnh của trình duyệt (nếu có)
        ctx.imageSmoothingQuality = 'high';

        // --- BƯỚC 2: CO NHỎ THEO TỪNG BƯỚC (INCREMENTAL RESIZING) ---
        // Đây là bước quan trọng nhất để đảm bảo độ sắc nét
        
        // Tạo một canvas tạm để thực hiện các bước co nhỏ trung gian
        const oc = document.createElement('canvas');
        const octx = oc.getContext('2d');
        if (!octx) return reject(new Error("Không thể lấy context của canvas tạm"));

        oc.width = img.width * 0.5;
        oc.height = img.height * 0.5;
        octx.drawImage(img, 0, 0, oc.width, oc.height);

        // Lặp lại quá trình co nhỏ 50% cho đến khi kích thước gần với đích
        while (oc.width * 0.5 > targetWidth) {
          octx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, oc.width * 0.5, oc.height * 0.5);
        }

        // Vẽ ảnh từ canvas tạm (đã được co nhỏ) vào canvas cuối cùng
        ctx.drawImage(oc, 0, 0, oc.width, oc.height, 0, 0, targetWidth, targetHeight);

        // --- BƯỚC 3: XUẤT ẢNH ---
        // Chuyển canvas thành chuỗi base64 với định dạng JPEG và chất lượng 90%
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateLabel = (segment: string): string => {
  if (!segment) return "Home"; 

  let label = segment.replace(/-/g, ' ').replace(/_/g, ' ');

  label = label
    .split(' ') 
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
    .join(' '); 

  return label;
};

export const generateSegmentFromLabel = (label: string): string => {
  if (label.trim().toLowerCase() === "home") {
    return "";
  }

  let segment = label.toLowerCase();

  segment = segment.replace(/\s+/g, '-');
  segment = segment.replace(/[^a-z0-9-]/g, '');
  segment = segment.replace(/^-+|-+$/g, '');

  return segment;
};

export function removeLastSegment(pathname: string): string {
  if (!pathname) {
    return "/"; 
  }

  const normalizedPath = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;

  if (normalizedPath === "/" || normalizedPath === "") {
    return "/";
  }

  const lastSlashIndex = normalizedPath.lastIndexOf('/');

  if (lastSlashIndex <= 0) { 
    return "/";
  }

  return normalizedPath.substring(0, lastSlashIndex);
}

export function getLastSegment(pathname: string): string {
  if(!pathname) {
    return "/";
  }

  const pathSegments = pathname.split("/").filter(pathname => pathname);
  const lastSegment = pathSegments[pathSegments.length - 1];

  return lastSegment;
}