import { TestHelper } from '../../../testing/test.helper';

export class FakeCommitmentService {

  public getAll() {
    return TestHelper.noResponse();
  }

  public get(id: string) {
    return TestHelper.noResponse();
  }

  public getCurrentUser() {
    return TestHelper.fakeResponse(
      {
        '_id': '3',
        'updatedAt': '2017-06-10T06:28:57.955Z',
        'createdAt': '2016-08-05T13:59:43.763Z',
        'type': 'daily',
        'minutes': 20,
        'users': ['3', '4', '5'],
        '__v': 224
      }
    );
  }

  public save(commitment) {
    return TestHelper.noResponse();
  }

  public commit(commitment) {
    return TestHelper.noResponse();
  }

  public uncommit(commitment) {
    return TestHelper.noResponse();
  }

  public delete(commitment) {
    return TestHelper.noResponse();
  }

  /**
   * Determines the percentage of the reached goal.
   */
  public reached(meditations, commitment) {
    return 0;
  }
}
