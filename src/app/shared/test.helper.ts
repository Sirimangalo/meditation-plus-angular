import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';

export class TestHelper {
  public static fakeResponse(json: {} = {}) {
    return Observable.create(obs => {
      obs.next(
        new Response(
          new ResponseOptions({
            body: json
          })
        )
      );
      obs.complete();
    });
  }

  public static noRespose() {
    return Observable.create(() => {});
  }
}
