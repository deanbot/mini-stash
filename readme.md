# mini-stash

A less-featured local/session storage wrapper. [Read More](https://www.spiritedrefactor.net/blog/add-local-and-session-storage-support-to-a-service).

## Exported methods

`stash`

parameters:

- **storageKey** (string) - key assigned to data
- **data** (any) - value/object to store
- **useSessionStorage** (boolean, optional) - whether to use session vs local storage

`retrieve`

parameters:

- **storageKey** (string) - key assigned to data
- **minutesToExpiration** (number) - number of minutes till invalidation of stash data (pass 0 to disable expiration)
- **useSessionStorage** (boolean, optional) - whether to use sesssion vs local storage

`clear`

parameters:

- **storageKey** (string) - key assigned to data
- **useSessionStorage** (boolean, optional) - whether to use session vs local storage

## Install

`npm install mini-stash`

## Example

```js

import { clear, stash, retrieve } from 'mini-stash';

// it's a good idea to prefix storage keys
const storageKey = 'myapp-coords';

// retrieve from local storage (discard if older than a day)
let coords = retrieve(storageKey, 60 * 24);
if (!coords) {
  // ... get the coords
  coords = {
    latitude: 33.441792,
    longitude: -94.037689
  };

  // save to local storage
  stash(storageKey, coords);
} else {
  console.log('retrieved from local storage');

  // manually clear from local storage
  clear(storageKey);
}

// retrieve from session storage (disable expiration)
const loginStorageKey = 'myapp-login';
let loginData = retrieve(loginStorageKey, 0, true);
if (!loginData) {
  // ... get login data
  loginData = {
    uid: '021947'
  };

  // save to session storage
  stash(loginStorageKey, loginData, true);
} else {
  console.log('retrieved from session storage');

  // manually clear from session storage
  clear(loginStorageKey, true);
}
```

# Development

- Notes
  - Written in TypeScript
  - Compiled to UMD via WebPack
  - Compiled to ES6 via TSC
  - Typings generated by TSC
- Setup: `pnpm install`
- Serve: `pnpm run start`

See [index.ejs](./index.ejs)

## Runtimes

Latest tested runtimes

- node: 10.16.3
- pnpm: 5.3.0
