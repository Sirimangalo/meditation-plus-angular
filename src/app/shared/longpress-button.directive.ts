import {
  Directive,
  Output,
  EventEmitter,
  HostBinding,
  HostListener,
  Input
} from '@angular/core';

/**
 * Detect long pressing.
 * Source: https://gist.github.com/amcdnl/32a5676ef5b4489ee5fbadf632642e01
 *
 * Usage:
 * <button
 *   long-press
 *   (onLongPressing)="myLongContinousPressFn()"
 *   (onLongPress)="myLongPressFn()"
 * />
 */
@Directive({
  selector: '[long-press]'
})
export class LongpressButtonDirective {

  @Input() disableLongpressing: boolean = false;
  _pressing: boolean = false;
  _longPressing: boolean = false;
  _timeout;
  _interval;

  @Output()
  onLongPress = new EventEmitter();

  @Output()
  onLongPressing = new EventEmitter();

  @HostBinding('class.press')
  get press() { return this._pressing; }

  @HostBinding('class.longpress')
  get longPress() { return this._longPressing; }

  @HostListener('mousedown', ['$event'])
  onMouseDown(event) {
    if (this.disableLongpressing) {
      return;
    }

    this._pressing = true;
    this._longPressing = false;

    this._timeout = setTimeout(() => {
     this._longPressing = true;
     this.onLongPress.emit(event);

     this._interval = setInterval(() => {
       this.onLongPressing.emit(event);
     }, 50);
    }, 300);
  }

  @HostListener('mouseup')
  onMouseUp = () => this.endPress()

  @HostListener('mouseleave')
  onMouseLeave = () => this.endPress()

  endPress() {
   clearTimeout(this._timeout);
   clearInterval(this._interval);

   this._longPressing = false;
   this._pressing = false;
  }
}
