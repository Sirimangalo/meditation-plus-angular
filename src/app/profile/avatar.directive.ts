import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[avatar]'
})
export class AvatarDirective {
  @Input() hash: string;
  @Input() size: number = 160;
  @Input() fallback: string = 'mm';

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    this.elementRef.nativeElement.src =
    `https://www.gravatar.com/avatar/${this.hash}?s=${this.size}&d=${this.fallback}`;
  }
}
