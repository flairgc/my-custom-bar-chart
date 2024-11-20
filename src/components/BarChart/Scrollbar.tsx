import React from 'react';

interface ScrollbarProps {
  width: number;
  totalWidth: number;
  scrollPosition: number;
  onScroll: (position: number) => void;
}

export const Scrollbar: React.FC<ScrollbarProps> = ({
  width,
  totalWidth,
  scrollPosition,
  onScroll,
}) => {
  const scrollbarWidth = Math.max((width / totalWidth) * width, 40);
  const maxScroll = width - scrollbarWidth;
  const scrollRatio = maxScroll / (totalWidth - width);
  const thumbPosition = scrollPosition * scrollRatio;

  const handleDrag = (e: React.MouseEvent) => {
    const startX = e.clientX;
    const startScroll = scrollPosition;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = (e.clientX - startX) / scrollRatio;
      const newPosition = Math.max(0, Math.min(totalWidth - width, startScroll + delta));
      onScroll(newPosition);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  if (totalWidth <= width) return null;

  return (
    <div className="h-2 bg-gray-200 rounded-full mt-2">
      <div
        className="h-full bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors"
        style={{
          width: `${scrollbarWidth}px`,
          transform: `translateX(${thumbPosition}px)`,
        }}
        onMouseDown={handleDrag}
      />
    </div>
  );
};