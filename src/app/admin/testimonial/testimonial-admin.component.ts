import { Component } from '@angular/core';
import { TestimonialService } from '../../testimonial';

@Component({
  selector: 'testimonial-admin',
  templateUrl: './testimonial-admin.component.html',
  styleUrls: [
    './testimonial-admin.component.styl'
  ]
})
export class TestimonialAdminComponent {

  // testimonial data
  testimonials: Object[];
  showOnlyUnreviewed = true;

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
