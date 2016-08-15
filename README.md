[![Travis CI](https://api.travis-ci.org/Sirimangalo/meditation-plus-angular.svg)](https://travis-ci.org/Sirimangalo/meditation-plus-angular)
[![Dependency Status](https://david-dm.org/Sirimangalo/meditation-plus-angular.svg)](https://david-dm.org/Sirimangalo/meditation-plus-angular)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

# Angular2 Client for Meditation+ REST API

![Meditation+ Screenshot](https://raw.githubusercontent.com/Sirimangalo/meditation-plus-angular/master/src/assets/img/screenshot.png)

## Quick Start

### Configuration
Add a `src/api.config.ts`:

```js
export let ApiConfig = {
  url: 'http://localhost:3002' // our REST endpoint
};
```
### Add required global libraries
```
npm install typings webpack-dev-server rimraf webpack -g
```

### Install dependencies and run
```
npm install
typings install
npm run start:hmr
```
