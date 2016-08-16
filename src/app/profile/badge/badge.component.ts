import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
  selector: 'badge',
  template: require('./badge.component.html'),
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    require('./badge.component.css')
  ]
})
export class BadgeComponent {
  @Input() badges: string[];

  stars: Array<{title: string, level: number}> = [];
  mergeAt: number = 4;

  ngOnChanges() {
    this.stars = this.badges.map(badge => {
      return {title: badge + ' consecutive days', level: 1};
    });
    this.mergeBadges();
  }

  /**
   * Merging number of badges defined in `mergeAt` in the same level
   * to a badge to the next level.
   * @param {number = 1} level Level to merge
   */
  mergeBadges(level: number = 1) {
    // count mergable badges in this level
    let mergeCount: number = Math.floor(
      this.stars.filter(star => star.level === level).length / this.mergeAt
    );

    if (mergeCount < 1) {
      return;
    }

    // remove number of mergable badges in this level
    let removeCount = mergeCount * this.mergeAt;
    this.stars = this.stars.filter(star => {
      const result: boolean = star.level !== level || removeCount < 1;
      removeCount--;
      return result;
    });

    // add number merged badges for next level
    for (; mergeCount > 0; mergeCount--) {
      this.stars.push({
        title: `Four badges of level ${level}.`,
        level: level + 1
      });
    }

    this.mergeBadges(level + 1);
  }
}
