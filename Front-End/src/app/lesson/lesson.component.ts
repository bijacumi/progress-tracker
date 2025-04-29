import { DatabaseService } from './../database.service';
import {
  Component,
  inject,
  signal,
  OnInit,
  DestroyRef,
  computed,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Lesson } from '../data.interface';
import {
  getTotalTimeMinutes,
  getCompletedTotalTimeMinutes,
} from '../utils/time.utils';
import { type Course } from '../data.interface';

@Component({
  selector: 'app-lesson',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson.component.html',
  styleUrl: './lesson.component.scss',
})
export class LessonComponent implements OnInit {
  course = input.required<Course>();
  currentTab = input.required<string>();
  readonly Math = Math;
  private dataService = inject(DatabaseService);
  private destroyRef = inject(DestroyRef);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  //lessons = signal<Lesson[]>([]);
  lessons = computed(() => this.dataService[`${this.course()}Data`]());

  ngOnInit() {
    this.loadLessons();
  }

  private loadLessons() {
    this.isLoading.set(true);
    const subscription = this.dataService
      .fetchLessonData(this.course())
      .subscribe({
        next: () => {
          //this.lessons.set(this.dataService[`${this.course()}Data`]());
          this.isLoading.set(false);
        },
        error: (error) => {
          this.error.set(error.message);
          this.isLoading.set(false);
        },
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  totalTime = computed(() => {
    return getTotalTimeMinutes(this.lessons());
  });

  // totalTimeHours = computed(Math.floor(this.totalTime / 60));

  totalCompletedTime = computed(() => {
    return getCompletedTotalTimeMinutes(this.lessons());
  });

  onToggleCompleted(course: Course, lesson: Lesson) {
    const subscription = this.dataService
      .toggleCompleted(course, lesson)
      .subscribe({
        next: () => {
          this.loadLessons(); // Reload lessons after toggle
          console.log(`Lesson ${lesson.id} updated successfully.`);
        },
        error: (err) => {
          console.error(`Failed to update lesson ${lesson.id}`, err);
        },
      });
    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
