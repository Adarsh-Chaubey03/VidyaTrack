/**
 * Reusable form components for the resume builder.
 * Keeps form UI consistent across all steps.
 */

import { useState, useEffect } from 'react';

export const TextField = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  type = 'text',
  required = false,
  className = '',
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors
        focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export const TextArea = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  rows = 4,
  required = false,
  maxLength,
  helperText,
  className = '',
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    )}
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors resize-y
        focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
    />
    <div className="flex justify-between mt-1">
      {error ? (
        <p className="text-xs text-red-500">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-400">{helperText}</p>
      ) : (
        <span />
      )}
      {maxLength && (
        <span className="text-xs text-gray-400">
          {value?.length || 0}/{maxLength}
        </span>
      )}
    </div>
  </div>
);

export const SelectField = ({
  label,
  value,
  onChange,
  options,
  error,
  placeholder = 'Select...',
  required = false,
  className = '',
}) => (
  <div className={className}>
    {label && (
      <label className="block text-sm font-medium text-gray-700 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
    )}
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3.5 py-2.5 rounded-lg border text-sm transition-colors appearance-none
        bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%236b7280%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')]
        bg-no-repeat bg-[right_12px_center]
        focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500
        ${error ? 'border-red-300 bg-red-50/50' : 'border-gray-300 bg-white hover:border-gray-400'}`}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={typeof opt === 'string' ? opt : opt.value} value={typeof opt === 'string' ? opt : opt.value}>
          {typeof opt === 'string' ? opt : opt.label}
        </option>
      ))}
    </select>
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export const CheckboxField = ({ label, checked, onChange }) => (
  <label className="flex items-center gap-2 cursor-pointer select-none">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
    />
    <span className="text-sm text-gray-600">{label}</span>
  </label>
);

export const SectionTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-800 mb-4 ${className}`}>
    {children}
  </h3>
);

export const AddButton = ({ onClick, children }) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600
      hover:text-emerald-700 transition-colors mt-2"
  >
    <span className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold">+</span>
    {children}
  </button>
);

export const RemoveButton = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded"
    title="Remove"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  </button>
);

export const ClearSectionButton = ({ onClear, sectionName }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!showConfirm) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') setShowConfirm(false);
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [showConfirm]);

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="text-xs font-medium text-gray-400 hover:text-gray-600 border border-gray-200
          hover:border-gray-300 px-2.5 py-1 rounded-md transition-colors whitespace-nowrap"
      >
        Clear
      </button>

      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-lg border border-gray-200 p-5 max-w-xs w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-sm text-gray-700 mb-4">
              Clear all fields in <span className="font-semibold">{sectionName}</span>?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="px-3.5 py-1.5 text-sm font-medium text-gray-600 border border-gray-300
                  rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onClear();
                  setShowConfirm(false);
                }}
                className="px-3.5 py-1.5 text-sm font-medium text-white bg-gray-600
                  rounded-lg hover:bg-gray-700 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const SectionHeader = ({ children, onClear, sectionName }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-800">{children}</h3>
    {onClear && (
      <ClearSectionButton onClear={onClear} sectionName={sectionName || children} />
    )}
  </div>
);
