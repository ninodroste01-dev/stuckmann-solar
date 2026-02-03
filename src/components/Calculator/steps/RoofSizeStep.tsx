import { motion } from 'framer-motion';

interface RoofSizeStepProps {
  value: number;
  onChange: (value: number) => void;
}

const sizeOptions = [
  { value: 30, label: 'S (30-40 m²)', description: '~ 25 m² Nutzbar' },
  { value: 50, label: 'M (50-60 m²)', description: '~ 40 m² Nutzbar' },
  { value: 80, label: 'L (80-100 m²)', description: '~ 65 m² Nutzbar' },
  { value: 120, label: 'XL (120+ m²)', description: '~ 100 m² Nutzbar' },
];

export function RoofSizeStep({ value, onChange }: RoofSizeStepProps) {
  // Find closest size option
  const selectedSize = sizeOptions.reduce((prev, curr) => 
    Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-secondary">Dachfläche</h2>
      </div>

      {/* Dropdown Select */}
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Dachfläche</label>
        <select
          value={selectedSize.value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full p-4 border border-gray-200 rounded-xl bg-white text-secondary font-medium focus:border-primary focus:ring-0 outline-none appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 1rem center',
            backgroundSize: '1.25rem',
          }}
        >
          {sizeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label} = {option.description}
            </option>
          ))}
        </select>
      </div>

      {/* Size Cards */}
      <div className="grid grid-cols-2 gap-3">
        {sizeOptions.map((option) => (
          <motion.button
            key={option.value}
            onClick={() => onChange(option.value)}
            whileTap={{ scale: 0.98 }}
            className={`
              p-4 rounded-xl border transition-all duration-200 text-left
              ${selectedSize.value === option.value
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            <span className={`text-sm font-semibold ${selectedSize.value === option.value ? 'text-primary' : 'text-secondary'}`}>
              {option.label.split(' ')[0]}
            </span>
            <p className="text-xs text-gray-500 mt-1">{option.description}</p>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
