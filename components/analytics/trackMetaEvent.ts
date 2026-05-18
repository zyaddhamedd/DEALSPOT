export const trackMetaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('track', eventName, params);
  }
};
