export interface Event {
  title: string;
  date: string;
  location: string;
  organizers: string;
  status: string;
  attendees: string;
  link: string;
  description: string;
  city?: string;
}

export interface MatchedEvent extends Event {
  matchScore?: number;
  rank?: number;
  whyMatches?: string;
  annaInterests?: string[];
  jordanInterests?: string[];
  person1_name?: string;
  person2_name?: string;
}

export interface Person {
  name: string;
  age: number;
  location: string;
  company: string;
  interests: string[];
}