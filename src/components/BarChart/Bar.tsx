import React from 'react';

interface BarProps {
  x: number;
  y: number;
  width: number;
  height: number;
  value: number;
}

export const Bar: React.FC<BarProps> = ({ x, y, width, height, value }) => {
  return (
    <g transform={`translate(${x}, 0)`}>
      <rect
        y={y}
        width={width - 2}
        height={height}
        fill="#3b82f6"
        rx={4}
      />
      <text
        x={width / 2}
        y={y - 5}
        textAnchor="middle"
        fill="#1f2937"
        fontSize="12px"
      >
        {value}
      </text>
    </g>
  );
};