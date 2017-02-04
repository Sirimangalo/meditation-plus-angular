import { Directive, ElementRef, Input, OnChanges } from '@angular/core';

@Directive({
  selector: '[avatar]'
})
export class AvatarDirective implements OnChanges {
  @Input() hash: string;
  @Input() size = 160;
  @Input() fallback = 'mm';

  gravatarUrl = 'https://www.gravatar.com/avatar/';

  constructor(private elementRef: ElementRef) {}

  ngOnChanges() {
    // Different sizes for HiDPI support
    this.elementRef.nativeElement.srcset =
    `${this.gravatarUrl}${this.hash}?s=${this.size}&d=${this.fallback} 1x,
     ${this.gravatarUrl}${this.hash}?s=${this.size * 2}&d=${this.fallback} 2x,`;

    // Fallback for older browsers
    this.elementRef.nativeElement.src =
      `${this.gravatarUrl}${this.hash}?s=${this.size}&d=${this.fallback}`;
  }
}
