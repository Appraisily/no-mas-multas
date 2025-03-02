# No Más Multas

A modern web application to help users contest traffic and parking fines by generating customized appeal letters with AI assistance.

## Features

- **Document Analysis**: Upload a traffic or parking fine in PDF or image format
- **AI-Powered Processing**: Extract key information from fine documents using Google Gemini AI
- **Customizable Appeals**: Generate appeal letters with various argument types
- **Professional Templates**: Produce formal appeal letters ready for submission
- **Legal Argument Generator**: Access to legally sound arguments based on violation type with relevant legal references and precedent cases
- **Appeal Quality Analyzer**: Real-time analysis of your appeal text with actionable suggestions and automatic scoring
- **Templates Library**: Save, browse, and apply appeal templates for faster drafting
- **Appeal Success Statistics**: Track and visualize success rates by appeal type and violation reason
- **User Dashboard**: Unified interface to manage appeals, templates, and track statistics
- **Multilingual Support**: Available in English and Spanish
- **Export & Print Options**: Save appeals as text, PDF, or print directly

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **AI Integration**: Google Gemini Flash for document analysis and text generation
- **File Processing**: PDF processing with pdf-lib and pdf-parse, image processing with sharp
- **Internationalization**: Custom language context for multilingual support
- **UI Components**: Custom React components with responsive design
- **State Management**: React Context API for global state management

## Prerequisites

- Node.js 18.17.0 or later
- Google Gemini API key

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/no-mas-multas.git
   cd no-mas-multas
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```
   GOOGLE_GEMINI_API_KEY=your_api_key_here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Usage

1. Upload a fine document (PDF or image)
2. Review the extracted information
3. Select the type of appeal you want to generate
4. Add any custom details relevant to your case
5. Generate the appeal letter
6. Edit, copy, or export the appeal letter as needed
7. Analyze your appeal for quality and improvement suggestions
8. Save successful appeals as templates for future use
9. Track your appeal success rate through the statistics dashboard

## Key Components

### Legal Argument Generator
Access a database of legally sound arguments tailored to specific violation types. Each argument includes:
- Legal code references
- Relevant precedent cases
- Pre-formatted appeal text
- Success rate statistics

### Appeal Quality Analyzer
Get real-time feedback on your appeal with:
- Overall quality score
- Metrics for clarity, persuasiveness, professionalism, and relevance
- Specific suggestions for improvement
- Highlighted strengths of your current text
- Auto-analysis that triggers when you stop typing

### Appeal Templates
Manage a library of reusable appeal templates:
- Save successful appeals as templates
- Browse public and personal templates
- Filter templates by category and search by keywords
- Apply templates with a single click

### Appeal Statistics
Track the effectiveness of your appeals with:
- Success rate breakdowns by appeal type
- Statistics by violation reason
- Visual representation of appeal status
- Most successful argument tracking

### User Dashboard
A central hub for managing all aspects of your appeals:
- Overview of recent activity
- Quick access to pending appeals
- Templates management
- Appeal statistics visualization

## Project Structure

```
no-mas-multas/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app directory
│   │   ├── api/      # API routes
│   │   └── page.tsx  # Main page component
│   ├── components/   # React components
│   │   ├── AppealQualityAnalyzer.tsx  # Appeal quality analysis
│   │   ├── AppealStats.tsx            # Appeal statistics
│   │   ├── AppealTemplates.tsx        # Templates management
│   │   ├── AppealText.tsx             # Appeal text editor
│   │   ├── Dashboard.tsx              # User dashboard
│   │   └── LegalArgumentGenerator.tsx # Legal arguments
│   ├── lib/          # Utility functions and contexts
│   │   └── LanguageContext.tsx        # Multilingual support
│   └── types.ts      # TypeScript types
├── .env.local.example # Environment variables example
└── package.json     # Project dependencies
```

## API Endpoints

- **POST /api/analyze** - Analyzes a fine document and extracts information
- **POST /api/generate-appeal** - Generates an appeal letter based on fine information and options
- **GET /api/legal-arguments** - Retrieves legal arguments for a specific violation type
- **GET /api/templates** - Lists available appeal templates
- **POST /api/templates** - Saves a new appeal template
- **GET /api/stats** - Retrieves appeal statistics

## Future Enhancements

- **User Authentication**: Personal accounts to save appeals and preferences
- **Cloud Storage**: Save appeals in progress and retrieve them later
- **Direct Submission**: Submit appeals directly to authorities where possible
- **Mobile App**: Companion app for on-the-go appeal management
- **Integration with Local Regulations**: Jurisdiction-specific legal arguments

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for powering the document analysis and text generation
- Next.js Team for the excellent framework
- Tailwind CSS for the styling system
