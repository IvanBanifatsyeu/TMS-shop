import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

export function appInitializerFactory(
  authService: AuthService
): () => Promise<void> {
  return () => firstValueFrom(authService.loadUser());
}
