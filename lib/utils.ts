import { clsx, type ClassValue } from "clsx"
import { useSyncExternalStore } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const emptySubscribe = () => () => {};

function getIsMac() {
  return /Mac|iPhone|iPad/.test(navigator.userAgent);
}

function getIsMacServer() {
  return false;
}

/**
 * Returns true on macOS/iOS, false otherwise.
 * Safe for SSR — always returns false on server, then syncs on client.
 */
export function useIsMac(): boolean {
  return useSyncExternalStore(emptySubscribe, getIsMac, getIsMacServer);
}

/**
 * Returns the modifier key label: ⌘ on Mac, Ctrl on others.
 */
export function useModKey(): string {
  const isMac = useIsMac();
  return isMac ? "\u2318" : "Ctrl";
}
