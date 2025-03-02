'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface Regulation {
  id: string;
  code: string;
  title: string;
  description: string;
  fullText: string;
  jurisdiction: string;
  category: string;
  relevance: number; // 0-100
  source: string;
  url?: string;
  lastUpdated: string;
}

interface RegulationFinderProps {
  jurisdiction?: string;
  violationType?: string;
  onSelectRegulation?: (regulation: Regulation) => void;
  initialQuery?: string;
}

export default function RegulationFinder({
  jurisdiction = '',
  violationType = '',
  onSelectRegulation,
  initialQuery = ''
}: RegulationFinderProps) {
  const { t, language } = useLanguage();
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [filteredRegulations, setFilteredRegulations] = useState<Regulation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState(initialQuery);
  const [searchJurisdiction, setSearchJurisdiction] = useState(jurisdiction);
  const [searchViolationType, setSearchViolationType] = useState(violationType);
  const [selectedRegulationId, setSelectedRegulationId] = useState<string | null>(null);
  const [expandedRegulationId, setExpandedRegulationId] = useState<string | null>(null);
  const [availableJurisdictions, setAvailableJurisdictions] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<string[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load available jurisdictions and regulation types
  useEffect(() => {
    // In a real app, these would come from an API
    setAvailableJurisdictions([
      'california',
      'new_york',
      'texas',
      'florida',
      'illinois',
      'pennsylvania',
      'federal'
    ]);

    setAvailableTypes([
      'parking',
      'speeding',
      'red_light',
      'stop_sign',
      'right_of_way',
      'vehicle_registration',
      'driver_license',
      'general'
    ]);
  }, []);

  // Fetch regulations based on filters
  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set a timeout to debounce the search
    searchTimeoutRef.current = setTimeout(() => {
      fetchRegulations();
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, searchJurisdiction, searchViolationType]);

  const fetchRegulations = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real app, this would be an API call with filters
      // await fetch(`/api/regulations?query=${query}&jurisdiction=${searchJurisdiction}&type=${searchViolationType}`);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data based on search parameters
      const mockRegulations = generateMockRegulations(
        searchJurisdiction, 
        searchViolationType, 
        query,
        language
      );
      
      setRegulations(mockRegulations);
      setFilteredRegulations(mockRegulations);
    } catch (err) {
      console.error('Error fetching regulations:', err);
      setError(t('errorFetchingRegulations') || 'Failed to fetch regulations');
    } finally {
      setLoading(false);
    }
  };

  const generateMockRegulations = (
    jurisdiction: string, 
    violationType: string, 
    searchQuery: string,
    lang: string
  ): Regulation[] => {
    // Base set of regulations
    const baseRegulations: Record<string, Regulation[]> = {
      'parking': [
        {
          id: 'ca-park-1',
          code: 'CVC §22500',
          title: lang === 'en' ? 'Prohibited Parking Locations' : 'Ubicaciones Prohibidas para Estacionamiento',
          description: lang === 'en' 
            ? 'Specifies locations where vehicles cannot be parked, including crosswalks, sidewalks, and in front of driveways.'
            : 'Especifica lugares donde los vehículos no pueden estacionarse, incluyendo cruces peatonales, aceras y frente a entradas de vehículos.',
          fullText: lang === 'en'
            ? 'No person shall stop, park, or leave standing any vehicle whether attended or unattended, except when necessary to avoid conflict with other traffic or in compliance with the directions of a peace officer or official traffic control device, in any of the following places: (a) Within an intersection. (b) On a crosswalk. (c) On a sidewalk...'
            : 'Ninguna persona deberá detener, estacionar o dejar parado cualquier vehículo, ya sea atendido o desatendido, excepto cuando sea necesario para evitar conflictos con otro tráfico o en cumplimiento de las indicaciones de un oficial de paz o dispositivo oficial de control de tráfico, en cualquiera de los siguientes lugares: (a) Dentro de una intersección. (b) En un cruce peatonal. (c) En una acera...',
          jurisdiction: 'california',
          category: 'parking',
          relevance: 95,
          source: 'California Vehicle Code',
          url: 'https://leginfo.legislature.ca.gov/faces/codes_displaySection.xhtml?lawCode=VEH&sectionNum=22500',
          lastUpdated: '2023-01-15'
        },
        {
          id: 'ny-park-1',
          code: 'NYC §4-08(d)',
          title: lang === 'en' ? 'Standing and Parking Regulations' : 'Regulaciones de Parada y Estacionamiento',
          description: lang === 'en'
            ? 'New York City parking regulations prohibiting standing or parking in specified places.'
            : 'Regulaciones de estacionamiento de la Ciudad de Nueva York que prohíben detenerse o estacionarse en lugares específicos.',
          fullText: lang === 'en'
            ? 'No person shall stand or park a vehicle: (1) Within a marked crosswalk. (2) Within 20 feet of a crosswalk at an intersection. (3) Alongside or opposite any street excavation or obstruction when stopping, standing, or parking would obstruct traffic...'
            : 'Ninguna persona deberá detenerse o estacionar un vehículo: (1) Dentro de un cruce peatonal marcado. (2) A menos de 20 pies de un cruce peatonal en una intersección. (3) Junto a o enfrente de cualquier excavación u obstrucción de la calle cuando detenerse, pararse o estacionarse obstruiría el tráfico...',
          jurisdiction: 'new_york',
          category: 'parking',
          relevance: 90,
          source: 'NYC Traffic Rules and Regulations',
          url: 'https://www.nyc.gov/html/dot/downloads/pdf/trafrule.pdf',
          lastUpdated: '2022-11-30'
        }
      ],
      'speeding': [
        {
          id: 'tx-speed-1',
          code: 'TTC §545.352',
          title: lang === 'en' ? 'Prima Facie Speed Limits' : 'Límites de Velocidad Prima Facie',
          description: lang === 'en'
            ? 'Establishes speed limits on various types of roads in Texas and requirements for speed measurement.'
            : 'Establece límites de velocidad en varios tipos de caminos en Texas y requisitos para la medición de velocidad.',
          fullText: lang === 'en'
            ? '(a) A speed in excess of the limits established by Subsection (b) or under another provision of this subchapter is prima facie evidence that the speed is not reasonable and prudent and that the speed is unlawful. (b) Unless a special hazard exists that requires a slower speed for compliance with Section 545.351(b), the following speeds are lawful: (1) 30 miles per hour in an urban district...'
            : '(a) Una velocidad que exceda los límites establecidos por la Subsección (b) o bajo otra disposición de este subcapítulo es evidencia prima facie de que la velocidad no es razonable y prudente y que la velocidad es ilegal. (b) A menos que exista un peligro especial que requiera una velocidad más lenta para cumplir con la Sección 545.351(b), las siguientes velocidades son legales: (1) 30 millas por hora en un distrito urbano...',
          jurisdiction: 'texas',
          category: 'speeding',
          relevance: 92,
          source: 'Texas Transportation Code',
          url: 'https://statutes.capitol.texas.gov/Docs/TN/htm/TN.545.htm#545.352',
          lastUpdated: '2023-03-10'
        },
        {
          id: 'fl-speed-1',
          code: 'FSS §316.183',
          title: lang === 'en' ? 'Unlawful Speed' : 'Velocidad Ilegal',
          description: lang === 'en'
            ? 'Florida statutes regarding maximum speed limits and requirements for speed detection devices.'
            : 'Estatutos de Florida sobre límites máximos de velocidad y requisitos para dispositivos de detección de velocidad.',
          fullText: lang === 'en'
            ? '(1) No person shall drive a vehicle on a highway at a speed greater than is reasonable and prudent under the conditions and having regard to the actual and potential hazards then existing. In every event, speed shall be controlled as may be necessary to avoid colliding with any person, vehicle, or other conveyance or object on or entering the highway...'
            : '(1) Ninguna persona conducirá un vehículo en una carretera a una velocidad mayor de lo que es razonable y prudente bajo las condiciones y teniendo en cuenta los peligros reales y potenciales entonces existentes. En todo caso, la velocidad se controlará según sea necesario para evitar colisionar con cualquier persona, vehículo u otro medio de transporte u objeto en la carretera o que ingrese a ella...',
          jurisdiction: 'florida',
          category: 'speeding',
          relevance: 88,
          source: 'Florida Statutes',
          url: 'http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Display_Statute&URL=0300-0399/0316/Sections/0316.183.html',
          lastUpdated: '2022-09-25'
        }
      ],
      'red_light': [
        {
          id: 'il-red-1',
          code: 'ILCS 5/11-306',
          title: lang === 'en' ? 'Traffic Control Signal Legend' : 'Leyenda de Señales de Control de Tráfico',
          description: lang === 'en'
            ? 'Illinois laws regarding traffic signals and procedures for automated traffic enforcement systems.'
            : 'Leyes de Illinois sobre señales de tráfico y procedimientos para sistemas automatizados de aplicación de tráfico.',
          fullText: lang === 'en'
            ? 'Whenever traffic is controlled by traffic-control signals exhibiting different colored lights or color lighted arrows, successively one at a time or in combination, only the colors green, red and yellow shall be used, except for special pedestrian signals, and the lights shall indicate and apply to drivers of vehicles and pedestrians as follows: (a) Green indication. 1. Vehicular traffic facing a circular green signal may proceed straight through or turn right or left...'
            : 'Siempre que el tráfico sea controlado por señales de control de tráfico que exhiban luces de diferentes colores o flechas iluminadas de colores, sucesivamente una a la vez o en combinación, solo se utilizarán los colores verde, rojo y amarillo, excepto para señales especiales para peatones, y las luces indicarán y se aplicarán a los conductores de vehículos y peatones de la siguiente manera: (a) Indicación verde. 1. El tráfico vehicular que enfrenta una señal verde circular puede proceder directamente o girar a la derecha o izquierda...',
          jurisdiction: 'illinois',
          category: 'red_light',
          relevance: 94,
          source: 'Illinois Compiled Statutes',
          url: 'https://www.ilga.gov/legislation/ilcs/fulltext.asp?DocName=062500050K11-306',
          lastUpdated: '2023-02-18'
        }
      ],
      'general': [
        {
          id: 'fed-proc-1',
          code: '28 U.S.C. §2461',
          title: lang === 'en' ? 'Mode of Recovery for Civil Penalties' : 'Modo de Recuperación de Sanciones Civiles',
          description: lang === 'en'
            ? 'Federal procedures for contesting and appealing civil penalties, including traffic violations.'
            : 'Procedimientos federales para impugnar y apelar sanciones civiles, incluidas las infracciones de tráfico.',
          fullText: lang === 'en'
            ? 'Whenever a civil fine, penalty or pecuniary forfeiture is prescribed for the violation of an Act of Congress without specifying the mode of recovery or enforcement thereof, it may be recovered in a civil action. Unless otherwise specified by statute, any civil penalty may be compromised by the proper authority...'
            : 'Siempre que se prescriba una multa civil, sanción o decomiso pecuniario por la violación de una Ley del Congreso sin especificar el modo de recuperación o aplicación del mismo, se puede recuperar en una acción civil. A menos que se especifique lo contrario por estatuto, cualquier sanción civil puede ser comprometida por la autoridad competente...',
          jurisdiction: 'federal',
          category: 'general',
          relevance: 80,
          source: 'United States Code',
          url: 'https://www.law.cornell.edu/uscode/text/28/2461',
          lastUpdated: '2022-08-15'
        }
      ]
    };
    
    // Create a list to hold the regulations we'll return
    let result: Regulation[] = [];
    
    // Add regulations based on violation type
    if (violationType && baseRegulations[violationType]) {
      result = [...result, ...baseRegulations[violationType]];
    } else {
      // If no violation type specified, add all regulations
      Object.values(baseRegulations).forEach(regs => {
        result = [...result, ...regs];
      });
    }
    
    // Filter by jurisdiction if specified
    if (jurisdiction) {
      result = result.filter(reg => reg.jurisdiction === jurisdiction);
    }
    
    // Filter by search query if provided
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(reg => 
        reg.title.toLowerCase().includes(lowerQuery) ||
        reg.description.toLowerCase().includes(lowerQuery) ||
        reg.code.toLowerCase().includes(lowerQuery) ||
        reg.fullText.toLowerCase().includes(lowerQuery)
      );
      
      // Sort by relevance - boost items that match in title or code
      result.sort((a, b) => {
        const aTitleMatch = a.title.toLowerCase().includes(lowerQuery) || a.code.toLowerCase().includes(lowerQuery) ? 20 : 0;
        const bTitleMatch = b.title.toLowerCase().includes(lowerQuery) || b.code.toLowerCase().includes(lowerQuery) ? 20 : 0;
        return (b.relevance + bTitleMatch) - (a.relevance + aTitleMatch);
      });
    } else {
      // Sort by relevance if no search query
      result.sort((a, b) => b.relevance - a.relevance);
    }
    
    return result;
  };

  const handleRegulationSelect = (regulation: Regulation) => {
    setSelectedRegulationId(regulation.id);
    if (onSelectRegulation) {
      onSelectRegulation(regulation);
    }
  };

  const handleExpandRegulation = (id: string) => {
    setExpandedRegulationId(expandedRegulationId === id ? null : id);
  };

  const formatJurisdictionName = (jurisdiction: string): string => {
    switch (jurisdiction) {
      case 'california':
        return t('jurisdictionCalifornia') || 'California';
      case 'new_york':
        return t('jurisdictionNewYork') || 'New York';
      case 'texas':
        return t('jurisdictionTexas') || 'Texas';
      case 'florida':
        return t('jurisdictionFlorida') || 'Florida';
      case 'illinois':
        return t('jurisdictionIllinois') || 'Illinois';
      case 'pennsylvania':
        return t('jurisdictionPennsylvania') || 'Pennsylvania';
      case 'federal':
        return t('jurisdictionFederal') || 'Federal';
      default:
        return jurisdiction.charAt(0).toUpperCase() + jurisdiction.slice(1).replace('_', ' ');
    }
  };

  const formatViolationType = (type: string): string => {
    switch (type) {
      case 'parking':
        return t('violationTypeParking') || 'Parking';
      case 'speeding':
        return t('violationTypeSpeeding') || 'Speeding';
      case 'red_light':
        return t('violationTypeRedLight') || 'Red Light';
      case 'stop_sign':
        return t('violationTypeStopSign') || 'Stop Sign';
      case 'right_of_way':
        return t('violationTypeRightOfWay') || 'Right of Way';
      case 'vehicle_registration':
        return t('violationTypeRegistration') || 'Vehicle Registration';
      case 'driver_license':
        return t('violationTypeDriverLicense') || 'Driver License';
      case 'general':
        return t('violationTypeGeneral') || 'General';
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const highlightQuery = (text: string, query: string): React.ReactNode => {
    if (!query) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    
    return (
      <>
        {parts.map((part, i) => 
          part.toLowerCase() === query.toLowerCase() ? 
            <span key={i} className="bg-yellow-200 dark:bg-yellow-800 px-0.5 rounded">
              {part}
            </span> : part
        )}
      </>
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-all">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
        {t('regulationFinderTitle') || 'Traffic Regulation Finder'}
      </h2>
      
      <div className="mb-6">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {t('regulationFinderDescription') || 'Search for traffic and parking regulations relevant to your case. Add specific regulations to strengthen your appeal.'}
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label htmlFor="search-query" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('searchQuery') || 'Search'}
            </label>
            <input
              id="search-query"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchRegulationsPlaceholder') || 'Search by keyword or code...'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="jurisdiction" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('jurisdiction') || 'Jurisdiction'}
            </label>
            <select
              id="jurisdiction"
              value={searchJurisdiction}
              onChange={(e) => setSearchJurisdiction(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('allJurisdictions') || 'All Jurisdictions'}</option>
              {availableJurisdictions.map((jur) => (
                <option key={jur} value={jur}>
                  {formatJurisdictionName(jur)}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="violation-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('violationType') || 'Violation Type'}
            </label>
            <select
              id="violation-type"
              value={searchViolationType}
              onChange={(e) => setSearchViolationType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">{t('allViolationTypes') || 'All Violation Types'}</option>
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {formatViolationType(type)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Results section */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white">
            {t('results') || 'Results'} 
            {filteredRegulations.length > 0 && ` (${filteredRegulations.length})`}
          </h3>
          
          {loading && (
            <div className="flex items-center text-blue-600 dark:text-blue-400">
              <svg className="animate-spin h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="text-sm">{t('searching') || 'Searching...'}</span>
            </div>
          )}
        </div>
        
        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-md mb-4">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}
        
        {!loading && filteredRegulations.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-gray-100">{t('noRegulationsFound') || 'No regulations found'}</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t('tryDifferentSearch') || 'Try a different search term or filter'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRegulations.map((regulation) => (
              <div key={regulation.id} className={`border rounded-lg overflow-hidden transition-all ${
                selectedRegulationId === regulation.id 
                  ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                  : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
              }`}>
                <div className="p-4 md:px-6">
                  <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white text-base mb-1 flex items-center">
                        <span className="bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-xs px-2 py-1 rounded mr-2 font-mono">
                          {highlightQuery(regulation.code, query)}
                        </span>
                        {highlightQuery(regulation.title, query)}
                      </h4>
                      <div className="flex flex-wrap items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
                        <span className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          {formatJurisdictionName(regulation.jurisdiction)}
                        </span>
                        <span className="inline-flex items-center bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded-full">
                          {formatViolationType(regulation.category)}
                        </span>
                        <span className="inline-flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(regulation.lastUpdated)}
                        </span>
                        <span 
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: `rgba(${regulation.relevance > 75 ? '4, 120, 87' : '202, 138, 4'}, ${
                              regulation.relevance > 75 ? 0.1 : 0.1
                            })`,
                            color: regulation.relevance > 75 ? 'rgb(4, 120, 87)' : 'rgb(202, 138, 4)'
                          }}
                        >
                          {regulation.relevance}% {t('relevance') || 'Relevance'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleExpandRegulation(regulation.id)}
                        className="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        aria-label={expandedRegulationId === regulation.id ? t('collapseDetails') || 'Collapse details' : t('expandDetails') || 'Expand details'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 transition-transform ${expandedRegulationId === regulation.id ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {regulation.url && (
                        <a
                          href={regulation.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors"
                          aria-label={t('viewSource') || 'View source'}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {highlightQuery(regulation.description, query)}
                  </p>
                  
                  {expandedRegulationId === regulation.id && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm">
                      <h5 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t('fullText') || 'Full Text'}:
                      </h5>
                      <div className="bg-gray-50 dark:bg-gray-750 p-3 rounded-md border border-gray-200 dark:border-gray-650 font-mono text-xs leading-relaxed text-gray-800 dark:text-gray-300 overflow-auto max-h-60">
                        {highlightQuery(regulation.fullText, query)}
                      </div>
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{t('source') || 'Source'}:</span> {regulation.source}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                    <button
                      onClick={() => handleRegulationSelect(regulation)}
                      className={`px-4 py-2 rounded-md text-sm transition-colors ${
                        selectedRegulationId === regulation.id
                          ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800'
                          : 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800'
                      }`}
                    >
                      {selectedRegulationId === regulation.id ? (t('regulationSelected') || 'Selected') : (t('useRegulation') || 'Use this regulation')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 