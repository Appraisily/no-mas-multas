# No Más Multas

A modern web application to help users contest traffic and parking fines by generating customized appeal letters with AI assistance.

## Features

- **Document Analysis**: Upload a traffic or parking fine in PDF or image format
- **AI-Powered Processing**: Extract key information from fine documents using Google Gemini AI
- **Customizable Appeals**: Generate appeal letters with various argument types
- **Professional Templates**: Produce formal appeal letters ready for submission
- **Multilingual Support**: Available in English and Spanish
- **Export & Print Options**: Save appeals as text or Word documents, or print directly

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **AI Integration**: Google Gemini Flash for document analysis and text generation
- **File Processing**: PDF processing with pdf-lib and pdf-parse, image processing with sharp
- **Internationalization**: Custom language context for multilingual support
- **UI Components**: Custom React components with responsive design

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

## Project Structure

```
no-mas-multas/
├── public/           # Static assets
├── src/
│   ├── app/          # Next.js app directory
│   │   ├── api/      # API routes
│   │   └── page.tsx  # Main page component
│   ├── components/   # React components
│   ├── lib/          # Utility functions and contexts
│   └── types.ts      # TypeScript types
├── .env.local.example # Environment variables example
└── package.json     # Project dependencies
```

## API Endpoints

- **POST /api/analyze** - Analyzes a fine document and extracts information
- **POST /api/generate-appeal** - Generates an appeal letter based on fine information and options

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google Gemini AI for powering the document analysis and text generation
- Next.js Team for the excellent framework
- Tailwind CSS for the styling system
