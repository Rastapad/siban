/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("workbox-v4.3.1/workbox-sw.js");
workbox.setConfig({modulePathPrefix: "workbox-v4.3.1"});

workbox.core.setCacheNameDetails({prefix: "gatsby-plugin-offline"});

workbox.core.skipWaiting();

workbox.core.clientsClaim();

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "icons/favicon.png",
    "revision": "862d7446c15ed051721783f1beff9639"
  },
  {
    "url": "static/icons/favicon.png"
  },
  {
    "url": "styles.f2e80b620884b50ca029.css"
  },
  {
    "url": "styles-407fe62976dc5310c43e.js"
  },
  {
    "url": "framework-fc1db31f678bd7aa66d8.js"
  },
  {
    "url": "dc6a8720040df98778fe970bf6c000a41750d3ae-1611da20b6d998dd3799.js"
  },
  {
    "url": "app-275eb05b06ed8a2304f6.js"
  },
  {
    "url": "offline-plugin-app-shell-fallback/index.html",
    "revision": "77c45e7e1355b069f1a820984dc8ccb6"
  },
  {
    "url": "webpack-runtime-16c1fa07b0882dcdfd64.js"
  },
  {
    "url": "component---cache-caches-gatsby-plugin-offline-app-shell-js-241020a1cf7d0f317bbe.js"
  },
  {
    "url": "polyfill-ff1a4a0224cfc2742b68.js"
  },
  {
    "url": "05d954cf-8320fb3c4e03a114f352.js"
  },
  {
    "url": "2970cfa47116fe92e03387074acc97a53ed3bdf0-1601a7e8e0a887ccc60b.js"
  },
  {
    "url": "component---src-pages-index-tsx-d18ddd9ab15e31939c1e.js"
  },
  {
    "url": "page-data/index/page-data.json",
    "revision": "9bcd9e12792ef3ff61c9a211516a421c"
  },
  {
    "url": "page-data/sq/d/1103940997.json",
    "revision": "d40e12717193e84a70db6e4c240e1b4d"
  },
  {
    "url": "page-data/sq/d/2291553744.json",
    "revision": "454e26eb251f1b26f86e63fa321c6b58"
  },
  {
    "url": "page-data/app-data.json",
    "revision": "596c7a6409bb73a4cb256c26130d76a9"
  },
  {
    "url": "component---src-templates-page-tsx-5355d23c17ac58d069a2.js"
  },
  {
    "url": "page-data/about/page-data.json",
    "revision": "82453b42d4f1d5ec5ff391c75b06157b"
  },
  {
    "url": "manifest.json",
    "revision": "56e0f900e1dc15e421c8462b54697fbe"
  },
  {
    "url": "manifest.webmanifest",
    "revision": "232ca0c3dac013482b8d318d102696d5"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});

workbox.routing.registerRoute(/(\.js$|\.css$|static\/)/, new workbox.strategies.CacheFirst(), 'GET');
workbox.routing.registerRoute(/^https?:.*\/page-data\/.*\.json/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:.*\.(png|jpg|jpeg|webp|svg|gif|tiff|js|woff|woff2|json|css)$/, new workbox.strategies.StaleWhileRevalidate(), 'GET');
workbox.routing.registerRoute(/^https?:\/\/fonts\.googleapis\.com\/css/, new workbox.strategies.StaleWhileRevalidate(), 'GET');

/* global importScripts, workbox, idbKeyval */
importScripts(`idb-keyval-3.2.0-iife.min.js`)

const { NavigationRoute } = workbox.routing

let lastNavigationRequest = null
let offlineShellEnabled = true

// prefer standard object syntax to support more browsers
const MessageAPI = {
  setPathResources: (event, { path, resources }) => {
    event.waitUntil(idbKeyval.set(`resources:${path}`, resources))
  },

  clearPathResources: event => {
    event.waitUntil(idbKeyval.clear())
  },

  enableOfflineShell: () => {
    offlineShellEnabled = true
  },

  disableOfflineShell: () => {
    offlineShellEnabled = false
  },
}

self.addEventListener(`message`, event => {
  const { gatsbyApi: api } = event.data
  if (api) MessageAPI[api](event, event.data)
})

function handleAPIRequest({ event }) {
  const { pathname } = new URL(event.request.url)

  const params = pathname.match(/:(.+)/)[1]
  const data = {}

  if (params.includes(`=`)) {
    params.split(`&`).forEach(param => {
      const [key, val] = param.split(`=`)
      data[key] = val
    })
  } else {
    data.api = params
  }

  if (MessageAPI[data.api] !== undefined) {
    MessageAPI[data.api]()
  }

  if (!data.redirect) {
    return new Response()
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: lastNavigationRequest,
    },
  })
}

const navigationRoute = new NavigationRoute(async ({ event }) => {
  // handle API requests separately to normal navigation requests, so do this
  // check first
  if (event.request.url.match(/\/.gatsby-plugin-offline:.+/)) {
    return handleAPIRequest({ event })
  }

  if (!offlineShellEnabled) {
    return await fetch(event.request)
  }

  lastNavigationRequest = event.request.url

  let { pathname } = new URL(event.request.url)
  pathname = pathname.replace(new RegExp(`^`), ``)

  // Check for resources + the app bundle
  // The latter may not exist if the SW is updating to a new version
  const resources = await idbKeyval.get(`resources:${pathname}`)
  if (!resources || !(await caches.match(`/app-275eb05b06ed8a2304f6.js`))) {
    return await fetch(event.request)
  }

  for (const resource of resources) {
    // As soon as we detect a failed resource, fetch the entire page from
    // network - that way we won't risk being in an inconsistent state with
    // some parts of the page failing.
    if (!(await caches.match(resource))) {
      return await fetch(event.request)
    }
  }

  const offlineShell = `/offline-plugin-app-shell-fallback/index.html`
  const offlineShellWithKey = workbox.precaching.getCacheKeyForURL(offlineShell)
  return await caches.match(offlineShellWithKey)
})

workbox.routing.registerRoute(navigationRoute)

// this route is used when performing a non-navigation request (e.g. fetch)
workbox.routing.registerRoute(/\/.gatsby-plugin-offline:.+/, handleAPIRequest)
