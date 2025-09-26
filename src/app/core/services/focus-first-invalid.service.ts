import { Injectable } from '@angular/core';

/**
 * Utility service to move focus to the first invalid field for
 * basic template-driven forms. Strategy:
 * 1. Look for any element with aria-invalid="true"
 * 2. Fallback to common invalid class selectors
 * 3. Focus it (and scroll into view if needed)
 */
@Injectable({
  providedIn: 'root'
})
export class FocusFirstInvalidService {

  focus(container?: HTMLElement | Document) {
    const root: Document | HTMLElement = container ?? document;

    const candidates: Element[] = Array.from(
      root.querySelectorAll(
        '[aria-invalid="true"], .ng-invalid[required], input.ng-invalid, select.ng-invalid, textarea.ng-invalid'
      )
    );

    const target = candidates.find(el => this.isFocusable(el)) as HTMLElement | undefined;
    if (target) {
      // Defer to ensure any state changes (like *ngIf adding error message) are applied
      setTimeout(() => {
        try {
          target.focus({ preventScroll: false });
          // Optional minor scroll alignment for off-screen
          if (!this.isElementInViewport(target)) {
            target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        } catch {
          /* no-op */
        }
      });
    }
  }

  private isFocusable(el: Element): boolean {
    if (!(el instanceof HTMLElement)) return false;
    // Check if the element is visible
    if (el.offsetParent === null) return false;
    const tabindex = el.getAttribute('tabindex');
    const disabled = (el as HTMLInputElement).disabled;
    return !disabled && !el.hasAttribute('inert') && (el.tabIndex >= 0 || tabindex !== null);
  }

  private isElementInViewport(el: HTMLElement): boolean {
    const rect = el.getBoundingClientRect();
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }
}