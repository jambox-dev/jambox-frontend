import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';

export const routes: Routes = [
  { path: '', component: SearchComponent },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
