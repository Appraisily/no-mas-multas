'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';

interface Template {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  successRate?: number;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

interface AppealTemplatesProps {
  onApplyTemplate: (content: string) => void;
  currentAppealText?: string;
  appealType?: string;
}

export default function AppealTemplates({
  onApplyTemplate,
  currentAppealText = '',
  appealType = 'comprehensive'
}: AppealTemplatesProps) {
  const { t } = useLanguage();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState<'my' | 'public'>('my');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTemplate, setNewTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    content: currentAppealText,
    category: appealType,
    tags: [],
    isPublic: false
  });
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  // Mock data - in a real app, this would come from an API
  useEffect(() => {
    const mockTemplates: Template[] = [
      {
        id: '1',
        name: 'Basic Procedural Appeal',
        description: 'A template for challenging the procedure of a ticket issuance.',
        content: 'I am writing to appeal the traffic citation [REFERENCE] issued on [DATE]. I believe this citation was issued improperly due to procedural errors in the ticketing process...',
        category: 'procedural',
        tags: ['procedure', 'basic'],
        isPublic: true,
        successRate: 78,
        createdAt: '2023-11-15',
        updatedAt: '2023-11-15',
        createdBy: 'system'
      },
      {
        id: '2',
        name: 'Comprehensive Parking Appeal',
        description: 'A detailed template for appealing parking violations.',
        content: 'I am writing to contest the parking violation [REFERENCE] that was issued on [DATE] at [LOCATION]. I believe this ticket was issued in error for the following reasons...',
        category: 'parking',
        tags: ['parking', 'comprehensive'],
        isPublic: true,
        successRate: 82,
        createdAt: '2023-11-20',
        updatedAt: '2023-12-05',
        createdBy: 'system'
      },
      {
        id: '3',
        name: 'Legal Basis Appeal',
        description: 'Appeal template focusing on legal arguments.',
        content: 'I am writing to contest citation [REFERENCE] issued on [DATE]. According to Municipal Code Section [XXX], the cited violation requires proof of [YYY], which is lacking in this case...',
        category: 'legal',
        tags: ['legal', 'code'],
        isPublic: true,
        successRate: 65,
        createdAt: '2023-12-01',
        updatedAt: '2023-12-01',
        createdBy: 'system'
      }
    ];
    
    setTemplates(mockTemplates);
    setFilteredTemplates(mockTemplates);
  }, []);

  useEffect(() => {
    filterTemplates();
  }, [searchTerm, selectedTab, templates]);

  const filterTemplates = () => {
    let filtered = templates;
    
    // Filter by tab
    if (selectedTab === 'my') {
      filtered = filtered.filter(t => t.createdBy === 'user'); // In real app, check against actual user ID
    } else {
      filtered = filtered.filter(t => t.isPublic);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(term) || 
        t.description.toLowerCase().includes(term) ||
        t.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredTemplates(filtered);
  };

  const handleSaveTemplate = () => {
    if (!newTemplate.name || !newTemplate.content) {
      setNotification({
        message: 'Template name and content are required',
        type: 'error'
      });
      return;
    }
    
    // In a real app, this would be an API call
    const newTemplateComplete: Template = {
      id: `user-${Date.now()}`,
      name: newTemplate.name || '',
      description: newTemplate.description || '',
      content: newTemplate.content || currentAppealText,
      category: newTemplate.category || appealType,
      tags: newTemplate.tags || [],
      isPublic: newTemplate.isPublic || false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      createdBy: 'user' // In real app, use actual user ID
    };
    
    setTemplates([...templates, newTemplateComplete]);
    setNotification({
      message: t('templateSaved'),
      type: 'success'
    });
    setIsModalOpen(false);
    
    // Reset form
    setNewTemplate({
      name: '',
      description: '',
      content: currentAppealText,
      category: appealType,
      tags: [],
      isPublic: false
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleApplyTemplate = (template: Template) => {
    onApplyTemplate(template.content);
    setNotification({
      message: t('templateApplied'),
      type: 'success'
    });
    
    // Clear notification after 3 seconds
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleDeleteTemplate = (id: string) => {
    if (confirm(t('confirmDeleteTemplate'))) {
      // In a real app, this would be an API call
      setTemplates(templates.filter(t => t.id !== id));
      setNotification({
        message: t('templateDeleted'),
        type: 'success'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categoryMap: {[key: string]: string} = {
      'procedural': t('categoryProcedural'),
      'factual': t('categoryFactual'),
      'legal': t('categoryLegal'),
      'comprehensive': t('categoryComprehensive'),
      'parking': t('categoryParking'),
      'speed': t('categorySpeed'),
      'redlight': t('categoryRedLight'),
      'other': t('categoryOther')
    };
    
    return categoryMap[category] || category;
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 transition-all">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
          {t('templatesLibrary')}
        </h3>
        
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 mr-2" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {t('saveAsTemplate')}
        </button>
      </div>
      
      {notification && (
        <div className={`mb-4 p-2 rounded ${notification.type === 'success' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
          {notification.message}
        </div>
      )}
      
      <div className="mb-4">
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setSelectedTab('my')}
            className={`px-4 py-2 rounded-md transition-colors ${selectedTab === 'my' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {t('myTemplates')}
          </button>
          <button
            onClick={() => setSelectedTab('public')}
            className={`px-4 py-2 rounded-md transition-colors ${selectedTab === 'public' 
              ? 'bg-purple-600 text-white' 
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
          >
            {t('publicTemplates')}
          </button>
        </div>
        
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t('searchTemplates')}
            className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute left-3 top-3 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTemplates.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            {selectedTab === 'my' 
              ? 'You haven\'t created any templates yet. Save your appeals as templates to reuse them later.' 
              : 'No public templates found matching your search.'}
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <div 
              key={template.id} 
              className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <div className="flex justify-between">
                <h4 className="font-medium text-gray-900 dark:text-white">{template.name}</h4>
                {template.successRate && (
                  <span className="text-sm text-green-600 dark:text-green-400 flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-4 w-4 mr-1" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {t('templateSuccess')} {template.successRate}%
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-1 rounded">
                  {getCategoryLabel(template.category)}
                </span>
                
                {template.tags.map((tag, i) => (
                  <span 
                    key={i} 
                    className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex justify-between mt-3">
                <button
                  onClick={() => handleApplyTemplate(template)}
                  className="text-sm px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                >
                  {t('applyTemplate')}
                </button>
                
                {template.createdBy === 'user' && (
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="text-sm px-3 py-1 text-red-600 hover:text-red-700 transition-colors"
                  >
                    {t('deleteTemplate')}
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Save Template Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              {t('saveAsTemplate')}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('templateName')} *
                </label>
                <input
                  type="text"
                  value={newTemplate.name || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, name: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('templateDescription')}
                </label>
                <textarea
                  value={newTemplate.description || ''}
                  onChange={(e) => setNewTemplate({...newTemplate, description: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 h-20"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('templateCategory')}
                </label>
                <select
                  value={newTemplate.category || appealType}
                  onChange={(e) => setNewTemplate({...newTemplate, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="procedural">{t('categoryProcedural')}</option>
                  <option value="factual">{t('categoryFactual')}</option>
                  <option value="legal">{t('categoryLegal')}</option>
                  <option value="comprehensive">{t('categoryComprehensive')}</option>
                  <option value="parking">{t('categoryParking')}</option>
                  <option value="speed">{t('categorySpeed')}</option>
                  <option value="redlight">{t('categoryRedLight')}</option>
                  <option value="other">{t('categoryOther')}</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {t('templateTags')}
                </label>
                <input
                  type="text"
                  value={(newTemplate.tags || []).join(', ')}
                  onChange={(e) => setNewTemplate({...newTemplate, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
                  placeholder="tag1, tag2, tag3"
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Separate tags with commas
                </p>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={newTemplate.isPublic || false}
                  onChange={(e) => setNewTemplate({...newTemplate, isPublic: e.target.checked})}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Make this template public
                </label>
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTemplate}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 