import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Merges CSS class names with Tailwind CSS conflict resolution
 * 
 * @param inputs - Array of class name values to merge
 * @returns Merged and deduped class name string
 * 
 * @description
 * Combines multiple class name inputs using clsx for conditional classes
 * and tailwind-merge for resolving Tailwind CSS conflicts. This ensures
 * that conflicting Tailwind utilities are properly resolved (e.g., if both
 * 'p-4' and 'p-2' are provided, only the last one will be kept).
 * 
 * @example
 * ```typescript
 * // Basic usage
 * cn("bg-red-500", "text-white", "p-4")
 * // Returns: "bg-red-500 text-white p-4"
 * 
 * // With conditional classes
 * cn("base-class", isActive && "active-class", disabled && "disabled-class")
 * 
 * // Resolving conflicts
 * cn("p-4", "p-2") // Returns: "p-2" (last one wins)
 * ```
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
