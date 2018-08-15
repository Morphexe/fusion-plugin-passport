// @flow
import passport from 'koa-passport';

import compose from 'koa-compose';

import {createPlugin, createToken} from 'fusion-core';
import {SessionToken} from 'fusion-tokens';

export const Token = createToken('PassportConfigToken');
export const UserStore = createToken('PassportStore');

const setupPassport = (config, store, Session) => {
  passport.use(
    new config.Strategy(config.config, async function(
      accessToken,
      refreshToken,
      profile,
      cb
    ) {
      const {
        id,
        username,
        displayName,
        emails: [{value}],
      } = profile;
      try {
        let user = await store.getUserByEmail(value);
        if (!user) {
          user = store.register({
            username: username | displayName,
            email: value,
            password: id,
          });
        }
        // register the auth type for the user
        await store.registerAuthForUser(config.name, id, user.id);
        //save the session
        Session.set('user', user.id);
        return cb(null, user);
      } catch (err) {
        return cb(err, {});
      }
    })
  );
};

const buildStrategy = (store, Session) => strategyConfig => {
  const setupStrategy = (ctx, next) => {
    setupPassport(strategyConfig, store, Session);
    return next();
  };
  const routesSetup = async (ctx, next) => {
    const authUrl = strategyConfig.authUrl;
    if (!authUrl) throw new Error("Invalid authUrl, can't be empty value");
    // If we are not a Get Request we just go to the next middleware
    if (ctx.method != 'GET') return next();
    // url path to login
    if (ctx.path === authUrl) {
      return passport.authenticate(strategyConfig.name)(ctx, next);
    }
    // Calback for a sucessfull login
    if (ctx.path == strategyConfig.config.callbackURL) {
      const redirectControl = async (ctx, next) => {
        console.warn('WE GOT THIS ', Session.get('user'));
        //const {req} = ctx;
        //const redirectUrl = req.query && req.query.state;
        // try to get the userId from the session
        //const userId = Session.get('userId');
        //const currentUser = await store.getUserById(userId);
        //const tokens = await access.grantAccess(user, req);
        //const currentUser = await getCurrentUser(req, res);
        // if (redirectUrl) {
        //   ctx.redirect(
        //     redirectUrl +
        //       (userId
        //         ? '?data=' +
        //           JSON.stringify({
        //             userId,
        //             user: currentUser,
        //           })
        //         : '')
        //   );
        // } else {
        ctx.redirect(strategyConfig.redirect || '/');
        // }
      };

      return compose([
        passport.authenticate(strategyConfig.name, {session: false}),
        redirectControl,
      ])(ctx, next);
    }
    return next();
  };
  return compose([setupStrategy, passport.initialize(), routesSetup]);
};

export const Plugin =
  __NODE__ &&
  createPlugin({
    deps: {
      Session: SessionToken,
      strategyConfigs: Token,
      store: UserStore,
    },
    // provides() {
    //   return service;
    // },
    middleware({Session, strategyConfigs, store}) {
      return (ctx, next) => {
        const actualSession = Session.from(ctx);
        const strats = compose(
          strategyConfigs.map(buildStrategy(store, actualSession))
        );

        return strats(ctx, next);
      };
    },
  });
