const express = require('express');
const userRouter = require('./user.route');
const teamRouter = require('./team.route');
const tournamentRouter = require('./tournament.route');
const divisionRouter = require('./division.route');
const playerRouter = require('./player.route');
const leagueRouter = require('./league.route');
const mainMenuRouter = require('./main-menu.route');
const uploadRouter = require('./upload.route');
const docsRoute = require('./docs.route');
const authRouter = require('./auth.route');
const youtubeRouter = require('./youtube.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/team',
    route: teamRouter,
  },
  {
    path: '/league',
    route: leagueRouter,
  },
  {
    path: '/division',
    route: divisionRouter,
  },
  {
    path: '/tournament',
    route: tournamentRouter,
  },
  {
    path: '/youtube',
    route: youtubeRouter,
  },
  {
    path: '/main-menu',
    route: mainMenuRouter,
  },
  {
    path: '/player',
    route: playerRouter,
  },
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/file',
    route: uploadRouter,
  },
  {
    path: '/auth',
    route: authRouter,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: '/docs',
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === 'development') {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}

module.exports = router;
