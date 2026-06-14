import { darkColors, AppColors } from '@/constants/colors';

// Starkz AI is a dark-only command-center app — always return the dark palette.
export function useColors(): AppColors {
  return darkColors;
}
