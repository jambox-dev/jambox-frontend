import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { QrCodeComponent } from './qr-code/qr-code.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  { path: 'qr-code', component: QrCodeComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  { path: '**', component: NotFoundComponent }
];
