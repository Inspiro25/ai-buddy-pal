export const scrollToBottom = (containerRef: HTMLElement | null) => {
  if (!containerRef) return;
  
  setTimeout(() => {
    containerRef.scrollTo({
      top: containerRef.scrollHeight,
      behavior: 'smooth'
    });
  }, 100);
};

export const triggerHapticFeedback = () => {
  if ('vibrate' in navigator) {
    navigator.vibrate(50); // Light haptic feedback
  }
};