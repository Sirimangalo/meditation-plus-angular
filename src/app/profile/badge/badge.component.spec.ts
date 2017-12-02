import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BadgeComponent } from './badge.component';
import { MaterialModule } from '../../shared/material.module';

describe('BadgeComponent', () => {
  let component: BadgeComponent;
  let fixture: ComponentFixture<BadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        BadgeComponent
      ],
      imports: [
        MaterialModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Badge Algorithm', () => {
    // Function for quickly checking the state of all stars.
    // Call like: checkBadges(100, { 1: 2, 2: 1 }) => true
    const checkBadges = (val, obj) => {
      // call function
      component.stars = [];
      component.mergeBadges(component.maxLevel, val);

      // check for too many badges
      for (const star of component.stars) {
        if (!(star.level in obj) || obj[star.level] < 0) {
          // return right away
          return false;
        }

        obj[star.level]--;
      }

      // check for too less badges
      for (const key in obj) {
        if (obj[key] !== 0) {
          return false;
        }
      }

      // passed test & also reset component stars
      component.stars = [];
      return true;
    };

    it('should calculate common values correctly', () => {
      expect(checkBadges(10, {
        1: 1
      })).toBe(true);

      expect(checkBadges(15, {
        1: 1
      })).toBe(true);

      expect(checkBadges(25, {
        1: 2
      })).toBe(true);

      expect(checkBadges(39, {
        1: 3
      })).toBe(true);

      expect(checkBadges(81, {
        2: 2
      })).toBe(true);

      expect(checkBadges(91, {
        2: 2,
        1: 1
      })).toBe(true);

      expect(checkBadges(100, {
        2: 2,
        1: 2
      })).toBe(true);

      expect(checkBadges(154, {
        2: 3,
        1: 3
      })).toBe(true);

      expect(checkBadges(164, {
        3: 1
      })).toBe(true);

      expect(checkBadges(443, {
        3: 2,
        2: 3
      })).toBe(true);

      expect(checkBadges(452, {
        3: 2,
        2: 3,
        1: 1
      })).toBe(true);

      expect(checkBadges(1200, {
        4: 1,
        3: 3,
        2: 2
      })).toBe(true);

      expect(checkBadges(1215, {
        4: 1,
        3: 3,
        2: 2,
        1: 1
      })).toBe(true);
    });

    it('should calculate very high values correctly', () => {
      expect(checkBadges(2420, {
        4: 3,
        3: 3,
        1: 2
      })).toBe(true);

      expect(checkBadges(6400, {
        4: 10
      })).toBe(true);
    });

    it('should not do crazy stuff', () => {
      component.stars = [];
      component.mergeBadges(null, 100);
      component.mergeBadges(4, -100);
      component.mergeBadges(-4, -100);
      component.mergeBadges(4, null);
      component.mergeBadges(3.4, null);
      expect(component.stars).toEqual([]);
    });
  });
});
