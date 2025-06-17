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