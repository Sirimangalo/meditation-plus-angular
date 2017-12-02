import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartsModule } from 'ng2-charts';

import { ProfileChartComponent } from './profile-chart.component';

describe('ProfileChartComponent', () => {
  let component: ProfileChartComponent;
  let fixture: ComponentFixture<ProfileChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ChartsModule
      ],
      declarations: [ ProfileChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should rotate arrays correctly', () => {
    expect(component.rotateArray([], 2)).toEqual([]);
    expect(component.rotateArray([1], 2)).toEqual([1]);
    expect(component.rotateArray([3, 1, 2], 1)).toEqual([1, 2, 3]);
    expect(component.rotateArray([1, 2, 3], 3)).toEqual([1, 2, 3]);
    expect(component.rotateArray([3, 1, 2], 10)).toEqual([1, 2, 3]);
    expect(component.rotateArray([4, 5, 1, 2, 3], 2)).toEqual([1, 2, 3, 4, 5]);
  });
});
