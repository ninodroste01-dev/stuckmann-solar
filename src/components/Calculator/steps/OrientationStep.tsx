import { motion } from 'framer-motion';
import type { Orientation } from '../../HouseVisualizer';

interface OrientationStepProps {
  value: Orientation;
  onChange: (value: Orientation) => void;
}

const orientations: { id: Orientation; label: string; short: string }[] = [
  { id: 'N', label: 'Nord', short: 'N' },
  { id: 'NO', label: 'Nordost', short: 'NO' },
  { id: 'O', label: 'Ost', short: 'O' },
  { id: 'SO', label: 'Südost', short: 'SO' },
  { id: 'S', label: 'Süd', short: 'S' },
  { id: 'SW', label: 'Südwest', short: 'SW' },
  { id: 'W', label: 'West', short: 'W' },
  { id: 'NW', label: 'Nordwest', short: 'NW' },
];

const efficiencyColors: Record<Orientation, string> = {
  'S': 'bg-green-500',
  'SO': 'bg-green-400',
  'SW': 'bg-green-400',
  'O': 'bg-yellow-400',
  'W': 'bg-yellow-400',
  'NO': 'bg-orange-400',
  'NW': 'bg-orange-400',
  'N': 'bg-red-400',
};

export function OrientationStep({ value, onChange }: OrientationStepProps) {
  const selectedOrientation = orientations.find(o => o.id === value);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-secondary">Ausrichtung</h2>
      </div>

      {/* Compass */}
      <div className="relative w-56 h-56 mx-auto">
        {/* Background circle */}
        <div className="absolute inset-0 rounded-full bg-gray-100 border border-gray-200" />
        
        {/* Center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-300 to-orange-400 flex items-center justify-center shadow-md">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>
        </div>

        {/* Direction buttons */}
        {orientations.map((orientation, index) => {
          const angle = index * 45 - 90;
          const radius = 85;
          const x = 112 + Math.cos((angle * Math.PI) / 180) * radius;
          const y = 112 + Math.sin((angle * Math.PI) / 180) * radius;
          const isSelected = value === orientation.id;

          return (
            <motion.button
              key={orientation.id}
              onClick={() => onChange(orientation.id)}
              className={`
                absolute w-10 h-10 -ml-5 -mt-5 rounded-full
                flex items-center justify-center text-xs font-bold
                transition-all duration-200
                ${isSelected
                  ? 'bg-primary text-white shadow-lg scale-110'
                  : 'bg-white text-gray-600 shadow hover:scale-105'
                }
              `}
              style={{ left: x, top: y }}
              whileTap={{ scale: 0.95 }}
            >
              {orientation.short}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Info */}
      <div className="text-center">
        <p className="text-lg font-semibold text-secondary">
          {selectedOrientation?.label}
        </p>
        <div className="flex items-center justify-center gap-2 mt-2">
          <span className={`w-3 h-3 rounded-full ${efficiencyColors[value]}`} />
          <span className="text-sm text-gray-500">
            {value === 'S' && 'Optimal'}
            {(value === 'SO' || value === 'SW') && 'Sehr gut'}
            {(value === 'O' || value === 'W') && 'Gut'}
            {(value === 'NO' || value === 'NW') && 'Eingeschränkt'}
            {value === 'N' && 'Nicht optimal'}
          </span>
        </div>
      </div>
    </div>
  );
}
