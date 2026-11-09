export interface Contact {
  id: number;
  familyGroup: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  mobilePhone?: string;
  landlinePhone?: string;
  altPhone?: string;
  locationNote?: string;
  notes?: string;
  isStarred?: boolean;
}

export type EventCategory = 
  | 'eucarestia' 
  | 'parola' 
  | 'tema' 
  | 'convivenza' 
  | 'penitenziale' 
  | 'speciale' 
  | 'avviso' 
  | 'incontro';

export interface CalendarEvent {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  title: string;
  category: EventCategory;
  preparationGroup?: string;
  time?: string;
  location?: string;
  notice?: string;
  isNoticeOnly?: boolean;
}
