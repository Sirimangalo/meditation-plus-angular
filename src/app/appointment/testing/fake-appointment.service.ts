import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Observable';
export class FakeAppointmentService {

  public getAll() {
    return TestHelper.noResponse();
  }

  public get(id: string) {
    return TestHelper.noResponse();
  }

  public save(appointment) {
    return TestHelper.noResponse();
  }

  public registration(appointment) {
    return TestHelper.noResponse();
  }

  public getSocket(): Observable<any> {
    return TestHelper.noResponse();
  }

  public getNow(join = false): Observable<any> {
    return TestHelper.noResponse();
  }

  public delete(appointment) {
    return TestHelper.noResponse();
  }

  public deleteRegistration(appointment) {
    return TestHelper.noResponse();
  }
}
