import { Injectable } from '@angular/core';
import { AuthHttp } from 'angular2-jwt/angular2-jwt';
import { ApiConfig } from '../../api.config.ts';
import { Headers } from '@angular/http';

@Injectable()
export class CommitmentService {

  public constructor(public authHttp: AuthHttp) {
  }

  public getAll() {
    return this.authHttp.get(
      ApiConfig.url + '/api/commitment'
    );
  }

  public get(id: string) {
    return this.authHttp.get(
      ApiConfig.url + '/api/commitment/' + id
    );
  }

  public getCurrentUser() {
    return this.authHttp.get(
      ApiConfig.url + '/api/commitment/user'
    );
  }

  public save(commitment) {
    const method = commitment._id ? 'put' : 'post';

    return this.authHttp[method](
      ApiConfig.url + '/api/commitment' + (commitment._id ? '/' + commitment._id : ''),
      commitment, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public commit(commitment) {
    return this.authHttp.post(
      ApiConfig.url + '/api/commitment/' + commitment._id + '/commit',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public uncommit(commitment) {
    return this.authHttp.post(
      ApiConfig.url + '/api/commitment/' + commitment._id + '/uncommit',
      '', {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  public delete(commitment) {
    return this.authHttp.delete(
      ApiConfig.url + '/api/commitment/' + commitment._id, {
      headers: new Headers({
        'Content-Type': 'application/json'
      })
    });
  }

  /**
   * Determines the percentage of the reached goal.
   */
  public reached(meditations, commitment) {
    if (commitment.type === 'daily') {
      let sum = 0;

      // Sum minutes per day for the last week
      for (let key of Object.keys(meditations.lastDays)) {
        const meditated = meditations.lastDays[key];
        // Cut meditated minutes to the max of the commitment to preserve
        // a correct average value.
        sum += meditated > commitment.minutes ? commitment.minutes : meditated;
      }

      // build the average and compare it to goal
      let avg = sum / Object.keys(meditations.lastDays).length;
      let result = Math.round(100 * avg / commitment.minutes);

      return result;
    }

    if (commitment.type === 'weekly') {
      const keys = Object.keys(meditations.lastWeeks);

      // Get last entry of lastWeeks
      const lastWeekSum = meditations.lastWeeks[keys[keys.length - 1]];

      // compare it to goal
      let result = Math.round(100 * lastWeekSum / commitment.minutes);

      return result;
    }
  }

}
