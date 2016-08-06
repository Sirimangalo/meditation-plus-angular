import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[avatar]'
})
export class AvatarDirective {
  @Input() hash: string;
  @Input() size: number = 160;
  @Input() fallback: string = 'mm';

  gravatarUrl: string = 'https://www.gravatar.com/avatar/';

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // Different sizes for HiDPI support
    this.elementRef.nativeElement.srcset =
    `${this.gravatarUrl}${this.hash}?s=${this.size}&d=${this.fallback} 1x,
     ${this.gravatarUrl}${this.hash}?s=${this.size * 2}&d=${this.fallback} 2x,`;

    // Fallback for older browsers
    this.elementRef.nativeElement.src =
      `${this.gravatarUrl}${this.hash}?s=${this.size}&d=${this.fallback}`;
  }
}
