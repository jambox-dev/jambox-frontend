import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TenantService } from '../services/tenant.service';

export const tenantInterceptor: HttpInterceptorFn = (req, next) => {
    const tenantService = inject(TenantService);
    const tenantSubdomain = tenantService.getTenantSubdomain();

    if (tenantSubdomain) {
        req = req.clone({
            setHeaders: {
                'X-Tenant-Subdomain': tenantSubdomain
            }
        });
    }

    return next(req);
};
