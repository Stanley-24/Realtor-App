
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


/**
 * Get dashboard URL based on user role
 */
export const getDashboardUrl = (role: string): string => {
  const normalizedRole = role.toLowerCase();
  switch (normalizedRole) {
    case "admin":
      return "/dashboard/admin";
    case "agent":
      return "/dashboard/agent";
    case "buyer":
      return "/dashboard/buyer";
    default:
      return "/";
  }
};

