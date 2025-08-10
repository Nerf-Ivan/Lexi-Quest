import React from 'react';

function LoadingSpinner({ size = 'large', message = 'Loading...', inline = false }) {
  const sizeClasses = {
    small: 'h-4 w-4',
    medium: 'h-8 w-8',
    large: 'h-12 w-12'
  };

  const borderClasses = {
    small: 'border-2',
    medium: 'border-3',
    large: 'border-4'
  };

  if (inline || size === 'small') {
    return (
      <div className="flex items-center justify-center">
        <div className={`animate-spin rounded-full border-gray-200 border-t-indigo-600 ${sizeClasses[size]} ${borderClasses[size]}`}></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className={`animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600 ${sizeClasses[size]}`}></div>
      {message && <p className="mt-4 text-gray-600">{message}</p>}
    </div>
  );
}

export default LoadingSpinner;