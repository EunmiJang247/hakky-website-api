const express = require('express');
const reservationRouter = require('./reservation.route');
const paymentRouter = require('./payment.route');
const optionRouter = require('./option.route');
const userRouter = require('./user.route');
const portfolioRouter = require('./portfolio.route');
const bannerRouter = require('./banner.route');
const scheduleRouter = require('./schedule.route');
const includeScheduleRouter = require('./include-schedule.route');
const excludeScheduleRouter = require('./exclude-schedule.route');
const productRouter = require('./product.route');
const placeRouter = require('./place.route');
const noticeRouter = require('./notice.route');
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
    path: '/reservation',
    route: reservationRouter,
  },
  {
    path: '/payment',
    route: paymentRouter,
  },
  {
    path: '/option',
    route: optionRouter,
  },
  {
    path: '/banner',
    route: bannerRouter,
  },
  {
    path: '/user',
    route: userRouter,
  },
  {
    path: '/place',
    route: placeRouter,
  },
  {
    path: '/portfolio',
    route: portfolioRouter,
  },
  {
    path: '/schedule',
    route: scheduleRouter,
  },
  {
    path: '/include-schedule',
    route: includeScheduleRouter,
  },
  {
    path: '/exclude-schedule',
    route: excludeScheduleRouter,
  },
  {
    path: '/product',
    route: productRouter,
  },
  {
    path: '/notice',
    route: noticeRouter,
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
