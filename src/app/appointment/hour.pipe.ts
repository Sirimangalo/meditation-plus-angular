import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment-timezone';

/*
 * Format a date, moment or number representing an hour to a formatted string and
 * optionally sets timezone.
 *
 * Usage:
 *   value | formatHour:timezoneFrom:timezoneTo
 * Example:
 *   {{ 700 | formatHour }}
 *   formats to: '07:00'
 *
 *   {{ 700 | formatHour:'America/Toronto':'Europe/Berlin' }}
 *   formats to: '13:00'
*/
@Pipe({name: 'formatHour'})
export class FormatHourPipe implements PipeTransform {
  hourToString(hour: number): string {
    // avoid overflows
    hour = ((hour % 2400) + 2400) % 2400;

    const hourStr = '0000' + hour.toString();
    return hourStr.substr(-4, 2) + ':' + hourStr.substr(-2, 2);
  }

  transform(value: any, timezoneFrom?: string, timezoneTo?: string): string {
    if (typeof value === 'string') {
      value = parseInt(value, 10);

      if (isNaN(value)) {
        return '';
      }
    }

    if (typeof value !== 'number' && !(value instanceof Date) && !moment.isMoment(value)) {
      return '';
    }

    if (!timezoneFrom) {
      return typeof value === 'number'
        ? this.hourToString(value)
        : moment.utc(value).format('HH:mm');
    } else {
      timezoneTo = timezoneTo ? timezoneTo : moment.tz.guess();

      return moment
        .tz(
          typeof value === 'number'
            ? this.hourToString(value)
            : moment.utc(value).format('HH:mm'),
          'HH:mm',
          timezoneFrom
        )
        .tz(timezoneTo)
        .format('HH:mm');
    }
  }
}
