import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Rx';

export class FakeMeditationService {

  public getRecent() {
    return TestHelper.fakeResponse([
      {
        '_id': '151',
        'updatedAt': '2017-06-10T06:20:13.856Z',
        'sitting': 40,
        'walking': 0,
        'createdAt': '2017-06-10T06:16:33.905Z',
        'end': '2017-06-10T06:56:33.905Z',
        'user': {
          '_id': '5',
          'gravatarHash': 'hhhh',
          'name': 'Ulric',
          'country': 'US',
          'username': 'Ulric'
        },
        'numOfLikes': 1,
        '__v': 0,
        'walkingLeft': 0,
        'sittingLeft': 31,
        'status': 'sitting'
      },
      {
        '_id': '152',
        'updatedAt': '2017-06-10T06:21:29.644Z',
        'sitting': 30,
        'walking': 0,
        'createdAt': '2017-06-10T06:21:29.644Z',
        'end': '2017-06-10T06:51:29.644Z',
        'user': {
          '_id': '3',
          'gravatarHash': 'gggg',
          'name': 'Steve',
          'username': 'Steve',
          'country': 'GB'
        },
        'numOfLikes': 0,
        '__v': 0,
        'walkingLeft': 0,
        'sittingLeft': 26,
        'status': 'sitting'
      },  // below is finished

      {
        '_id': '123',
        'updatedAt': '2017-06-10T04:53:20.463Z',
        'sitting': 60,
        'walking': 0,
        'createdAt': '2017-06-10T04:47:53.504Z',
        'end': '2017-06-10T05:47:53.504Z',
        'user': {
          '_id': '1',
          'gravatarHash': 'nnnn',
          'name': 'Sam',
          'country': 'US',
          'username': 'sammy'
        },
        'numOfLikes': 1,
        '__v': 0,
        'walkingLeft': 0,
        'sittingLeft': 0,
        'status': 'done'
      },
      {
        '_id': '124',
        'updatedAt': '2017-06-10T04:53:20.463Z',
        'sitting': 60,
        'walking': 0,
        'createdAt': '2017-06-10T03:42:22.749Z',
        'end': '2017-06-10T04:42:22.749Z',
        'user': {
          '_id': '2',
          'gravatarHash': 'kkkk',
          'name': 'Matt',
          'country': 'GB',
          'username': 'Matt'
        },
        'numOfLikes': 1,
        '__v': 0,
        'walkingLeft': 0,
        'sittingLeft': 0,
        'status': 'done'
      },
      {
        '_id': '125',
        'updatedAt': '2017-06-10T03:39:52.863Z',
        'sitting': 30,
        'walking': 30,
        'createdAt': '2017-06-10T02:33:37.058Z',
        'end': '2017-06-10T03:33:37.058Z',
        'user': {
          '_id': '3',
          'gravatarHash': 'llll',
          'name': 'Adam',
          'country': 'IL',
          'username': 'adam'
        },
        'numOfLikes': 2,
        '__v': 0,
        'walkingLeft': 0,
        'sittingLeft': 0,
        'status': 'done'
      }]);
  }

  public getTimes() {
    return TestHelper.fakeResponse(
      {
        '0': 2448,
        '1': 4340,
        '2': 2179,
        '3': 3186,
        '4': 3999,
        '5': 3502,
        '6': 5516,
        '7': 5810,
        '8': 3806,
        '9': 2936,
        '10': 4659,
        '11': 4966,
        '12': 3758,
        '13': 3720,
        '14': 4125,
        '15': 6568,
        '16': 9166,
        '17': 4655,
        '18': 2703,
        '19': 2202,
        '20': 4874,
        '21': 4021,
        '22': 3718,
        '23': 2464
      }
    );
  }

  public post(walking: number, sitting: number, start = null) {
    return TestHelper.noResponse();
  }

  public stop() {
    return TestHelper.noResponse();
  }

  public like() {
    return TestHelper.noResponse();
  }

  public getSocket(): Observable<any> {
    return TestHelper.noResponse();
  }

}
