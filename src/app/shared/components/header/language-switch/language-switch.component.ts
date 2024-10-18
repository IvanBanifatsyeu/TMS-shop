import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-account-popup',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './language-switch.component.html',
  styleUrl: './language-switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LanguageSwitchComponent {
  translate = inject(TranslateService);

  useLanguage(language: string): void {
    this.translate.use(language);
  }
}
