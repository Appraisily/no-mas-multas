import { NextRequest, NextResponse } from 'next/server';
import { extractTextFromPDF, processImage, isImage, isPDF } from '@/lib/fileUtils';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-flash' });

export const maxDuration = 60; // Set maximum duration to 60 seconds
export const dynamic = 'force-dynamic'; // Force dynamic rendering

export async function POST(request: NextRequest) {
  try {
    // Check for proper API key configuration
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Server configuration error: Missing API key' },
        { status: 500 }
      );
    }

    // Get form data from request
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Process the file based on type
    let content: string;

    if (isPDF(file)) {
      content = await extractTextFromPDF(file);
    } else if (isImage(file)) {
      const imageBase64 = await processImage(file);
      content = `IMAGE_DATA:${imageBase64}`;
    } else {
      return NextResponse.json(
        { error: 'Unsupported file type' },
        { status: 400 }
      );
    }

    // Create a prompt for the AI
    const prompt = `
      You are an expert in analyzing traffic and parking tickets or fines. 
      I will provide you with the text or image of a fine document. 
      Please extract the following information precisely:
      
      1. Reference/Ticket Number
      2. Date of the fine
      3. Amount to pay
      4. Location of the incident
      5. Reason for the fine
      6. Vehicle information
      
      Format the output as a JSON object with the following fields:
      {
        "referenceNumber": "...",
        "date": "...",
        "amount": "...",
        "location": "...",
        "reason": "...",
        "vehicle": "..."
      }
      
      If you can't determine any field, use an empty string.
      Only respond with the JSON object, no additional explanation.
    `;

    // Call the AI model
    let result;
    if (content.startsWith('IMAGE_DATA:')) {
      // Extract base64 data
      const base64Data = content.replace('IMAGE_DATA:', '');
      
      // For images, we need to use multimodal content
      const imageParts = [
        {
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        },
      ];
      
      // Generate content with image
      result = await model.generateContent([prompt, ...imageParts]);
    } else {
      // For text content
      result = await model.generateContent([prompt, content]);
    }

    const response = await result.response;
    const textResult = response.text();
    
    // Try to parse the response as JSON
    let fineInfo;
    try {
      fineInfo = JSON.parse(textResult);
    } catch (e) {
      // If parsing fails, return an error
      return NextResponse.json(
        { error: 'Failed to parse fine information' },
        { status: 500 }
      );
    }

    // Return the extracted information
    return NextResponse.json({ fineInfo });
  } catch (error) {
    console.error('Error processing document:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while processing the document' },
      { status: 500 }
    );
  }
} 