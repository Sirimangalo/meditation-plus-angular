import {
  Component,
  Pipe,
  PipeTransform,
  ViewChild,
  ElementRef,
  ApplicationRef
} from '@angular/core';
import { TestimonialService } from './testimonials.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Rx';
import { DateFormatPipe } from 'angular2-moment';

@Component({
  selector: 'testimonials',
  template: require('./testimonials.html'),
  pipes: [DateFormatPipe],
  styles: [
    require('./testimonials.css')
  ]
})
export class TestimonialComponent {

  @ViewChild('testimonialsList', {read: ElementRef}) testimonialsList: ElementRef;

  testimonials: Object[];
  allowUser: boolean = true;
  showForm: boolean = false;
  submitTestimonial: string = '';
  submitAnonymous: boolean = false;
  lastScrollTop: number = 0;
  lastScrollHeight: number = 0;

  constructor(
    public testimonialService: TestimonialService,
    public router: Router,
    private appRef: ApplicationRef
  ) {

  }

  scroll() {
    this.lastScrollHeight = this.testimonialsList.nativeElement.scrollHeight;
    this.lastScrollTop = this.testimonialsList.nativeElement.scrollTop;
  }

  getUrlString(url) {
    return 'url("' + url + '")';
  }

  loadTestimonials() {
    this.testimonialService.getRecent()
      .map(res => res.json())
      .subscribe(data => {
        this.testimonials = data;
        this.appRef.tick();
      });
  }

  sendTestimonial(evt) {
    evt.preventDefault();

    if (!this.submitTestimonial)
      return;

    this.testimonialService.post(this.submitTestimonial, this.submitAnonymous)
      .subscribe(() => {
        this.submitTestimonial = '';
        this.submitAnonymous = false;
        this.toggleShowForm();
      }, (err) => {
        console.error(err);
      });
  }

  toggleShowForm() {
    this.showForm = !this.showForm;
  }

  ngOnInit() {
    // getting chat data instantly
    this.loadTestimonials();
  }
}
