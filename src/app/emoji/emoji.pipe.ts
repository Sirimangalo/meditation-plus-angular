import {
  Pipe,
  PipeTransform,
  BaseException
} from '@angular/core';
import { DomSanitizationService, SafeHtml } from '@angular/platform-browser';

let emojione = require('emojione');

/**
 * Pipe for translating emoji patterns (e.g. :grin:) to
 * an i-element with the corresponding emojione css class.
 */
@Pipe({
  name: 'emoji'
})
export class EmojiPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizationService) {}

  transform(v: string): string {
    if (typeof v !== 'string') {
      throw new BaseException('Requires a String as input');
    }
    // Encode user's input to prevent XSS
    let safeHtml = this.encodeHtml(v);

    // converts unicode emoji
    safeHtml = emojione.toShort(safeHtml);

    return safeHtml.replace(new RegExp('\:[a-zA-Z0-9-_+]+\:', 'g'), val => {
      const shortname = val.substr(1, val.length - 2).toLowerCase();

      return val.toLowerCase() in emojione.emojioneList
        ? `<i class="e1a-${shortname}" title="${shortname}"></i>`
        : val;
    });
  }

  /**
   * Hack to encode html.
   * Source: http://stackoverflow.com/a/15348311
   * @param  {string} html Html that should be encoded
   * @return {string}      Encoded html
   */
  private encodeHtml(html: string): string {
    return (<any>document.createElement('a').appendChild(
      document.createTextNode(html)
    ).parentNode).innerHTML;
  }
}
