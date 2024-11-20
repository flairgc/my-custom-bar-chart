import React, { useState, useMemo } from 'react';
import { BarChart } from './components/BarChart/BarChart';
import { Sliders, LineChart, BarChart as BarChartIcon } from 'lucide-react';

function App() {
  const [minBarWidth, setMinBarWidth] = useState(50);
  const [dataPoints, setDataPoints] = useState(1000);
  const [showLine, setShowLine] = useState(true);
  
  // Generate random data with memoization
  const data = useMemo(() => 
    Array.from({ length: dataPoints }, () => 
      Math.floor(Math.random() * 90) + 10
    ), [dataPoints]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sliders className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Interactive Chart</h1>
          </div>
          
          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Bar Width: {minBarWidth}px
              </label>
              <input
                type="range"
                min="20"
                max="100"
                value={minBarWidth}
                onChange={(e) => setMinBarWidth(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Data Points: {dataPoints}
              </label>
              <input
                type="range"
                min="100"
                max="10000"
                step="100"
                value={dataPoints}
                onChange={(e) => setDataPoints(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLine(!showLine)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                  showLine ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                }`}
              >
                <LineChart className="w-4 h-4" />
                {showLine ? 'Hide Line' : 'Show Line'}
              </button>
            </div>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50">
            <BarChart
              data={data}
              width={800}
              height={400}
              minBarWidth={minBarWidth}
              padding={20}
              showLine={showLine}
            />
          </div>
          
          <p className="mt-4 text-sm text-gray-600">
            Scroll horizontally using the mouse wheel or drag the scrollbar below the chart.
            Only visible elements are rendered for optimal performance.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;