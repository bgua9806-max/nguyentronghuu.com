export const notifyIndexNow = async (url: string) => {
  try {
    const response = await fetch('/api/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    if (!response.ok) {
      console.warn('IndexNow notification was not accepted:', response.status);
    }
  } catch (error) {
    console.warn('IndexNow notification failed:', error);
  }
};
