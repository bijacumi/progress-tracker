import { environment } from './../environments/environment';
import { Injectable, signal, inject, WritableSignal } from '@angular/core';
import { Lesson } from './data.interface';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { type Course } from './data.interface';

@Injectable({
  providedIn: 'root',
})
export class DatabaseService {
  private httpClient = inject(HttpClient);
  private angular = signal<Lesson[]>([]);
  private frontend = signal<Lesson[]>([]);
  private backend = signal<Lesson[]>([]);

  angularData = this.angular.asReadonly();
  frontendData = this.frontend.asReadonly();
  backendData = this.backend.asReadonly();

  private lessonsMap = {
    angular: this.angular,
    frontend: this.frontend,
    backend: this.backend,
  };

  fetchLessonData(course: Course) {
    return this.fetchData(course).pipe(
      tap((lessons) => {
        const lessonsSignal = this.lessonsMap[course];
        lessonsSignal.set(lessons);
      })
    );
  }

  toggleCompleted(course: Course, lesson: Lesson) {
    const updated = { ...lesson, completed: +!lesson.completed };

    return this.updateLesson(course, lesson.id, {
      completed: updated.completed,
    }).pipe(
      tap(() => {
        const lessonsSignal = this.lessonsMap[course];
        const updatedLessons = lessonsSignal().map((l) =>
          l.id === updated.id ? updated : l
        );
        lessonsSignal.set(updatedLessons);
        console.log(lessonsSignal());
      })
    );
  }

  updateLesson(course: string, id: number, changes: Partial<Lesson>) {
    const url = `${environment.apiUrl}/${course}/${id}`;
    return this.httpClient.put(url, changes);
  }

  private fetchData(course: string) {
    const url = `${environment.apiUrl}/` + course;
    console.log(url);
    return this.httpClient.get<Lesson[]>(url).pipe(
      tap((lessons) => {
        console.log('Raw response from backend:', lessons);
      }),
      catchError((error) => {
        console.error('Error fetching data:', error);
        return throwError(
          () => new Error('Failed to fetch data. Please try again later.')
        );
      })
    );
  }

  /*
  private getSignalForCourse(course: string) {
    //another version for keeping track of the signals.
    return {
      angular: this.angular,
      frontend: this.frontend,
      backend: this.backend,
    }[course];
  }*/
}
