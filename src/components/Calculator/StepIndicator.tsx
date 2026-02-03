import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  const progress = ((currentStep) / totalSteps) * 100;

  return (
    <div className="mb-12">
      {/* Progress bar */}
      <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
        <motion.div
          className="absolute h-full bg-gradient-to-r from-primary to-primary-light rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }, (_, i) => {
          const stepNumber = i + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div key={i} className="flex flex-col items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isCompleted 
                    ? '#48BB78' 
                    : isCurrent 
                      ? '#F5A623' 
                      : '#E2E8F0',
                }}
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  text-sm font-semibold transition-colors
                  ${isCompleted || isCurrent ? 'text-white' : 'text-gray-400'}
                `}
              >
                {isCompleted ? (
                  <motion.svg
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  stepNumber
                )}
              </motion.div>
              
              {stepLabels && stepLabels[i] && (
                <span 
                  className={`
                    text-xs mt-1 text-center max-w-[60px] leading-tight
                    ${isCurrent ? 'text-primary font-medium' : 'text-gray-400'}
                  `}
                >
                  {stepLabels[i]}
                </span>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
}
