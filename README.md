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
- **Dark Mode Support**: Fully customizable theme system with light, dark, and system preference options
- **Export & Print Options**: Save appeals as text, PDF, or print directly
- **Enhanced Accessibility**: Keyboard shortcuts, accessible form components, and a floating help system
- **Floating Help Button**: Quick access to guides, tutorials, and frequently asked questions
- **AI-Powered Legal Argument Generator**: Create custom legal arguments based on your specific traffic violation scenario.
- **Multi-language Support**: Available in both English and Spanish to serve a wider community.
- **Appeal Template System**: Access professionally formatted legal appeal templates.
- **Appeal Tracking**: Monitor the status and progress of your submitted appeals.
- **Dark Mode Support**: Comfortable viewing experience in any lighting condition.
- **Accessibility Focused**: Designed to be accessible for all users, including those with disabilities.
- **Fine Calculator**: Estimate potential fines and calculate potential savings from successful appeals.
- **Legal Deadline Tracker**: Keep track of important dates and deadlines for your traffic ticket appeals, ensuring you never miss a crucial deadline with visual reminders and priority settings.
- **Toast Notification System**: Get real-time feedback on your actions with an accessible notification system.

## Tech Stack

- **Frontend**: Next.js 15, React 18, Tailwind CSS
- **AI Integration**: Google Gemini Flash for document analysis and text generation
- **File Processing**: PDF processing with pdf-lib and pdf-parse, image processing with sharp
- **Internationalization**: Custom language context for multilingual support
- **Theme System**: Context-based theme management with system preference detection
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

### Theme System
A comprehensive theme management system with multiple options:
- Light mode for bright environments
- Dark mode for reduced eye strain and low-light environments
- System preference detection for automatic switching
- Persistent theme preferences saved to cookies
- Mobile-optimized interface for theme switching
- Accessible design with proper color contrast in both themes

### Enhanced Accessibility
Multiple features to improve application accessibility:
- Keyboard shortcuts for quick navigation and common actions
- Accessible form components with proper labeling and ARIA attributes
- Floating help button for quick access to assistance
- Screen reader friendly UI components with semantic HTML
- High contrast mode support for visually impaired users
- Focus management for keyboard navigation

### Floating Help System
A context-aware help system that provides:
- Quick access to guides and tutorials
- Demo mode for new users
- Frequently asked questions
- Responsive design for all device sizes
- Keyboard accessible interface
- Toast notifications for user feedback

### Toast Notification System
A flexible notification system for providing feedback to users:
- Success, error, warning, and info notification types
- Customizable duration and styling
- Accessible design with proper ARIA attributes
- Automatic dismissal with manual close option
- Animated entrance and exit for better UX
- Context-based messaging

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

The project follows a clean, modular structure:

- `src/`: Main source code directory
  - `app/`: Next.js app directory
    - `page.tsx`: Home page
    - `layout.tsx`: Root layout component
    - `appeal/`: Appeal creation pages
    - `dashboard/`: User dashboard pages
    - `deadlines/`: Legal deadline tracker pages
  - `components/`: Reusable React components
    - `AccessibleInput.tsx`: Accessible form input components
    - `AppealOptionsForm.tsx`: Form for selecting appeal options
    - `FloatingHelpButton.tsx`: Help button with quick access to resources
    - `Navigation.tsx`: Main navigation bar
    - `ThemeSwitcher.tsx`: Component for switching between light/dark themes
    - `ToastNotification.tsx`: Toast notification system
    - `KeyboardShortcutsDialog.tsx`: Dialog displaying keyboard shortcuts
    - `FineCalculator.tsx`: Tool to calculate fines and potential savings
    - `DeadlineTracker.tsx`: Component to track legal deadlines for appeals
  - `lib/`: Utility functions and context providers
    - `ThemeContext.tsx`: Context for theme management
    - `LanguageContext.tsx`: Context for language/localization
    - `useKeyboardShortcuts.tsx`: Hook for keyboard shortcuts functionality
  - `styles/`: CSS and styling files
  - `public/`: Static assets

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
