import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NavigationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  @HostBinding('class.position-absolute') isAbsolute = true;
}
