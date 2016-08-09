import { Component, EventEmitter, Output } from '@angular/core';

/**
 * Component for the selection of emojis.
 * The ./emojione-awesome.css needs to be included app-wide.
 */
@Component({
  selector: 'emoji-select',
  styles: [
    require('./emoji-select.component.css')
  ],
  template: require('./emoji-select.component.html')
})
export class EmojiSelectComponent {
  @Output() selected: EventEmitter<string> = new EventEmitter<string>();

  // Emojis that should be displayed for selection
  emojiList: string[] = [
    'question',
    'slight_smile',
    'sunglasses',
    'grin',
    'grinning',
    'grimacing',
    'wink',
    'cry',
    'frowning2',
    'neutral_face',
    'kissing_heart',
    'stuck_out_tongue_winking_eye',
    'blush',
    'angry',
    'heart_eyes',
    'sleeping',
    'thumbsup',
    'pray',
    'zipper_mouth',
    'mask',
    'thermometer_face',
    'head_bandage',
    'sleeping',
    'sleepy',
    'snake',
    'monkey',
    'dragon',
    'red_car',
    'taxi',
    'bus',
    'bike',
    'house_with_garden',
    'heart',
    'yellow_heart',
    'green_heart',
    'blue_heart',
    'purple_heart',
    'place_of_worship',
    'wave',
    'clap',
    'airplane',
    'upside_down',
    'peace',
    'thought_balloon',
    'raised_hand',
    'tongue',
    'ear',
    'nose',
    'eye',
    'footprints',
    'wheel_of_dharma'
  ];

  /**
   * Handler for the selection of an emoji.
   * @param {[type]} evt   Click event
   * @param {string} emoji Selected emoji
   */
  select(evt, emoji: string) {
    evt.preventDefault();
    this.selected.emit(emoji);
  }
}
