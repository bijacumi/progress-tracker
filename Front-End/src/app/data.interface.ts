export interface Lesson {
  id: number;
  lesson_title: string;
  hours: number;
  minutes: number;
  completed: boolean | number;
  url?: string;
}

export type Course = 'angular' | 'frontend' | 'backend';

export type RevisedCourse = 'angular' | 'front-end' | 'back-end';
