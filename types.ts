
export enum UserRole {
  CANDIDATE = 'CANDIDATE',
  COMPANY = 'COMPANY',
  ADMIN = 'ADMIN'
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  duration: string;
  description: string;
  verified: boolean;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  year: string;
}

export interface Skill {
  name: string;
  level: number; // 0-100
  category: 'Technical' | 'Soft' | 'Cognitive';
  verified: boolean;
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  potentialScore: number;
  trustScore: number;
  headline?: string;
  bio?: string;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
}

export interface PotentialScores {
  performance: number;
  learning: number;
  adaptability: number;
  trust: number;
  curiosity: number;
}

export interface AssessmentQuestion {
  id: string;
  text: string;
  type: 'adaptive' | 'curiosity' | 'technical';
  difficulty: number;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
}

export interface Job {
  id: string;
  company: string;
  title: string;
  location: string;
  salary: string;
  potentialMatch: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: string;
}
