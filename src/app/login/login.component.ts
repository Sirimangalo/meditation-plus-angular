import { Component } from '@angular/core';
import { UserService } from '../user/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  template: require('./login.html'),
})
export class Login {

  username: string;
  email: string;
  password: string;
  password2: string;
  error: string;
  doSignup: boolean = false;

  constructor(
    public userService: UserService,
    public router: Router
  ) {

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

    if(this.doSignup) {
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
      !this.username ||
      !this.password ||
      !this.password2 ||
      !this.email) {
      this.error = 'Please enter your username, both passwords and your email address.';
      return;
    }

    if (this.password !== this.password2) {
      this.error = 'The passwords do not match.';
      return;
    }

    this.userService.signup(this.username, this.password, this.email)
    .subscribe(() => {
      // Successfully signed up
      this.toggleSignup();
      this.error = 'You have successfully signed up. Please login now.';
      this.clear();
    }, (err) => {
      this.error = err.text();
    })
  }

  /**
   * Clear input fields
   */
  clear() {
    this.username = '';
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
    if (!this.username || !this.password) {
      this.error = 'Please enter your username and password.';
      return;
    }

    this.userService.login(this.username, this.password)
    .subscribe(() => {
      this.router.navigate(['/']);
    }, () => {
      this.error = 'Invalid credentials.';
    })
  }
}
