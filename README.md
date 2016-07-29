[![Travis CI](https://api.travis-ci.org/Sirimangalo/meditation-plus-angular.svg)](https://travis-ci.org/Sirimangalo/meditation-plus-angular)
[![Dependency Status](https://david-dm.org/Sirimangalo/meditation-plus-angular.svg)](https://david-dm.org/Sirimangalo/meditation-plus-angular)

# Angular2 Client for Meditation+ REST API

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
