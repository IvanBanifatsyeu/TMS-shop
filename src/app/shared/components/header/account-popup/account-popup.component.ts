import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-popup',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './account-popup.component.html',
  styleUrl: './account-popup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AccountPopupComponent {
  translate = inject(TranslateService);

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
