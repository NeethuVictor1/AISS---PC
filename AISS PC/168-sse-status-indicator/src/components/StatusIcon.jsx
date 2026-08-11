import React from 'react';
import './StatusIcon.css';

const statusLabelMap = {
  success: 'SSE Connection Active',
  warning: 'SSE Reconnecting',
  error: 'SSE Connection Failed',
  idle: 'SSE Initializing'
};

export const StatusIcon = ({ status = 'idle', size = 12, ariaLabel }) => {
  const currentLabel = ariaLabel || statusLabelMap[status] || 'Unknown Connection Status';

  return (
    <div 
      className="status-icon-container" 
      role="status" 
      aria-label={currentLabel}
      title={currentLabel}
    >
      <span 
        className={`status-icon ${status}`} 
        style={{ width: `${size}px`, height: `${size}px` }}
      />
    </div>
  );
};

export default StatusIcon;
