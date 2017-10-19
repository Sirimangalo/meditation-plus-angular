import { FormatHourPipe } from './hour.pipe';
import * as moment from 'moment-timezone';

describe('Pipe: FormatHour', () => {
  let pipe: FormatHourPipe;

  beforeEach(() => {
    pipe = new FormatHourPipe();
  });

  it('should return empty string if invalid', () => {
    expect(pipe.transform('')).toBe('');
    expect(pipe.transform('invalid')).toBe('');
    expect(pipe.transform({})).toBe('');
    expect(pipe.transform({a: 3})).toBe('');
    expect(pipe.transform(null)).toBe('');
    expect(pipe.transform(false)).toBe('');
  });

  it('should format numbers correctly', () => {
    expect(pipe.transform(0)).toBe('00:00');
    expect(pipe.transform(1)).toBe('00:01');
    expect(pipe.transform(19)).toBe('00:19');
    expect(pipe.transform(159)).toBe('01:59');
    expect(pipe.transform(1559)).toBe('15:59');
    expect(pipe.transform(600)).toBe('06:00');
    expect(pipe.transform(2301)).toBe('23:01');
  });

  it('should format date/moment objects correctly', () => {
    expect(pipe.transform(new Date(Date.UTC(2017,  9, 26, 10, 10, 0)))).toBe('10:10');
    expect(pipe.transform(new Date('2014-06-01T00:06:00Z'))).toBe('00:06');
    expect(pipe.transform(new Date('2014-06-01T23:59:00Z'))).toBe('23:59');
    expect(pipe.transform(moment('2014-06-01T23:59:00Z'))).toBe('23:59');
    expect(pipe.transform(moment.utc('2014-06-01T23:59:00Z'))).toBe('23:59');
    expect(pipe.transform(moment.tz('2014-06-01T23:59:00Z', 'Asia/Tokyo'))).toBe('23:59');
  });

  it('should format numbers correctly with timezones', () => {
    expect(pipe.transform(10, 'America/Toronto', 'America/Toronto')).toBe('00:10');
    expect(pipe.transform(700, 'America/Toronto', 'Europe/Berlin')).toBe('13:00');
    expect(pipe.transform(1830, 'America/Toronto', 'Europe/Berlin')).toBe('00:30');
    expect(pipe.transform(930, 'America/Toronto', 'Europe/Berlin')).toBe('15:30');
  });

  it('should format date/moment objects correctly with timezones', () => {
    expect(pipe.transform(new Date('2014-06-01T16:16:00Z'), 'America/Toronto', 'America/Toronto')).toBe('16:16');
    expect(pipe.transform(new Date('2014-06-01T07:00:00Z'), 'America/Toronto', 'Europe/Berlin')).toBe('13:00');
    expect(pipe.transform(moment('2014-06-01T07:00:00Z'), 'America/Toronto', 'Europe/Berlin')).toBe('13:00');
    expect(pipe.transform(moment.utc('2014-06-01T07:00:00Z'), 'America/Toronto', 'Europe/Berlin')).toBe('13:00');
    expect(pipe.transform(moment('2014-06-01T18:30:00Z'), 'America/Toronto', 'Europe/Berlin')).toBe('00:30');
    expect(pipe.transform(moment('2014-06-01T09:30:00Z'), 'America/Toronto', 'Europe/Berlin')).toBe('15:30');
  });
});
