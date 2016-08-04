import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';
import { AppState } from '../';

@Component({
  selector: 'login',
  styles: [
    require('./login.css')
  ],
  template: require('./login.html'),
})
export class Login {

  name: string;
  email: string;
  password: string;
  password2: string;
  error: string;
  message: string;
  doSignup: boolean = false;
  loading: boolean = false;

  constructor(
    public userService: UserService,
    public router: Router,
    public appState: AppState
  ) {
    this.appState.set('title', '');
  }

  /**
   * Toggle Signup Mode
   */
  toggleSignup(evt = null) {
    if (evt)
      evt.preventDefault();

    this.doSignup = !this.doSignup;
    this.error = '';
  }

  /**
   * Submitting the form
   */
  submit(evt = null) {
    if (evt)
      evt.preventDefault();

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

    this.userService.signup(this.name, this.password, this.email)
    .subscribe(
      () => {
        // Successfully signed up
        this.toggleSignup();
        this.message = 'You have successfully signed up. Please login now.';
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

    this.loading = true;

    this.userService.login(this.email, this.password)
    .subscribe(
      () => this.router.navigate(['/']),
      err => {
        this.error = err.status === 401
          ? 'Invalid credentials.'
          : 'An error occurred. Please try again later.';
        this.loading = false;
      }
    );
  }
}
