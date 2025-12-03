import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TenantService {

    getTenantSubdomain(): string | null {
        const hostname = window.location.hostname;
        const mainDomains = ['jambox.dev', 'www.jambox.dev', 'localhost'];

        if (mainDomains.includes(hostname)) {
            return null;
        }

        // Handle *.jambox.dev
        if (hostname.endsWith('.jambox.dev')) {
            const parts = hostname.split('.');
            // Avoid matching www.jambox.dev again if logic changes, but handled above
            return parts[0];
        }

        // Handle *.localhost for local development
        if (hostname.endsWith('.localhost')) {
            const parts = hostname.split('.');
            return parts[0];
        }

        return null;
    }

    isMainDomain(): boolean {
        return this.getTenantSubdomain() === null;
    }
}
