import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Observable';

export class FakeTestimonialService {

  public getAll(): Observable<any> {
    return TestHelper.noResponse();
  }

  public getAllAdmin(): Observable<any> {
    return TestHelper.noResponse();
  }

  public post(testimonial: string, anonymous: boolean): Observable<any> {
    return TestHelper.noResponse();
  }

  public toggleReviewed(testimonialId: string): Observable<any> {
    return TestHelper.noResponse();
  }

  public delete(testimonial) {
    return TestHelper.noResponse();
  }

}
