import { inject } from '@angular/core/testing';
import { MentionsPipe } from './mentions.pipe';
import { DomSanitizer } from '@angular/platform-browser';

describe('Pipe: ActorAge', () => {
  let pipe: MentionsPipe;

  beforeEach(inject([DomSanitizer], (ds: DomSanitizer) => {
      ds.bypassSecurityTrustHtml = (x) => {
        return x;
      };
      pipe = new MentionsPipe(ds);
    })
  );

  it('should transform @john', () => {
    expect(pipe.transform('@john')).toContain('/profile/john');
  });
  it('should not have hyperlink', () => {
    expect(pipe.transform('hello there')).not.toContain('/profile/');
  });

});
