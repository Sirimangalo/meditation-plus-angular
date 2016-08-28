import {
  inject,
  addProviders
} from '@angular/core/testing';
import { EmojiPipe } from './emoji.pipe';

describe('EmojiPipe', () => {
  let pipe: EmojiPipe;

  beforeEach(() => {
    addProviders([EmojiPipe]);
  });

  beforeEach(inject([EmojiPipe], p => {
    pipe = p;
  }));

  it('should throw if not used with a string', () => {
    // must use arrow function for expect to capture exception
    expect(() => pipe.transform(null)).toThrow();
    expect(() => pipe.transform(undefined)).toThrow();
  });

  it('should work with empty string', () => {
    expect(pipe.transform('')).toEqual('');
  });

  it('transforms ":grin:"', () => {
    expect(pipe.transform(':grin:')).toEqual('<i class="e1a-grin" title="grin"></i>');
  });

  it('transforms ":grin: :wink:"', () => {
    expect(pipe.transform(':grin: :wink:'))
      .toEqual('<i class="e1a-grin" title="grin"></i> <i class="e1a-wink" title="wink"></i>');
  });

  it('transforms ":grin::wink:"', () => {
    expect(pipe.transform(':grin::wink:'))
      .toEqual('<i class="e1a-grin" title="grin"></i><i class="e1a-wink" title="wink"></i>');
  });

  it('transforms ":grin::wink"', () => {
    expect(pipe.transform(':grin::wink'))
      .toEqual('<i class="e1a-grin" title="grin"></i>:wink');
  });

  it('should be case-insensitive', () => {
    expect(pipe.transform(':Grin:'))
      .toEqual('<i class="e1a-grin" title="grin"></i>');
  });
});
