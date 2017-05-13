import { Component, OnInit } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AppState } from '../app.service';

@Component({
  selector: 'login',
  styleUrls: [
    './login.component.styl'
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  username: string;
  name: string;
  email: string;
  password: string;
  password2: string;
  error: string;
  message: string;
  doSignup = false;
  loading = false;
  btnResend: boolean;
  usernameRequested = false;

  constructor(
    public userService: UserService,
    public router: Router,
    public appState: AppState,
    private route: ActivatedRoute
  ) {
    this.appState.set('title', '');
  }

  /**
   * Toggle Signup Mode
   */
  toggleSignup(evt = null) {
    if (evt) {
      evt.preventDefault();
    }

    this.doSignup = !this.doSignup;
    this.error = '';
  }

  /**
   * Submitting the form
   */
  submit(evt = null) {
    if (evt) {
      evt.preventDefault();
    }

    if (this.doSignup) {
      this.signup();
      return;
    }
    this.login();
  }

  /**
   * A method for signing up
   */
  signup() {
    this.error = '';

    // Validations
    if (
      !this.name ||
      !this.password ||
      !this.password2 ||
      !this.email) {
      this.error = 'Please enter your name, both passwords and your email address.';
      return;
    }

    if (this.password !== this.password2) {
      this.error = 'The passwords do not match.';
      return;
    }

    this.loading = true;

    this.userService.signup(this.name, this.password, this.email, this.username)
    .subscribe(
      () => {
        // Successfully signed up
        this.toggleSignup();
        this.message = 'You have successfully signed up. Please verify your email address before you can login.';
        this.clear();
      },
      err => {
        this.error = err.text();
        this.loading = false;
      },
      () => this.loading = false
    );
  }

  /**
   * Clear input fields
   */
  clear() {
    this.name = '';
    this.password = '';
    this.password2 = '';
    this.email = '';
    this.btnResend = false;
  }

  /**
   * Method to login the user
   */
  login() {
    this.error = '';

    // Validation
    if (!this.email || !this.password) {
      this.error = 'Please enter your email and password.';
      return;
    }

    // check if localStorage is available
    const storageError = this.checkLocalStorage();
    if (storageError !== null) {
      this.error = storageError;
      return;
    }

    this.loading = true;

    this.userService.login(this.email, this.password, this.username)
    .subscribe(
      () => this.router.navigate(['/']),
      err => {
        this.error = err.status === 401
          ? err.text()
          : 'An error occurred. Please try again later.';
        this.loading = false;
        this.btnResend = this.error.indexOf('confirm your email address') > -1;
        this.usernameRequested = this.error.indexOf('Please choose a username') > -1
          || (this.usernameRequested && this.error.indexOf('This username is already taken.') > -1);
      }
    );
  }

  /**
   * Resend activation email
   */
  resendEmail() {
    if (!this.email) {
      return;
    }

    this.userService.resend(this.email)
      .subscribe(
        () => {
          this.error = '';
          this.btnResend = false;
          this.message = 'Email was send successfully.';
        },
        err => this.error = 'Failed to resend email.'
      );
  }

  /**
   * Checks if localStorage is available and accessible.
   * Source: http://stackoverflow.com/a/27081419
   * @return {string} null = ok, otherwise error message
   */
  checkLocalStorage(): string {
    if (typeof localStorage !== 'object') {
      return `Your browser does not support storing login credentials locally
        which is required for this site.`;
    }

    try {
      localStorage.setItem('localStorage', '1');
      localStorage.removeItem('localStorage');
      return null;
    } catch (e) {
      return `Your browser prevents storing login credentials locally.
      The most common cause of this is using "Private Browsing Mode".
      You need to turn that off in order to use this site.`;
    }
  }

  ngOnInit() {
    const verificationToken = this.route.snapshot.params['verify'];

    if (verificationToken) {
      this.userService
        .verify(verificationToken)
        .subscribe(
          () => this.message = 'Your email has been verified successfully. You can now login.',
          () => this.error = 'An error occurred. Please try clicking the verification link again or contact the IT support.'
        );
    }
  }
}
