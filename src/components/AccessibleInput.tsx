'use client';

import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, forwardRef } from 'react';

interface BaseInputProps {
  id: string;
  label: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  hideLabel?: boolean;
}

type InputProps = BaseInputProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id'>;
type TextareaProps = BaseInputProps & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id'>;
type SelectProps = BaseInputProps & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> & { options: { value: string; label: string }[] };

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ id, label, error, helperText, required, hideLabel, className, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${hideLabel ? 'sr-only' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={`${id}-helper ${id}-error`}
          required={required}
          className={`w-full rounded-md border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} 
          px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 
          transition-colors ${className || ''}`}
          {...rest}
        />
        {helperText && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ id, label, error, helperText, required, hideLabel, className, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${hideLabel ? 'sr-only' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        <textarea
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={`${id}-helper ${id}-error`}
          required={required}
          className={`w-full rounded-md border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} 
          px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:bg-gray-800 dark:text-white dark:placeholder-gray-400
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 
          transition-colors ${className || ''}`}
          {...rest}
        />
        {helperText && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ id, label, options, error, helperText, required, hideLabel, className, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <label 
          htmlFor={id} 
          className={`block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 ${hideLabel ? 'sr-only' : ''}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
        <select
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={`${id}-helper ${id}-error`}
          required={required}
          className={`w-full rounded-md border ${error ? 'border-red-500 dark:border-red-400' : 'border-gray-300 dark:border-gray-600'} 
          px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          dark:bg-gray-800 dark:text-white 
          disabled:bg-gray-100 dark:disabled:bg-gray-700 disabled:text-gray-500 dark:disabled:text-gray-400 
          transition-colors ${className || ''}`}
          {...rest}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {helperText && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

export const Checkbox = forwardRef<HTMLInputElement, Omit<InputProps, 'hideLabel'> & { labelClassName?: string }>(
  ({ id, label, error, helperText, required, className, labelClassName, ...rest }, ref) => {
    return (
      <div className="mb-4">
        <div className="flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            aria-invalid={!!error}
            aria-describedby={`${id}-helper ${id}-error`}
            required={required}
            className={`h-5 w-5 text-blue-600 focus:ring-blue-500 focus:ring-2 border-gray-300 dark:border-gray-600 rounded transition-colors
            dark:bg-gray-800 dark:checked:bg-blue-500 ${className || ''}`}
            {...rest}
          />
          <label 
            htmlFor={id} 
            className={`ml-3 block text-sm text-gray-700 dark:text-gray-300 ${labelClassName || ''}`}
          >
            {label}
            {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
          </label>
        </div>
        {helperText && (
          <p id={`${id}-helper`} className="mt-1 text-sm text-gray-500 dark:text-gray-400 ml-8">
            {helperText}
          </p>
        )}
        {error && (
          <p id={`${id}-error`} className="mt-1 text-sm text-red-600 dark:text-red-400 ml-8" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox'; 