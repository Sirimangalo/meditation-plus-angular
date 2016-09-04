import {
  Component,
  Pipe,
  PipeTransform,
  ViewChild,
  ElementRef,
  ApplicationRef
} from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { Response } from '@angular/http';
import { TestimonialService } from '../../testimonial';

@Component({
  selector: 'testimonial-admin',
  template: require('./testimonial-admin.html'),
  styles: [
    require('./testimonial-admin.css')
  ]
})
export class TestimonialAdminComponent {

  // testimonial data
  testimonials: Object[];
  showOnlyUnreviewed: boolean = true;

  constructor(public testimonialService: TestimonialService) {
    this.loadTestimonials();
  }

  /**
   * Loads all testimonials
   */
  loadTestimonials() {
    this.testimonialService.getAllAdmin()
      .map(res => res.json())
      .subscribe(data => this.testimonials = data.testimonials);
  }

  delete(evt, testimonial) {
    evt.preventDefault();

    if (!confirm('Are you sure?')) {
      return;
    }

    this.testimonialService
      .delete(testimonial)
      .subscribe(() => this.loadTestimonials());
  }

  toggleReviewed(testimonial) {
    this.testimonialService
      .toggleReviewed(testimonial._id)
      .subscribe(() => this.loadTestimonials());
  }

}
