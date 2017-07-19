import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Rx';

export class FakeSettingsService {
  public get() {
    return TestHelper.noResponse();
  }

  public set(property, value) {
    return TestHelper.noResponse();
  }
}
