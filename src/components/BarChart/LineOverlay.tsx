import React from 'react';
import { line, curveMonotoneX } from 'd3-shape';

interface LineOverlayProps {
  data: number[];
  xScale: (i: number) => number;
  yScale: (v: number) => number;
  startIndex: number;
  width: number;
  color?: string;
}

export const LineOverlay: React.FC<LineOverlayProps> = ({
  data,
  xScale,
  yScale,
  startIndex,
  width,
  color = '#ef4444'
}) => {
  const lineGenerator = line<number>()
    .x((_, i) => xScale(startIndex + i))
    .y(d => yScale(d))
    .curve(curveMonotoneX);

  return (
    <>
      <path
        d={lineGenerator(data) || ''}
        fill="none"
        stroke={color}
        strokeWidth={2}
        className="filter drop-shadow-md"
      />
      {data.map((value, i) => (
        <circle
          key={`point-${startIndex + i}`}
          cx={xScale(startIndex + i)}
          cy={yScale(value)}
          r={4}
          fill="white"
          stroke={color}
          strokeWidth={2}
          className="transition-transform hover:scale-150"
        />
      ))}
    </>
  );
};