import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
} from '@angular/core';
import { NavigationComponent } from '../navigation/navigation.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AccountPopupComponent } from './account-popup/account-popup.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    NavigationComponent,
    TranslateModule,
    AccountPopupComponent,
    CommonModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  @HostBinding('class.position-absolute') isAbsolute = true;
  isPopupVisible = false;
  translate = inject(TranslateService);

  showPopup() {
    this.isPopupVisible = true;
  }

  hidePopup() {
    this.isPopupVisible = false;
  }
}
