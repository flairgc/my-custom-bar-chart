import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface BarChartProps {
  data: number[];
  width: number;
  height: number;
  minBarWidth: number;
  padding: number;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  width,
  height,
  minBarWidth,
  padding,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    if (!svgRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Calculate dimensions
    const actualBarWidth = Math.max(
      minBarWidth,
      width / data.length
    );
    
    const totalWidth = actualBarWidth * data.length;
    const chartWidth = Math.max(width, totalWidth);

    // Create scales
    const xScale = d3.scaleLinear()
      .domain([0, data.length])
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data) || 0])
      .range([height - padding * 2, 0]);

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `${scrollPosition} 0 ${width} ${height}`);

    // Create chart group
    const chart = svg.append('g')
      .attr('transform', `translate(${padding}, ${padding})`);

    // Create bars
    chart.selectAll('rect')
      .data(data)
      .enter()
      .append('rect')
      .attr('x', (_, i) => xScale(i))
      .attr('y', d => yScale(d))
      .attr('width', actualBarWidth - 2)
      .attr('height', d => height - padding * 2 - yScale(d))
      .attr('fill', '#3b82f6')
      .attr('rx', 4);

    // Add values on top of bars
    chart.selectAll('text')
      .data(data)
      .enter()
      .append('text')
      .text(d => d)
      .attr('x', (_, i) => xScale(i) + actualBarWidth / 2)
      .attr('y', d => yScale(d) - 5)
      .attr('text-anchor', 'middle')
      .attr('fill', '#1f2937')
      .attr('font-size', '12px');

  }, [data, width, height, minBarWidth, padding, scrollPosition]);

  const handleScroll = (e: React.WheelEvent) => {
    const totalWidth = Math.max(width, minBarWidth * data.length);
    const maxScroll = totalWidth - width;
    
    setScrollPosition(prev => {
      const newPosition = prev + e.deltaY;
      return Math.max(0, Math.min(newPosition, maxScroll));
    });
  };

  return (
    <div className="relative overflow-hidden" onWheel={handleScroll}>
      <svg
        ref={svgRef}
        className="cursor-grab active:cursor-grabbing"
      />
    </div>
  );
};