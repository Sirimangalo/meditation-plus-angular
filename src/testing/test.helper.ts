import { Response, ResponseOptions } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { ComponentFixture, tick } from '@angular/core/testing';

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

  public static noResponse() {
    return Observable.create(() => {
    });
  }

  public static dispatchEvent(element: any, eventType: any) {
    element.dispatchEvent(new Event(eventType));
  }

  public static setInputValue(inputElement: HTMLInputElement , value: string) {
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('input'));
  }

  /**
   * tell Angular to update html after changing component member
   * @param fixture
   * @returns {Promise<any>}
   */
  public static advance(fixture: ComponentFixture<any>) {
    fixture.detectChanges();
    return fixture.whenStable();
  }
}
