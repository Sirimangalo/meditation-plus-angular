import { Response } from '@angular/http';
import { TestHelper } from '../../../testing/test.helper';
import { Observable } from 'rxjs/Observable';

export class FakeUserService {

  /**
   * Logging in a User via email and password.
   * @param {String} email
   * @param {String} password
   * @param {String} username
   */
  public login(email: string, password: string, username?: string) {
    return TestHelper.noResponse();
  }

  /**
   * Verify account by sending token received via email to server
   *
   * @param  {string}               token secret token
   */
  public verify(token: string): Observable<Response> {
    return TestHelper.noResponse();
  }

  /**
   * Resend email activation with token
   *
   * @param  {string}               email mail address of user
   */
  public resend(email: string): Observable<Response> {
    return TestHelper.noResponse();
  }

  public resetPasswordInit(email: string): Observable<Response> {
    return TestHelper.noResponse();
  }

  public resetPassword(userId: string, token: string, password: string): Observable<Response> {
    return TestHelper.noResponse();
  }

  /**
   * Register refresh subscription
   */
  public registerRefresh() {
  }

  getUserId(): string {
    return '';
  }

  /**
   * Checks whether the currently logged in user is an admin.
   * @return {boolean} true: admin, false: no admin
   */
  public isAdmin(): boolean {
    return false;
  }

  public signup(name: string, password: string, email: string, username: string) {
    return TestHelper.noResponse();
  }

  /**
   * Logging out the current user. Removes the token from
   * localStorage.
   */
  public logout(): void {

  }

  /**
   * Asks the server if we are logged in.
   */
  public loggedIn() {
  }

  /**
   * Updates the profile of the current user.
   * @param  {Object}                profile Profile data
   * @return {Observable<Response>}
   */
  public updateProfile(profile: Object): Observable<Response> {
    return TestHelper.noResponse();
  }

  /**
   * Gets the complete profile of the given id or, if null, the
   * currently logged in user.
   * @return {Observable<Response>}
   */
  public getProfile(id: string = null): Observable<Response> {
    return TestHelper.fakeResponse({
      '_id': '5',
      'gravatarHash': 'hash',
      'name': 'tom',
      'sound': '/assets/audio/bell.mp3',
      'local': {},
      'lastActive': '2017-06-10T07:02:00.656Z',
      'country': 'CA',
      'timezone': 'Pacific Standard Time',
      'lastMeditation': '2017-06-08T14:19:08.282Z',
      'description': '',
      'stableBell': true,
      'verified': true,
      'recoverUntil': '2017-05-16T00:49:43.075Z',
      'verifyToken': 'token',
      'username': 'tom',
      'meditations': {
        'lastMonths': {
          'Sep': 0,
          'Oct': 106,
          'Nov': 135,
          'Dec': 306,
          'Jan': 400,
          'Feb': 150,
          'Mar': 0,
          'Apr': 0,
          'May': 90,
          'Jun': 150
        },
        'lastWeeks': {
          '17-14': 0,
          '17-15': 0,
          '17-16': 0,
          '17-17': 0,
          '17-18': 0,
          '17-19': 0,
          '17-20': 30,
          '17-21': 0,
          '17-22': 90,
          '17-23': 120
        },
        'lastDays': {
          '1st': 0,
          '2nd': 0,
          '3rd': 30,
          '4th': 30,
          '5th': 30,
          '6th': 30,
          '7th': 0,
          '8th': 30,
          '9th': 0,
          '10th': 0
        },
        'consecutiveDays': [],
        'numberOfSessions': 48,
        'currentConsecutiveDays': 0,
        'totalMeditationTime': 1337,
        'averageSessionTime': 28,
        'lastDay': '2017-06-08T13:49:08.282Z'
      }
    });
  }

  /**
   * Gets the complete profile of the given username.
   * @return {Observable<Response>}
   */
  public getProfileByUsername(username: string): Observable<Response> {
    return TestHelper.noResponse();
  }

  public getAll() {
    return TestHelper.noResponse();
  }

  public search(term: string) {
    return TestHelper.noResponse();
  }

  public getOnlineUsers() {
    return TestHelper.noResponse();
  }

  public getOnlineCount() {
    return TestHelper.noResponse();
  }

  public getOnlineSocket(): Observable<any> {
    return TestHelper.noResponse();
  }

  public get(id: string) {
    return TestHelper.noResponse();
  }

  public save(user) {
    return TestHelper.noResponse();
  }

  public delete(user) {
    return TestHelper.noResponse();
  }

  public registerPushSubscription(subscription) {
    return TestHelper.noResponse();
  }

  public getUsername(search: string) {
    return TestHelper.noResponse();
  }

}
