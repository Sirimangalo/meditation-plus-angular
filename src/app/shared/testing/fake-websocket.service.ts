import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Observable';

export class FakeWebsocketService {

  public onConnected(): Observable<any> {
    return TestHelper.noResponse();
  }

  /**
   * Event that gets triggered when any user sends a new chat message
   */
  public onMessage(): Observable<any> {
    return TestHelper.noResponse();
  }
}
