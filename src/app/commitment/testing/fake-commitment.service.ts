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
        'idXY': {
          '_id': 'idXY',
          'type': 'daily',
          'minutes': 20,
          'reached': 40
        }
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
