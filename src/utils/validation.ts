import { z } from 'zod';

// German phone number validation
const germanPhoneRegex = /^(\+49|0049|0)[1-9][0-9]{1,14}$/;

// Email validation with common typo checks
const commonEmailTypos: Record<string, string> = {
  'gmial.com': 'gmail.com',
  'gmal.com': 'gmail.com',
  'gmali.com': 'gmail.com',
  'gmail.de': 'gmail.com',
  'gmaill.com': 'gmail.com',
  'hotmal.com': 'hotmail.com',
  'hotmai.com': 'hotmail.com',
  'hotmial.com': 'hotmail.com',
  'outlok.com': 'outlook.com',
  'outloo.com': 'outlook.com',
  'yahooo.com': 'yahoo.com',
  'yaho.com': 'yahoo.com',
};

// Disposable email domains to block
const disposableEmailDomains = [
  'tempmail.com',
  'throwaway.email',
  'guerrillamail.com',
  '10minutemail.com',
  'mailinator.com',
  'trashmail.com',
  'fakeinbox.com',
  'sharklasers.com',
  'guerrillamail.info',
  'grr.la',
  'maildrop.cc',
  'temp-mail.org',
];

// Contact form schema
export const contactFormSchema = z.object({
  name: z
    .string()
    .min(2, 'Name muss mindestens 2 Zeichen haben')
    .max(100, 'Name darf maximal 100 Zeichen haben')
    .regex(/^[a-zA-ZäöüÄÖÜß\s\-']+$/, 'Name enthält ungültige Zeichen'),
  
  email: z
    .string()
    .email('Bitte geben Sie eine gültige E-Mail-Adresse ein')
    .min(5, 'E-Mail-Adresse ist zu kurz')
    .max(254, 'E-Mail-Adresse ist zu lang')
    .refine((email) => {
      const domain = email.split('@')[1]?.toLowerCase();
      return !disposableEmailDomains.includes(domain);
    }, 'Bitte verwenden Sie eine permanente E-Mail-Adresse'),
  
  phone: z
    .string()
    .min(6, 'Telefonnummer ist zu kurz')
    .max(20, 'Telefonnummer ist zu lang')
    .transform((val) => val.replace(/[\s\-\(\)\/]/g, ''))
    .refine((val) => germanPhoneRegex.test(val), 'Bitte geben Sie eine gültige deutsche Telefonnummer ein'),
  
  plz: z
    .string()
    .length(5, 'PLZ muss 5 Ziffern haben')
    .regex(/^[0-9]{5}$/, 'PLZ darf nur Ziffern enthalten'),
  
  message: z
    .string()
    .max(1000, 'Nachricht darf maximal 1000 Zeichen haben')
    .optional(),
  
  privacy: z
    .boolean()
    .refine((val) => val === true, 'Bitte akzeptieren Sie die Datenschutzerklärung'),
  
  // Honeypot field - should always be empty
  website: z
    .string()
    .max(0, 'Ungültige Anfrage')
    .optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Validate email and suggest corrections
export function validateEmail(email: string): { valid: boolean; suggestion?: string; error?: string } {
  const trimmed = email.trim().toLowerCase();
  
  if (!trimmed) {
    return { valid: false, error: 'E-Mail-Adresse ist erforderlich' };
  }
  
  // Basic format check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return { valid: false, error: 'Ungültiges E-Mail-Format' };
  }
  
  // Check for common typos
  const domain = trimmed.split('@')[1];
  if (domain && commonEmailTypos[domain]) {
    const corrected = trimmed.replace(domain, commonEmailTypos[domain]);
    return { 
      valid: true, 
      suggestion: `Meinten Sie ${corrected}?` 
    };
  }
  
  // Check for disposable emails
  if (disposableEmailDomains.includes(domain)) {
    return { valid: false, error: 'Bitte verwenden Sie eine permanente E-Mail-Adresse' };
  }
  
  return { valid: true };
}

// Validate German phone number
export function validatePhone(phone: string): { valid: boolean; formatted?: string; error?: string } {
  // Remove common formatting characters
  const cleaned = phone.replace(/[\s\-\(\)\/\.]/g, '');
  
  if (!cleaned) {
    return { valid: false, error: 'Telefonnummer ist erforderlich' };
  }
  
  // Check if it matches German phone format
  if (!germanPhoneRegex.test(cleaned)) {
    return { valid: false, error: 'Ungültige deutsche Telefonnummer' };
  }
  
  // Format for display
  let formatted = cleaned;
  if (cleaned.startsWith('0049')) {
    formatted = '+49' + cleaned.slice(4);
  } else if (cleaned.startsWith('0')) {
    formatted = '+49' + cleaned.slice(1);
  }
  
  // Add spacing for readability
  if (formatted.startsWith('+49')) {
    const rest = formatted.slice(3);
    if (rest.length >= 10) {
      formatted = `+49 ${rest.slice(0, 3)} ${rest.slice(3, 6)} ${rest.slice(6)}`;
    }
  }
  
  return { valid: true, formatted };
}

// Validate German PLZ (postal code)
export function validatePLZ(plz: string): { valid: boolean; region?: string; error?: string } {
  const cleaned = plz.replace(/\s/g, '');
  
  if (!/^[0-9]{5}$/.test(cleaned)) {
    return { valid: false, error: 'PLZ muss 5 Ziffern haben' };
  }
  
  // Check if PLZ is in OWL region (Ostwestfalen-Lippe)
  const owlPLZRanges = [
    { min: 32000, max: 32839 }, // Bielefeld, Herford, etc.
    { min: 33000, max: 33829 }, // Paderborn, etc.
    { min: 49000, max: 49849 }, // Osnabrück area (partially)
  ];
  
  const plzNum = parseInt(cleaned, 10);
  const isOWL = owlPLZRanges.some(range => plzNum >= range.min && plzNum <= range.max);
  
  return { 
    valid: true, 
    region: isOWL ? 'OWL' : 'Außerhalb OWL'
  };
}

// Sanitize input to prevent XSS
export function sanitizeInput(input: string): string {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

// Check for spam patterns in message
export function checkSpamPatterns(text: string): boolean {
  const spamPatterns = [
    /\b(viagra|cialis|casino|lottery|winner|congratulations|click here|act now|limited time)\b/i,
    /https?:\/\/[^\s]+/g, // URLs
    /[A-Z]{10,}/, // Long uppercase strings
    /(.)\1{5,}/, // Repeated characters
    /\$\d+[,\d]*/, // Dollar amounts
  ];
  
  return spamPatterns.some(pattern => pattern.test(text));
}
