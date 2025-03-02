import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FineInfo, AppealOptions } from '@/types';

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

    // Get request body
    const body = await request.json();
    const { fineInfo, appealOptions } = body;

    // Validate required data
    if (!fineInfo || !appealOptions) {
      return NextResponse.json(
        { error: 'Missing required information' },
        { status: 400 }
      );
    }

    // Create a prompt for the AI based on the appeal type
    let appealTypeDetails = '';
    switch (appealOptions.appealType) {
      case 'procedural':
        appealTypeDetails = 'Focus on procedural errors in how the fine was issued or processed. Highlight issues with the documentation, procedure, or notification.';
        break;
      case 'factual':
        appealTypeDetails = 'Dispute the factual circumstances of the fine. Question the accuracy of the alleged violation.';
        break;
      case 'legal':
        appealTypeDetails = 'Emphasize legal arguments and cite relevant laws and regulations that may invalidate the fine.';
        break;
      case 'comprehensive':
      default:
        appealTypeDetails = 'Include procedural, factual, and legal arguments for a comprehensive appeal.';
        break;
    }

    // Include custom details if provided
    const customDetailsPrompt = appealOptions.customDetails 
      ? `\nAlso incorporate these specific details from the appellant: "${appealOptions.customDetails}"`
      : '';

    // Template placeholder handling
    const templatePlaceholders = appealOptions.includeTemplateText
      ? 'Include placeholders for personal information like [Your Name], [Your Address], etc.'
      : 'Use "I" and "my" pronouns without placeholders.';

    const prompt = `
      You are an expert legal assistant specializing in traffic and parking fine appeals.
      
      Generate a formal appeal letter for the following fine:
      
      - Reference/Ticket Number: ${fineInfo.referenceNumber}
      - Date: ${fineInfo.date}
      - Amount: ${fineInfo.amount}
      - Location: ${fineInfo.location}
      - Reason: ${fineInfo.reason}
      - Vehicle: ${fineInfo.vehicle}
      
      Appeal Type: ${appealOptions.appealType}
      ${appealTypeDetails}
      ${customDetailsPrompt}
      
      Format instructions:
      - Write a formal, professional letter.
      - ${templatePlaceholders}
      - Include appropriate greeting and closing.
      - Organize the letter with clear sections.
      - Be polite but firm.
      - Include specific details from the fine information.
      - Keep the letter under 1000 words.
      
      Return only the appeal letter text without any additional explanations.
    `;

    // Call the AI model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const appealText = response.text();

    // Return the generated appeal text
    return NextResponse.json({ appealText });
  } catch (error) {
    console.error('Error generating appeal text:', error);
    
    return NextResponse.json(
      { error: 'An error occurred while generating the appeal text' },
      { status: 500 }
    );
  }
} 