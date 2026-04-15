type ClassValue = string | undefined | null | false;

export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(" ");
}
