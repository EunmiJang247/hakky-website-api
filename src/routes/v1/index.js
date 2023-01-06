const express = require('express');
const popupRouter = require('./popup.route');
const counselorRouter = require('./counselor.route');
const noticeRouter = require('./notice.route');
const faqRouter = require('./faq.route');
const contactRouter = require('./contact.route');
const docsRoute = require('./docs.route');
const config = require('../../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/popup',
    route: popupRouter,
  },
  {
    path: '/counselor',
    route: counselorRouter,
  },
  {
    path: '/notice',
    route: noticeRouter,
  },
  {
    path: '/faq',
    route: faqRouter,
  },
  {
    path: '/contact',
    route: contactRouter,
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
