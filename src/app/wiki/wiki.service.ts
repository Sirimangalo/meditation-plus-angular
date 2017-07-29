import { Injectable } from '@angular/core';
import { AuthHttp } from '../shared/auth-http.service';
import { ApiConfig } from '../../api.config';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { WebsocketService } from '../shared';

@Injectable()
export class WikiService {
  public constructor(
    public authHttp: AuthHttp,
    public wsService: WebsocketService
  ) {
  }

  public search(
    search: string = '',
    tags: string[] = [],
    sortBy: string = '',
    sortOrder: string = '',
    limit: number = 15,
    skip: number = 0
  ): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/wiki',
      JSON.stringify({
        search, tags, sortBy, sortOrder, limit, skip
      }), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public new(url: string, tags: string[], description: string = ''): Observable<any>  {
    return this.authHttp.post(
      ApiConfig.url + '/api/wiki/new',
      JSON.stringify({
        url, description, tags
      }), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public getTags(
    search: string = '',
    relatedTo: string[] = [],
    sortBy: string = '_id',
    sortOrder = 'ascending',
    limit: Number = 50,
    skip: Number = 0,
    populate: Boolean = false,
  ): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/wiki/tags',
      JSON.stringify({
        limit, skip, search, relatedTo, sortBy, sortOrder, populate
      }), {
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }
    );
  }

  public delete(entry): Observable<any> {
    if (!entry._id) {
      return;
    }

    return this.authHttp.delete(
      ApiConfig.url + '/api/wiki/' + entry._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }
}
