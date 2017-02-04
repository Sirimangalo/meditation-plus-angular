[![Travis CI](https://api.travis-ci.org/Sirimangalo/meditation-plus-angular.svg)](https://travis-ci.org/Sirimangalo/meditation-plus-angular)
[![Dependency Status](https://david-dm.org/Sirimangalo/meditation-plus-angular.svg)](https://david-dm.org/Sirimangalo/meditation-plus-angular)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

# Angular2 Client for Meditation+ REST API

![Screenshot of meditation tab](https://raw.githubusercontent.com/Sirimangalo/meditation-plus-angular/master/src/assets/img/screenshot.jpg)
![Screenshot of doing meditation](https://raw.githubusercontent.com/Sirimangalo/meditation-plus-angular/master/src/assets/img/screenshot2.jpg)
![Screenshot of profile](https://raw.githubusercontent.com/Sirimangalo/meditation-plus-angular/master/src/assets/img/screenshot3.jpg)

## Quick Start

### Configuration
Add a `src/api.config.ts`:

```js
export let ApiConfig = {
  url: 'http://localhost:3002' // our REST endpoint
};
```

### Install dependencies and run
```
yarn
ng serve
```