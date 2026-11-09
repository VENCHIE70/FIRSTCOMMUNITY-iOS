import { Contact } from '../types';

/**
 * Clean phone number for tel:, sms:, and WhatsApp protocols
 */
export function cleanPhoneNumber(phone?: string): string {
  if (!phone) return '';
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Format Italian or international phone number for WhatsApp
 */
export function getWhatsAppNumber(phone?: string): string {
  const cleaned = cleanPhoneNumber(phone);
  if (!cleaned) return '';
  if (cleaned.startsWith('+')) {
    return cleaned.replace('+', '');
  }
  // Standard Italian mobile (starts with 3...)
  if (cleaned.startsWith('3')) {
    return '39' + cleaned;
  }
  return cleaned;
}

/**
 * Splits fullName into family name / given name for vCard N property
 */
function parseName(contact: Contact): { lastName: string; firstName: string } {
  const parts = contact.fullName.trim().split(/\s+/);
  if (parts.length === 1) {
    return { lastName: parts[0], firstName: '' };
  }
  // If starts with "don ", handle title
  if (contact.fullName.toLowerCase().startsWith('don ')) {
    return { lastName: parts.slice(2).join(' ') || parts[1], firstName: parts[0] + ' ' + parts[1] };
  }
  return { lastName: parts[0], firstName: parts.slice(1).join(' ') };
}

/**
 * Generates a vCard 3.0 formatted text string for a single contact.
 * Fully compatible with Apple iOS (iPhone/iPad) Contacts and Android/Google Contacts.
 */
export function generateVCardString(contact: Contact): string {
  const { lastName, firstName } = parseName(contact);
  const cleanMobile = cleanPhoneNumber(contact.mobilePhone);
  const cleanLandline = cleanPhoneNumber(contact.landlinePhone);
  const cleanAlt = cleanPhoneNumber(contact.altPhone);

  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${contact.fullName}`,
    `N:${lastName};${firstName};;;`,
    `ORG:1^ Comunità S.AP.;Famiglia ${contact.familyGroup}`,
  ];

  if (cleanMobile) {
    // Prefix +39 for standard Italian mobile if not already prefixed
    const formatted = cleanMobile.startsWith('+') || cleanMobile.length > 10 ? cleanMobile : `+39${cleanMobile}`;
    lines.push(`TEL;TYPE=CELL,VOICE:${formatted}`);
  }

  if (cleanLandline) {
    const formatted = cleanLandline.startsWith('+') ? cleanLandline : `+39${cleanLandline}`;
    lines.push(`TEL;TYPE=HOME,VOICE:${formatted}`);
  }

  if (cleanAlt) {
    const formatted = cleanAlt.startsWith('+') ? cleanAlt : `+39${cleanAlt}`;
    lines.push(`TEL;TYPE=WORK,VOICE:${formatted}`);
  }

  const noteParts: string[] = ['1^ Comunità S.AP.'];
  if (contact.familyGroup) noteParts.push(`Famiglia: ${contact.familyGroup}`);
  if (contact.locationNote) noteParts.push(`Sede: ${contact.locationNote}`);
  if (contact.notes) noteParts.push(contact.notes);
  lines.push(`NOTE:${noteParts.join(' - ')}`);
  lines.push('CATEGORIES:1^ Comunità,Chiesa');
  lines.push('END:VCARD');

  return lines.join('\r\n');
}

/**
 * Downloads or shares a .vcf file for a single contact.
 * On iPhone (iOS), it utilizes the native Share Sheet if available, allowing
 * the user to tap "Contatti" / "Aggiungi a Contatti", or falls back to direct vCard download.
 */
export async function downloadSingleVCard(contact: Contact): Promise<{ shared: boolean; downloaded: boolean }> {
  const vcardText = generateVCardString(contact);
  const safeName = contact.fullName.replace(/[^a-zA-Z0-9]/g, '_');
  const filename = `${safeName}.vcf`;

  // On iOS Safari / modern mobile browsers, try Web Share API with File
  if (typeof navigator !== 'undefined' && typeof File !== 'undefined' && navigator.canShare) {
    try {
      const file = new File([vcardText], filename, { type: 'text/vcard;charset=utf-8' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: contact.fullName,
          text: `Salva ${contact.fullName} nei Contatti`,
        });
        return { shared: true, downloaded: false };
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return { shared: false, downloaded: false };
      }
    }
  }

  const blob = new Blob([vcardText], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { shared: false, downloaded: true };
}

/**
 * Downloads a combined .vcf file containing all contacts.
 * Works on both iPhone (iOS) and Android to import all community contacts.
 */
export async function downloadAllVCards(contacts: Contact[]): Promise<{ shared: boolean; downloaded: boolean }> {
  const allCards = contacts.map((c) => generateVCardString(c)).join('\r\n\r\n');
  const filename = 'Contatti_iPhone_1_Comunita_S_AP.vcf';

  if (typeof navigator !== 'undefined' && typeof File !== 'undefined' && navigator.canShare) {
    try {
      const file = new File([allCards], filename, { type: 'text/vcard;charset=utf-8' });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Tutti i ${contacts.length} contatti della Comunità`,
          text: `Importa tutti i ${contacts.length} contatti nei tuoi Contatti`,
        });
        return { shared: true, downloaded: false };
      }
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') {
        return { shared: false, downloaded: false };
      }
    }
  }

  const blob = new Blob([allCards], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 2000);
  return { shared: false, downloaded: true };
}
