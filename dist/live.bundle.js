/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/live.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/rest/UrlBuilder.js":
/*!*****************************************!*\
  !*** ./node_modules/rest/UrlBuilder.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar mixin, xWWWFormURLEncoder, origin, urlRE, absoluteUrlRE, fullyQualifiedUrlRE;\n\nmixin = __webpack_require__(/*! ./util/mixin */ \"./node_modules/rest/util/mixin.js\");\nxWWWFormURLEncoder = __webpack_require__(/*! ./mime/type/application/x-www-form-urlencoded */ \"./node_modules/rest/mime/type/application/x-www-form-urlencoded.js\");\n\nurlRE = /([a-z][a-z0-9\\+\\-\\.]*:)\\/\\/([^@]+@)?(([^:\\/]+)(:([0-9]+))?)?(\\/[^?#]*)?(\\?[^#]*)?(#\\S*)?/i;\nabsoluteUrlRE = /^([a-z][a-z0-9\\-\\+\\.]*:\\/\\/|\\/)/i;\nfullyQualifiedUrlRE = /([a-z][a-z0-9\\+\\-\\.]*:)\\/\\/([^@]+@)?(([^:\\/]+)(:([0-9]+))?)?\\//i;\n\n/**\n * Apply params to the template to create a URL.\n *\n * Parameters that are not applied directly to the template, are appended\n * to the URL as query string parameters.\n *\n * @param {string} template the URI template\n * @param {Object} params parameters to apply to the template\n * @return {string} the resulting URL\n */\nfunction buildUrl(template, params) {\n\t// internal builder to convert template with params.\n\tvar url, name, queryStringParams, queryString, re;\n\n\turl = template;\n\tqueryStringParams = {};\n\n\tif (params) {\n\t\tfor (name in params) {\n\t\t\t/*jshint forin:false */\n\t\t\tre = new RegExp('\\\\{' + name + '\\\\}');\n\t\t\tif (re.test(url)) {\n\t\t\t\turl = url.replace(re, encodeURIComponent(params[name]), 'g');\n\t\t\t}\n\t\t\telse {\n\t\t\t\tqueryStringParams[name] = params[name];\n\t\t\t}\n\t\t}\n\n\t\tqueryString = xWWWFormURLEncoder.write(queryStringParams);\n\t\tif (queryString) {\n\t\t\turl += url.indexOf('?') === -1 ? '?' : '&';\n\t\t\turl += queryString;\n\t\t}\n\t}\n\treturn url;\n}\n\nfunction startsWith(str, test) {\n\treturn str.indexOf(test) === 0;\n}\n\n/**\n * Create a new URL Builder\n *\n * @param {string|UrlBuilder} template the base template to build from, may be another UrlBuilder\n * @param {Object} [params] base parameters\n * @constructor\n */\nfunction UrlBuilder(template, params) {\n\tif (!(this instanceof UrlBuilder)) {\n\t\t// invoke as a constructor\n\t\treturn new UrlBuilder(template, params);\n\t}\n\n\tif (template instanceof UrlBuilder) {\n\t\tthis._template = template.template;\n\t\tthis._params = mixin({}, this._params, params);\n\t}\n\telse {\n\t\tthis._template = (template || '').toString();\n\t\tthis._params = params || {};\n\t}\n}\n\nUrlBuilder.prototype = {\n\n\t/**\n\t * Create a new UrlBuilder instance that extends the current builder.\n\t * The current builder is unmodified.\n\t *\n\t * @param {string} [template] URL template to append to the current template\n\t * @param {Object} [params] params to combine with current params.  New params override existing params\n\t * @return {UrlBuilder} the new builder\n\t */\n\tappend: function (template,  params) {\n\t\t// TODO consider query strings and fragments\n\t\treturn new UrlBuilder(this._template + template, mixin({}, this._params, params));\n\t},\n\n\t/**\n\t * Create a new UrlBuilder with a fully qualified URL based on the\n\t * window's location or base href and the current templates relative URL.\n\t *\n\t * Path variables are preserved.\n\t *\n\t * *Browser only*\n\t *\n\t * @return {UrlBuilder} the fully qualified URL template\n\t */\n\tfullyQualify: function () {\n\t\tif (typeof location === 'undefined') { return this; }\n\t\tif (this.isFullyQualified()) { return this; }\n\n\t\tvar template = this._template;\n\n\t\tif (startsWith(template, '//')) {\n\t\t\ttemplate = origin.protocol + template;\n\t\t}\n\t\telse if (startsWith(template, '/')) {\n\t\t\ttemplate = origin.origin + template;\n\t\t}\n\t\telse if (!this.isAbsolute()) {\n\t\t\ttemplate = origin.origin + origin.pathname.substring(0, origin.pathname.lastIndexOf('/') + 1);\n\t\t}\n\n\t\tif (template.indexOf('/', 8) === -1) {\n\t\t\t// default the pathname to '/'\n\t\t\ttemplate = template + '/';\n\t\t}\n\n\t\treturn new UrlBuilder(template, this._params);\n\t},\n\n\t/**\n\t * True if the URL is absolute\n\t *\n\t * @return {boolean}\n\t */\n\tisAbsolute: function () {\n\t\treturn absoluteUrlRE.test(this.build());\n\t},\n\n\t/**\n\t * True if the URL is fully qualified\n\t *\n\t * @return {boolean}\n\t */\n\tisFullyQualified: function () {\n\t\treturn fullyQualifiedUrlRE.test(this.build());\n\t},\n\n\t/**\n\t * True if the URL is cross origin. The protocol, host and port must not be\n\t * the same in order to be cross origin,\n\t *\n\t * @return {boolean}\n\t */\n\tisCrossOrigin: function () {\n\t\tif (!origin) {\n\t\t\treturn true;\n\t\t}\n\t\tvar url = this.parts();\n\t\treturn url.protocol !== origin.protocol ||\n\t\t       url.hostname !== origin.hostname ||\n\t\t       url.port !== origin.port;\n\t},\n\n\t/**\n\t * Split a URL into its consituent parts following the naming convention of\n\t * 'window.location'. One difference is that the port will contain the\n\t * protocol default if not specified.\n\t *\n\t * @see https://developer.mozilla.org/en-US/docs/DOM/window.location\n\t *\n\t * @returns {Object} a 'window.location'-like object\n\t */\n\tparts: function () {\n\t\t/*jshint maxcomplexity:20 */\n\t\tvar url, parts;\n\t\turl = this.fullyQualify().build().match(urlRE);\n\t\tparts = {\n\t\t\thref: url[0],\n\t\t\tprotocol: url[1],\n\t\t\thost: url[3] || '',\n\t\t\thostname: url[4] || '',\n\t\t\tport: url[6],\n\t\t\tpathname: url[7] || '',\n\t\t\tsearch: url[8] || '',\n\t\t\thash: url[9] || ''\n\t\t};\n\t\tparts.origin = parts.protocol + '//' + parts.host;\n\t\tparts.port = parts.port || (parts.protocol === 'https:' ? '443' : parts.protocol === 'http:' ? '80' : '');\n\t\treturn parts;\n\t},\n\n\t/**\n\t * Expand the template replacing path variables with parameters\n\t *\n\t * @param {Object} [params] params to combine with current params.  New params override existing params\n\t * @return {string} the expanded URL\n\t */\n\tbuild: function (params) {\n\t\treturn buildUrl(this._template, mixin({}, this._params, params));\n\t},\n\n\t/**\n\t * @see build\n\t */\n\ttoString: function () {\n\t\treturn this.build();\n\t}\n\n};\n\norigin = typeof location !== 'undefined' ? new UrlBuilder(location.href).parts() : void 0;\n\nmodule.exports = UrlBuilder;\n\n\n//# sourceURL=webpack:///./node_modules/rest/UrlBuilder.js?");

/***/ }),

/***/ "./node_modules/rest/browser.js":
/*!**************************************!*\
  !*** ./node_modules/rest/browser.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2014-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar rest = __webpack_require__(/*! ./client/default */ \"./node_modules/rest/client/default.js\"),\n    browser = __webpack_require__(/*! ./client/xhr */ \"./node_modules/rest/client/xhr.js\");\n\nrest.setPlatformDefaultClient(browser);\n\nmodule.exports = rest;\n\n\n//# sourceURL=webpack:///./node_modules/rest/browser.js?");

/***/ }),

/***/ "./node_modules/rest/client.js":
/*!*************************************!*\
  !*** ./node_modules/rest/client.js ***!
  \*************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2014-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\n/**\n * Add common helper methods to a client impl\n *\n * @param {function} impl the client implementation\n * @param {Client} [target] target of this client, used when wrapping other clients\n * @returns {Client} the client impl with additional methods\n */\nmodule.exports = function client(impl, target) {\n\n\tif (target) {\n\n\t\t/**\n\t\t * @returns {Client} the target client\n\t\t */\n\t\timpl.skip = function skip() {\n\t\t\treturn target;\n\t\t};\n\n\t}\n\n\t/**\n\t * Allow a client to easily be wrapped by an interceptor\n\t *\n\t * @param {Interceptor} interceptor the interceptor to wrap this client with\n\t * @param [config] configuration for the interceptor\n\t * @returns {Client} the newly wrapped client\n\t */\n\timpl.wrap = function wrap(interceptor, config) {\n\t\treturn interceptor(impl, config);\n\t};\n\n\t/**\n\t * @deprecated\n\t */\n\timpl.chain = function chain() {\n\t\tif (typeof console !== 'undefined') {\n\t\t\tconsole.log('rest.js: client.chain() is deprecated, use client.wrap() instead');\n\t\t}\n\n\t\treturn impl.wrap.apply(this, arguments);\n\t};\n\n\treturn impl;\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/client.js?");

/***/ }),

/***/ "./node_modules/rest/client/default.js":
/*!*********************************************!*\
  !*** ./node_modules/rest/client/default.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2014-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\n/**\n * Plain JS Object containing properties that represent an HTTP request.\n *\n * Depending on the capabilities of the underlying client, a request\n * may be cancelable. If a request may be canceled, the client will add\n * a canceled flag and cancel function to the request object. Canceling\n * the request will put the response into an error state.\n *\n * @field {string} [method='GET'] HTTP method, commonly GET, POST, PUT, DELETE or HEAD\n * @field {string|UrlBuilder} [path=''] path template with optional path variables\n * @field {Object} [params] parameters for the path template and query string\n * @field {Object} [headers] custom HTTP headers to send, in addition to the clients default headers\n * @field [entity] the HTTP entity, common for POST or PUT requests\n * @field {boolean} [canceled] true if the request has been canceled, set by the client\n * @field {Function} [cancel] cancels the request if invoked, provided by the client\n * @field {Client} [originator] the client that first handled this request, provided by the interceptor\n *\n * @class Request\n */\n\n/**\n * Plain JS Object containing properties that represent an HTTP response\n *\n * @field {Object} [request] the request object as received by the root client\n * @field {Object} [raw] the underlying request object, like XmlHttpRequest in a browser\n * @field {number} [status.code] status code of the response (i.e. 200, 404)\n * @field {string} [status.text] status phrase of the response\n * @field {Object] [headers] response headers hash of normalized name, value pairs\n * @field [entity] the response body\n *\n * @class Response\n */\n\n/**\n * HTTP client particularly suited for RESTful operations.\n *\n * @field {function} wrap wraps this client with a new interceptor returning the wrapped client\n *\n * @param {Request} the HTTP request\n * @returns {ResponsePromise<Response>} a promise the resolves to the HTTP response\n *\n * @class Client\n */\n\n /**\n  * Extended when.js Promises/A+ promise with HTTP specific helpers\n  *q\n  * @method entity promise for the HTTP entity\n  * @method status promise for the HTTP status code\n  * @method headers promise for the HTTP response headers\n  * @method header promise for a specific HTTP response header\n  *\n  * @class ResponsePromise\n  * @extends Promise\n  */\n\nvar client, target, platformDefault;\n\nclient = __webpack_require__(/*! ../client */ \"./node_modules/rest/client.js\");\n\nif (typeof Promise !== 'function' && console && console.log) {\n\tconsole.log('An ES6 Promise implementation is required to use rest.js. See https://github.com/cujojs/when/blob/master/docs/es6-promise-shim.md for using when.js as a Promise polyfill.');\n}\n\n/**\n * Make a request with the default client\n * @param {Request} the HTTP request\n * @returns {Promise<Response>} a promise the resolves to the HTTP response\n */\nfunction defaultClient() {\n\treturn target.apply(void 0, arguments);\n}\n\n/**\n * Change the default client\n * @param {Client} client the new default client\n */\ndefaultClient.setDefaultClient = function setDefaultClient(client) {\n\ttarget = client;\n};\n\n/**\n * Obtain a direct reference to the current default client\n * @returns {Client} the default client\n */\ndefaultClient.getDefaultClient = function getDefaultClient() {\n\treturn target;\n};\n\n/**\n * Reset the default client to the platform default\n */\ndefaultClient.resetDefaultClient = function resetDefaultClient() {\n\ttarget = platformDefault;\n};\n\n/**\n * @private\n */\ndefaultClient.setPlatformDefaultClient = function setPlatformDefaultClient(client) {\n\tif (platformDefault) {\n\t\tthrow new Error('Unable to redefine platformDefaultClient');\n\t}\n\ttarget = platformDefault = client;\n};\n\nmodule.exports = client(defaultClient);\n\n\n//# sourceURL=webpack:///./node_modules/rest/client/default.js?");

/***/ }),

/***/ "./node_modules/rest/client/xhr.js":
/*!*****************************************!*\
  !*** ./node_modules/rest/client/xhr.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar normalizeHeaderName, responsePromise, client, headerSplitRE;\n\nnormalizeHeaderName = __webpack_require__(/*! ../util/normalizeHeaderName */ \"./node_modules/rest/util/normalizeHeaderName.js\");\nresponsePromise = __webpack_require__(/*! ../util/responsePromise */ \"./node_modules/rest/util/responsePromise.js\");\nclient = __webpack_require__(/*! ../client */ \"./node_modules/rest/client.js\");\n\n// according to the spec, the line break is '\\r\\n', but doesn't hold true in practice\nheaderSplitRE = /[\\r|\\n]+/;\n\nfunction parseHeaders(raw) {\n\t// Note: Set-Cookie will be removed by the browser\n\tvar headers = {};\n\n\tif (!raw) { return headers; }\n\n\traw.trim().split(headerSplitRE).forEach(function (header) {\n\t\tvar boundary, name, value;\n\t\tboundary = header.indexOf(':');\n\t\tname = normalizeHeaderName(header.substring(0, boundary).trim());\n\t\tvalue = header.substring(boundary + 1).trim();\n\t\tif (headers[name]) {\n\t\t\tif (Array.isArray(headers[name])) {\n\t\t\t\t// add to an existing array\n\t\t\t\theaders[name].push(value);\n\t\t\t}\n\t\t\telse {\n\t\t\t\t// convert single value to array\n\t\t\t\theaders[name] = [headers[name], value];\n\t\t\t}\n\t\t}\n\t\telse {\n\t\t\t// new, single value\n\t\t\theaders[name] = value;\n\t\t}\n\t});\n\n\treturn headers;\n}\n\nfunction safeMixin(target, source) {\n\tObject.keys(source || {}).forEach(function (prop) {\n\t\t// make sure the property already exists as\n\t\t// IE 6 will blow up if we add a new prop\n\t\tif (source.hasOwnProperty(prop) && prop in target) {\n\t\t\ttry {\n\t\t\t\ttarget[prop] = source[prop];\n\t\t\t}\n\t\t\tcatch (e) {\n\t\t\t\t// ignore, expected for some properties at some points in the request lifecycle\n\t\t\t}\n\t\t}\n\t});\n\n\treturn target;\n}\n\nmodule.exports = client(function xhr(request) {\n\treturn responsePromise.promise(function (resolve, reject) {\n\t\t/*jshint maxcomplexity:20 */\n\n\t\tvar client, method, url, headers, entity, headerName, response, XHR;\n\n\t\trequest = typeof request === 'string' ? { path: request } : request || {};\n\t\tresponse = { request: request };\n\n\t\tif (request.canceled) {\n\t\t\tresponse.error = 'precanceled';\n\t\t\treject(response);\n\t\t\treturn;\n\t\t}\n\n\t\tXHR = request.engine || XMLHttpRequest;\n\t\tif (!XHR) {\n\t\t\treject({ request: request, error: 'xhr-not-available' });\n\t\t\treturn;\n\t\t}\n\n\t\tentity = request.entity;\n\t\trequest.method = request.method || (entity ? 'POST' : 'GET');\n\t\tmethod = request.method;\n\t\turl = response.url = request.path || '';\n\n\t\ttry {\n\t\t\tclient = response.raw = new XHR();\n\n\t\t\t// mixin extra request properties before and after opening the request as some properties require being set at different phases of the request\n\t\t\tsafeMixin(client, request.mixin);\n\t\t\tclient.open(method, url, true);\n\t\t\tsafeMixin(client, request.mixin);\n\n\t\t\theaders = request.headers;\n\t\t\tfor (headerName in headers) {\n\t\t\t\t/*jshint forin:false */\n\t\t\t\tif (headerName === 'Content-Type' && headers[headerName] === 'multipart/form-data') {\n\t\t\t\t\t// XMLHttpRequest generates its own Content-Type header with the\n\t\t\t\t\t// appropriate multipart boundary when sending multipart/form-data.\n\t\t\t\t\tcontinue;\n\t\t\t\t}\n\n\t\t\t\tclient.setRequestHeader(headerName, headers[headerName]);\n\t\t\t}\n\n\t\t\trequest.canceled = false;\n\t\t\trequest.cancel = function cancel() {\n\t\t\t\trequest.canceled = true;\n\t\t\t\tclient.abort();\n\t\t\t\treject(response);\n\t\t\t};\n\n\t\t\tclient.onreadystatechange = function (/* e */) {\n\t\t\t\tif (request.canceled) { return; }\n\t\t\t\tif (client.readyState === (XHR.DONE || 4)) {\n\t\t\t\t\tresponse.status = {\n\t\t\t\t\t\tcode: client.status,\n\t\t\t\t\t\ttext: client.statusText\n\t\t\t\t\t};\n\t\t\t\t\tresponse.headers = parseHeaders(client.getAllResponseHeaders());\n\t\t\t\t\tresponse.entity = client.responseText;\n\n\t\t\t\t\t// #125 -- Sometimes IE8-9 uses 1223 instead of 204\n\t\t\t\t\t// http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request\n\t\t\t\t\tif (response.status.code === 1223) {\n\t\t\t\t\t\tresponse.status.code = 204;\n\t\t\t\t\t}\n\n\t\t\t\t\tif (response.status.code > 0) {\n\t\t\t\t\t\t// check status code as readystatechange fires before error event\n\t\t\t\t\t\tresolve(response);\n\t\t\t\t\t}\n\t\t\t\t\telse {\n\t\t\t\t\t\t// give the error callback a chance to fire before resolving\n\t\t\t\t\t\t// requests for file:// URLs do not have a status code\n\t\t\t\t\t\tsetTimeout(function () {\n\t\t\t\t\t\t\tresolve(response);\n\t\t\t\t\t\t}, 0);\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t};\n\n\t\t\ttry {\n\t\t\t\tclient.onerror = function (/* e */) {\n\t\t\t\t\tresponse.error = 'loaderror';\n\t\t\t\t\treject(response);\n\t\t\t\t};\n\t\t\t}\n\t\t\tcatch (e) {\n\t\t\t\t// IE 6 will not support error handling\n\t\t\t}\n\n\t\t\tclient.send(entity);\n\t\t}\n\t\tcatch (e) {\n\t\t\tresponse.error = 'loaderror';\n\t\t\treject(response);\n\t\t}\n\n\t});\n});\n\n\n//# sourceURL=webpack:///./node_modules/rest/client/xhr.js?");

/***/ }),

/***/ "./node_modules/rest/interceptor.js":
/*!******************************************!*\
  !*** ./node_modules/rest/interceptor.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar defaultClient, mixin, responsePromise, client;\n\ndefaultClient = __webpack_require__(/*! ./client/default */ \"./node_modules/rest/client/default.js\");\nmixin = __webpack_require__(/*! ./util/mixin */ \"./node_modules/rest/util/mixin.js\");\nresponsePromise = __webpack_require__(/*! ./util/responsePromise */ \"./node_modules/rest/util/responsePromise.js\");\nclient = __webpack_require__(/*! ./client */ \"./node_modules/rest/client.js\");\n\n/**\n * Interceptors have the ability to intercept the request and/org response\n * objects.  They may augment, prune, transform or replace the\n * request/response as needed.  Clients may be composed by wrapping\n * together multiple interceptors.\n *\n * Configured interceptors are functional in nature.  Wrapping a client in\n * an interceptor will not affect the client, merely the data that flows in\n * and out of that client.  A common configuration can be created once and\n * shared; specialization can be created by further wrapping that client\n * with custom interceptors.\n *\n * @param {Client} [target] client to wrap\n * @param {Object} [config] configuration for the interceptor, properties will be specific to the interceptor implementation\n * @returns {Client} A client wrapped with the interceptor\n *\n * @class Interceptor\n */\n\nfunction defaultInitHandler(config) {\n\treturn config;\n}\n\nfunction defaultRequestHandler(request /*, config, meta */) {\n\treturn request;\n}\n\nfunction defaultResponseHandler(response /*, config, meta */) {\n\treturn response;\n}\n\n/**\n * Alternate return type for the request handler that allows for more complex interactions.\n *\n * @param properties.request the traditional request return object\n * @param {Promise} [properties.abort] promise that resolves if/when the request is aborted\n * @param {Client} [properties.client] override the defined client with an alternate client\n * @param [properties.response] response for the request, short circuit the request\n */\nfunction ComplexRequest(properties) {\n\tif (!(this instanceof ComplexRequest)) {\n\t\t// in case users forget the 'new' don't mix into the interceptor\n\t\treturn new ComplexRequest(properties);\n\t}\n\tmixin(this, properties);\n}\n\n/**\n * Create a new interceptor for the provided handlers.\n *\n * @param {Function} [handlers.init] one time intialization, must return the config object\n * @param {Function} [handlers.request] request handler\n * @param {Function} [handlers.response] response handler regardless of error state\n * @param {Function} [handlers.success] response handler when the request is not in error\n * @param {Function} [handlers.error] response handler when the request is in error, may be used to 'unreject' an error state\n * @param {Function} [handlers.client] the client to use if otherwise not specified, defaults to platform default client\n *\n * @returns {Interceptor}\n */\nfunction interceptor(handlers) {\n\n\tvar initHandler, requestHandler, successResponseHandler, errorResponseHandler;\n\n\thandlers = handlers || {};\n\n\tinitHandler            = handlers.init    || defaultInitHandler;\n\trequestHandler         = handlers.request || defaultRequestHandler;\n\tsuccessResponseHandler = handlers.success || handlers.response || defaultResponseHandler;\n\terrorResponseHandler   = handlers.error   || function () {\n\t\t// Propagate the rejection, with the result of the handler\n\t\treturn Promise.resolve((handlers.response || defaultResponseHandler).apply(this, arguments))\n\t\t\t.then(Promise.reject.bind(Promise));\n\t};\n\n\treturn function (target, config) {\n\n\t\tif (typeof target === 'object') {\n\t\t\tconfig = target;\n\t\t}\n\t\tif (typeof target !== 'function') {\n\t\t\ttarget = handlers.client || defaultClient;\n\t\t}\n\n\t\tconfig = initHandler(config || {});\n\n\t\tfunction interceptedClient(request) {\n\t\t\tvar context, meta;\n\t\t\tcontext = {};\n\t\t\tmeta = { 'arguments': Array.prototype.slice.call(arguments), client: interceptedClient };\n\t\t\trequest = typeof request === 'string' ? { path: request } : request || {};\n\t\t\trequest.originator = request.originator || interceptedClient;\n\t\t\treturn responsePromise(\n\t\t\t\trequestHandler.call(context, request, config, meta),\n\t\t\t\tfunction (request) {\n\t\t\t\t\tvar response, abort, next;\n\t\t\t\t\tnext = target;\n\t\t\t\t\tif (request instanceof ComplexRequest) {\n\t\t\t\t\t\t// unpack request\n\t\t\t\t\t\tabort = request.abort;\n\t\t\t\t\t\tnext = request.client || next;\n\t\t\t\t\t\tresponse = request.response;\n\t\t\t\t\t\t// normalize request, must be last\n\t\t\t\t\t\trequest = request.request;\n\t\t\t\t\t}\n\t\t\t\t\tresponse = response || Promise.resolve(request).then(function (request) {\n\t\t\t\t\t\treturn Promise.resolve(next(request)).then(\n\t\t\t\t\t\t\tfunction (response) {\n\t\t\t\t\t\t\t\treturn successResponseHandler.call(context, response, config, meta);\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tfunction (response) {\n\t\t\t\t\t\t\t\treturn errorResponseHandler.call(context, response, config, meta);\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t);\n\t\t\t\t\t});\n\t\t\t\t\treturn abort ? Promise.race([response, abort]) : response;\n\t\t\t\t},\n\t\t\t\tfunction (error) {\n\t\t\t\t\treturn Promise.reject({ request: request, error: error });\n\t\t\t\t}\n\t\t\t);\n\t\t}\n\n\t\treturn client(interceptedClient, target);\n\t};\n}\n\ninterceptor.ComplexRequest = ComplexRequest;\n\nmodule.exports = interceptor;\n\n\n//# sourceURL=webpack:///./node_modules/rest/interceptor.js?");

/***/ }),

/***/ "./node_modules/rest/interceptor/mime.js":
/*!***********************************************!*\
  !*** ./node_modules/rest/interceptor/mime.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar interceptor, mime, registry, noopConverter, missingConverter, attempt;\n\ninterceptor = __webpack_require__(/*! ../interceptor */ \"./node_modules/rest/interceptor.js\");\nmime = __webpack_require__(/*! ../mime */ \"./node_modules/rest/mime.js\");\nregistry = __webpack_require__(/*! ../mime/registry */ \"./node_modules/rest/mime/registry.js\");\nattempt = __webpack_require__(/*! ../util/attempt */ \"./node_modules/rest/util/attempt.js\");\n\nnoopConverter = {\n\tread: function (obj) { return obj; },\n\twrite: function (obj) { return obj; }\n};\n\nmissingConverter = {\n\tread: function () { throw 'No read method found on converter'; },\n\twrite: function () { throw 'No write method found on converter'; }\n};\n\n/**\n * MIME type support for request and response entities.  Entities are\n * (de)serialized using the converter for the MIME type.\n *\n * Request entities are converted using the desired converter and the\n * 'Accept' request header prefers this MIME.\n *\n * Response entities are converted based on the Content-Type response header.\n *\n * @param {Client} [client] client to wrap\n * @param {string} [config.mime='text/plain'] MIME type to encode the request\n *   entity\n * @param {string} [config.accept] Accept header for the request\n * @param {Client} [config.client=<request.originator>] client passed to the\n *   converter, defaults to the client originating the request\n * @param {Registry} [config.registry] MIME registry, defaults to the root\n *   registry\n * @param {boolean} [config.permissive] Allow an unkown request MIME type\n *\n * @returns {Client}\n */\nmodule.exports = interceptor({\n\tinit: function (config) {\n\t\tconfig.registry = config.registry || registry;\n\t\treturn config;\n\t},\n\trequest: function (request, config) {\n\t\tvar type, headers;\n\n\t\theaders = request.headers || (request.headers = {});\n\t\ttype = mime.parse(headers['Content-Type'] || config.mime || 'text/plain');\n\t\theaders.Accept = headers.Accept || config.accept || type.raw + ', application/json;q=0.8, text/plain;q=0.5, */*;q=0.2';\n\n\t\tif (!('entity' in request)) {\n\t\t\treturn request;\n\t\t}\n\n\t\theaders['Content-Type'] = type.raw;\n\n\t\treturn config.registry.lookup(type)['catch'](function () {\n\t\t\t// failed to resolve converter\n\t\t\tif (config.permissive) {\n\t\t\t\treturn noopConverter;\n\t\t\t}\n\t\t\tthrow 'mime-unknown';\n\t\t}).then(function (converter) {\n\t\t\tvar client = config.client || request.originator,\n\t\t\t\twrite = converter.write || missingConverter.write;\n\n\t\t\treturn attempt(write.bind(void 0, request.entity, { client: client, request: request, mime: type, registry: config.registry }))\n\t\t\t\t['catch'](function() {\n\t\t\t\t\tthrow 'mime-serialization';\n\t\t\t\t})\n\t\t\t\t.then(function(entity) {\n\t\t\t\t\trequest.entity = entity;\n\t\t\t\t\treturn request;\n\t\t\t\t});\n\t\t});\n\t},\n\tresponse: function (response, config) {\n\t\tif (!(response.headers && response.headers['Content-Type'] && response.entity)) {\n\t\t\treturn response;\n\t\t}\n\n\t\tvar type = mime.parse(response.headers['Content-Type']);\n\n\t\treturn config.registry.lookup(type)['catch'](function () { return noopConverter; }).then(function (converter) {\n\t\t\tvar client = config.client || response.request && response.request.originator,\n\t\t\t\tread = converter.read || missingConverter.read;\n\n\t\t\treturn attempt(read.bind(void 0, response.entity, { client: client, response: response, mime: type, registry: config.registry }))\n\t\t\t\t['catch'](function (e) {\n\t\t\t\t\tresponse.error = 'mime-deserialization';\n\t\t\t\t\tresponse.cause = e;\n\t\t\t\t\tthrow response;\n\t\t\t\t})\n\t\t\t\t.then(function (entity) {\n\t\t\t\t\tresponse.entity = entity;\n\t\t\t\t\treturn response;\n\t\t\t\t});\n\t\t});\n\t}\n});\n\n\n//# sourceURL=webpack:///./node_modules/rest/interceptor/mime.js?");

/***/ }),

/***/ "./node_modules/rest/interceptor/pathPrefix.js":
/*!*****************************************************!*\
  !*** ./node_modules/rest/interceptor/pathPrefix.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar interceptor, UrlBuilder;\n\ninterceptor = __webpack_require__(/*! ../interceptor */ \"./node_modules/rest/interceptor.js\");\nUrlBuilder = __webpack_require__(/*! ../UrlBuilder */ \"./node_modules/rest/UrlBuilder.js\");\n\nfunction startsWith(str, prefix) {\n\treturn str.indexOf(prefix) === 0;\n}\n\nfunction endsWith(str, suffix) {\n\treturn str.lastIndexOf(suffix) + suffix.length === str.length;\n}\n\n/**\n * Prefixes the request path with a common value.\n *\n * @param {Client} [client] client to wrap\n * @param {number} [config.prefix] path prefix\n *\n * @returns {Client}\n */\nmodule.exports = interceptor({\n\trequest: function (request, config) {\n\t\tvar path;\n\n\t\tif (config.prefix && !(new UrlBuilder(request.path).isFullyQualified())) {\n\t\t\tpath = config.prefix;\n\t\t\tif (request.path) {\n\t\t\t\tif (!endsWith(path, '/') && !startsWith(request.path, '/')) {\n\t\t\t\t\t// add missing '/' between path sections\n\t\t\t\t\tpath += '/';\n\t\t\t\t}\n\t\t\t\tpath += request.path;\n\t\t\t}\n\t\t\trequest.path = path;\n\t\t}\n\n\t\treturn request;\n\t}\n});\n\n\n//# sourceURL=webpack:///./node_modules/rest/interceptor/pathPrefix.js?");

/***/ }),

/***/ "./node_modules/rest/interceptor/template.js":
/*!***************************************************!*\
  !*** ./node_modules/rest/interceptor/template.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2015-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar interceptor, uriTemplate, mixin;\n\ninterceptor = __webpack_require__(/*! ../interceptor */ \"./node_modules/rest/interceptor.js\");\nuriTemplate = __webpack_require__(/*! ../util/uriTemplate */ \"./node_modules/rest/util/uriTemplate.js\");\nmixin = __webpack_require__(/*! ../util/mixin */ \"./node_modules/rest/util/mixin.js\");\n\n/**\n * Applies request params to the path as a URI Template\n *\n * Params are removed from the request object, as they have been consumed.\n *\n * @see https://tools.ietf.org/html/rfc6570\n *\n * @param {Client} [client] client to wrap\n * @param {Object} [config.params] default param values\n * @param {string} [config.template] default template\n *\n * @returns {Client}\n */\nmodule.exports = interceptor({\n\tinit: function (config) {\n\t\tconfig.params = config.params || {};\n\t\tconfig.template = config.template || '';\n\t\treturn config;\n\t},\n\trequest: function (request, config) {\n\t\tvar template, params;\n\n\t\ttemplate = request.path || config.template;\n\t\tparams = mixin({}, request.params, config.params);\n\n\t\trequest.path = uriTemplate.expand(template, params);\n\t\tdelete request.params;\n\n\t\treturn request;\n\t}\n});\n\n\n//# sourceURL=webpack:///./node_modules/rest/interceptor/template.js?");

/***/ }),

/***/ "./node_modules/rest/mime.js":
/*!***********************************!*\
  !*** ./node_modules/rest/mime.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n* Copyright 2014-2016 the original author or authors\n* @license MIT, see LICENSE.txt for details\n*\n* @author Scott Andrews\n*/\n\n\n\n/**\n * Parse a MIME type into it's constituent parts\n *\n * @param {string} mime MIME type to parse\n * @return {{\n *   {string} raw the original MIME type\n *   {string} type the type and subtype\n *   {string} [suffix] mime suffix, including the plus, if any\n *   {Object} params key/value pair of attributes\n * }}\n */\nfunction parse(mime) {\n\tvar params, type;\n\n\tparams = mime.split(';');\n\ttype = params[0].trim().split('+');\n\n\treturn {\n\t\traw: mime,\n\t\ttype: type[0],\n\t\tsuffix: type[1] ? '+' + type[1] : '',\n\t\tparams: params.slice(1).reduce(function (params, pair) {\n\t\t\tpair = pair.split('=');\n\t\t\tparams[pair[0].trim()] = pair[1] ? pair[1].trim() : void 0;\n\t\t\treturn params;\n\t\t}, {})\n\t};\n}\n\nmodule.exports = {\n\tparse: parse\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/mime.js?");

/***/ }),

/***/ "./node_modules/rest/mime/registry.js":
/*!********************************************!*\
  !*** ./node_modules/rest/mime/registry.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar mime, registry;\n\nmime = __webpack_require__(/*! ../mime */ \"./node_modules/rest/mime.js\");\n\nfunction Registry(mimes) {\n\n\t/**\n\t * Lookup the converter for a MIME type\n\t *\n\t * @param {string} type the MIME type\n\t * @return a promise for the converter\n\t */\n\tthis.lookup = function lookup(type) {\n\t\tvar parsed;\n\n\t\tparsed = typeof type === 'string' ? mime.parse(type) : type;\n\n\t\tif (mimes[parsed.raw]) {\n\t\t\treturn mimes[parsed.raw];\n\t\t}\n\t\tif (mimes[parsed.type + parsed.suffix]) {\n\t\t\treturn mimes[parsed.type + parsed.suffix];\n\t\t}\n\t\tif (mimes[parsed.type]) {\n\t\t\treturn mimes[parsed.type];\n\t\t}\n\t\tif (mimes[parsed.suffix]) {\n\t\t\treturn mimes[parsed.suffix];\n\t\t}\n\n\t\treturn Promise.reject(new Error('Unable to locate converter for mime \"' + parsed.raw + '\"'));\n\t};\n\n\t/**\n\t * Create a late dispatched proxy to the target converter.\n\t *\n\t * Common when a converter is registered under multiple names and\n\t * should be kept in sync if updated.\n\t *\n\t * @param {string} type mime converter to dispatch to\n\t * @returns converter whose read/write methods target the desired mime converter\n\t */\n\tthis.delegate = function delegate(type) {\n\t\treturn {\n\t\t\tread: function () {\n\t\t\t\tvar args = arguments;\n\t\t\t\treturn this.lookup(type).then(function (converter) {\n\t\t\t\t\treturn converter.read.apply(this, args);\n\t\t\t\t}.bind(this));\n\t\t\t}.bind(this),\n\t\t\twrite: function () {\n\t\t\t\tvar args = arguments;\n\t\t\t\treturn this.lookup(type).then(function (converter) {\n\t\t\t\t\treturn converter.write.apply(this, args);\n\t\t\t\t}.bind(this));\n\t\t\t}.bind(this)\n\t\t};\n\t};\n\n\t/**\n\t * Register a custom converter for a MIME type\n\t *\n\t * @param {string} type the MIME type\n\t * @param converter the converter for the MIME type\n\t * @return a promise for the converter\n\t */\n\tthis.register = function register(type, converter) {\n\t\tmimes[type] = Promise.resolve(converter);\n\t\treturn mimes[type];\n\t};\n\n\t/**\n\t * Create a child registry whoes registered converters remain local, while\n\t * able to lookup converters from its parent.\n\t *\n\t * @returns child MIME registry\n\t */\n\tthis.child = function child() {\n\t\treturn new Registry(Object.create(mimes));\n\t};\n\n}\n\nregistry = new Registry({});\n\n// include provided serializers\nregistry.register('application/hal', __webpack_require__(/*! ./type/application/hal */ \"./node_modules/rest/mime/type/application/hal.js\"));\nregistry.register('application/json', __webpack_require__(/*! ./type/application/json */ \"./node_modules/rest/mime/type/application/json.js\"));\nregistry.register('application/x-www-form-urlencoded', __webpack_require__(/*! ./type/application/x-www-form-urlencoded */ \"./node_modules/rest/mime/type/application/x-www-form-urlencoded.js\"));\nregistry.register('multipart/form-data', __webpack_require__(/*! ./type/multipart/form-data */ \"./node_modules/rest/mime/type/multipart/form-data.js\"));\nregistry.register('text/plain', __webpack_require__(/*! ./type/text/plain */ \"./node_modules/rest/mime/type/text/plain.js\"));\n\nregistry.register('+json', registry.delegate('application/json'));\n\nmodule.exports = registry;\n\n\n//# sourceURL=webpack:///./node_modules/rest/mime/registry.js?");

/***/ }),

/***/ "./node_modules/rest/mime/type/application/hal.js":
/*!********************************************************!*\
  !*** ./node_modules/rest/mime/type/application/hal.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2013-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar pathPrefix, template, find, lazyPromise, responsePromise;\n\npathPrefix = __webpack_require__(/*! ../../../interceptor/pathPrefix */ \"./node_modules/rest/interceptor/pathPrefix.js\");\ntemplate = __webpack_require__(/*! ../../../interceptor/template */ \"./node_modules/rest/interceptor/template.js\");\nfind = __webpack_require__(/*! ../../../util/find */ \"./node_modules/rest/util/find.js\");\nlazyPromise = __webpack_require__(/*! ../../../util/lazyPromise */ \"./node_modules/rest/util/lazyPromise.js\");\nresponsePromise = __webpack_require__(/*! ../../../util/responsePromise */ \"./node_modules/rest/util/responsePromise.js\");\n\nfunction defineProperty(obj, name, value) {\n\tObject.defineProperty(obj, name, {\n\t\tvalue: value,\n\t\tconfigurable: true,\n\t\tenumerable: false,\n\t\twriteable: true\n\t});\n}\n\n/**\n * Hypertext Application Language serializer\n *\n * Implemented to https://tools.ietf.org/html/draft-kelly-json-hal-06\n *\n * As the spec is still a draft, this implementation will be updated as the\n * spec evolves\n *\n * Objects are read as HAL indexing links and embedded objects on to the\n * resource. Objects are written as plain JSON.\n *\n * Embedded relationships are indexed onto the resource by the relationship\n * as a promise for the related resource.\n *\n * Links are indexed onto the resource as a lazy promise that will GET the\n * resource when a handler is first registered on the promise.\n *\n * A `requestFor` method is added to the entity to make a request for the\n * relationship.\n *\n * A `clientFor` method is added to the entity to get a full Client for a\n * relationship.\n *\n * The `_links` and `_embedded` properties on the resource are made\n * non-enumerable.\n */\nmodule.exports = {\n\n\tread: function (str, opts) {\n\t\tvar client, console;\n\n\t\topts = opts || {};\n\t\tclient = opts.client;\n\t\tconsole = opts.console || console;\n\n\t\tfunction deprecationWarning(relationship, deprecation) {\n\t\t\tif (deprecation && console && console.warn || console.log) {\n\t\t\t\t(console.warn || console.log).call(console, 'Relationship \\'' + relationship + '\\' is deprecated, see ' + deprecation);\n\t\t\t}\n\t\t}\n\n\t\treturn opts.registry.lookup(opts.mime.suffix).then(function (converter) {\n\t\t\treturn converter.read(str, opts);\n\t\t}).then(function (root) {\n\t\t\tfind.findProperties(root, '_embedded', function (embedded, resource, name) {\n\t\t\t\tObject.keys(embedded).forEach(function (relationship) {\n\t\t\t\t\tif (relationship in resource) { return; }\n\t\t\t\t\tvar related = responsePromise({\n\t\t\t\t\t\tentity: embedded[relationship]\n\t\t\t\t\t});\n\t\t\t\t\tdefineProperty(resource, relationship, related);\n\t\t\t\t});\n\t\t\t\tdefineProperty(resource, name, embedded);\n\t\t\t});\n\t\t\tfind.findProperties(root, '_links', function (links, resource, name) {\n\t\t\t\tObject.keys(links).forEach(function (relationship) {\n\t\t\t\t\tvar link = links[relationship];\n\t\t\t\t\tif (relationship in resource) { return; }\n\t\t\t\t\tdefineProperty(resource, relationship, responsePromise.make(lazyPromise(function () {\n\t\t\t\t\t\tif (link.deprecation) { deprecationWarning(relationship, link.deprecation); }\n\t\t\t\t\t\tif (link.templated === true) {\n\t\t\t\t\t\t\treturn template(client)({ path: link.href });\n\t\t\t\t\t\t}\n\t\t\t\t\t\treturn client({ path: link.href });\n\t\t\t\t\t})));\n\t\t\t\t});\n\t\t\t\tdefineProperty(resource, name, links);\n\t\t\t\tdefineProperty(resource, 'clientFor', function (relationship, clientOverride) {\n\t\t\t\t\tvar link = links[relationship];\n\t\t\t\t\tif (!link) {\n\t\t\t\t\t\tthrow new Error('Unknown relationship: ' + relationship);\n\t\t\t\t\t}\n\t\t\t\t\tif (link.deprecation) { deprecationWarning(relationship, link.deprecation); }\n\t\t\t\t\tif (link.templated === true) {\n\t\t\t\t\t\treturn template(\n\t\t\t\t\t\t\tclientOverride || client,\n\t\t\t\t\t\t\t{ template: link.href }\n\t\t\t\t\t\t);\n\t\t\t\t\t}\n\t\t\t\t\treturn pathPrefix(\n\t\t\t\t\t\tclientOverride || client,\n\t\t\t\t\t\t{ prefix: link.href }\n\t\t\t\t\t);\n\t\t\t\t});\n\t\t\t\tdefineProperty(resource, 'requestFor', function (relationship, request, clientOverride) {\n\t\t\t\t\tvar client = this.clientFor(relationship, clientOverride);\n\t\t\t\t\treturn client(request);\n\t\t\t\t});\n\t\t\t});\n\n\t\t\treturn root;\n\t\t});\n\n\t},\n\n\twrite: function (obj, opts) {\n\t\treturn opts.registry.lookup(opts.mime.suffix).then(function (converter) {\n\t\t\treturn converter.write(obj, opts);\n\t\t});\n\t}\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/mime/type/application/hal.js?");

/***/ }),

/***/ "./node_modules/rest/mime/type/application/json.js":
/*!*********************************************************!*\
  !*** ./node_modules/rest/mime/type/application/json.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\n/**\n * Create a new JSON converter with custom reviver/replacer.\n *\n * The extended converter must be published to a MIME registry in order\n * to be used. The existing converter will not be modified.\n *\n * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON\n *\n * @param {function} [reviver=undefined] custom JSON.parse reviver\n * @param {function|Array} [replacer=undefined] custom JSON.stringify replacer\n */\nfunction createConverter(reviver, replacer) {\n\treturn {\n\n\t\tread: function (str) {\n\t\t\treturn JSON.parse(str, reviver);\n\t\t},\n\n\t\twrite: function (obj) {\n\t\t\treturn JSON.stringify(obj, replacer);\n\t\t},\n\n\t\textend: createConverter\n\n\t};\n}\n\nmodule.exports = createConverter();\n\n\n//# sourceURL=webpack:///./node_modules/rest/mime/type/application/json.js?");

/***/ }),

/***/ "./node_modules/rest/mime/type/application/x-www-form-urlencoded.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rest/mime/type/application/x-www-form-urlencoded.js ***!
  \**************************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar encodedSpaceRE, urlEncodedSpaceRE;\n\nencodedSpaceRE = /%20/g;\nurlEncodedSpaceRE = /\\+/g;\n\nfunction urlEncode(str) {\n\tstr = encodeURIComponent(str);\n\t// spec says space should be encoded as '+'\n\treturn str.replace(encodedSpaceRE, '+');\n}\n\nfunction urlDecode(str) {\n\t// spec says space should be encoded as '+'\n\tstr = str.replace(urlEncodedSpaceRE, ' ');\n\treturn decodeURIComponent(str);\n}\n\nfunction append(str, name, value) {\n\tif (Array.isArray(value)) {\n\t\tvalue.forEach(function (value) {\n\t\t\tstr = append(str, name, value);\n\t\t});\n\t}\n\telse {\n\t\tif (str.length > 0) {\n\t\t\tstr += '&';\n\t\t}\n\t\tstr += urlEncode(name);\n\t\tif (value !== undefined && value !== null) {\n\t\t\tstr += '=' + urlEncode(value);\n\t\t}\n\t}\n\treturn str;\n}\n\nmodule.exports = {\n\n\tread: function (str) {\n\t\tvar obj = {};\n\t\tstr.split('&').forEach(function (entry) {\n\t\t\tvar pair, name, value;\n\t\t\tpair = entry.split('=');\n\t\t\tname = urlDecode(pair[0]);\n\t\t\tif (pair.length === 2) {\n\t\t\t\tvalue = urlDecode(pair[1]);\n\t\t\t}\n\t\t\telse {\n\t\t\t\tvalue = null;\n\t\t\t}\n\t\t\tif (name in obj) {\n\t\t\t\tif (!Array.isArray(obj[name])) {\n\t\t\t\t\t// convert to an array, perserving currnent value\n\t\t\t\t\tobj[name] = [obj[name]];\n\t\t\t\t}\n\t\t\t\tobj[name].push(value);\n\t\t\t}\n\t\t\telse {\n\t\t\t\tobj[name] = value;\n\t\t\t}\n\t\t});\n\t\treturn obj;\n\t},\n\n\twrite: function (obj) {\n\t\tvar str = '';\n\t\tObject.keys(obj).forEach(function (name) {\n\t\t\tstr = append(str, name, obj[name]);\n\t\t});\n\t\treturn str;\n\t}\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/mime/type/application/x-www-form-urlencoded.js?");

/***/ }),

/***/ "./node_modules/rest/mime/type/multipart/form-data.js":
/*!************************************************************!*\
  !*** ./node_modules/rest/mime/type/multipart/form-data.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2014-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Michael Jackson\n */\n\n/* global FormData, File, Blob */\n\n\n\nfunction isFormElement(object) {\n\treturn object &&\n\t\tobject.nodeType === 1 && // Node.ELEMENT_NODE\n\t\tobject.tagName === 'FORM';\n}\n\nfunction createFormDataFromObject(object) {\n\tvar formData = new FormData();\n\n\tvar value;\n\tfor (var property in object) {\n\t\tif (object.hasOwnProperty(property)) {\n\t\t\tvalue = object[property];\n\n\t\t\tif (value instanceof File) {\n\t\t\t\tformData.append(property, value, value.name);\n\t\t\t} else if (value instanceof Blob) {\n\t\t\t\tformData.append(property, value);\n\t\t\t} else {\n\t\t\t\tformData.append(property, String(value));\n\t\t\t}\n\t\t}\n\t}\n\n\treturn formData;\n}\n\nmodule.exports = {\n\n\twrite: function (object) {\n\t\tif (typeof FormData === 'undefined') {\n\t\t\tthrow new Error('The multipart/form-data mime serializer requires FormData support');\n\t\t}\n\n\t\t// Support FormData directly.\n\t\tif (object instanceof FormData) {\n\t\t\treturn object;\n\t\t}\n\n\t\t// Support <form> elements.\n\t\tif (isFormElement(object)) {\n\t\t\treturn new FormData(object);\n\t\t}\n\n\t\t// Support plain objects, may contain File/Blob as value.\n\t\tif (typeof object === 'object' && object !== null) {\n\t\t\treturn createFormDataFromObject(object);\n\t\t}\n\n\t\tthrow new Error('Unable to create FormData from object ' + object);\n\t}\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/mime/type/multipart/form-data.js?");

/***/ }),

/***/ "./node_modules/rest/mime/type/text/plain.js":
/*!***************************************************!*\
  !*** ./node_modules/rest/mime/type/text/plain.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nmodule.exports = {\n\n\tread: function (str) {\n\t\treturn str;\n\t},\n\n\twrite: function (obj) {\n\t\treturn obj.toString();\n\t}\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/mime/type/text/plain.js?");

/***/ }),

/***/ "./node_modules/rest/util/attempt.js":
/*!*******************************************!*\
  !*** ./node_modules/rest/util/attempt.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2015-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\n/**\n * Attempt to invoke a function capturing the resulting value as a Promise\n *\n * If the method throws, the caught value used to reject the Promise.\n *\n * @param {function} work function to invoke\n * @returns {Promise} Promise for the output of the work function\n */\nfunction attempt(work) {\n\ttry {\n\t\treturn Promise.resolve(work());\n\t}\n\tcatch (e) {\n\t\treturn Promise.reject(e);\n\t}\n}\n\nmodule.exports = attempt;\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/attempt.js?");

/***/ }),

/***/ "./node_modules/rest/util/find.js":
/*!****************************************!*\
  !*** ./node_modules/rest/util/find.js ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2013-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nmodule.exports = {\n\n\t/**\n\t * Find objects within a graph the contain a property of a certain name.\n\t *\n\t * NOTE: this method will not discover object graph cycles.\n\t *\n\t * @param {*} obj object to search on\n\t * @param {string} prop name of the property to search for\n\t * @param {Function} callback function to receive the found properties and their parent\n\t */\n\tfindProperties: function findProperties(obj, prop, callback) {\n\t\tif (typeof obj !== 'object' || obj === null) { return; }\n\t\tif (prop in obj) {\n\t\t\tcallback(obj[prop], obj, prop);\n\t\t}\n\t\tObject.keys(obj).forEach(function (key) {\n\t\t\tfindProperties(obj[key], prop, callback);\n\t\t});\n\t}\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/find.js?");

/***/ }),

/***/ "./node_modules/rest/util/lazyPromise.js":
/*!***********************************************!*\
  !*** ./node_modules/rest/util/lazyPromise.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2013-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar attempt = __webpack_require__(/*! ./attempt */ \"./node_modules/rest/util/attempt.js\");\n\n/**\n * Create a promise whose work is started only when a handler is registered.\n *\n * The work function will be invoked at most once. Thrown values will result\n * in promise rejection.\n *\n * @param {Function} work function whose ouput is used to resolve the\n *   returned promise.\n * @returns {Promise} a lazy promise\n */\nfunction lazyPromise(work) {\n\tvar started, resolver, promise, then;\n\n\tstarted = false;\n\n\tpromise = new Promise(function (resolve, reject) {\n\t\tresolver = {\n\t\t\tresolve: resolve,\n\t\t\treject: reject\n\t\t};\n\t});\n\tthen = promise.then;\n\n\tpromise.then = function () {\n\t\tif (!started) {\n\t\t\tstarted = true;\n\t\t\tattempt(work).then(resolver.resolve, resolver.reject);\n\t\t}\n\t\treturn then.apply(promise, arguments);\n\t};\n\n\treturn promise;\n}\n\nmodule.exports = lazyPromise;\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/lazyPromise.js?");

/***/ }),

/***/ "./node_modules/rest/util/mixin.js":
/*!*****************************************!*\
  !*** ./node_modules/rest/util/mixin.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar empty = {};\n\n/**\n * Mix the properties from the source object into the destination object.\n * When the same property occurs in more then one object, the right most\n * value wins.\n *\n * @param {Object} dest the object to copy properties to\n * @param {Object} sources the objects to copy properties from.  May be 1 to N arguments, but not an Array.\n * @return {Object} the destination object\n */\nfunction mixin(dest /*, sources... */) {\n\tvar i, l, source, name;\n\n\tif (!dest) { dest = {}; }\n\tfor (i = 1, l = arguments.length; i < l; i += 1) {\n\t\tsource = arguments[i];\n\t\tfor (name in source) {\n\t\t\tif (!(name in dest) || (dest[name] !== source[name] && (!(name in empty) || empty[name] !== source[name]))) {\n\t\t\t\tdest[name] = source[name];\n\t\t\t}\n\t\t}\n\t}\n\n\treturn dest; // Object\n}\n\nmodule.exports = mixin;\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/mixin.js?");

/***/ }),

/***/ "./node_modules/rest/util/normalizeHeaderName.js":
/*!*******************************************************!*\
  !*** ./node_modules/rest/util/normalizeHeaderName.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2012-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\n/**\n * Normalize HTTP header names using the pseudo camel case.\n *\n * For example:\n *   content-type         -> Content-Type\n *   accepts              -> Accepts\n *   x-custom-header-name -> X-Custom-Header-Name\n *\n * @param {string} name the raw header name\n * @return {string} the normalized header name\n */\nfunction normalizeHeaderName(name) {\n\treturn name.toLowerCase()\n\t\t.split('-')\n\t\t.map(function (chunk) { return chunk.charAt(0).toUpperCase() + chunk.slice(1); })\n\t\t.join('-');\n}\n\nmodule.exports = normalizeHeaderName;\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/normalizeHeaderName.js?");

/***/ }),

/***/ "./node_modules/rest/util/responsePromise.js":
/*!***************************************************!*\
  !*** ./node_modules/rest/util/responsePromise.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2014-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\n/*jshint latedef: nofunc */\n\nvar normalizeHeaderName = __webpack_require__(/*! ./normalizeHeaderName */ \"./node_modules/rest/util/normalizeHeaderName.js\");\n\nfunction property(promise, name) {\n\treturn promise.then(\n\t\tfunction (value) {\n\t\t\treturn value && value[name];\n\t\t},\n\t\tfunction (value) {\n\t\t\treturn Promise.reject(value && value[name]);\n\t\t}\n\t);\n}\n\n/**\n * Obtain the response entity\n *\n * @returns {Promise} for the response entity\n */\nfunction entity() {\n\t/*jshint validthis:true */\n\treturn property(this, 'entity');\n}\n\n/**\n * Obtain the response status\n *\n * @returns {Promise} for the response status\n */\nfunction status() {\n\t/*jshint validthis:true */\n\treturn property(property(this, 'status'), 'code');\n}\n\n/**\n * Obtain the response headers map\n *\n * @returns {Promise} for the response headers map\n */\nfunction headers() {\n\t/*jshint validthis:true */\n\treturn property(this, 'headers');\n}\n\n/**\n * Obtain a specific response header\n *\n * @param {String} headerName the header to retrieve\n * @returns {Promise} for the response header's value\n */\nfunction header(headerName) {\n\t/*jshint validthis:true */\n\theaderName = normalizeHeaderName(headerName);\n\treturn property(this.headers(), headerName);\n}\n\n/**\n * Follow a related resource\n *\n * The relationship to follow may be define as a plain string, an object\n * with the rel and params, or an array containing one or more entries\n * with the previous forms.\n *\n * Examples:\n *   response.follow('next')\n *\n *   response.follow({ rel: 'next', params: { pageSize: 100 } })\n *\n *   response.follow([\n *       { rel: 'items', params: { projection: 'noImages' } },\n *       'search',\n *       { rel: 'findByGalleryIsNull', params: { projection: 'noImages' } },\n *       'items'\n *   ])\n *\n * @param {String|Object|Array} rels one, or more, relationships to follow\n * @returns ResponsePromise<Response> related resource\n */\nfunction follow(rels) {\n\t/*jshint validthis:true */\n\trels = [].concat(rels);\n\n\treturn make(rels.reduce(function (response, rel) {\n\t\treturn response.then(function (response) {\n\t\t\tif (typeof rel === 'string') {\n\t\t\t\trel = { rel: rel };\n\t\t\t}\n\t\t\tif (typeof response.entity.clientFor !== 'function') {\n\t\t\t\tthrow new Error('Hypermedia response expected');\n\t\t\t}\n\t\t\tvar client = response.entity.clientFor(rel.rel);\n\t\t\treturn client({ params: rel.params });\n\t\t});\n\t}, this));\n}\n\n/**\n * Wrap a Promise as an ResponsePromise\n *\n * @param {Promise<Response>} promise the promise for an HTTP Response\n * @returns {ResponsePromise<Response>} wrapped promise for Response with additional helper methods\n */\nfunction make(promise) {\n\tpromise.status = status;\n\tpromise.headers = headers;\n\tpromise.header = header;\n\tpromise.entity = entity;\n\tpromise.follow = follow;\n\treturn promise;\n}\n\nfunction responsePromise(obj, callback, errback) {\n\treturn make(Promise.resolve(obj).then(callback, errback));\n}\n\nresponsePromise.make = make;\nresponsePromise.reject = function (val) {\n\treturn make(Promise.reject(val));\n};\nresponsePromise.promise = function (func) {\n\treturn make(new Promise(func));\n};\n\nmodule.exports = responsePromise;\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/responsePromise.js?");

/***/ }),

/***/ "./node_modules/rest/util/uriEncoder.js":
/*!**********************************************!*\
  !*** ./node_modules/rest/util/uriEncoder.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2015-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar charMap;\n\ncharMap = (function () {\n\tvar strings = {\n\t\talpha: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',\n\t\tdigit: '0123456789'\n\t};\n\n\tstrings.genDelims = ':/?#[]@';\n\tstrings.subDelims = '!$&\\'()*+,;=';\n\tstrings.reserved = strings.genDelims + strings.subDelims;\n\tstrings.unreserved = strings.alpha + strings.digit + '-._~';\n\tstrings.url = strings.reserved + strings.unreserved;\n\tstrings.scheme = strings.alpha + strings.digit + '+-.';\n\tstrings.userinfo = strings.unreserved + strings.subDelims + ':';\n\tstrings.host = strings.unreserved + strings.subDelims;\n\tstrings.port = strings.digit;\n\tstrings.pchar = strings.unreserved + strings.subDelims + ':@';\n\tstrings.segment = strings.pchar;\n\tstrings.path = strings.segment + '/';\n\tstrings.query = strings.pchar + '/?';\n\tstrings.fragment = strings.pchar + '/?';\n\n\treturn Object.keys(strings).reduce(function (charMap, set) {\n\t\tcharMap[set] = strings[set].split('').reduce(function (chars, myChar) {\n\t\t\tchars[myChar] = true;\n\t\t\treturn chars;\n\t\t}, {});\n\t\treturn charMap;\n\t}, {});\n}());\n\nfunction encode(str, allowed) {\n\tif (typeof str !== 'string') {\n\t\tthrow new Error('String required for URL encoding');\n\t}\n\treturn str.split('').map(function (myChar) {\n\t\tif (allowed.hasOwnProperty(myChar)) {\n\t\t\treturn myChar;\n\t\t}\n\t\tvar code = myChar.charCodeAt(0);\n\t\tif (code <= 127) {\n\t\t\tvar encoded = code.toString(16).toUpperCase();\n \t\t\treturn '%' + (encoded.length % 2 === 1 ? '0' : '') + encoded;\n\t\t}\n\t\telse {\n\t\t\treturn encodeURIComponent(myChar).toUpperCase();\n\t\t}\n\t}).join('');\n}\n\nfunction makeEncoder(allowed) {\n\tallowed = allowed || charMap.unreserved;\n\treturn function (str) {\n\t\treturn encode(str, allowed);\n\t};\n}\n\nfunction decode(str) {\n\treturn decodeURIComponent(str);\n}\n\nmodule.exports = {\n\n\t/*\n\t * Decode URL encoded strings\n\t *\n\t * @param {string} URL encoded string\n\t * @returns {string} URL decoded string\n\t */\n\tdecode: decode,\n\n\t/*\n\t * URL encode a string\n\t *\n\t * All but alpha-numerics and a very limited set of punctuation - . _ ~ are\n\t * encoded.\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencode: makeEncoder(),\n\n\t/*\n\t* URL encode a URL\n\t*\n\t* All character permitted anywhere in a URL are left unencoded even\n\t* if that character is not permitted in that portion of a URL.\n\t*\n\t* Note: This method is typically not what you want.\n\t*\n\t* @param {string} string to encode\n\t* @returns {string} URL encoded string\n\t*/\n\tencodeURL: makeEncoder(charMap.url),\n\n\t/*\n\t * URL encode the scheme portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodeScheme: makeEncoder(charMap.scheme),\n\n\t/*\n\t * URL encode the user info portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodeUserInfo: makeEncoder(charMap.userinfo),\n\n\t/*\n\t * URL encode the host portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodeHost: makeEncoder(charMap.host),\n\n\t/*\n\t * URL encode the port portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodePort: makeEncoder(charMap.port),\n\n\t/*\n\t * URL encode a path segment portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodePathSegment: makeEncoder(charMap.segment),\n\n\t/*\n\t * URL encode the path portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodePath: makeEncoder(charMap.path),\n\n\t/*\n\t * URL encode the query portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodeQuery: makeEncoder(charMap.query),\n\n\t/*\n\t * URL encode the fragment portion of a URL\n\t *\n\t * @param {string} string to encode\n\t * @returns {string} URL encoded string\n\t */\n\tencodeFragment: makeEncoder(charMap.fragment)\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/uriEncoder.js?");

/***/ }),

/***/ "./node_modules/rest/util/uriTemplate.js":
/*!***********************************************!*\
  !*** ./node_modules/rest/util/uriTemplate.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("/*\n * Copyright 2015-2016 the original author or authors\n * @license MIT, see LICENSE.txt for details\n *\n * @author Scott Andrews\n */\n\n\n\nvar uriEncoder, operations, prefixRE;\n\nuriEncoder = __webpack_require__(/*! ./uriEncoder */ \"./node_modules/rest/util/uriEncoder.js\");\n\nprefixRE = /^([^:]*):([0-9]+)$/;\noperations = {\n\t'':  { first: '',  separator: ',', named: false, empty: '',  encoder: uriEncoder.encode },\n\t'+': { first: '',  separator: ',', named: false, empty: '',  encoder: uriEncoder.encodeURL },\n\t'#': { first: '#', separator: ',', named: false, empty: '',  encoder: uriEncoder.encodeURL },\n\t'.': { first: '.', separator: '.', named: false, empty: '',  encoder: uriEncoder.encode },\n\t'/': { first: '/', separator: '/', named: false, empty: '',  encoder: uriEncoder.encode },\n\t';': { first: ';', separator: ';', named: true,  empty: '',  encoder: uriEncoder.encode },\n\t'?': { first: '?', separator: '&', named: true,  empty: '=', encoder: uriEncoder.encode },\n\t'&': { first: '&', separator: '&', named: true,  empty: '=', encoder: uriEncoder.encode },\n\t'=': { reserved: true },\n\t',': { reserved: true },\n\t'!': { reserved: true },\n\t'@': { reserved: true },\n\t'|': { reserved: true }\n};\n\nfunction apply(operation, expression, params) {\n\t/*jshint maxcomplexity:11 */\n\treturn expression.split(',').reduce(function (result, variable) {\n\t\tvar opts, value;\n\n\t\topts = {};\n\t\tif (variable.slice(-1) === '*') {\n\t\t\tvariable = variable.slice(0, -1);\n\t\t\topts.explode = true;\n\t\t}\n\t\tif (prefixRE.test(variable)) {\n\t\t\tvar prefix = prefixRE.exec(variable);\n\t\t\tvariable = prefix[1];\n\t\t\topts.maxLength = parseInt(prefix[2]);\n\t\t}\n\n\t\tvariable = uriEncoder.decode(variable);\n\t\tvalue = params[variable];\n\n\t\tif (value === void 0 || value === null) {\n\t\t\treturn result;\n\t\t}\n\t\tif (Array.isArray(value)) {\n\t\t\tresult = value.reduce(function (result, value) {\n\t\t\t\tif (result.length) {\n\t\t\t\t\tresult += opts.explode ? operation.separator : ',';\n\t\t\t\t\tif (operation.named && opts.explode) {\n\t\t\t\t\t\tresult += operation.encoder(variable);\n\t\t\t\t\t\tresult += value.length ? '=' : operation.empty;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tresult += operation.first;\n\t\t\t\t\tif (operation.named) {\n\t\t\t\t\t\tresult += operation.encoder(variable);\n\t\t\t\t\t\tresult += value.length ? '=' : operation.empty;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tresult += operation.encoder(value);\n\t\t\t\treturn result;\n\t\t\t}, result);\n\t\t}\n\t\telse if (typeof value === 'object') {\n\t\t\tresult = Object.keys(value).reduce(function (result, name) {\n\t\t\t\tif (result.length) {\n\t\t\t\t\tresult += opts.explode ? operation.separator : ',';\n\t\t\t\t}\n\t\t\t\telse {\n\t\t\t\t\tresult += operation.first;\n\t\t\t\t\tif (operation.named && !opts.explode) {\n\t\t\t\t\t\tresult += operation.encoder(variable);\n\t\t\t\t\t\tresult += value[name].length ? '=' : operation.empty;\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t\tresult += operation.encoder(name);\n\t\t\t\tresult += opts.explode ? '=' : ',';\n\t\t\t\tresult += operation.encoder(value[name]);\n\t\t\t\treturn result;\n\t\t\t}, result);\n\t\t}\n\t\telse {\n\t\t\tvalue = String(value);\n\t\t\tif (opts.maxLength) {\n\t\t\t\tvalue = value.slice(0, opts.maxLength);\n\t\t\t}\n\t\t\tresult += result.length ? operation.separator : operation.first;\n\t\t\tif (operation.named) {\n\t\t\t\tresult += operation.encoder(variable);\n\t\t\t\tresult += value.length ? '=' : operation.empty;\n\t\t\t}\n\t\t\tresult += operation.encoder(value);\n\t\t}\n\n\t\treturn result;\n\t}, '');\n}\n\nfunction expandExpression(expression, params) {\n\tvar operation;\n\n\toperation = operations[expression.slice(0,1)];\n\tif (operation) {\n\t\texpression = expression.slice(1);\n\t}\n\telse {\n\t\toperation = operations[''];\n\t}\n\n\tif (operation.reserved) {\n\t\tthrow new Error('Reserved expression operations are not supported');\n\t}\n\n\treturn apply(operation, expression, params);\n}\n\nfunction expandTemplate(template, params) {\n\tvar start, end, uri;\n\n\turi = '';\n\tend = 0;\n\twhile (true) {\n\t\tstart = template.indexOf('{', end);\n\t\tif (start === -1) {\n\t\t\t// no more expressions\n\t\t\turi += template.slice(end);\n\t\t\tbreak;\n\t\t}\n\t\turi += template.slice(end, start);\n\t\tend = template.indexOf('}', start) + 1;\n\t\turi += expandExpression(template.slice(start + 1, end - 1), params);\n\t}\n\n\treturn uri;\n}\n\nmodule.exports = {\n\n\t/**\n\t * Expand a URI Template with parameters to form a URI.\n\t *\n\t * Full implementation (level 4) of rfc6570.\n\t * @see https://tools.ietf.org/html/rfc6570\n\t *\n\t * @param {string} template URI template\n\t * @param {Object} [params] params to apply to the template durring expantion\n\t * @returns {string} expanded URI\n\t */\n\texpand: expandTemplate\n\n};\n\n\n//# sourceURL=webpack:///./node_modules/rest/util/uriTemplate.js?");

/***/ }),

/***/ "./src/doors.js":
/*!**********************!*\
  !*** ./src/doors.js ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar rest = __webpack_require__(/*! rest */ \"./node_modules/rest/browser.js\");\nvar mime = __webpack_require__(/*! rest/interceptor/mime */ \"./node_modules/rest/interceptor/mime.js\");\n\nvar client = rest.wrap(mime);\nmodule.exports = function () {\n  var doorStatus = document.getElementById('door_status');\n  return client({\n    path: 'https://members.heatsynclabs.org/space_api.json'\n  }).then(function (response) {\n    console.log('door response', response);\n    var data = response.entity;\n    var status_text = '<span class=\"' + (data.open ? 'open' : 'closed') + '\">\\n    ' + (data.open ? 'open, come on down!' : 'closed, check the calendar!') + '\\n    </span>';\n    doorStatus.innerHTML = status_text;\n\n    return data;\n  }).catch(function (err) {\n    console.log('Did not get door data.', err);\n    doorStatus.innerHTML = 'Error occurred while fetching status, please refresh.';\n  }).then(function () {\n    // temporary hack\n    doorStatus.innerHTML = 'Check the Calendar';\n  });\n};\n\n//# sourceURL=webpack:///./src/doors.js?");

/***/ }),

/***/ "./src/live.js":
/*!*********************!*\
  !*** ./src/live.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nvar doors = __webpack_require__(/*! ./doors */ \"./src/doors.js\");\n\nfunction refresh() {\n  for (var i = 1; i <= 4; i++) {\n    document.getElementById('livestream' + i).src = 'http://live.heatsynclabs.org/snapshot.php?camera=' + i + '&time=' + new Date();\n    document.getElementById('lsAnchor' + i).href = 'http://live.heatsynclabs.org/snapshot.php?camera=' + i + '&time=' + new Date();\n  }\n}\n\ndocument.addEventListener('DOMContentLoaded', function () {\n  setInterval(refresh, 10000);\n\n  Promise.all([doors()]).then(console.log).catch(console.error);\n});\n\n//# sourceURL=webpack:///./src/live.js?");

/***/ })

/******/ });