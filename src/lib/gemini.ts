import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { FineData, AppealOptions } from '@/types';

// Initialize the Google Generative AI with your API key
// In production, this should be stored in environment variables
const getGeminiAI = () => {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
  return new GoogleGenerativeAI(apiKey);
};

// Safety settings to ensure appropriate content
const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
  },
];

/**
 * Extract fine information from an image or PDF using Gemini Flash
 */
export async function extractFineInfo(fileContent: string, fileType: string): Promise<FineData> {
  try {
    const genAI = getGeminiAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
      You are an expert in analyzing traffic and parking fine documents. 
      Please extract the following information from this ${fileType} document:
      
      1. Fine Number (if available)
      2. Date of the fine
      3. Amount to pay
      4. Location where the fine was issued
      5. Reason for the fine
      6. License plate number
      7. Vehicle type
      8. Issuing authority
      9. Due date for payment
      10. Any additional relevant information
      
      Format your response as a JSON object with the following keys:
      fineNumber, date, amount, location, reason, licensePlate, vehicleType, authority, dueDate, additionalInfo.
      
      If any information is not available, leave the field empty.
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }, { inlineData: { data: fileContent, mimeType: fileType } }] }],
      safetySettings,
    });

    const response = result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as FineData;
    }
    
    throw new Error('Could not extract structured data from the response');
  } catch (error) {
    console.error('Error extracting fine information:', error);
    throw error;
  }
}

/**
 * Generate appeal text based on fine data and user options
 */
export async function generateAppealText(fineData: FineData, options: AppealOptions): Promise<string> {
  try {
    const genAI = getGeminiAI();
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

    let appealTypePrompt = '';
    switch (options.appealType) {
      case 'procedural':
        appealTypePrompt = 'Focus on procedural errors, such as incorrect information, missing details, or improper notification.';
        break;
      case 'factual':
        appealTypePrompt = 'Focus on factual disputes, such as challenging the circumstances described in the fine.';
        break;
      case 'legal':
        appealTypePrompt = 'Focus on legal arguments, such as citing relevant laws or regulations that may invalidate the fine.';
        break;
      case 'comprehensive':
        appealTypePrompt = 'Provide a comprehensive appeal that includes procedural, factual, and legal arguments.';
        break;
    }

    const customDetailsPrompt = options.customDetails 
      ? `Additionally, consider these specific details provided by the user: ${options.customDetails}` 
      : '';

    const prompt = `
      You are a legal expert specializing in traffic and parking fine appeals. 
      Please generate a formal appeal letter for the following fine:
      
      Fine Number: ${fineData.fineNumber || 'Not provided'}
      Date: ${fineData.date || 'Not provided'}
      Amount: ${fineData.amount || 'Not provided'}
      Location: ${fineData.location || 'Not provided'}
      Reason: ${fineData.reason || 'Not provided'}
      License Plate: ${fineData.licensePlate || 'Not provided'}
      Vehicle Type: ${fineData.vehicleType || 'Not provided'}
      Authority: ${fineData.authority || 'Not provided'}
      Due Date: ${fineData.dueDate || 'Not provided'}
      Additional Info: ${fineData.additionalInfo || 'Not provided'}
      
      ${appealTypePrompt}
      ${customDetailsPrompt}
      
      The appeal should be formal, professional, and persuasive. Include appropriate salutations, references to the fine, 
      clear arguments, a request for the fine to be dismissed or reduced, and a proper closing.
      
      ${options.includeTemplateText ? 'Include placeholders for personal information that the user will need to fill in.' : 'Do not include placeholders for personal information.'}
    `;

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      safetySettings,
    });

    const response = result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating appeal text:', error);
    throw error;
  }
} 