import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/**
 * Source: https://goo.gl/OBGrHW
 * Pipe for the 'bypassSecurityTrustResourceUrl' method of DomSanitizer
 *
 * Usage:
 *   urlString | safe
 *
 */
@Pipe({ name: 'safe' })
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  transform(url: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
