import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';

/*
 * Replace any occurence of a '@username' like string with
 * a link to the profile page of this user
*/
@Pipe({
  name: 'mentions',
  pure: true
})
export class MentionsPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(text: string) {
    return this.sanitizer.bypassSecurityTrustHtml(
      text.replace(/@([a-zA-Z][a-zA-Z0-9-_\.]{3,20}|all)/g, m =>
        `<a style="text-decoration:none;color:#000;font-weight:bold;"${
          m === '@all' ? '#' : ' href="/profile/' + m.substring(1) + '"'
        }>${m}</a>`
      )
    );
  }
}
