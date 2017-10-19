import { TestHelper } from '../../../testing/test.helper';

export class FakeSettingsService {
  public get() {
    return TestHelper.noResponse();
  }

  public set(property, value) {
    return TestHelper.noResponse();
  }
}
