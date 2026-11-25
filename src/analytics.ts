/** Send GA4 events without interrupting interactions when analytics is blocked. */
export function trackEvent(name: string, parameters: Record<string, string | number | boolean> = {}): void {
  const gtag = (window as Window & { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag === "function") gtag("event", name, parameters);
}
