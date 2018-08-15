# fusion-plugin-passport

The `fusion-plugin-passport` package provides a passport implementation for the  [FusionJS](https://github.com/fusionjs).

---

### Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Setup](#setup)

---

### Installation

```sh
yarn add fusion-plugin-passport
```
---

### Setup

```jsx
// src/main.js
import App from 'fusion-react';
import Passport, { PassportToken, UserStore } from 'fusion-plugin-passport';
import UniversalEvents, {
  UniversalEventsToken,
} from 'fusion-plugin-universal-events';
import root from './components/root';

export default function start(App) {
  const app = new App(root);
  app.register(Router);
  app.register(UserStore, {
    registerAuthForUser(authName /*the same parameter passed in the config */,id /*AuthProvider ID*/, userId /* Id returned by the getUserByEmail*/ ) { ....},
    register({id, email, password}) { .... },
    getUserByEmail(email) {
      let user = loadFromDatabase;
      return user;
    }
  });
  app.register(PassportToken, [
    {
      config: {
        clientID: "-----------", // clientID
        clientSecret: "----------", // app secret
        scope: ["email"], // the scope
        callbackURL : "/auth/facebook/callback",
        profileFields: ["id", "emails", "displayName"] // fields to retrive
      },
      name: "facebook",  // This name needs to match the strategy and is used internally
      redirect: "/",
      authUrl: "/auth/facebook",
      Strategy : FacebookStrategy // any strategy for passport should work
    }
  ]);

  return app;
}
```

---

### API

#### Registration API

##### Plugin

```js
import Passport from "fusion-plugin-passport";
```

The plugin.

##### `PassportToken`

```jsx
import { PassportToken } from "fusion-plugin-passport";
```

A token for registering the passport configuration.

##### `UserStore`

```jsx
import { UserStore } from "fusion-plugin-passport";
```

A token for registering the UserStore to be used by the plugin to handle registration and user fetching.
The user store supports has the following interface:

###### `UserStore Api`

```js
 {
    registerAuthForUser(authName : string ,id : string, userId : any ) { ....},
    register({id, email, password}) {

      // Store the user fields to a database
     },
    getUserByEmail(email : string ) {
      let user = await loadFromDatabase(email);
      return user; // this can be anything the only requirment is having a email fields and id field.
    }
```

#### Auth Events

The plugin will emit the following events/metrics via the [universal events](https://github.com/fusionjs/fusion-plugin-universal-events) plugin if provided:

##### Server-side events

  None, in the future I want to log login attempts that fail or seem suspicious, but I am still thinkering on how to do so.

<!--
- `'pageview:server'`
  - `page: string` - (1)The path of an [exact match](https://reacttraining.com/react-router/web/api/match), or (2)`ctx.path`.
  - `title: string` - (1)`props.trackingId` provided by [`<Route>`](#route), or (2)the path of an [exact match](https://reacttraining.com/react-router/web/api/match), or (3)`ctx.path`.
  - `status: number` - HTTP status of the response
  - `timing: number` - Milliseconds. The time since the request received till routed by this plugin.
- `'render:server'`
  - `page: string` - (1)The path of an [exact match](https://reacttraining.com/react-router/web/api/match), or (2)`ctx.path`.
  - `title: string` - (1)`props.trackingId` provided by [`<Route>`](#route), or (2)the path of an [exact match](https://reacttraining.com/react-router/web/api/match), or (3)`ctx.path`.
  - `status: number` - HTTP status of the response
  - `timing: number` - Milliseconds. The execution time of [renderer](https://github.com/fusionjs/fusion-core#app). -->

##### Browser events
    None
<!-- - `'pageview:browser'`
  - `page: string` - (1)The path of an [exact match](https://reacttraining.com/react-router/web/api/match), or (2)`ctx.path`.
  - `title: string` - (1)`props.trackingId` provided by [`<Route>`](#route), or (2)the path of an [exact match](https://reacttraining.com/react-router/web/api/match), or (3)`ctx.path`.

--- -->