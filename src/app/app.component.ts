import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
<<<<<<< HEAD
import { HomePageComponent } from './pages/home-page/home-page.component';
import { FooterComponent } from './common-ui/footer/footer.component';
import { HeaderComponent } from './common-ui/header/header.component';

=======
import { HeaderComponent } from './core/components/header/header.component';
import { FooterComponent } from './core/components/footer/footer.component';
>>>>>>> 2320c6fa6be4a0894d2a834067025cafe2e8d22d

@Component({
  selector: 'app-root',
  standalone: true,
<<<<<<< HEAD
  imports: [RouterOutlet,FooterComponent, HeaderComponent],
=======
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
>>>>>>> 2320c6fa6be4a0894d2a834067025cafe2e8d22d
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'TMS-shop';
}
