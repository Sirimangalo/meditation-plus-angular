import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Observable';

export class FakeQuestionService {
  public getQuestions(filterAnswered = false,
                      page = 0): Observable<any> {
    if (!filterAnswered) {
      return TestHelper.fakeResponse([{
        '_id': '1',
        'updatedAt': '2017-06-27T01:23:09.898Z',
        'createdAt': '2017-06-27T01:23:09.898Z',
        'text': 'unanswered-1\n',
        'user': {
          '_id': '2',
          'gravatarHash': '222hhh',
          'name': 'John',
          'username': 'Johny',
          'lastMeditation': '2017-06-27T01:41:53.933Z',
          'country': 'US'
        },
        'likes': ['444'], // user-id of like
        '__v': 0

      },
        {
          '_id': '2',
          'updatedAt': '2017-06-27T01:28:23.810Z',
          'createdAt': '2017-06-27T01:28:23.810Z',
          'text': 'unanswered-2\n',
          'user': {
            '_id': '3',
            'gravatarHash': '333hhh',
            'name': 'Mary',
            'username': 'maryjane'
          },
          'likes': [],
          '__v': 0
        }
      ]);
    } else {
      return TestHelper.fakeResponse([{
        '_id': '44',
        'updatedAt': '2017-06-24T03:17:39.209Z',
        'createdAt': '2017-06-24T03:15:20.746Z',
        'text': 'Answered-question-1',
        'user': {
          '_id': '666',
          'gravatarHash': '666hhh',
          'name': 'sri',
          'country': 'IN',
          'lastMeditation': '2017-06-05T00:56:20.706Z',
          'username': 'sridan'
        },
        'likes': [555],
        '__v': 0,
        'answered': true,
        'answeredAt': '2017-06-24T03:17:39.208Z'
      }
      ]);

    }
  }

  public post(question: string): Observable<any> {
    return TestHelper.noResponse();
  }

  public like(question): Observable<any> {
    return TestHelper.noResponse();
  }

  public delete(question): Observable<any> {
    return TestHelper.noResponse();
  }

  public answer(question): Observable<any> {
    return TestHelper.noResponse();
  }

  public answering(question): Observable<any> {
    return TestHelper.noResponse();
  }

  public unanswering(question): Observable<any> {
    return TestHelper.noResponse();
  }

  public findSuggestions(question: string): Observable<any> {
    return TestHelper.noResponse();
  }

  public getCount(): Observable<any> {
    return TestHelper.fakeResponse(3);
  }

  public getSocket(): Observable<any> {
    return TestHelper.noResponse();
  }
}
