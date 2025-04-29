import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'courseLabel',
  standalone: true,
})
export class CourseLabelPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case 'frontend':
        return 'Front-End';
      case 'backend':
        return 'Back-End';
      case 'angular':
        return 'Angular';
      default:
        return value;
    }
  }
}
