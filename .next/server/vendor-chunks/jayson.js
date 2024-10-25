"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/jayson";
exports.ids = ["vendor-chunks/jayson"];
exports.modules = {

/***/ "(ssr)/./node_modules/jayson/lib/client/browser/index.js":
/*!*********************************************************!*\
  !*** ./node_modules/jayson/lib/client/browser/index.js ***!
  \*********************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst uuid = (__webpack_require__(/*! uuid */ \"(ssr)/./node_modules/uuid/dist/esm-node/index.js\").v4);\nconst generateRequest = __webpack_require__(/*! ../../generateRequest */ \"(ssr)/./node_modules/jayson/lib/generateRequest.js\");\n\n/**\n * Constructor for a Jayson Browser Client that does not depend any node.js core libraries\n * @class ClientBrowser\n * @param {Function} callServer Method that calls the server, receives the stringified request and a regular node-style callback\n * @param {Object} [options]\n * @param {Function} [options.reviver] Reviver function for JSON\n * @param {Function} [options.replacer] Replacer function for JSON\n * @param {Number} [options.version=2] JSON-RPC version to use (1|2)\n * @param {Function} [options.generator] Function to use for generating request IDs\n *  @param {Boolean} [options.notificationIdNull=false] When true, version 2 requests will set id to null instead of omitting it\n * @return {ClientBrowser}\n */\nconst ClientBrowser = function(callServer, options) {\n  if(!(this instanceof ClientBrowser)) {\n    return new ClientBrowser(callServer, options);\n  }\n\n  if (!options) {\n    options = {};\n  }\n\n  this.options = {\n    reviver: typeof options.reviver !== 'undefined' ? options.reviver : null,\n    replacer: typeof options.replacer !== 'undefined' ? options.replacer : null,\n    generator: typeof options.generator !== 'undefined' ? options.generator : function() { return uuid(); },\n    version: typeof options.version !== 'undefined' ? options.version : 2,\n    notificationIdNull: typeof options.notificationIdNull === 'boolean' ? options.notificationIdNull : false,\n  };\n\n  this.callServer = callServer;\n};\n\nmodule.exports = ClientBrowser;\n\n/**\n *  Creates a request and dispatches it if given a callback.\n *  @param {String|Array} method A batch request if passed an Array, or a method name if passed a String\n *  @param {Array|Object} [params] Parameters for the method\n *  @param {String|Number} [id] Optional id. If undefined an id will be generated. If null it creates a notification request\n *  @param {Function} [callback] Request callback. If specified, executes the request rather than only returning it.\n *  @throws {TypeError} Invalid parameters\n *  @return {Object} JSON-RPC 1.0 or 2.0 compatible request\n */\nClientBrowser.prototype.request = function(method, params, id, callback) {\n  const self = this;\n  let request = null;\n\n  // is this a batch request?\n  const isBatch = Array.isArray(method) && typeof params === 'function';\n\n  if (this.options.version === 1 && isBatch) {\n    throw new TypeError('JSON-RPC 1.0 does not support batching');\n  }\n\n  // is this a raw request?\n  const isRaw = !isBatch && method && typeof method === 'object' && typeof params === 'function';\n\n  if(isBatch || isRaw) {\n    callback = params;\n    request = method;\n  } else {\n    if(typeof id === 'function') {\n      callback = id;\n      // specifically undefined because \"null\" is a notification request\n      id = undefined;\n    }\n\n    const hasCallback = typeof callback === 'function';\n\n    try {\n      request = generateRequest(method, params, id, {\n        generator: this.options.generator,\n        version: this.options.version,\n        notificationIdNull: this.options.notificationIdNull,\n      });\n    } catch(err) {\n      if(hasCallback) {\n        return callback(err);\n      }\n      throw err;\n    }\n\n    // no callback means we should just return a raw request\n    if(!hasCallback) {\n      return request;\n    }\n\n  }\n\n  let message;\n  try {\n    message = JSON.stringify(request, this.options.replacer);\n  } catch(err) {\n    return callback(err);\n  }\n\n  this.callServer(message, function(err, response) {\n    self._parseResponse(err, response, callback);\n  });\n\n  // always return the raw request\n  return request;\n};\n\n/**\n * Parses a response from a server\n * @param {Object} err Error to pass on that is unrelated to the actual response\n * @param {String} responseText JSON-RPC 1.0 or 2.0 response\n * @param {Function} callback Callback that will receive different arguments depending on the amount of parameters\n * @private\n */\nClientBrowser.prototype._parseResponse = function(err, responseText, callback) {\n  if(err) {\n    callback(err);\n    return;\n  }\n\n  if(!responseText) {\n    // empty response text, assume that is correct because it could be a\n    // notification which jayson does not give any body for\n    return callback();\n  }\n\n  let response;\n  try {\n    response = JSON.parse(responseText, this.options.reviver);\n  } catch(err) {\n    return callback(err);\n  }\n\n  if(callback.length === 3) {\n    // if callback length is 3, we split callback arguments on error and response\n\n    // is batch response?\n    if(Array.isArray(response)) {\n\n      // neccesary to split strictly on validity according to spec here\n      const isError = function(res) {\n        return typeof res.error !== 'undefined';\n      };\n\n      const isNotError = function (res) {\n        return !isError(res);\n      };\n\n      return callback(null, response.filter(isError), response.filter(isNotError));\n    \n    } else {\n\n      // split regardless of validity\n      return callback(null, response.error, response.result);\n    \n    }\n  \n  }\n\n  callback(null, response);\n};\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvamF5c29uL2xpYi9jbGllbnQvYnJvd3Nlci9pbmRleC5qcyIsIm1hcHBpbmdzIjoiQUFBYTs7QUFFYixhQUFhLHdGQUFrQjtBQUMvQix3QkFBd0IsbUJBQU8sQ0FBQyxpRkFBdUI7O0FBRXZEO0FBQ0E7QUFDQTtBQUNBLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFdBQVcsVUFBVTtBQUNyQixXQUFXLFFBQVE7QUFDbkIsV0FBVyxVQUFVO0FBQ3JCLFlBQVksU0FBUztBQUNyQixZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsMkZBQTJGLGdCQUFnQjtBQUMzRztBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsWUFBWSxjQUFjO0FBQzFCLFlBQVksY0FBYztBQUMxQixZQUFZLGVBQWU7QUFDM0IsWUFBWSxVQUFVO0FBQ3RCLGFBQWEsV0FBVztBQUN4QixhQUFhLFFBQVE7QUFDckI7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsV0FBVyxRQUFRO0FBQ25CLFdBQVcsUUFBUTtBQUNuQixXQUFXLFVBQVU7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxNQUFNOztBQUVOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vdGVtcGxhdGUtbmV4dC10YWlsd2luZC1iYXNpYy8uL25vZGVfbW9kdWxlcy9qYXlzb24vbGliL2NsaWVudC9icm93c2VyL2luZGV4LmpzPzlhZGMiXSwic291cmNlc0NvbnRlbnQiOlsiJ3VzZSBzdHJpY3QnO1xuXG5jb25zdCB1dWlkID0gcmVxdWlyZSgndXVpZCcpLnY0O1xuY29uc3QgZ2VuZXJhdGVSZXF1ZXN0ID0gcmVxdWlyZSgnLi4vLi4vZ2VuZXJhdGVSZXF1ZXN0Jyk7XG5cbi8qKlxuICogQ29uc3RydWN0b3IgZm9yIGEgSmF5c29uIEJyb3dzZXIgQ2xpZW50IHRoYXQgZG9lcyBub3QgZGVwZW5kIGFueSBub2RlLmpzIGNvcmUgbGlicmFyaWVzXG4gKiBAY2xhc3MgQ2xpZW50QnJvd3NlclxuICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbFNlcnZlciBNZXRob2QgdGhhdCBjYWxscyB0aGUgc2VydmVyLCByZWNlaXZlcyB0aGUgc3RyaW5naWZpZWQgcmVxdWVzdCBhbmQgYSByZWd1bGFyIG5vZGUtc3R5bGUgY2FsbGJhY2tcbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9uc11cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnJldml2ZXJdIFJldml2ZXIgZnVuY3Rpb24gZm9yIEpTT05cbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLnJlcGxhY2VyXSBSZXBsYWNlciBmdW5jdGlvbiBmb3IgSlNPTlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLnZlcnNpb249Ml0gSlNPTi1SUEMgdmVyc2lvbiB0byB1c2UgKDF8MilcbiAqIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmdlbmVyYXRvcl0gRnVuY3Rpb24gdG8gdXNlIGZvciBnZW5lcmF0aW5nIHJlcXVlc3QgSURzXG4gKiAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ub3RpZmljYXRpb25JZE51bGw9ZmFsc2VdIFdoZW4gdHJ1ZSwgdmVyc2lvbiAyIHJlcXVlc3RzIHdpbGwgc2V0IGlkIHRvIG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZyBpdFxuICogQHJldHVybiB7Q2xpZW50QnJvd3Nlcn1cbiAqL1xuY29uc3QgQ2xpZW50QnJvd3NlciA9IGZ1bmN0aW9uKGNhbGxTZXJ2ZXIsIG9wdGlvbnMpIHtcbiAgaWYoISh0aGlzIGluc3RhbmNlb2YgQ2xpZW50QnJvd3NlcikpIHtcbiAgICByZXR1cm4gbmV3IENsaWVudEJyb3dzZXIoY2FsbFNlcnZlciwgb3B0aW9ucyk7XG4gIH1cblxuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cblxuICB0aGlzLm9wdGlvbnMgPSB7XG4gICAgcmV2aXZlcjogdHlwZW9mIG9wdGlvbnMucmV2aXZlciAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnJldml2ZXIgOiBudWxsLFxuICAgIHJlcGxhY2VyOiB0eXBlb2Ygb3B0aW9ucy5yZXBsYWNlciAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLnJlcGxhY2VyIDogbnVsbCxcbiAgICBnZW5lcmF0b3I6IHR5cGVvZiBvcHRpb25zLmdlbmVyYXRvciAhPT0gJ3VuZGVmaW5lZCcgPyBvcHRpb25zLmdlbmVyYXRvciA6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdXVpZCgpOyB9LFxuICAgIHZlcnNpb246IHR5cGVvZiBvcHRpb25zLnZlcnNpb24gIT09ICd1bmRlZmluZWQnID8gb3B0aW9ucy52ZXJzaW9uIDogMixcbiAgICBub3RpZmljYXRpb25JZE51bGw6IHR5cGVvZiBvcHRpb25zLm5vdGlmaWNhdGlvbklkTnVsbCA9PT0gJ2Jvb2xlYW4nID8gb3B0aW9ucy5ub3RpZmljYXRpb25JZE51bGwgOiBmYWxzZSxcbiAgfTtcblxuICB0aGlzLmNhbGxTZXJ2ZXIgPSBjYWxsU2VydmVyO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBDbGllbnRCcm93c2VyO1xuXG4vKipcbiAqICBDcmVhdGVzIGEgcmVxdWVzdCBhbmQgZGlzcGF0Y2hlcyBpdCBpZiBnaXZlbiBhIGNhbGxiYWNrLlxuICogIEBwYXJhbSB7U3RyaW5nfEFycmF5fSBtZXRob2QgQSBiYXRjaCByZXF1ZXN0IGlmIHBhc3NlZCBhbiBBcnJheSwgb3IgYSBtZXRob2QgbmFtZSBpZiBwYXNzZWQgYSBTdHJpbmdcbiAqICBAcGFyYW0ge0FycmF5fE9iamVjdH0gW3BhcmFtc10gUGFyYW1ldGVycyBmb3IgdGhlIG1ldGhvZFxuICogIEBwYXJhbSB7U3RyaW5nfE51bWJlcn0gW2lkXSBPcHRpb25hbCBpZC4gSWYgdW5kZWZpbmVkIGFuIGlkIHdpbGwgYmUgZ2VuZXJhdGVkLiBJZiBudWxsIGl0IGNyZWF0ZXMgYSBub3RpZmljYXRpb24gcmVxdWVzdFxuICogIEBwYXJhbSB7RnVuY3Rpb259IFtjYWxsYmFja10gUmVxdWVzdCBjYWxsYmFjay4gSWYgc3BlY2lmaWVkLCBleGVjdXRlcyB0aGUgcmVxdWVzdCByYXRoZXIgdGhhbiBvbmx5IHJldHVybmluZyBpdC5cbiAqICBAdGhyb3dzIHtUeXBlRXJyb3J9IEludmFsaWQgcGFyYW1ldGVyc1xuICogIEByZXR1cm4ge09iamVjdH0gSlNPTi1SUEMgMS4wIG9yIDIuMCBjb21wYXRpYmxlIHJlcXVlc3RcbiAqL1xuQ2xpZW50QnJvd3Nlci5wcm90b3R5cGUucmVxdWVzdCA9IGZ1bmN0aW9uKG1ldGhvZCwgcGFyYW1zLCBpZCwgY2FsbGJhY2spIHtcbiAgY29uc3Qgc2VsZiA9IHRoaXM7XG4gIGxldCByZXF1ZXN0ID0gbnVsbDtcblxuICAvLyBpcyB0aGlzIGEgYmF0Y2ggcmVxdWVzdD9cbiAgY29uc3QgaXNCYXRjaCA9IEFycmF5LmlzQXJyYXkobWV0aG9kKSAmJiB0eXBlb2YgcGFyYW1zID09PSAnZnVuY3Rpb24nO1xuXG4gIGlmICh0aGlzLm9wdGlvbnMudmVyc2lvbiA9PT0gMSAmJiBpc0JhdGNoKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSlNPTi1SUEMgMS4wIGRvZXMgbm90IHN1cHBvcnQgYmF0Y2hpbmcnKTtcbiAgfVxuXG4gIC8vIGlzIHRoaXMgYSByYXcgcmVxdWVzdD9cbiAgY29uc3QgaXNSYXcgPSAhaXNCYXRjaCAmJiBtZXRob2QgJiYgdHlwZW9mIG1ldGhvZCA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHBhcmFtcyA9PT0gJ2Z1bmN0aW9uJztcblxuICBpZihpc0JhdGNoIHx8IGlzUmF3KSB7XG4gICAgY2FsbGJhY2sgPSBwYXJhbXM7XG4gICAgcmVxdWVzdCA9IG1ldGhvZDtcbiAgfSBlbHNlIHtcbiAgICBpZih0eXBlb2YgaWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIGNhbGxiYWNrID0gaWQ7XG4gICAgICAvLyBzcGVjaWZpY2FsbHkgdW5kZWZpbmVkIGJlY2F1c2UgXCJudWxsXCIgaXMgYSBub3RpZmljYXRpb24gcmVxdWVzdFxuICAgICAgaWQgPSB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgY29uc3QgaGFzQ2FsbGJhY2sgPSB0eXBlb2YgY2FsbGJhY2sgPT09ICdmdW5jdGlvbic7XG5cbiAgICB0cnkge1xuICAgICAgcmVxdWVzdCA9IGdlbmVyYXRlUmVxdWVzdChtZXRob2QsIHBhcmFtcywgaWQsIHtcbiAgICAgICAgZ2VuZXJhdG9yOiB0aGlzLm9wdGlvbnMuZ2VuZXJhdG9yLFxuICAgICAgICB2ZXJzaW9uOiB0aGlzLm9wdGlvbnMudmVyc2lvbixcbiAgICAgICAgbm90aWZpY2F0aW9uSWROdWxsOiB0aGlzLm9wdGlvbnMubm90aWZpY2F0aW9uSWROdWxsLFxuICAgICAgfSk7XG4gICAgfSBjYXRjaChlcnIpIHtcbiAgICAgIGlmKGhhc0NhbGxiYWNrKSB7XG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICAgICAgfVxuICAgICAgdGhyb3cgZXJyO1xuICAgIH1cblxuICAgIC8vIG5vIGNhbGxiYWNrIG1lYW5zIHdlIHNob3VsZCBqdXN0IHJldHVybiBhIHJhdyByZXF1ZXN0XG4gICAgaWYoIWhhc0NhbGxiYWNrKSB7XG4gICAgICByZXR1cm4gcmVxdWVzdDtcbiAgICB9XG5cbiAgfVxuXG4gIGxldCBtZXNzYWdlO1xuICB0cnkge1xuICAgIG1lc3NhZ2UgPSBKU09OLnN0cmluZ2lmeShyZXF1ZXN0LCB0aGlzLm9wdGlvbnMucmVwbGFjZXIpO1xuICB9IGNhdGNoKGVycikge1xuICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICB9XG5cbiAgdGhpcy5jYWxsU2VydmVyKG1lc3NhZ2UsIGZ1bmN0aW9uKGVyciwgcmVzcG9uc2UpIHtcbiAgICBzZWxmLl9wYXJzZVJlc3BvbnNlKGVyciwgcmVzcG9uc2UsIGNhbGxiYWNrKTtcbiAgfSk7XG5cbiAgLy8gYWx3YXlzIHJldHVybiB0aGUgcmF3IHJlcXVlc3RcbiAgcmV0dXJuIHJlcXVlc3Q7XG59O1xuXG4vKipcbiAqIFBhcnNlcyBhIHJlc3BvbnNlIGZyb20gYSBzZXJ2ZXJcbiAqIEBwYXJhbSB7T2JqZWN0fSBlcnIgRXJyb3IgdG8gcGFzcyBvbiB0aGF0IGlzIHVucmVsYXRlZCB0byB0aGUgYWN0dWFsIHJlc3BvbnNlXG4gKiBAcGFyYW0ge1N0cmluZ30gcmVzcG9uc2VUZXh0IEpTT04tUlBDIDEuMCBvciAyLjAgcmVzcG9uc2VcbiAqIEBwYXJhbSB7RnVuY3Rpb259IGNhbGxiYWNrIENhbGxiYWNrIHRoYXQgd2lsbCByZWNlaXZlIGRpZmZlcmVudCBhcmd1bWVudHMgZGVwZW5kaW5nIG9uIHRoZSBhbW91bnQgb2YgcGFyYW1ldGVyc1xuICogQHByaXZhdGVcbiAqL1xuQ2xpZW50QnJvd3Nlci5wcm90b3R5cGUuX3BhcnNlUmVzcG9uc2UgPSBmdW5jdGlvbihlcnIsIHJlc3BvbnNlVGV4dCwgY2FsbGJhY2spIHtcbiAgaWYoZXJyKSB7XG4gICAgY2FsbGJhY2soZXJyKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBpZighcmVzcG9uc2VUZXh0KSB7XG4gICAgLy8gZW1wdHkgcmVzcG9uc2UgdGV4dCwgYXNzdW1lIHRoYXQgaXMgY29ycmVjdCBiZWNhdXNlIGl0IGNvdWxkIGJlIGFcbiAgICAvLyBub3RpZmljYXRpb24gd2hpY2ggamF5c29uIGRvZXMgbm90IGdpdmUgYW55IGJvZHkgZm9yXG4gICAgcmV0dXJuIGNhbGxiYWNrKCk7XG4gIH1cblxuICBsZXQgcmVzcG9uc2U7XG4gIHRyeSB7XG4gICAgcmVzcG9uc2UgPSBKU09OLnBhcnNlKHJlc3BvbnNlVGV4dCwgdGhpcy5vcHRpb25zLnJldml2ZXIpO1xuICB9IGNhdGNoKGVycikge1xuICAgIHJldHVybiBjYWxsYmFjayhlcnIpO1xuICB9XG5cbiAgaWYoY2FsbGJhY2subGVuZ3RoID09PSAzKSB7XG4gICAgLy8gaWYgY2FsbGJhY2sgbGVuZ3RoIGlzIDMsIHdlIHNwbGl0IGNhbGxiYWNrIGFyZ3VtZW50cyBvbiBlcnJvciBhbmQgcmVzcG9uc2VcblxuICAgIC8vIGlzIGJhdGNoIHJlc3BvbnNlP1xuICAgIGlmKEFycmF5LmlzQXJyYXkocmVzcG9uc2UpKSB7XG5cbiAgICAgIC8vIG5lY2Nlc2FyeSB0byBzcGxpdCBzdHJpY3RseSBvbiB2YWxpZGl0eSBhY2NvcmRpbmcgdG8gc3BlYyBoZXJlXG4gICAgICBjb25zdCBpc0Vycm9yID0gZnVuY3Rpb24ocmVzKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgcmVzLmVycm9yICE9PSAndW5kZWZpbmVkJztcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGlzTm90RXJyb3IgPSBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIHJldHVybiAhaXNFcnJvcihyZXMpO1xuICAgICAgfTtcblxuICAgICAgcmV0dXJuIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlLmZpbHRlcihpc0Vycm9yKSwgcmVzcG9uc2UuZmlsdGVyKGlzTm90RXJyb3IpKTtcbiAgICBcbiAgICB9IGVsc2Uge1xuXG4gICAgICAvLyBzcGxpdCByZWdhcmRsZXNzIG9mIHZhbGlkaXR5XG4gICAgICByZXR1cm4gY2FsbGJhY2sobnVsbCwgcmVzcG9uc2UuZXJyb3IsIHJlc3BvbnNlLnJlc3VsdCk7XG4gICAgXG4gICAgfVxuICBcbiAgfVxuXG4gIGNhbGxiYWNrKG51bGwsIHJlc3BvbnNlKTtcbn07XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jayson/lib/client/browser/index.js\n");

/***/ }),

/***/ "(ssr)/./node_modules/jayson/lib/generateRequest.js":
/*!****************************************************!*\
  !*** ./node_modules/jayson/lib/generateRequest.js ***!
  \****************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\n\nconst uuid = (__webpack_require__(/*! uuid */ \"(ssr)/./node_modules/uuid/dist/esm-node/index.js\").v4);\n\n/**\n *  Generates a JSON-RPC 1.0 or 2.0 request\n *  @param {String} method Name of method to call\n *  @param {Array|Object} params Array of parameters passed to the method as specified, or an object of parameter names and corresponding value\n *  @param {String|Number|null} [id] Request ID can be a string, number, null for explicit notification or left out for automatic generation\n *  @param {Object} [options]\n *  @param {Number} [options.version=2] JSON-RPC version to use (1 or 2)\n *  @param {Boolean} [options.notificationIdNull=false] When true, version 2 requests will set id to null instead of omitting it\n *  @param {Function} [options.generator] Passed the request, and the options object and is expected to return a request ID\n *  @throws {TypeError} If any of the parameters are invalid\n *  @return {Object} A JSON-RPC 1.0 or 2.0 request\n *  @memberOf Utils\n */\nconst generateRequest = function(method, params, id, options) {\n  if(typeof method !== 'string') {\n    throw new TypeError(method + ' must be a string');\n  }\n\n  options = options || {};\n\n  // check valid version provided\n  const version = typeof options.version === 'number' ? options.version : 2;\n  if (version !== 1 && version !== 2) {\n    throw new TypeError(version + ' must be 1 or 2');\n  }\n\n  const request = {\n    method: method\n  };\n\n  if(version === 2) {\n    request.jsonrpc = '2.0';\n  }\n\n  if(params) {\n    // params given, but invalid?\n    if(typeof params !== 'object' && !Array.isArray(params)) {\n      throw new TypeError(params + ' must be an object, array or omitted');\n    }\n    request.params = params;\n  }\n\n  // if id was left out, generate one (null means explicit notification)\n  if(typeof(id) === 'undefined') {\n    const generator = typeof options.generator === 'function' ? options.generator : function() { return uuid(); };\n    request.id = generator(request, options);\n  } else if (version === 2 && id === null) {\n    // we have a version 2 notification\n    if (options.notificationIdNull) {\n      request.id = null; // id will not be set at all unless option provided\n    }\n  } else {\n    request.id = id;\n  }\n\n  return request;\n};\n\nmodule.exports = generateRequest;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKHNzcikvLi9ub2RlX21vZHVsZXMvamF5c29uL2xpYi9nZW5lcmF0ZVJlcXVlc3QuanMiLCJtYXBwaW5ncyI6IkFBQWE7O0FBRWIsYUFBYSx3RkFBa0I7O0FBRS9CO0FBQ0E7QUFDQSxZQUFZLFFBQVE7QUFDcEIsWUFBWSxjQUFjO0FBQzFCLFlBQVksb0JBQW9CO0FBQ2hDLFlBQVksUUFBUTtBQUNwQixZQUFZLFFBQVE7QUFDcEIsWUFBWSxTQUFTO0FBQ3JCLFlBQVksVUFBVTtBQUN0QixhQUFhLFdBQVc7QUFDeEIsYUFBYSxRQUFRO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlHQUFpRztBQUNqRztBQUNBLElBQUk7QUFDSjtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSIsInNvdXJjZXMiOlsid2VicGFjazovL3RlbXBsYXRlLW5leHQtdGFpbHdpbmQtYmFzaWMvLi9ub2RlX21vZHVsZXMvamF5c29uL2xpYi9nZW5lcmF0ZVJlcXVlc3QuanM/ZmY5OCJdLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIHN0cmljdCc7XG5cbmNvbnN0IHV1aWQgPSByZXF1aXJlKCd1dWlkJykudjQ7XG5cbi8qKlxuICogIEdlbmVyYXRlcyBhIEpTT04tUlBDIDEuMCBvciAyLjAgcmVxdWVzdFxuICogIEBwYXJhbSB7U3RyaW5nfSBtZXRob2QgTmFtZSBvZiBtZXRob2QgdG8gY2FsbFxuICogIEBwYXJhbSB7QXJyYXl8T2JqZWN0fSBwYXJhbXMgQXJyYXkgb2YgcGFyYW1ldGVycyBwYXNzZWQgdG8gdGhlIG1ldGhvZCBhcyBzcGVjaWZpZWQsIG9yIGFuIG9iamVjdCBvZiBwYXJhbWV0ZXIgbmFtZXMgYW5kIGNvcnJlc3BvbmRpbmcgdmFsdWVcbiAqICBAcGFyYW0ge1N0cmluZ3xOdW1iZXJ8bnVsbH0gW2lkXSBSZXF1ZXN0IElEIGNhbiBiZSBhIHN0cmluZywgbnVtYmVyLCBudWxsIGZvciBleHBsaWNpdCBub3RpZmljYXRpb24gb3IgbGVmdCBvdXQgZm9yIGF1dG9tYXRpYyBnZW5lcmF0aW9uXG4gKiAgQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zXVxuICogIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy52ZXJzaW9uPTJdIEpTT04tUlBDIHZlcnNpb24gdG8gdXNlICgxIG9yIDIpXG4gKiAgQHBhcmFtIHtCb29sZWFufSBbb3B0aW9ucy5ub3RpZmljYXRpb25JZE51bGw9ZmFsc2VdIFdoZW4gdHJ1ZSwgdmVyc2lvbiAyIHJlcXVlc3RzIHdpbGwgc2V0IGlkIHRvIG51bGwgaW5zdGVhZCBvZiBvbWl0dGluZyBpdFxuICogIEBwYXJhbSB7RnVuY3Rpb259IFtvcHRpb25zLmdlbmVyYXRvcl0gUGFzc2VkIHRoZSByZXF1ZXN0LCBhbmQgdGhlIG9wdGlvbnMgb2JqZWN0IGFuZCBpcyBleHBlY3RlZCB0byByZXR1cm4gYSByZXF1ZXN0IElEXG4gKiAgQHRocm93cyB7VHlwZUVycm9yfSBJZiBhbnkgb2YgdGhlIHBhcmFtZXRlcnMgYXJlIGludmFsaWRcbiAqICBAcmV0dXJuIHtPYmplY3R9IEEgSlNPTi1SUEMgMS4wIG9yIDIuMCByZXF1ZXN0XG4gKiAgQG1lbWJlck9mIFV0aWxzXG4gKi9cbmNvbnN0IGdlbmVyYXRlUmVxdWVzdCA9IGZ1bmN0aW9uKG1ldGhvZCwgcGFyYW1zLCBpZCwgb3B0aW9ucykge1xuICBpZih0eXBlb2YgbWV0aG9kICE9PSAnc3RyaW5nJykge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IobWV0aG9kICsgJyBtdXN0IGJlIGEgc3RyaW5nJyk7XG4gIH1cblxuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblxuICAvLyBjaGVjayB2YWxpZCB2ZXJzaW9uIHByb3ZpZGVkXG4gIGNvbnN0IHZlcnNpb24gPSB0eXBlb2Ygb3B0aW9ucy52ZXJzaW9uID09PSAnbnVtYmVyJyA/IG9wdGlvbnMudmVyc2lvbiA6IDI7XG4gIGlmICh2ZXJzaW9uICE9PSAxICYmIHZlcnNpb24gIT09IDIpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHZlcnNpb24gKyAnIG11c3QgYmUgMSBvciAyJyk7XG4gIH1cblxuICBjb25zdCByZXF1ZXN0ID0ge1xuICAgIG1ldGhvZDogbWV0aG9kXG4gIH07XG5cbiAgaWYodmVyc2lvbiA9PT0gMikge1xuICAgIHJlcXVlc3QuanNvbnJwYyA9ICcyLjAnO1xuICB9XG5cbiAgaWYocGFyYW1zKSB7XG4gICAgLy8gcGFyYW1zIGdpdmVuLCBidXQgaW52YWxpZD9cbiAgICBpZih0eXBlb2YgcGFyYW1zICE9PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShwYXJhbXMpKSB7XG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKHBhcmFtcyArICcgbXVzdCBiZSBhbiBvYmplY3QsIGFycmF5IG9yIG9taXR0ZWQnKTtcbiAgICB9XG4gICAgcmVxdWVzdC5wYXJhbXMgPSBwYXJhbXM7XG4gIH1cblxuICAvLyBpZiBpZCB3YXMgbGVmdCBvdXQsIGdlbmVyYXRlIG9uZSAobnVsbCBtZWFucyBleHBsaWNpdCBub3RpZmljYXRpb24pXG4gIGlmKHR5cGVvZihpZCkgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgY29uc3QgZ2VuZXJhdG9yID0gdHlwZW9mIG9wdGlvbnMuZ2VuZXJhdG9yID09PSAnZnVuY3Rpb24nID8gb3B0aW9ucy5nZW5lcmF0b3IgOiBmdW5jdGlvbigpIHsgcmV0dXJuIHV1aWQoKTsgfTtcbiAgICByZXF1ZXN0LmlkID0gZ2VuZXJhdG9yKHJlcXVlc3QsIG9wdGlvbnMpO1xuICB9IGVsc2UgaWYgKHZlcnNpb24gPT09IDIgJiYgaWQgPT09IG51bGwpIHtcbiAgICAvLyB3ZSBoYXZlIGEgdmVyc2lvbiAyIG5vdGlmaWNhdGlvblxuICAgIGlmIChvcHRpb25zLm5vdGlmaWNhdGlvbklkTnVsbCkge1xuICAgICAgcmVxdWVzdC5pZCA9IG51bGw7IC8vIGlkIHdpbGwgbm90IGJlIHNldCBhdCBhbGwgdW5sZXNzIG9wdGlvbiBwcm92aWRlZFxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICByZXF1ZXN0LmlkID0gaWQ7XG4gIH1cblxuICByZXR1cm4gcmVxdWVzdDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZ2VuZXJhdGVSZXF1ZXN0O1xuIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(ssr)/./node_modules/jayson/lib/generateRequest.js\n");

/***/ })

};
;