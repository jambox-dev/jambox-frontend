import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

/**
 * Directive to enhance a single 2FA input:
 * - Accepts only digits
 * - Formats as ###-### (UI only)
 * - Emits complete event when required length reached
 * - Supports full code paste (with or without dash)
 */
@Directive({
  selector: '[twoFaCode]',
  standalone: true
})
export class TwoFaCodeDirective {
  @Input() length = 6;
  @Output() complete = new EventEmitter<string>();
  @Output() valueChange = new EventEmitter<string>();

  private el: HTMLInputElement;

  constructor(ref: ElementRef<HTMLInputElement>) {
    this.el = ref.nativeElement;
  }

  @HostListener('input')
  handleInput() {
    const digits = this.getDigits(this.el.value);
    this.render(digits);
  }

  @HostListener('paste', ['$event'])
  handlePaste(e: ClipboardEvent) {
    const txt = e.clipboardData?.getData('text') ?? '';
    const digits = this.getDigits(txt);
    if (digits) {
      e.preventDefault();
      this.render(digits);
    }
  }

  private getDigits(v: string): string {
    return v.replace(/\D/g, '').slice(0, this.length);
  }

  private format(d: string): string {
    if (d.length <= 3) return d;
    return d.slice(0, 3) + '-' + d.slice(3);
  }

  private render(digits: string) {
    this.el.value = this.format(digits);
    this.valueChange.emit(digits);
    if (digits.length === this.length) {
      this.complete.emit(digits);
    }
  }
}