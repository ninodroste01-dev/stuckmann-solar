import { motion } from 'framer-motion';

interface PostalCodeStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function PostalCodeStep({ value, onChange }: PostalCodeStepProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, '').slice(0, 5);
    onChange(newValue);
  };

  const isValid = value.length === 5;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
          <svg className="w-5 h-5 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-secondary">Standort</h2>
      </div>

      {/* Input */}
      <div className="space-y-2">
        <label className="text-sm text-gray-500">Postleitzahl</label>
        <div className="relative">
          <input
            type="text"
            inputMode="numeric"
            value={value}
            onChange={handleChange}
            placeholder="z.B. 10115"
            className="w-full p-4 border border-gray-200 rounded-xl bg-white text-secondary text-lg font-medium focus:border-primary focus:ring-0 outline-none"
          />
          {isValid && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
          )}
        </div>
        {value.length > 0 && value.length < 5 && (
          <p className="text-sm text-gray-400">{5 - value.length} Ziffern fehlen</p>
        )}
      </div>

      {/* Info */}
      {isValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 rounded-xl p-4 text-center"
        >
          <p className="text-sm text-gray-600">
            Sonneneinstrahlung wird für PLZ <span className="font-semibold text-primary">{value}</span> berechnet
          </p>
        </motion.div>
      )}
    </div>
  );
}
