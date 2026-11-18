// Entry point referenced by index.html — composition only, real bootstrap
// lives in __main.tsx (template-managed).
import { authClient } from './lib/auth';
import './__main';
void authClient.managedAuth.handleRedirect();
