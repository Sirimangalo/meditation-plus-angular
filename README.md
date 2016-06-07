# Angular2 Client for Meditation+ REST API

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
npm install
typings install
npm run start:hmr
```

## TODO
- [x] Material Design
- [x] Meditations
- [x] Chats
- [x] Support Android 4.3 & iOS 8
- [x] Differentiate between finished and active meditation
- [ ] Flags (blocked by https://github.com/angular/material2/issues/118)
- [x] Profiles
- [ ] Schedules
- [x] Commitments
- [x] WebSockets
- [ ] WebRCT
- [x] Guide
- [ ] Quote
- ~~[ ] Share~~
- [ ] Settings (?)
- [ ] Alarms (?)
- [x] Help
