import React from 'react';

const VerifiedBadge = ({ size = 18, className = '', tooltip = 'Verified Organization' }) => (
    <span
        className={`inline-flex items-center ml-1 align-middle ${className}`}
        title={tooltip}
        aria-label={tooltip}
        style={{ verticalAlign: 'middle' }}
    >
        {/* SVG: Facebook/Twitter style blue checkmark */}
        <svg
            width={size}
            height={size}
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
        >
            <circle cx="10" cy="10" r="10" fill="#1877F2" />
            <path
                d="M6 10.5l3 3 5-5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    </span>
);

export default VerifiedBadge; 