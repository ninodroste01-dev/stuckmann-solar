import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '../ui';
import { contactFormSchema, validateEmail, validatePhone, validatePLZ, sanitizeInput, checkSpamPatterns } from '../../utils/validation';
import { checkRateLimit, recordSubmission, detectBot, markFormStart, checkFormTime, generateFingerprint } from '../../utils/security';
import type { CalculationInput, CalculationResult } from '../../utils/calculations';

interface ContactFormProps {
  calculationInput: CalculationInput;
  calculationResult: CalculationResult;
  onSubmitSuccess: () => void;
  onBack: () => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  plz?: string;
  message?: string;
  privacy?: string;
  general?: string;
}

export function ContactForm({ calculationInput, calculationResult, onSubmitSuccess, onBack }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    plz: '',
    message: '',
    privacy: false,
    website: '', // Honeypot
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSuggestion, setEmailSuggestion] = useState<string | null>(null);
  const [phoneFormatted, setPhoneFormatted] = useState<string | null>(null);
  const [plzRegion, setPlzRegion] = useState<string | null>(null);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    markFormStart();
  }, []);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // Real-time validation hints
    if (field === 'email' && typeof value === 'string' && value.length > 5) {
      const result = validateEmail(value);
      setEmailSuggestion(result.suggestion || null);
    }

    if (field === 'phone' && typeof value === 'string' && value.length > 5) {
      const result = validatePhone(value);
      setPhoneFormatted(result.formatted || null);
    }

    if (field === 'plz' && typeof value === 'string' && value.length === 5) {
      const result = validatePLZ(value);
      setPlzRegion(result.region || null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Validate using Zod schema
    try {
      contactFormSchema.parse(formData);
    } catch (err) {
      if (err instanceof Error && 'errors' in err) {
        const zodErrors = (err as { errors: Array<{ path: string[]; message: string }> }).errors;
        zodErrors.forEach((error) => {
          const field = error.path[0] as keyof FormErrors;
          newErrors[field] = error.message;
        });
      }
    }

    // Additional spam check for message
    if (formData.message && checkSpamPatterns(formData.message)) {
      newErrors.message = 'Ihre Nachricht enthält ungültige Inhalte';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check honeypot
    if (formData.website) {
      console.log('Honeypot triggered');
      setSubmitStatus('success'); // Fake success for bots
      return;
    }

    // Check rate limit
    const rateLimit = checkRateLimit();
    if (!rateLimit.allowed) {
      setErrors({
        general: `Zu viele Anfragen. Bitte warten Sie ${rateLimit.waitTime} Minuten.`,
      });
      return;
    }

    // Check form time
    const formTime = checkFormTime();
    if (!formTime.valid) {
      console.log('Form submitted too quickly');
      // Allow but log for analysis
    }

    // Check for bot
    const botCheck = detectBot();
    if (botCheck.isBot) {
      console.log('Bot detected:', botCheck.reasons);
      setSubmitStatus('success'); // Fake success for bots
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      // Prepare payload
      const payload = {
        timestamp: new Date().toISOString(),
        source: 'stuckmann-solar-calculator',
        fingerprint: generateFingerprint(),
        contact: {
          name: sanitizeInput(formData.name),
          email: sanitizeInput(formData.email.toLowerCase()),
          phone: sanitizeInput(formData.phone),
          plz: sanitizeInput(formData.plz),
          message: formData.message ? sanitizeInput(formData.message) : undefined,
        },
        calculation: {
          roofType: calculationInput.roofType,
          roofAngle: calculationInput.roofAngle,
          orientation: calculationInput.orientation,
          roofSize: calculationInput.roofSize,
          consumption: calculationInput.annualConsumption,
          wantsStorage: calculationInput.wantsStorage,
          storageSize: calculationInput.storageSize,
        },
        results: {
          systemSize: calculationResult.systemSize,
          annualYield: calculationResult.annualYield,
          annualSavings: calculationResult.annualSavings,
          roi: calculationResult.paybackPeriod,
          co2Savings: calculationResult.annualCO2Savings,
          totalInvestment: calculationResult.totalInvestment,
        },
      };

      // Send to webhook
      const response = await fetch('https://hook.eu1.make.com/qdlobbppbaiyjnv6ou1mdk8mzk85jgkh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Webhook request failed');
      }

      // Record successful submission for rate limiting
      recordSubmission();
      
      setSubmitStatus('success');
      onSubmitSuccess();
    } catch (error) {
      console.error('Submission error:', error);
      setErrors({
        general: 'Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.',
      });
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <h2 className="text-2xl font-bold text-secondary mb-3">
          Vielen Dank für Ihre Anfrage!
        </h2>
        <p className="text-gray-600 mb-6 max-w-md mx-auto">
          Wir haben Ihre Daten erhalten und werden uns innerhalb von 24 Stunden 
          mit einem individuellen Angebot bei Ihnen melden.
        </p>
        
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-sm text-green-800">
            Eine Bestätigung wurde an <strong>{formData.email}</strong> gesendet.
          </p>
        </div>

        <div className="mt-8">
          <a 
            href="https://www.stuckmann-solar.de" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Mehr über Stuckmann Solar erfahren
          </a>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-secondary mb-2">
          Kostenloses Angebot anfordern
        </h2>
        <p className="text-gray-500">
          Erhalten Sie Ihr persönliches Angebot per E-Mail
        </p>
      </div>

      {errors.general && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
        >
          {errors.general}
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          error={errors.name}
          placeholder="Max Mustermann"
          required
        />

        <div>
          <Input
            label="E-Mail"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={errors.email}
            placeholder="max@beispiel.de"
            required
          />
          <AnimatePresence>
            {emailSuggestion && (
              <motion.button
                type="button"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onClick={() => {
                  const corrected = formData.email.replace(/@.+$/, '@' + emailSuggestion.split('@')[1]?.replace('?', ''));
                  handleInputChange('email', corrected);
                  setEmailSuggestion(null);
                }}
                className="text-xs text-blue-600 hover:underline mt-1"
              >
                {emailSuggestion}
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Input
            label="Telefon"
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={errors.phone}
            placeholder="+49 5222 1234567"
            required
          />
          {phoneFormatted && !errors.phone && (
            <p className="text-xs text-gray-500 mt-1">Formatiert: {phoneFormatted}</p>
          )}
        </div>

        <div>
          <Input
            label="Postleitzahl"
            value={formData.plz}
            onChange={(e) => handleInputChange('plz', e.target.value)}
            error={errors.plz}
            placeholder="32105"
            maxLength={5}
            required
          />
          {plzRegion && !errors.plz && (
            <p className={`text-xs mt-1 ${plzRegion === 'OWL' ? 'text-green-600' : 'text-gray-500'}`}>
              {plzRegion === 'OWL' ? 'In unserem Einzugsgebiet' : 'Außerhalb OWL - Beratung möglich'}
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-secondary mb-1.5">
          Nachricht (optional)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          placeholder="Haben Sie besondere Wünsche oder Fragen?"
          rows={3}
          maxLength={1000}
          className={`
            w-full px-4 py-3 rounded-lg border-2 transition-all duration-200
            placeholder:text-gray-500 placeholder:opacity-70 resize-none
            ${errors.message
              ? 'border-red-500 focus:border-red-500'
              : 'border-gray-200 focus:border-primary'
            }
            focus:outline-none focus:ring-4 focus:ring-primary/20
          `}
        />
        {errors.message && (
          <p className="mt-1.5 text-sm text-red-500">{errors.message}</p>
        )}
        <p className="text-xs text-gray-400 mt-1 text-right">
          {formData.message.length}/1000 Zeichen
        </p>
      </div>

      {/* Honeypot field - hidden from users */}
      <input
        type="text"
        name="website"
        value={formData.website}
        onChange={(e) => handleInputChange('website', e.target.value)}
        tabIndex={-1}
        autoComplete="off"
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          opacity: 0,
          height: 0,
          width: 0,
        }}
      />

      {/* Privacy checkbox */}
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="privacy"
          checked={formData.privacy}
          onChange={(e) => handleInputChange('privacy', e.target.checked)}
          className="mt-1 w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <label htmlFor="privacy" className="text-sm text-gray-600">
          Ich habe die{' '}
          <a 
            href="https://www.stuckmann-solar.de/datenschutzerklaerung/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            Datenschutzerklärung
          </a>{' '}
          gelesen und stimme der Verarbeitung meiner Daten zu. *
        </label>
      </div>
      {errors.privacy && (
        <p className="text-sm text-red-500 -mt-3">{errors.privacy}</p>
      )}

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          Zurück
        </Button>
        <Button
          type="submit"
          variant="primary"
          isLoading={isSubmitting}
          className="flex-1"
        >
          Angebot anfordern
        </Button>
      </div>

      <p className="text-xs text-gray-400 text-center">
        Ihre Daten werden sicher übertragen und nicht an Dritte weitergegeben.
      </p>
    </motion.form>
  );
}
