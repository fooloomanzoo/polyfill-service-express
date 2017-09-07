'use strict';

const polyfillio = require('polyfill-service');
const PolyfillSet = require('./PolyfillSet.js');
const pump = require('pump');
const mergeStream = require('merge2');
const streamFromString = require('from2-string');
const contentTypes = {
  ".js": 'application/javascript',
  ".css": 'text/css'
};

module.exports = polyfillService;

/**
 * @param {object} [options] options
 * @return {function} express middleware
 */
function polyfillService(options) {

  const verbose = options && options.verbose;
  /**
   * @param {object} [req] request
   * @param {object} [res] response
   * @return {function} express middleware
   * @public
   */

  return function(req, res) {

    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // method not allowed
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, HEAD');
      res.setHeader('Content-Length', '0');
      res.end();
      return;
    }

    const firstParameter = req.params[0].toLowerCase();
    const minified = firstParameter === '.min';
    const fileExtension = req.params[1] ? req.params[1].toLowerCase() : firstParameter;
    const uaString = (typeof req.query.ua === 'string' && req.query.ua) || req.header('user-agent');
    const flags = (typeof req.query.flags === 'string') ? req.query.flags.split(',') : [];

    // Currently don't support CSS
    if (fileExtension !== '.js') {
      res.status(404);
      res.set('Content-Type', 'text/plain;charset=utf-8');
      res.send('/* Type not supported.  Only .js is supported at the moment */');
      return;
    }

    const polyfills = PolyfillSet.fromQueryParam(req.query.features, flags);

    // If inbound request did not specify UA on the query string, the cache key must use the HTTP header
    if (!req.query.ua) {
      res.set('Vary', 'User-Agent');
    }

    const params = {
      features: polyfills.get(),
      excludes: (typeof req.query.excludes === 'string' && req.query.excludes.split(',')) || [],
      minify: minified,
      rum: (Number.parseInt(req.query.rum, 10) === 1),
      stream: true
    };

    if (req.query.unknown) {
      params.unknown = (req.query.unknown === 'polyfill') ? 'polyfill' : 'ignore';
    }
    
    if (uaString) {
      params.uaString = uaString;
    }

    res.set('Content-Type', contentTypes[fileExtension] + ';charset=utf-8');
    res.set('Access-Control-Allow-Origin', '*');

    const outputStream = mergeStream();

    outputStream.add(polyfillio.getPolyfillString(params));

    if (req.query.callback && typeof req.query.callback === 'string' && req.query.callback.match(/^[\w\.]+$/)) {
      outputStream.add(streamFromString("\ntypeof " + req.query.callback + "==='function' && " + req.query.callback + "();"));
    }

    pump(outputStream, res, (err) => {
      if (err && verbose) {
        console.error(err);
      }
    });
  };
}
