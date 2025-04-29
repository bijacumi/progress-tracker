import { Lesson } from './../data.interface';

export function getTotalTimeMinutes(lessons: Lesson[]): number {
  return lessons.reduce((acc, l) => acc + l.hours * 60 + l.minutes, 0);
}

export function getCompletedTotalTimeMinutes(lessons: Lesson[]): number {
  return lessons
    .filter((lesson) => lesson.completed)
    .reduce((acc, l) => acc + l.hours * 60 + l.minutes, 0);
}
