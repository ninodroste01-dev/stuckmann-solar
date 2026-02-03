import { motion } from 'framer-motion';
import type { RoofType } from '../../HouseVisualizer';

interface RoofTypeStepProps {
  value: RoofType;
  onChange: (value: RoofType) => void;
}

const roofTypes: { id: RoofType; label: string; icon: React.ReactNode }[] = [
  {
    id: 'satteldach',
    label: 'Satteldach',
    icon: (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <path d="M4 28 L24 8 L44 28 Z" fill="currentColor" opacity="0.2" />
        <path d="M4 28 L24 8 L44 28" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="28" width="32" height="2" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 'flachdach',
    label: 'Flachdach',
    icon: (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <rect x="4" y="16" width="40" height="4" fill="currentColor" opacity="0.2" />
        <rect x="4" y="16" width="40" height="4" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="20" width="32" height="10" fill="currentColor" opacity="0.1" />
      </svg>
    ),
  },
  {
    id: 'pultdach',
    label: 'Pultdach',
    icon: (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <path d="M4 28 L4 12 L44 22 L44 28 Z" fill="currentColor" opacity="0.2" />
        <path d="M4 12 L44 22" fill="none" stroke="currentColor" strokeWidth="2" />
        <rect x="8" y="28" width="32" height="2" fill="currentColor" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: 'walmdach',
    label: 'Walmdach',
    icon: (
      <svg viewBox="0 0 48 32" className="w-full h-full">
        <path d="M4 28 L12 12 L36 12 L44 28 Z" fill="currentColor" opacity="0.2" />
        <path d="M4 28 L12 12 L36 12 L44 28" fill="none" stroke="currentColor" strokeWidth="2" />
        <line x1="12" y1="12" x2="24" y2="6" stroke="currentColor" strokeWidth="2" />
        <line x1="36" y1="12" x2="24" y2="6" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
  },
];

export function RoofTypeStep({ value, onChange }: RoofTypeStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-secondary">Dachtyp</h2>
      </div>

      {/* Roof Type Selection */}
      <div className="grid grid-cols-2 gap-3">
        {roofTypes.map((roof) => (
          <motion.button
            key={roof.id}
            onClick={() => onChange(roof.id)}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-xl border transition-all duration-200
              flex flex-col items-center gap-2
              ${value === roof.id
                ? 'border-primary bg-primary/5'
                : 'border-gray-200 bg-white hover:border-gray-300'
              }
            `}
          >
            {value === roof.id && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
              >
                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
            )}
            
            <div className={`w-16 h-10 ${value === roof.id ? 'text-primary' : 'text-gray-400'}`}>
              {roof.icon}
            </div>
            
            <span className={`text-sm font-medium ${value === roof.id ? 'text-primary' : 'text-gray-600'}`}>
              {roof.label}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
