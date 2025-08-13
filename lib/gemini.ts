export async function getRecommendation(imageBase64: string): Promise<string> {
  // Placeholder: In the future, call Gemini with GEMINI_API_KEY and the base64 image
  await new Promise((r) => setTimeout(r, 600));
  return 'Based on your skin analysis, we recommend a hydrating moisturizer and sunscreen daily.';
}
