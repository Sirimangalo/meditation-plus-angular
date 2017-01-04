import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';
import { Observable } from 'rxjs/Rx';

@Injectable()
export class WikiService {

  public constructor(public authHttp: AuthHttp) { }


  /**
   * Submit a new video or modify an old one
   * @param  {string}          url      URL/videID of video
   * @param  {string}          category category of video
   * @param  {string}          tags     list of comma separated tags
   * @return {Observable<any>}          [description]
   */
  public submit(url: string, category: string, tags: string): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/wiki',
      JSON.stringify({
        url: url,
        category: category,
        tags: tags
      }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Get structure of the whole Wiki
   */
  public getStructure(): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/wiki', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
      }
    );
  }

  /**
   * Get all videos of a certain category
   * @param  {string}          category name of the category
   */
  public getCategory(category: string): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/wiki/' + category, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
      }
    );
  }

  /**
   * Get a single video by videoID
   * @param  {string}          videoID videoID of video
   */
  public getVideo(videoID: string): Observable<any> {
    return this.authHttp.get(
      ApiConfig.url + '/api/wiki/video/' + videoID, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
      }
    );
  }

  /**
   * Submit a search query
   * @param  {string}          search search string
   */
  public search(search: string): Observable<any> {
    return this.authHttp.post(
      ApiConfig.url + '/api/wiki/search',
      JSON.stringify({
        search: search
      }), {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
      }
    );
  }

  /**
   * Delete a video
   * @param {string} videoID video's videoID
   */
  public delete(videoID: string) {
    return this.authHttp.delete(
      ApiConfig.url + '/api/wiki/' + videoID, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

}
