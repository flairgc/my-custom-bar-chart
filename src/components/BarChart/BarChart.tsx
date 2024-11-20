import React, { useState, useMemo } from 'react';
import { scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { Bar } from './Bar';
import { LineOverlay } from './LineOverlay';
import { Scrollbar } from './Scrollbar';

interface BarChartProps {
  data: number[];
  width: number;
  height: number;
  minBarWidth: number;
  padding: number;
  showLine?: boolean;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  minBarWidth,
  padding,
  showLine = true,
}) => {
  const [scrollPosition, setScrollPosition] = useState(0);

  const {
    actualBarWidth,
    totalWidth,
    xScale,
    yScale,
    chartHeight,
    visibleBars,
    startIndex,
    endIndex,
  } = useMemo(() => {
    const actualBarWidth = Math.max(minBarWidth, width / data.length);
    const totalWidth = actualBarWidth * data.length;
    const chartWidth = Math.max(width, totalWidth);
    const chartHeight = height - padding * 2;

    // Calculate visible range with buffer
    const visibleCount = Math.ceil(width / actualBarWidth);
    const buffer = Math.ceil(visibleCount * 0.2); // 20% buffer on each side
    const startIndex = Math.max(0, Math.floor(scrollPosition / actualBarWidth) - buffer);
    const endIndex = Math.min(
      data.length,
      Math.ceil((scrollPosition + width) / actualBarWidth) + buffer
    );

    const xScale = scaleLinear()
      .domain([0, data.length])
      .range([0, chartWidth]);

    const yScale = scaleLinear()
      .domain([0, max(data) || 0])
      .range([chartHeight, 0]);

    const visibleBars = data.slice(startIndex, endIndex);

    return {
      actualBarWidth,
      totalWidth,
      xScale,
      yScale,
      chartHeight,
      visibleBars,
      startIndex,
      endIndex,
    };
  }, [data, width, height, minBarWidth, padding, scrollPosition]);

  const handleWheel = (e: React.WheelEvent) => {
    const maxScroll = totalWidth - width;
    setScrollPosition(prev => {
      const newPosition = prev + e.deltaY;
      return Math.max(0, Math.min(newPosition, maxScroll));
    });
  };

  return (
    <div className="relative">
      <div className="overflow-hidden" onWheel={handleWheel}>
        <svg
          width={width}
          height={height}
          className="cursor-grab active:cursor-grabbing"
          style={{ overflow: 'visible' }}
        >
          <g transform={`translate(${padding - scrollPosition}, ${padding})`}>
            {/* Render bars */}
            {visibleBars.map((value, i) => (
              <Bar
                key={`bar-${startIndex + i}`}
                x={xScale(startIndex + i)}
                y={yScale(value)}
                width={actualBarWidth}
                height={chartHeight - yScale(value)}
                value={value}
              />
            ))}
            
            {/* Render line overlay */}
            {showLine && (
              <LineOverlay
                data={visibleBars}
                xScale={xScale}
                yScale={yScale}
                startIndex={startIndex}
                width={width}
              />
            )}
          </g>
        </svg>
      </div>
      <Scrollbar
        width={width}
        totalWidth={totalWidth}
        scrollPosition={scrollPosition}
        onScroll={setScrollPosition}
      />
    </div>
  );
};