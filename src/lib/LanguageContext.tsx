'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'es';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

interface LanguageProviderProps {
  children: ReactNode;
}

type Translations = {
  [key: string]: {
    [key: string]: string;
  };
};

// Add all translations here
const translations: Translations = {
  en: {
    title: 'No Más Multas',
    subtitle: 'Challenge traffic and parking tickets with AI',
    uploadTitle: 'Upload Your Document',
    dropFiles: 'Drop files here or click to browse',
    fileType: 'Supported formats: PDF, JPG, PNG',
    detailsTitle: 'Fine Details',
    fineReference: 'Reference Number',
    fineDate: 'Date',
    fineAmount: 'Amount',
    fineLocation: 'Location',
    fineReason: 'Violation Reason',
    fineVehicle: 'Vehicle',
    editDetails: 'Edit Details',
    appealOptions: 'Appeal Options',
    appealType: 'Appeal Type',
    appealTypeProcedural: 'Procedural',
    appealTypeFactual: 'Factual',
    appealTypeLegal: 'Legal',
    appealTypeComprehensive: 'Comprehensive',
    includeTemplate: 'Include Template Text',
    customDetails: 'Custom Details (Optional)',
    customDetailsPlaceholder: 'Add any specific details you want to include in your appeal...',
    analyze: 'Analyze Document',
    generate: 'Generate Appeal',
    regenerate: 'Regenerate Appeal',
    loading: 'Processing...',
    errorOccurred: 'An error occurred. Please try again.',
    tryAgain: 'Try again or upload a different document.',
    appealResult: 'Appeal Letter',
    editableText: 'The text below is editable. Make any changes you need.',
    copy: 'Copy',
    copied: 'Copied!',
    export: 'Export',
    print: 'Print',
    download: 'Download',
    downloadTxt: 'Download as .txt',
    downloadDocx: 'Download as .docx',
    appealLetter: 'Appeal Letter',
    home: 'Home',
    about: 'About',
    howItWorks: 'How It Works',
    pricing: 'Pricing',
    contact: 'Contact',
    faq: 'FAQ',
    termsOfService: 'Terms of Service',
    privacyPolicy: 'Privacy Policy',
    disclaimerTitle: 'Disclaimer',
    disclaimer: 'This tool provides assistance but does not constitute legal advice.',
    copyright: 'All rights reserved.',
    languageEn: 'English',
    languageEs: 'Spanish',
    upgrade: 'Upgrade to Premium',
    premiumFeatures: 'Get access to premium features',
    legal: 'Legal',
    cookiePolicy: 'Cookie Policy',
    quickLinks: 'Quick Links',
    appealGeneratorLabel: 'Appeal Generator',
    dashboardLabel: 'Dashboard',
    successAppealGenerated: 'Appeal generated successfully!',
    successDocumentAnalyzed: 'Document analyzed successfully!',
    
    // New translations
    characters: 'characters',
    words: 'words',
    tips: 'Writing Tips',
    tipClear: 'Be clear and concise',
    tipRespectful: 'Maintain a respectful tone',
    tipFacts: 'Focus on facts and evidence',
    tipSpecific: 'Be specific about your case',
    tipProofread: 'Proofread before submitting',
    hideDetails: 'Hide Tips',
    showDetails: 'Show Tips',
    formatBold: 'Bold',
    formatItalic: 'Italic',
    formatUnderline: 'Underline',
    formatUppercase: 'UPPERCASE',
    formatLowercase: 'lowercase',
    
    // Help Assistant
    helpAssistant: 'Help Assistant',
    helpWelcome: 'Hello! How can I help you with No Más Multas today?',
    helpGreeting: 'Hello! I\'m here to help you with challenging your traffic or parking tickets.',
    helpGeneral: 'I can help with uploading documents, analyzing fines, generating appeals, and more. What would you like to know?',
    helpUpload: 'To upload a document, drag and drop your file in the upload area or click to browse your files. I support PDF, JPG, and PNG formats.',
    helpAppeal: 'After uploading and analyzing your document, you can generate an appeal by selecting an appeal type and clicking the "Generate Appeal" button.',
    helpEdit: 'You can edit the fine details by clicking the "Edit" button on the Fine Details card. You can also edit the generated appeal text directly in the text area.',
    helpExport: 'You can export your appeal as a TXT or DOCX file, copy it to clipboard, or print it using the buttons at the bottom of the appeal card.',
    helpThanks: 'You\'re welcome! Feel free to ask if you need anything else.',
    helpFallback: 'I\'m not sure I understand. Could you rephrase your question? I can help with uploading documents, analyzing fines, or generating appeals.',
    helpPlaceholder: 'Type your question here...',
    openHelp: 'Open help assistant',
    closeHelp: 'Close help assistant',
    
    // Guided Tour translations
    tourCompleted: 'Tour completed! You can now start using the app.',
    previous: 'Previous',
    next: 'Next',
    finish: 'Finish',
    tourUploadTitle: 'Upload Your Document',
    tourUploadContent: 'Start by uploading your fine document here. We support PDF, JPG, and PNG formats.',
    tourAnalyzeTitle: 'Analyze Your Document',
    tourAnalyzeContent: 'Once uploaded, click this button to analyze your document and extract fine details.',
    tourOptionsTitle: 'Configure Appeal Options',
    tourOptionsContent: 'Choose the type of appeal and customize any additional details you want to include.',
    tourGenerateTitle: 'Generate Your Appeal',
    tourGenerateContent: 'Click here to generate your appeal based on the fine details and your selected options.',
    tourAppealTitle: 'Review and Edit',
    tourAppealContent: 'Review the generated appeal and make any necessary edits before exporting or printing.',
    
    // Celebration message
    appealSuccessTitle: 'Appeal Generated!',
    appealSuccessMessage: 'Your appeal has been successfully generated. Now you can review and edit it before exporting.',
    
    // New help assistant phrases
    helpTour: 'To start the application tour again, go to your user profile and click "Show Tour".',
    
    // Appeal comparison
    compareVersions: 'Compare Versions',
    originalVersion: 'Original Version',
    modifiedVersion: 'Modified Version',
    differences: 'Differences',
    close: 'Close',
    unsavedChanges: 'You have unsaved changes',
    revertChanges: 'Revert to original',
    
    // Chat assistant voice features
    startListening: 'Start voice input',
    stopListening: 'Stop listening',
    listening: 'Listening...',
    clearChat: 'Clear chat',
    
    // Theme translations
    changeTheme: 'Change theme',
    themeLight: 'Light',
    themeDark: 'Dark',
    themeSystem: 'System',
  },
  es: {
    title: 'No Más Multas',
    subtitle: 'Impugna multas de tráfico y estacionamiento con IA',
    uploadTitle: 'Sube tu documento',
    dropFiles: 'Suelta archivos aquí o haz clic para explorar',
    fileType: 'Formatos compatibles: PDF, JPG, PNG',
    detailsTitle: 'Detalles de la multa',
    fineReference: 'Número de referencia',
    fineDate: 'Fecha',
    fineAmount: 'Importe',
    fineLocation: 'Ubicación',
    fineReason: 'Motivo de la infracción',
    fineVehicle: 'Vehículo',
    editDetails: 'Editar detalles',
    appealOptions: 'Opciones de recurso',
    appealType: 'Tipo de recurso',
    appealTypeProcedural: 'Procesal',
    appealTypeFactual: 'Factual',
    appealTypeLegal: 'Legal',
    appealTypeComprehensive: 'Completo',
    includeTemplate: 'Incluir texto de plantilla',
    customDetails: 'Detalles personalizados (Opcional)',
    customDetailsPlaceholder: 'Añade cualquier detalle específico que quieras incluir en tu recurso...',
    analyze: 'Analizar documento',
    generate: 'Generar recurso',
    regenerate: 'Regenerar recurso',
    loading: 'Procesando...',
    errorOccurred: 'Ha ocurrido un error. Por favor, inténtalo de nuevo.',
    tryAgain: 'Inténtalo de nuevo o sube un documento diferente.',
    appealResult: 'Carta de recurso',
    editableText: 'El texto a continuación es editable. Realiza los cambios que necesites.',
    copy: 'Copiar',
    copied: '¡Copiado!',
    export: 'Exportar',
    print: 'Imprimir',
    download: 'Descargar',
    downloadTxt: 'Descargar como .txt',
    downloadDocx: 'Descargar como .docx',
    appealLetter: 'Carta de Recurso',
    home: 'Inicio',
    about: 'Acerca de',
    howItWorks: 'Cómo funciona',
    pricing: 'Precios',
    contact: 'Contacto',
    faq: 'Preguntas frecuentes',
    termsOfService: 'Términos de servicio',
    privacyPolicy: 'Política de privacidad',
    disclaimerTitle: 'Aviso legal',
    disclaimer: 'Esta herramienta proporciona asistencia pero no constituye asesoramiento legal.',
    copyright: 'Todos los derechos reservados.',
    languageEn: 'Inglés',
    languageEs: 'Español',
    upgrade: 'Actualizar a Premium',
    premiumFeatures: 'Obtén acceso a funciones premium',
    legal: 'Legal',
    cookiePolicy: 'Política de cookies',
    quickLinks: 'Enlaces rápidos',
    appealGeneratorLabel: 'Generador de recursos',
    dashboardLabel: 'Panel de control',
    successAppealGenerated: '¡Recurso generado con éxito!',
    successDocumentAnalyzed: '¡Documento analizado con éxito!',
    
    // New translations
    characters: 'caracteres',
    words: 'palabras',
    tips: 'Consejos de redacción',
    tipClear: 'Sé claro y conciso',
    tipRespectful: 'Mantén un tono respetuoso',
    tipFacts: 'Céntrate en hechos y pruebas',
    tipSpecific: 'Sé específico sobre tu caso',
    tipProofread: 'Revisa antes de enviar',
    hideDetails: 'Ocultar consejos',
    showDetails: 'Mostrar consejos',
    formatBold: 'Negrita',
    formatItalic: 'Cursiva',
    formatUnderline: 'Subrayado',
    formatUppercase: 'MAYÚSCULAS',
    formatLowercase: 'minúsculas',
    
    // Help Assistant
    helpAssistant: 'Asistente de ayuda',
    helpWelcome: '¡Hola! ¿Cómo puedo ayudarte con No Más Multas hoy?',
    helpGreeting: '¡Hola! Estoy aquí para ayudarte a impugnar tus multas de tráfico o estacionamiento.',
    helpGeneral: 'Puedo ayudarte a subir documentos, analizar multas, generar recursos y más. ¿Qué te gustaría saber?',
    helpUpload: 'Para subir un documento, arrastra y suelta tu archivo en el área de carga o haz clic para explorar tus archivos. Compatible con formatos PDF, JPG y PNG.',
    helpAppeal: 'Después de cargar y analizar tu documento, puedes generar un recurso seleccionando un tipo de recurso y haciendo clic en el botón "Generar recurso".',
    helpEdit: 'Puedes editar los detalles de la multa haciendo clic en el botón "Editar" en la tarjeta de Detalles de la multa. También puedes editar el texto del recurso generado directamente en el área de texto.',
    helpExport: 'Puedes exportar tu recurso como un archivo TXT o DOCX, copiarlo al portapapeles o imprimirlo usando los botones en la parte inferior de la tarjeta de recurso.',
    helpThanks: '¡De nada! No dudes en preguntar si necesitas algo más.',
    helpFallback: 'No estoy seguro de entender. ¿Podrías reformular tu pregunta? Puedo ayudarte con la carga de documentos, el análisis de multas o la generación de recursos.',
    helpPlaceholder: 'Escribe tu pregunta aquí...',
    openHelp: 'Abrir asistente de ayuda',
    closeHelp: 'Cerrar asistente de ayuda',
    
    // Guided Tour translations
    tourCompleted: '¡Recorrido completado! Ahora puedes comenzar a usar la aplicación.',
    previous: 'Anterior',
    next: 'Siguiente',
    finish: 'Finalizar',
    tourUploadTitle: 'Sube tu documento',
    tourUploadContent: 'Comienza subiendo tu documento de multa aquí. Admitimos formatos PDF, JPG y PNG.',
    tourAnalyzeTitle: 'Analiza tu documento',
    tourAnalyzeContent: 'Una vez subido, haz clic en este botón para analizar tu documento y extraer los detalles de la multa.',
    tourOptionsTitle: 'Configura las opciones de recurso',
    tourOptionsContent: 'Elige el tipo de recurso y personaliza cualquier detalle adicional que quieras incluir.',
    tourGenerateTitle: 'Genera tu recurso',
    tourGenerateContent: 'Haz clic aquí para generar tu recurso basado en los detalles de la multa y las opciones seleccionadas.',
    tourAppealTitle: 'Revisa y edita',
    tourAppealContent: 'Revisa el recurso generado y realiza las ediciones necesarias antes de exportarlo o imprimirlo.',
    
    // Celebration message
    appealSuccessTitle: '¡Recurso generado!',
    appealSuccessMessage: 'Tu recurso ha sido generado con éxito. Ahora puedes revisarlo y editarlo antes de exportarlo.',
    
    // New help assistant phrases
    helpTour: 'Para iniciar el recorrido de la aplicación de nuevo, ve a tu perfil de usuario y haz clic en "Mostrar recorrido".',
    
    // Appeal comparison
    compareVersions: 'Comparar Versiones',
    originalVersion: 'Versión Original',
    modifiedVersion: 'Versión Modificada',
    differences: 'Diferencias',
    close: 'Cerrar',
    unsavedChanges: 'Tienes cambios sin guardar',
    revertChanges: 'Volver al original',
    
    // Chat assistant voice features
    startListening: 'Iniciar entrada de voz',
    stopListening: 'Detener escucha',
    listening: 'Escuchando...',
    clearChat: 'Limpiar chat',
    
    // Theme translations
    changeTheme: 'Cambiar tema',
    themeLight: 'Claro',
    themeDark: 'Oscuro',
    themeSystem: 'Sistema',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: keyof typeof translations.en) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  
  return context;
} 