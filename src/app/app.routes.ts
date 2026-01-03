import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QrCodeComponent } from './qr-code/qr-code.component';
import { LandingComponent } from './landing/landing.component';
import { MainDomainGuard } from './core/guards/main-domain.guard';
import { TenantDomainGuard } from './core/guards/tenant-domain.guard';

import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './admin/login/login.component';

export const routes: Routes = [
  // Main Domain Routes
  {
    path: '',
    component: LandingComponent,
    canMatch: [MainDomainGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    canMatch: [MainDomainGuard]
  },
  {
    path: 'register',
    component: RegisterComponent,
    canMatch: [MainDomainGuard]
  },
  // Tenant Domain Routes
  {
    path: '',
    component: SearchComponent,
    canMatch: [TenantDomainGuard]
  },

  // Shared/Common Routes (or specific to one, can be guarded if needed)
  { path: 'qr-code', component: QrCodeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', component: NotFoundComponent }
];
