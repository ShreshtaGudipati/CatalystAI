import React from 'react';

const ConfidenceGauge = ({ score, size = 120, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Determine color matching status
  const getColor = (val) => {
    if (val >= 80) return '#10b981'; // green
    if (val >= 65) return '#f59e0b'; // yellow
    return '#ef4444'; // red
  };

  const color = getColor(score);

  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke="rgba(255, 255, 255, 0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Animated fill indicator circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.8s ease-in-out' }}
        />
      </svg>
      {/* Centered value indicator */}
      <div style={{ position: 'absolute', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <span style={{ fontSize: '26px', fontWeight: 'bold', color: '#f1f3f9' }}>{score}%</span>
        <span style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '600', marginTop: '2px' }}>Confidence</span>
      </div>
    </div>
  );
};

export default ConfidenceGauge;
