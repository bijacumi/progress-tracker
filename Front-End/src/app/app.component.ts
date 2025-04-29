import { BodyComponent } from './body/body.component';
import { HeaderComponent } from './header/header.component';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, BodyComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'learning_progress';
}
