import { motion } from 'framer-motion';

interface RoofAngleStepProps {
  value: number;
  onChange: (value: number) => void;
  roofType: string;
}

const angleOptions = [
  { value: 10, label: 'Flach (10°)' },
  { value: 20, label: 'Leicht (20°)' },
  { value: 30, label: 'Mittel (30°)' },
  { value: 40, label: 'Steil (40°)' },
  { value: 50, label: 'Sehr steil (50°)' },
];

export function RoofAngleStep({ value, onChange, roofType }: RoofAngleStepProps) {
  const isFlat = roofType === 'flachdach';

  if (isFlat) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-lg font-semibold text-secondary">Dachneigung</h2>
        </div>

        <div className="bg-green-50 rounded-xl p-5 text-center">
          <p className="text-green-800 font-medium">Flachdach erkannt</p>
          <p className="text-sm text-green-600 mt-1">
            Module werden optimal mit 15° aufgeständert
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21l4-8-4-8h10l-4 8 4 8H7z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-secondary">Dachneigung</h2>
      </div>

      {/* Visual Preview */}
      <div className="bg-gray-50 rounded-xl p-6 flex items-center justify-center">
        <svg viewBox="0 0 120 60" className="w-40 h-20">
          <line x1="10" y1="50" x2="110" y2="50" stroke="#E5E7EB" strokeWidth="2" />
          <rect x="30" y="35" width="60" height="15" fill="#F5F5F5" stroke="#E0E0E0" />
          <motion.path
            initial={false}
            animate={{ d: `M 25 35 L 60 ${35 - value * 0.5} L 95 35 Z` }}
            fill="#E8E8E8"
            stroke="#D0D0D0"
            transition={{ duration: 0.2 }}
          />
          <text x="100" y="25" fill="#F5A623" fontSize="12" fontWeight="bold">{value}°</text>
        </svg>
      </div>

      {/* Angle Select */}
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Neigungswinkel</label>
        <select
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full p-3 border border-gray-200 rounded-xl bg-white text-secondary font-medium focus:border-primary focus:ring-0 outline-none"
        >
          {angleOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Quick Select */}
      <div className="flex gap-2 justify-center">
        {[15, 25, 30, 35, 45].map((angle) => (
          <button
            key={angle}
            onClick={() => onChange(angle)}
            className={`
              px-3 py-1.5 rounded-lg text-sm font-medium transition-all
              ${value === angle
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }
            `}
          >
            {angle}°
          </button>
        ))}
      </div>

      {/* Hint */}
      {value >= 28 && value <= 35 && (
        <p className="text-sm text-green-600 text-center">
          Optimal für Deutschland
        </p>
      )}
    </div>
  );
}
