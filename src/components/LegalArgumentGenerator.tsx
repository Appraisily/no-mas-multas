'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface LegalArgument {
  id: string;
  title: string;
  description: string;
  legalReference: string;
  precedentCase?: string;
  successRate: number;
  appealText: string;
}

interface LegalArgumentGeneratorProps {
  violationType: string;
  jurisdiction?: string;
  onSelectArgument: (argument: string) => void;
}

export default function LegalArgumentGenerator({
  violationType,
  jurisdiction = 'general',
  onSelectArgument
}: LegalArgumentGeneratorProps) {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [arguments, setArguments] = useState<LegalArgument[]>([]);
  const [selectedArgumentId, setSelectedArgumentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fetch legal arguments based on violation type and jurisdiction
  useEffect(() => {
    const fetchLegalArguments = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Simulate API call - in a real app, this would be a fetch to an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock data based on violation type
        const mockArguments: { [key: string]: LegalArgument[] } = {
          'parking': [
            {
              id: 'p1',
              title: language === 'en' ? 'Inadequate Signage' : 'Señalización Inadecuada',
              description: language === 'en' 
                ? 'The parking restriction was not clearly indicated by proper signage as required by local regulations.'
                : 'La restricción de estacionamiento no estaba claramente indicada por la señalización adecuada según lo exigen las regulaciones locales.',
              legalReference: language === 'en' ? 'Municipal Code §12.56.450' : 'Código Municipal §12.56.450',
              precedentCase: 'Martinez v. City of Los Angeles (2018)',
              successRate: 78,
              appealText: language === 'en' 
                ? 'I am contesting this parking citation on the grounds that the parking restriction was not properly posted as required by Municipal Code §12.56.450, which states that "No person shall be cited for a parking violation if proper signage is not visible from the parking location." In this case, the signage was [obscured/missing/damaged/unclear], making it impossible for a reasonable person to be aware of the restriction. The precedent set in Martinez v. City of Los Angeles (2018) established that municipalities have the burden of ensuring clear and visible parking signage.'
                : 'Estoy impugnando esta multa de estacionamiento porque la restricción de estacionamiento no estaba correctamente señalizada según lo requiere el Código Municipal §12.56.450, que establece que "Ninguna persona será citada por una infracción de estacionamiento si la señalización adecuada no es visible desde el lugar de estacionamiento." En este caso, la señalización estaba [oculta/faltante/dañada/poco clara], lo que hacía imposible que una persona razonable conociera la restricción. El precedente establecido en Martínez v. Ciudad de Los Ángeles (2018) determinó que los municipios tienen la responsabilidad de garantizar una señalización de estacionamiento clara y visible.'
            },
            {
              id: 'p2',
              title: language === 'en' ? 'Malfunctioning Meter' : 'Parquímetro Defectuoso',
              description: language === 'en' 
                ? 'The parking meter was not functioning properly, preventing payment despite reasonable attempts.'
                : 'El parquímetro no funcionaba correctamente, lo que impedía el pago a pesar de intentos razonables.',
              legalReference: language === 'en' ? 'Vehicle Code §22508' : 'Código de Vehículos §22508',
              successRate: 82,
              appealText: language === 'en' 
                ? 'I respectfully contest this citation on the basis that the parking meter (Number: [METER ID]) was malfunctioning at the time of the alleged violation. Vehicle Code §22508 specifically states that "No person shall be charged with a violation of any parking regulation if the parking meter is inoperative." I made multiple attempts to pay using [credit card/coins/mobile app], but the meter [error message/would not accept payment/displayed out of order]. I took reasonable steps to comply with payment requirements including [describe any additional steps taken].'
                : 'Impugno respetuosamente esta citación debido a que el parquímetro (Número: [ID DEL PARQUÍMETRO]) no funcionaba correctamente en el momento de la supuesta infracción. El Código de Vehículos §22508 establece específicamente que "Ninguna persona será acusada de una infracción de estacionamiento si el parquímetro no está operativo." Realicé múltiples intentos de pago utilizando [tarjeta de crédito/monedas/aplicación móvil], pero el parquímetro [mensaje de error/no aceptaba el pago/mostraba fuera de servicio]. Tomé medidas razonables para cumplir con los requisitos de pago, incluyendo [describir cualquier paso adicional tomado].'
            }
          ],
          'speed': [
            {
              id: 's1',
              title: language === 'en' ? 'Radar Calibration Issues' : 'Problemas de Calibración del Radar',
              description: language === 'en' 
                ? 'Speed detection equipment must be properly calibrated and certified according to legal standards.'
                : 'Los equipos de detección de velocidad deben estar correctamente calibrados y certificados según los estándares legales.',
              legalReference: language === 'en' ? 'Traffic Enforcement Act §453.6' : 'Ley de Control de Tráfico §453.6',
              precedentCase: 'State v. Jenkins (2019)',
              successRate: 65,
              appealText: language === 'en' 
                ? 'I am contesting this speeding citation on the grounds that the radar/lidar equipment used may not have been properly calibrated as required by Traffic Enforcement Act §453.6. This law requires that all speed detection equipment be calibrated every 30 days and certified by a licensed technician. In State v. Jenkins (2019), the court established that the burden is on the enforcement agency to provide documentation of proper calibration when challenged. I formally request evidence of the proper calibration and certification of the device used in this citation (Device ID: [DEVICE ID if known]).'
                : 'Estoy impugnando esta citación por exceso de velocidad porque es posible que el equipo de radar/lidar utilizado no haya sido calibrado correctamente según lo exige la Ley de Control de Tráfico §453.6. Esta ley requiere que todos los equipos de detección de velocidad sean calibrados cada 30 días y certificados por un técnico licenciado. En Estado v. Jenkins (2019), el tribunal estableció que la carga de proporcionar documentación de la calibración adecuada recae en la agencia de aplicación cuando se cuestiona. Solicito formalmente evidencia de la calibración y certificación adecuada del dispositivo utilizado en esta citación (ID del dispositivo: [ID DEL DISPOSITIVO si se conoce]).'
            },
            {
              id: 's2',
              title: language === 'en' ? 'Emergency Circumstances' : 'Circunstancias de Emergencia',
              description: language === 'en' 
                ? 'Temporary speed limit violations may be excused under certain emergency conditions.'
                : 'Las infracciones temporales del límite de velocidad pueden ser excusadas bajo ciertas condiciones de emergencia.',
              legalReference: language === 'en' ? 'Vehicle Code §21055' : 'Código de Vehículos §21055',
              successRate: 58,
              appealText: language === 'en' 
                ? 'I am requesting dismissal of this citation due to emergency circumstances that necessitated temporary exceeding of the posted speed limit as permitted under Vehicle Code §21055. At the time of the alleged violation, I was [describe emergency situation: e.g., transporting someone requiring urgent medical attention/responding to a family emergency/etc.]. The statute recognizes that certain emergency situations may justify temporary violations when public safety is not unduly compromised. I have attached documentation supporting this emergency claim [if available: e.g., medical records/emergency room visit confirmation/etc.].'
                : 'Solicito la desestimación de esta citación debido a circunstancias de emergencia que necesitaron el exceso temporal del límite de velocidad permitido según el Código de Vehículos §21055. En el momento de la supuesta infracción, estaba [describir situación de emergencia: por ejemplo, transportando a alguien que requería atención médica urgente/respondiendo a una emergencia familiar/etc.]. La ley reconoce que ciertas situaciones de emergencia pueden justificar infracciones temporales cuando la seguridad pública no se ve indebidamente comprometida. He adjuntado documentación que respalda esta afirmación de emergencia [si está disponible: por ejemplo, registros médicos/confirmación de visita a sala de emergencias/etc.].'
            }
          ],
          'redlight': [
            {
              id: 'r1',
              title: language === 'en' ? 'Yellow Light Timing' : 'Tiempo de Luz Amarilla',
              description: language === 'en' 
                ? 'Yellow traffic signals must be timed according to specific engineering standards.'
                : 'Las señales de tráfico amarillas deben cronometrarse según estándares de ingeniería específicos.',
              legalReference: language === 'en' ? 'Federal Highway Administration Standards 4D.26' : 'Estándares de la Administración Federal de Carreteras 4D.26',
              precedentCase: 'Williams v. Department of Transportation (2020)',
              successRate: 74,
              appealText: language === 'en' 
                ? 'I am contesting this red light citation on the basis that the yellow light at this intersection ([INTERSECTION NAME]) may not conform to the Federal Highway Administration Standards 4D.26, which requires yellow light timing to be calculated based on the posted speed limit according to the formula: Yellow Time (in seconds) = 1 + [Speed Limit (mph) ÷ 10]. For a speed limit of [SPEED LIMIT] mph, the yellow light should be displayed for at least [CALCULATE: 1 + (Speed Limit ÷ 10)] seconds. In Williams v. Department of Transportation (2020), the court established that citations issued at intersections with improperly timed yellow lights must be dismissed.'
                : 'Estoy impugnando esta citación de luz roja porque la luz amarilla en esta intersección ([NOMBRE DE LA INTERSECCIÓN]) puede no cumplir con los Estándares de la Administración Federal de Carreteras 4D.26, que requiere que el tiempo de la luz amarilla se calcule en función del límite de velocidad publicado según la fórmula: Tiempo Amarillo (en segundos) = 1 + [Límite de Velocidad (mph) ÷ 10]. Para un límite de velocidad de [LÍMITE DE VELOCIDAD] mph, la luz amarilla debería mostrarse durante al menos [CALCULAR: 1 + (Límite de Velocidad ÷ 10)] segundos. En Williams v. Departamento de Transporte (2020), el tribunal estableció que las citaciones emitidas en intersecciones con luces amarillas mal cronometradas deben ser desestimadas.'
            }
          ],
          'general': [
            {
              id: 'g1',
              title: language === 'en' ? 'Procedural Error' : 'Error de Procedimiento',
              description: language === 'en' 
                ? 'Citing officers must follow specific procedural requirements when issuing tickets.'
                : 'Los oficiales que emiten citaciones deben seguir requisitos procedimentales específicos.',
              legalReference: language === 'en' ? 'Traffic Procedures Manual §8.4.2' : 'Manual de Procedimientos de Tráfico §8.4.2',
              successRate: 71,
              appealText: language === 'en' 
                ? 'I am respectfully requesting dismissal of this citation due to procedural errors in its issuance according to Traffic Procedures Manual §8.4.2. This section requires that all citations include [complete officer identification/proper vehicle description/accurate location details/time of observation]. This citation contains the following procedural error(s): [DESCRIBE SPECIFIC ERROR(S)]. These requirements are not merely technical but ensure due process and proper documentation of alleged violations.'
                : 'Solicito respetuosamente la desestimación de esta citación debido a errores de procedimiento en su emisión según el Manual de Procedimientos de Tráfico §8.4.2. Esta sección requiere que todas las citaciones incluyan [identificación completa del oficial/descripción correcta del vehículo/detalles precisos de ubicación/hora de observación]. Esta citación contiene el siguiente(s) error(es) de procedimiento: [DESCRIBIR ERROR(ES) ESPECÍFICO(S)]. Estos requisitos no son meramente técnicos, sino que garantizan el debido proceso y la documentación adecuada de las supuestas infracciones.'
            }
          ]
        };
        
        // Get arguments based on violation type or fallback to general
        const relevantArgs = mockArguments[violationType] || mockArguments['general'];
        setArguments(relevantArgs);
      } catch (err) {
        console.error('Error fetching legal arguments:', err);
        setError(language === 'en' ? 'Failed to load legal arguments' : 'Error al cargar argumentos legales');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLegalArguments();
  }, [violationType, jurisdiction, language]);

  const handleSelectArgument = (id: string) => {
    setSelectedArgumentId(id);
    const selectedArg = arguments.find(arg => arg.id === id);
    if (selectedArg) {
      onSelectArgument(selectedArg.appealText);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        {t('legalArgumentsTitle')}
      </h3>
      
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {isLoading ? (
        <div className="animate-pulse space-y-4">
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
          <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {arguments.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-4">
              {t('noArgumentsFound')}
            </p>
          ) : (
            arguments.map((arg) => (
              <div 
                key={arg.id}
                className={`border rounded-lg p-4 transition-all ${
                  selectedArgumentId === arg.id 
                    ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                    : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-gray-900 dark:text-white">{arg.title}</h4>
                  <span 
                    className="text-sm font-semibold px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                  >
                    {arg.successRate}% {t('successRate')}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {arg.description}
                </p>
                
                <div className="flex flex-wrap gap-2 text-xs mb-4">
                  <span className="bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                    {arg.legalReference}
                  </span>
                  
                  {arg.precedentCase && (
                    <span className="bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-1 rounded">
                      {arg.precedentCase}
                    </span>
                  )}
                </div>
                
                <button
                  onClick={() => handleSelectArgument(arg.id)}
                  className={`w-full py-2 px-4 rounded-md text-center transition-colors ${
                    selectedArgumentId === arg.id
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {selectedArgumentId === arg.id ? t('argumentSelected') : t('useThisArgument')}
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
} 