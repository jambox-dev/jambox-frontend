import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

/**
 * Central store for autoplay (auto-accept) mode.
 * When enabled, user-facing UI may expose queue position info.
 */
@Injectable({ providedIn: 'root' })
export class AutoplayService {
  private readonly _autoplay$ = new BehaviorSubject<boolean>(false);
  readonly autoplay$ = this._autoplay$.asObservable();

  setEnabled(enabled: boolean) {
    this._autoplay$.next(enabled);
  }

  toggle(): boolean {
    const next = !this._autoplay$.value;
    this._autoplay$.next(next);
    return next;
  }

  isEnabled(): boolean {
    return this._autoplay$.value;
  }
}