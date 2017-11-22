import { Component, ChangeDetectionStrategy, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'badge',
  templateUrl: './badge.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: [
    './badge.component.styl'
  ]
})
export class BadgeComponent implements OnChanges {
  @Input() consecutiveDays: number;

  stars: Array<{title: string, level: number}> = [];

  mergeAt = 4;
  maxLevel = 4;

  ngOnChanges() {
    if (this.consecutiveDays > 0) {
      this.stars = [];
      this.mergeBadges(this.maxLevel, this.consecutiveDays);
    }
  }

  /**
   * Calculates the set of badges/stars for a given value of
   * consecutive days.
   *
   * @param {number} level             Start calculation on this level, then
   *                                   iteratively decrease the level by 1.
   * @param {number} consecutiveDays   Number of consecutive days used for calculation
   */
  mergeBadges(level, consecutiveDays): void {
    if (level <= 0 || consecutiveDays <= 0) {
      return;
    }

    // Calculate the number of minutes the badge at the
    // current level stands for, meaning
    //   level 1 = 10                           consecutive days
    //   level 2 = 4 * level 1 = 4^(2-1) * 10   consecutive days
    //   level 3 = 4 * level 2 = 4^(3-1) * 10   consecutive days
    //   ...
    const badgeValue = 10 * Math.pow(4, level - 1);

    // Determine the number of badges for 'consecutiveDays'
    const badgeCount = Math.floor(consecutiveDays / badgeValue);


    // Add new badges for this level
    for (let i = 0; i < badgeCount; i++) {
      this.stars.push({
        level: level,
        title: level === 1
          ? '10 consecutive days'
          : this.mergeAt + ' badges of level ' + (level - 1).toString()
      });
    }

    // Determine the days that are left without a badge,
    // then use this value for recursion.
    const daysLeft = consecutiveDays - badgeCount * badgeValue;
    if (daysLeft > 9 && level > 1) {
      this.mergeBadges(level - 1, daysLeft);
    }
  }
}
