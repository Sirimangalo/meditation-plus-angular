import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Rx';

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

  public delete(appointment) {
    return TestHelper.noResponse();
  }

  public deleteRegistration(appointment) {
    return TestHelper.noResponse();
  }

  public updateIncrement(increment: Number) {
    return TestHelper.noResponse();
  }

  public getIncrement() {
    return TestHelper.noResponse();
  }
}
