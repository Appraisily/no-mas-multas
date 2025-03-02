'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Input, Select } from './AccessibleInput';
import { useToast } from './ToastNotification';

interface Deadline {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  completed: boolean;
  category: 'citation' | 'appeal' | 'hearing' | 'payment' | 'other';
  priority: 'high' | 'medium' | 'low';
}

export default function DeadlineTracker() {
  const { t } = useLanguage();
  const { showToast } = useToast();
  const [deadlines, setDeadlines] = useState<Deadline[]>([]);
  const [newDeadline, setNewDeadline] = useState<{
    title: string;
    description: string;
    dueDate: string;
    category: 'citation' | 'appeal' | 'hearing' | 'payment' | 'other';
    priority: 'high' | 'medium' | 'low';
  }>({
    title: '',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    category: 'citation',
    priority: 'medium'
  });
  
  const [filter, setFilter] = useState<{
    category: string;
    completed: string;
  }>({
    category: 'all',
    completed: 'pending'
  });

  // Load deadlines from localStorage on component mount
  useEffect(() => {
    const savedDeadlines = localStorage.getItem('deadlines');
    if (savedDeadlines) {
      try {
        const parsed = JSON.parse(savedDeadlines);
        // Convert string dates back to Date objects
        const processedDeadlines = parsed.map((deadline: any) => ({
          ...deadline,
          dueDate: new Date(deadline.dueDate)
        }));
        setDeadlines(processedDeadlines);
      } catch (error) {
        console.error('Failed to parse saved deadlines:', error);
      }
    }
  }, []);

  // Save deadlines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('deadlines', JSON.stringify(deadlines));
  }, [deadlines]);

  const addDeadline = () => {
    if (!newDeadline.title.trim()) {
      showToast(t('deadlineTitleRequired') || 'Please enter a deadline title', 'warning');
      return;
    }

    const deadline: Deadline = {
      id: Date.now().toString(),
      title: newDeadline.title.trim(),
      description: newDeadline.description.trim(),
      dueDate: new Date(newDeadline.dueDate),
      completed: false,
      category: newDeadline.category,
      priority: newDeadline.priority
    };

    setDeadlines(prev => [...prev, deadline]);
    setNewDeadline({
      title: '',
      description: '',
      dueDate: new Date().toISOString().split('T')[0],
      category: 'citation',
      priority: 'medium'
    });

    showToast(t('deadlineAdded') || 'Deadline added successfully', 'success');
  };

  const toggleDeadlineStatus = (id: string) => {
    setDeadlines(prev => 
      prev.map(deadline => 
        deadline.id === id 
          ? { ...deadline, completed: !deadline.completed }
          : deadline
      )
    );
  };

  const deleteDeadline = (id: string) => {
    setDeadlines(prev => prev.filter(deadline => deadline.id !== id));
    showToast(t('deadlineDeleted') || 'Deadline deleted', 'info');
  };

  // Calculate days remaining from today to the deadline date
  const getDaysRemaining = (dueDate: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);
    
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  // Get badge color based on days remaining
  const getStatusBadge = (dueDate: Date, completed: boolean) => {
    if (completed) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
          {t('completed') || 'Completed'}
        </span>
      );
    }

    const daysRemaining = getDaysRemaining(dueDate);
    
    if (daysRemaining < 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {t('overdue') || 'Overdue'}
        </span>
      );
    } else if (daysRemaining === 0) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
          {t('dueToday') || 'Due Today'}
        </span>
      );
    } else if (daysRemaining <= 3) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
          {t('dueInDays', { days: daysRemaining }) || `Due in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`}
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
          {t('dueInDays', { days: daysRemaining }) || `Due in ${daysRemaining} day${daysRemaining === 1 ? '' : 's'}`}
        </span>
      );
    }
  };

  // Get priority badge
  const getPriorityBadge = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
            {t('priorityHigh') || 'High'}
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
            {t('priorityMedium') || 'Medium'}
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            {t('priorityLow') || 'Low'}
          </span>
        );
      default:
        return null;
    }
  };

  // Get category badge
  const getCategoryBadge = (category: string) => {
    const categoryColors: Record<string, string> = {
      citation: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      appeal: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      hearing: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      payment: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${categoryColors[category] || categoryColors.other}`}>
        {t(`category${category.charAt(0).toUpperCase() + category.slice(1)}`) || category.charAt(0).toUpperCase() + category.slice(1)}
      </span>
    );
  };

  // Get filtered deadlines
  const getFilteredDeadlines = () => {
    return deadlines
      .filter(deadline => {
        // Filter by category
        if (filter.category !== 'all' && deadline.category !== filter.category) {
          return false;
        }
        
        // Filter by completion status
        if (filter.completed === 'pending' && deadline.completed) {
          return false;
        }
        if (filter.completed === 'completed' && !deadline.completed) {
          return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // First sort by completion status
        if (a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }
        
        // Then sort uncompleted items by due date
        if (!a.completed) {
          return a.dueDate.getTime() - b.dueDate.getTime();
        }
        
        // Sort completed items by most recently completed (would need to track completion date)
        return 0;
      });
  };

  const formatDateForDisplay = (date: Date) => {
    // Using toLocaleDateString for localized date format
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {t('deadlineTracker') || 'Legal Deadline Tracker'}
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          {t('deadlineTrackerDescription') || 'Keep track of important dates and deadlines for your traffic ticket appeals.'}
        </p>
      </div>

      {/* Add New Deadline Form */}
      <div className="p-6 bg-gray-50 dark:bg-gray-750 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          {t('addNewDeadline') || 'Add New Deadline'}
        </h3>
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Input
            id="deadlineTitle"
            label={t('deadlineTitle') || 'Title'}
            value={newDeadline.title}
            onChange={(e) => setNewDeadline(prev => ({ ...prev, title: e.target.value }))}
            placeholder={t('deadlineTitlePlaceholder') || 'e.g., Submit Appeal Form'}
            required
          />
          
          <Input
            id="deadlineDueDate"
            label={t('dueDate') || 'Due Date'}
            type="date"
            value={newDeadline.dueDate}
            onChange={(e) => setNewDeadline(prev => ({ ...prev, dueDate: e.target.value }))}
            min={new Date().toISOString().split('T')[0]}
            required
          />
          
          <Select
            id="deadlineCategory"
            label={t('category') || 'Category'}
            value={newDeadline.category}
            onChange={(e) => setNewDeadline(prev => ({ ...prev, category: e.target.value as any }))}
            options={[
              { value: 'citation', label: t('categoryCitation') || 'Citation' },
              { value: 'appeal', label: t('categoryAppeal') || 'Appeal' },
              { value: 'hearing', label: t('categoryHearing') || 'Hearing' },
              { value: 'payment', label: t('categoryPayment') || 'Payment' },
              { value: 'other', label: t('categoryOther') || 'Other' }
            ]}
          />
          
          <Select
            id="deadlinePriority"
            label={t('priority') || 'Priority'}
            value={newDeadline.priority}
            onChange={(e) => setNewDeadline(prev => ({ ...prev, priority: e.target.value as any }))}
            options={[
              { value: 'high', label: t('priorityHigh') || 'High' },
              { value: 'medium', label: t('priorityMedium') || 'Medium' },
              { value: 'low', label: t('priorityLow') || 'Low' }
            ]}
          />
          
          <div className="md:col-span-2">
            <label htmlFor="deadlineDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('description') || 'Description'}
            </label>
            <textarea
              id="deadlineDescription"
              rows={3}
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white"
              value={newDeadline.description}
              onChange={(e) => setNewDeadline(prev => ({ ...prev, description: e.target.value }))}
              placeholder={t('deadlineDescriptionPlaceholder') || 'Add details about this deadline...'}
            />
          </div>
        </div>
        
        <div className="mt-4">
          <button 
            onClick={addDeadline}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            {t('addDeadline') || 'Add Deadline'}
          </button>
        </div>
      </div>

      {/* Deadline Filters */}
      <div className="p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="filterCategory" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('filterByCategory') || 'Filter by Category'}
            </label>
            <select
              id="filterCategory"
              className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm"
              value={filter.category}
              onChange={(e) => setFilter(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="all">{t('allCategories') || 'All Categories'}</option>
              <option value="citation">{t('categoryCitation') || 'Citation'}</option>
              <option value="appeal">{t('categoryAppeal') || 'Appeal'}</option>
              <option value="hearing">{t('categoryHearing') || 'Hearing'}</option>
              <option value="payment">{t('categoryPayment') || 'Payment'}</option>
              <option value="other">{t('categoryOther') || 'Other'}</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="filterCompleted" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t('filterByStatus') || 'Filter by Status'}
            </label>
            <select
              id="filterCompleted"
              className="rounded-md border border-gray-300 dark:border-gray-600 px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white text-sm"
              value={filter.completed}
              onChange={(e) => setFilter(prev => ({ ...prev, completed: e.target.value }))}
            >
              <option value="all">{t('allStatus') || 'All Status'}</option>
              <option value="pending">{t('pending') || 'Pending'}</option>
              <option value="completed">{t('completed') || 'Completed'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Deadlines List */}
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-4">
          {t('yourDeadlines') || 'Your Deadlines'}
        </h3>
        
        {getFilteredDeadlines().length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-600 dark:text-gray-400">
              {filter.category !== 'all' || filter.completed !== 'all' 
                ? (t('noDeadlinesMatchingFilters') || 'No deadlines matching your filters')
                : (t('noDeadlinesYet') || 'No deadlines yet. Add your first deadline above.')}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {getFilteredDeadlines().map(deadline => (
              <div 
                key={deadline.id} 
                className={`border ${deadline.completed ? 'border-gray-200 dark:border-gray-700 opacity-70' : 'border-gray-300 dark:border-gray-600'} rounded-lg p-4 transition-all hover:shadow-md ${deadline.completed ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-750'}`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex-grow">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`complete-${deadline.id}`}
                        checked={deadline.completed}
                        onChange={() => toggleDeadlineStatus(deadline.id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300 dark:border-gray-600 rounded transition-colors"
                      />
                      <h4 className={`text-lg font-medium ${deadline.completed ? 'line-through text-gray-500 dark:text-gray-400' : 'text-gray-800 dark:text-white'}`}>
                        {deadline.title}
                      </h4>
                    </div>
                    
                    {deadline.description && (
                      <p className="mt-2 text-gray-600 dark:text-gray-400 text-sm">
                        {deadline.description}
                      </p>
                    )}
                    
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      {getStatusBadge(deadline.dueDate, deadline.completed)}
                      {getPriorityBadge(deadline.priority)}
                      {getCategoryBadge(deadline.category)}
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDateForDisplay(deadline.dueDate)}
                      </span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => deleteDeadline(deadline.id)}
                    className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    aria-label={t('deleteDeadline') || "Delete deadline"}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 