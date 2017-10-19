import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TestimonialComponent } from './testimonial.component';
import { MaterialModule } from '../shared/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { AvatarDirective } from '../profile/avatar.directive';
import { EmojiModule } from 'app/emoji';
import { LinkyModule } from 'angular-linky';
import { FakeTestimonialService } from 'app/testimonial/testing/fake-testimonial.service';
import { TestimonialService } from './testimonial.service';

describe('TestimonialComponent', () => {
  let component: TestimonialComponent;
  let fixture: ComponentFixture<TestimonialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TestimonialComponent,
        AvatarDirective,
      ],
      imports: [
        MaterialModule,
        FormsModule,
        LinkyModule,
        EmojiModule,
        RouterTestingModule
      ],
      providers: [
        {provide: TestimonialService, useClass: FakeTestimonialService},
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestimonialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
