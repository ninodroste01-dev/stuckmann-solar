import { motion } from 'framer-motion';

interface OwnershipStepProps {
  value: boolean | null;
  onChange: (value: boolean) => void;
}

const OPTIONS = [
  {
    id: 'owner',
    value: true,
    label: 'Ja, ich bin Eigentümer',
    description: 'Ich besitze das Haus',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    id: 'renter',
    value: false,
    label: 'Nein, ich bin Mieter',
    description: 'Ich miete das Haus/die Wohnung',
    icon: (
      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
];

export function OwnershipStep({ value, onChange }: OwnershipStepProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-secondary">Eigentumsverhältnis</h2>
      </div>

      {/* Question */}
      <p className="text-gray-600 text-center mb-6">
        Sind Sie Eigentümer des Hauses?
      </p>

      {/* Options */}
      <div className="space-y-4">
        {OPTIONS.map((option) => {
          const isSelected = value === option.value;
          
          return (
            <motion.button
              key={option.id}
              onClick={() => onChange(option.value)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className={`
                relative w-full p-5 rounded-xl border-2 transition-all text-left flex items-center gap-4
                ${isSelected
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }
              `}
            >
              {/* Selection indicator */}
              <div className={`
                w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
                ${isSelected ? 'border-primary bg-primary' : 'border-gray-300'}
              `}>
                {isSelected && (
                  <motion.svg 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-4 h-4 text-white" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </motion.svg>
                )}
              </div>

              {/* Icon */}
              <div className={`${isSelected ? 'text-primary' : 'text-gray-400'}`}>
                {option.icon}
              </div>

              {/* Text */}
              <div className="flex-1">
                <h3 className={`font-semibold ${isSelected ? 'text-primary' : 'text-secondary'}`}>
                  {option.label}
                </h3>
                <p className="text-sm text-gray-400 mt-0.5">
                  {option.description}
                </p>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info for renters */}
      {value === false && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-xl p-4"
        >
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-amber-700">
              Als Mieter benötigen Sie die Zustimmung Ihres Vermieters für die Installation einer PV-Anlage. 
              Wir beraten Sie gerne zu den Möglichkeiten.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
