import { CourseLabelPipe } from './../courseLabel.pipe';
import { LessonComponent } from '../lesson/lesson.component';
import { Component, signal } from '@angular/core';
import { type Course } from '../data.interface';
import { MatTabsModule, MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-body',
  standalone: true,
  imports: [LessonComponent, MatTabsModule, CourseLabelPipe],
  templateUrl: './body.component.html',
  styleUrl: './body.component.scss',
})
export class BodyComponent {
  courses = signal<Course[]>(['angular', 'frontend', 'backend']);
  activeTab = signal<Course>('angular');

  onTabChange(event: MatTabChangeEvent) {
    this.activeTab.set(this.courses()[event.index]);
  }
}
