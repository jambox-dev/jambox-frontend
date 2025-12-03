import { Injectable, inject } from '@angular/core';
import { CanMatch, Route, UrlSegment } from '@angular/router';
import { TenantService } from '../services/tenant.service';

@Injectable({
    providedIn: 'root'
})
export class TenantDomainGuard implements CanMatch {
    private tenantService = inject(TenantService);

    canMatch(route: Route, segments: UrlSegment[]): boolean {
        return !this.tenantService.isMainDomain();
    }
}
