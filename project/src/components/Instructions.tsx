import React, { useState } from 'react';
import { HelpCircle, MousePointer, MousePointerClick, Flag } from 'lucide-react';

const Instructions: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mx-auto max-w-md mb-4 px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full flex items-center justify-between p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center">
            <HelpCircle className="mr-2 text-blue-500" size={20} />
            <span className="font-medium">How to Play</span>
          </div>
          <span className="text-gray-500">{isOpen ? '−' : '+'}</span>
        </button>

        {isOpen && (
          <div className="p-4 animate-fade-in">
            <ul className="space-y-3">
              <li className="flex items-start">
                <MousePointerClick className="mr-2 mt-0.5 text-blue-500 flex-shrink-0" size={18} />
                <span><strong>Left click</strong> to reveal a cell. Numbers show how many mines are adjacent.</span>
              </li>
              <li className="flex items-start">
                <Flag className="mr-2 mt-0.5 text-red-500 flex-shrink-0" size={18} />
                <span><strong>Right click</strong> to place a flag on suspected mines.</span>
              </li>
              <li className="flex items-start">
                <MousePointer className="mr-2 mt-0.5 text-green-500 flex-shrink-0" size={18} />
                <span>Avoid clicking on mines. The first click is always safe.</span>
              </li>
            </ul>
            <p className="mt-3 text-sm text-gray-600">
              Win by revealing all cells without mines. The counter shows remaining mines and the timer tracks your speed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Instructions;
