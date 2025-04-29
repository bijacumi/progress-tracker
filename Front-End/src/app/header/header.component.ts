import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../database.service';
import {
  getTotalTimeMinutes,
  getCompletedTotalTimeMinutes,
} from '../utils/time.utils';
import { Lesson } from '../data.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent implements OnInit {
  private db = inject(DatabaseService);
  readonly Math = Math;

  // allLessons = signal<Lesson[]>([]);

  allLessons = computed(() => [
    ...this.db['angularData'](),
    ...this.db['frontendData'](),
    ...this.db['backendData'](),
  ]);

  ngOnInit() {
    this.loadAllLessons();
  }

  private loadAllLessons() {
    this.db.fetchLessonData('angular').subscribe();
    this.db.fetchLessonData('frontend').subscribe();
    this.db.fetchLessonData('backend').subscribe();
    // Combine all data into one signal
  }

  totalTime = computed(() => getTotalTimeMinutes(this.allLessons()));
  totalCompletedTime = computed(() =>
    getCompletedTotalTimeMinutes(this.allLessons())
  );

  progress = computed(() =>
    this.totalTime() > 0
      ? Math.floor((this.totalCompletedTime() / this.totalTime()) * 100)
      : 0
  );
}
