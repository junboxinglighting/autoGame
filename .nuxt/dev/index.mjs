import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import crypto from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getRouterParam, getHeader, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getHeaders, getMethod, setHeader, getResponseStatusText } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/h3/dist/index.mjs';
import { escapeHtml } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/@vue/shared/dist/shared.cjs.js';
import bcrypt from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/bcryptjs/index.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/ufo/dist/index.mjs';
import { renderToString } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/vue/server-renderer/index.mjs';
import { klona } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/defu/dist/defu.mjs';
import destr, { destr as destr$1 } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/destr/dist/index.mjs';
import { snakeCase } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/scule/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/unhead/dist/server.mjs';
import { stringify, uneval } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/devalue/index.js';
import { isVNode, toValue, isRef } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/vue/index.mjs';
import { DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/unhead/dist/plugins.mjs';
import { createHooks } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/ohash/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/youch-core/build/index.js';
import { Youch } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/nitropack/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { getContext } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/unctx/dist/index.mjs';
import { captureRawStackTrace, parseRawStackTrace } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/errx/dist/index.js';
import mysql from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/mysql2/promise.js';
import { promises } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname as dirname$1, resolve as resolve$1 } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/pathe/dist/index.mjs';
import jwt from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/jsonwebtoken/index.js';
import { walkResolver } from 'file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"C:/Users/ql/Desktop/activation-code-system/activation-code-system/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/ql/Desktop/activation-code-system/activation-code-system","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"C:/Users/ql/Desktop/activation-code-system/activation-code-system/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/ql/Desktop/activation-code-system/activation-code-system/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"C:/Users/ql/Desktop/activation-code-system/activation-code-system/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"C:/Users/ql/Desktop/activation-code-system/activation-code-system/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {
    "apiBase": "/api"
  },
  "jwtSecret": "your-super-secret-jwt-key-change-this-in-production",
  "dbHost": "localhost",
  "dbPort": "3306",
  "dbUser": "root",
  "dbPassword": "123321",
  "dbName": "activation_code_system",
  "alipayAppId": "your_alipay_app_id",
  "alipayPrivateKey": "your_alipay_private_key",
  "wechatAppId": "your_wechat_app_id",
  "wechatAppSecret": "your_wechat_app_secret"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

function isJsonRequest(event) {
  if (hasReqHeader(event, "accept", "text/html")) {
    return false;
  }
  return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
  const value = getRequestHeader(event, name);
  return value && typeof value === "string" && value.toLowerCase().includes(includes);
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
  if (event.handled || isJsonRequest(event)) {
    return;
  }
  const defaultRes = await defaultHandler(error, event, { json: true });
  const statusCode = error.statusCode || 500;
  if (statusCode === 404 && defaultRes.status === 302) {
    setResponseHeaders(event, defaultRes.headers);
    setResponseStatus(event, defaultRes.status, defaultRes.statusText);
    return send(event, JSON.stringify(defaultRes.body, null, 2));
  }
  if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
    defaultRes.body.stack = defaultRes.body.stack.join("\n");
  }
  const errorObject = defaultRes.body;
  const url = new URL(errorObject.url);
  errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
  errorObject.message ||= "Server Error";
  errorObject.data ||= error.data;
  errorObject.statusMessage ||= error.statusMessage;
  delete defaultRes.headers["content-type"];
  delete defaultRes.headers["content-security-policy"];
  setResponseHeaders(event, defaultRes.headers);
  const reqHeaders = getRequestHeaders(event);
  const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
  const res = isRenderingError ? null : await useNitroApp().localFetch(
    withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject),
    {
      headers: { ...reqHeaders, "x-nuxt-error": "true" },
      redirect: "manual"
    }
  ).catch(() => null);
  if (event.handled) {
    return;
  }
  if (!res) {
    const { template } = await Promise.resolve().then(function () { return errorDev; }) ;
    {
      errorObject.description = errorObject.message;
    }
    setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
    return send(event, template(errorObject));
  }
  const html = await res.text();
  for (const [header, value] of res.headers.entries()) {
    if (header === "set-cookie") {
      appendResponseHeader(event, header, value);
      continue;
    }
    setResponseHeader(event, header, value);
  }
  setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
  return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json || !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _cwpI_lvmIz2CfPI21_dj3n8IVaqoRHZd85rr7Bb3ku8 = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "C:/Users/ql/Desktop/activation-code-system/activation-code-system";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appId = "nuxt-app";

const devReducers = {
  VNode: (data) => isVNode(data) ? { type: data.type, props: data.props } : void 0,
  URL: (data) => data instanceof URL ? data.toString() : void 0
};
const asyncContext = getContext("nuxt-dev", { asyncContext: true, AsyncLocalStorage });
const _KW2rqI6oLhj38Pl0ZL3oKrMJHdZVKGgk3OMhboqqh4 = (nitroApp) => {
  const handler = nitroApp.h3App.handler;
  nitroApp.h3App.handler = (event) => {
    return asyncContext.callAsync({ logs: [], event }, () => handler(event));
  };
  onConsoleLog((_log) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    const rawStack = captureRawStackTrace();
    if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
      return;
    }
    const trace = [];
    let filename = "";
    for (const entry of parseRawStackTrace(rawStack)) {
      if (entry.source === globalThis._importMeta_.url) {
        continue;
      }
      if (EXCLUDE_TRACE_RE.test(entry.source)) {
        continue;
      }
      filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
      trace.push({
        ...entry,
        source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
      });
    }
    const log = {
      ..._log,
      // Pass along filename to allow the client to display more info about where log comes from
      filename,
      // Clean up file names in stack trace
      stack: trace
    };
    ctx.logs.push(log);
  });
  nitroApp.hooks.hook("afterResponse", () => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    return nitroApp.hooks.callHook("dev:ssr-logs", { logs: ctx.logs, path: ctx.event.path });
  });
  nitroApp.hooks.hook("render:html", (htmlContext) => {
    const ctx = asyncContext.tryUse();
    if (!ctx) {
      return;
    }
    try {
      const reducers = Object.assign(/* @__PURE__ */ Object.create(null), devReducers, ctx.event.context._payloadReducers);
      htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
    } catch (e) {
      const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
      console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/api/composables/use-nuxt-app#payload.`);
    }
  });
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
  consola$1.addReporter({
    log(logObj) {
      callback(logObj);
    }
  });
  consola$1.wrapConsole();
}

var __defProp$2 = Object.defineProperty;
var __defNormalProp$2 = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$2 = (obj, key, value) => __defNormalProp$2(obj, typeof key !== "symbol" ? key + "" : key, value);
const _Database = class _Database {
  constructor() {
    __publicField$2(this, "pool", null);
  }
  static getInstance() {
    if (!_Database.instance) {
      _Database.instance = new _Database();
    }
    return _Database.instance;
  }
  async connect(config) {
    try {
      this.pool = mysql.createPool({
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.password,
        database: config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
        timezone: "+08:00",
        charset: "utf8mb4"
      });
      const connection = await this.pool.getConnection();
      await connection.ping();
      connection.release();
      console.log("\u6570\u636E\u5E93\u8FDE\u63A5\u6210\u529F");
    } catch (error) {
      console.error("\u6570\u636E\u5E93\u8FDE\u63A5\u5931\u8D25:", error);
      throw error;
    }
  }
  async query(sql, params) {
    if (!this.pool) {
      throw new Error("\u6570\u636E\u5E93\u672A\u8FDE\u63A5");
    }
    try {
      const [rows] = await this.pool.execute(sql, params);
      return rows;
    } catch (error) {
      console.error("SQL\u6267\u884C\u9519\u8BEF:", error);
      throw error;
    }
  }
  async queryOne(sql, params) {
    const results = await this.query(sql, params);
    return results.length > 0 ? results[0] : null;
  }
  async transaction(callback) {
    if (!this.pool) {
      throw new Error("\u6570\u636E\u5E93\u672A\u8FDE\u63A5");
    }
    const connection = await this.pool.getConnection();
    await connection.beginTransaction();
    try {
      const result = await callback(connection);
      await connection.commit();
      return result;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
  async close() {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }
};
__publicField$2(_Database, "instance");
let Database = _Database;
async function initDatabase() {
  const config = useRuntimeConfig();
  const db = Database.getInstance();
  await db.connect({
    host: config.dbHost,
    port: parseInt(config.dbPort),
    user: config.dbUser,
    password: config.dbPassword,
    database: config.dbName
  });
  return db;
}
const Database$1 = Database.getInstance();

const _nB5AmYvNRdQUN8l9rRQZTg_uHZzRkHMMkbg5Aw55uA = async () => {
  try {
    console.log("\u6B63\u5728\u521D\u59CB\u5316\u6570\u636E\u5E93\u8FDE\u63A5...");
    await initDatabase();
    console.log("\u6570\u636E\u5E93\u8FDE\u63A5\u521D\u59CB\u5316\u6210\u529F");
  } catch (error) {
    console.error("\u6570\u636E\u5E93\u8FDE\u63A5\u521D\u59CB\u5316\u5931\u8D25:", error);
  }
};

const plugins = [
  _cwpI_lvmIz2CfPI21_dj3n8IVaqoRHZd85rr7Bb3ku8,
_KW2rqI6oLhj38Pl0ZL3oKrMJHdZVKGgk3OMhboqqh4,
_nB5AmYvNRdQUN8l9rRQZTg_uHZzRkHMMkbg5Aw55uA
];

const assets = {};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _FagHBZ = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  if (encodings.length > 1) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var __defProp$1 = Object.defineProperty;
var __defNormalProp$1 = (obj, key, value) => key in obj ? __defProp$1(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField$1 = (obj, key, value) => __defNormalProp$1(obj, key + "" , value);
class TokenGenerator {
  /**
   * 设置JWT密钥
   * @param secret JWT密钥
   */
  static setSecret(secret) {
    this.secret = secret;
  }
  /**
   * 生成JWT令牌
   * @param payload 载荷数据
   * @param expiresIn 过期时间（默认7天）
   * @returns JWT令牌
   */
  static generateJWT(payload, expiresIn = "7d") {
    if (!this.secret) {
      throw new Error("JWT\u5BC6\u94A5\u672A\u8BBE\u7F6E");
    }
    return jwt.sign(payload, this.secret, {
      expiresIn,
      algorithm: "HS256"
    });
  }
  /**
   * 验证JWT令牌
   * @param token JWT令牌
   * @returns 解码后的载荷数据
   */
  static verifyJWT(token) {
    if (!this.secret) {
      throw new Error("JWT\u5BC6\u94A5\u672A\u8BBE\u7F6E");
    }
    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      throw new Error("\u65E0\u6548\u7684JWT\u4EE4\u724C");
    }
  }
  /**
   * 生成授权令牌（用于游戏脚本授权）
   * @param activationCode 激活码
   * @param userId 用户ID
   * @param deviceFingerprint 设备指纹
   * @param expiryTime 过期时间
   * @returns 加密的授权令牌
   */
  static generateAuthToken(activationCode, userId, deviceFingerprint, expiryTime) {
    const tokenData = {
      code: activationCode,
      userId,
      device: deviceFingerprint,
      exp: Math.floor(expiryTime.getTime() / 1e3),
      iat: Math.floor(Date.now() / 1e3)
    };
    const key = crypto.scryptSync(this.secret, "salt", 32);
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher("aes-256-gcm", key);
    let encrypted = cipher.update(JSON.stringify(tokenData), "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag();
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted}`;
  }
  /**
   * 验证授权令牌
   * @param token 授权令牌
   * @returns 解码后的令牌数据
   */
  static verifyAuthToken(token) {
    if (!this.secret) {
      throw new Error("JWT\u5BC6\u94A5\u672A\u8BBE\u7F6E");
    }
    try {
      const [ivHex, authTagHex, encrypted] = token.split(":");
      if (!ivHex || !authTagHex || !encrypted) {
        throw new Error("\u4EE4\u724C\u683C\u5F0F\u9519\u8BEF");
      }
      const key = crypto.scryptSync(this.secret, "salt", 32);
      const iv = Buffer.from(ivHex, "hex");
      const authTag = Buffer.from(authTagHex, "hex");
      const decipher = crypto.createDecipher("aes-256-gcm", key);
      decipher.setAuthTag(authTag);
      let decrypted = decipher.update(encrypted, "hex", "utf8");
      decrypted += decipher.final("utf8");
      const tokenData = JSON.parse(decrypted);
      if (tokenData.exp && tokenData.exp < Math.floor(Date.now() / 1e3)) {
        throw new Error("\u4EE4\u724C\u5DF2\u8FC7\u671F");
      }
      return tokenData;
    } catch (error) {
      throw new Error("\u65E0\u6548\u7684\u6388\u6743\u4EE4\u724C");
    }
  }
  /**
   * 生成API签名
   * @param data 要签名的数据
   * @param timestamp 时间戳
   * @returns 签名
   */
  static generateSignature(data, timestamp) {
    const signData = `${data}${timestamp}${this.secret}`;
    return crypto.createHash("sha256").update(signData).digest("hex");
  }
  /**
   * 验证API签名
   * @param data 原始数据
   * @param timestamp 时间戳
   * @param signature 签名
   * @returns 是否有效
   */
  static verifySignature(data, timestamp, signature) {
    const now = Math.floor(Date.now() / 1e3);
    if (Math.abs(now - timestamp) > 300) {
      return false;
    }
    const expectedSignature = this.generateSignature(data, timestamp);
    return expectedSignature === signature;
  }
}
__publicField$1(TokenGenerator, "secret");

const _bMg7Ze = defineEventHandler(async (event) => {
  const url = getRouterParam(event, "url") || event.node.req.url;
  const publicRoutes = [
    "/api/codes/validate",
    "/api/payment/process",
    "/api/blacklist/check"
  ];
  const isPublicRoute = publicRoutes.some((route) => url == null ? void 0 : url.startsWith(route));
  if (url === "/api/login" || isPublicRoute) {
    return;
  }
  const isAdminRoute = url == null ? void 0 : url.startsWith("/api/admin/");
  if (isAdminRoute) {
    try {
      const authHeader = getHeader(event, "authorization");
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw createError({
          statusCode: 401,
          statusMessage: "\u7F3A\u5C11\u8BA4\u8BC1\u4EE4\u724C"
        });
      }
      const token = authHeader.substring(7);
      const payload = TokenGenerator.verifyJWT(token);
      event.context.user = payload;
    } catch (error) {
      throw createError({
        statusCode: 401,
        statusMessage: "\u65E0\u6548\u7684\u8BA4\u8BC1\u4EE4\u724C"
      });
    }
  }
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
  disableCapoSorting: false,
  plugins: [DeprecationsPlugin, PromisesPlugin, TemplateParamsPlugin, AliasSortingPlugin],
};

function createSSRContext(event) {
  const ssrContext = {
    url: event.path,
    event,
    runtimeConfig: useRuntimeConfig(event),
    noSSR: event.context.nuxt?.noSSR || (false),
    head: createHead(unheadOptions),
    error: false,
    nuxt: void 0,
    /* NuxtApp */
    payload: {},
    _payloadReducers: /* @__PURE__ */ Object.create(null),
    modules: /* @__PURE__ */ new Set()
  };
  return ssrContext;
}
function setSSRError(ssrContext, error) {
  ssrContext.error = true;
  ssrContext.payload = { error };
  ssrContext.url = error.url;
}

function buildAssetsDir() {
  return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
  return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
  const app = useRuntimeConfig().app;
  const publicBase = app.cdnURL || app.baseURL;
  return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
const getServerEntry = () => import('file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
const getClientManifest = () => import('file://C:/Users/ql/Desktop/activation-code-system/activation-code-system/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
const getSSRRenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  if (!manifest) {
    throw new Error("client.manifest is not available");
  }
  const createSSRApp = await getServerEntry();
  if (!createSSRApp) {
    throw new Error("Server bundle is not available");
  }
  const options = {
    manifest,
    renderToString: renderToString$1,
    buildAssetsURL
  };
  const renderer = createRenderer(createSSRApp, options);
  async function renderToString$1(input, context) {
    const html = await renderToString(input, context);
    if (process.env.NUXT_VITE_NODE_OPTIONS) {
      renderer.rendererContext.updateManifest(await getClientManifest());
    }
    return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
  }
  return renderer;
});
const getSPARenderer = lazyCachedFunction(async () => {
  const manifest = await getClientManifest();
  const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
    {
      return APP_ROOT_OPEN_TAG + r + APP_ROOT_CLOSE_TAG;
    }
  });
  const options = {
    manifest,
    renderToString: () => spaTemplate,
    buildAssetsURL
  };
  const renderer = createRenderer(() => () => {
  }, options);
  const result = await renderer.renderToString({});
  const renderToString = (ssrContext) => {
    const config = useRuntimeConfig(ssrContext.event);
    ssrContext.modules ||= /* @__PURE__ */ new Set();
    ssrContext.payload.serverRendered = false;
    ssrContext.config = {
      public: config.public,
      app: config.app
    };
    return Promise.resolve(result);
  };
  return {
    rendererContext: renderer.rendererContext,
    renderToString
  };
});
function lazyCachedFunction(fn) {
  let res = null;
  return () => {
    if (res === null) {
      res = fn().catch((err) => {
        res = null;
        throw err;
      });
    }
    return res;
  };
}
function getRenderer(ssrContext) {
  return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
  const styleMap = await getSSRStyles();
  const inlinedStyles = /* @__PURE__ */ new Set();
  for (const mod of usedModules) {
    if (mod in styleMap && styleMap[mod]) {
      for (const style of await styleMap[mod]()) {
        inlinedStyles.add(style);
      }
    }
  }
  return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
function getServerComponentHTML(body) {
  const match = body.match(ROOT_NODE_REGEX);
  return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
    return void 0;
  }
  const response = {};
  for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
    response[name] = {
      ...slot,
      fallback: ssrContext.teleports?.[`island-fallback=${name}`]
    };
  }
  return response;
}
function getClientIslandResponse(ssrContext) {
  if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
    return void 0;
  }
  const response = {};
  for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
    const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
    response[clientUid] = {
      ...component,
      html,
      slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
    };
  }
  return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
  const entries = Object.entries(teleports);
  const slots = {};
  for (const [key, value] of entries) {
    const match = key.match(SSR_CLIENT_SLOT_MARKER);
    if (match) {
      const [, id, slot] = match;
      if (!slot || clientUid !== id) {
        continue;
      }
      slots[slot] = value;
    }
  }
  return slots;
}
function replaceIslandTeleports(ssrContext, html) {
  const { teleports, islandContext } = ssrContext;
  if (islandContext || !teleports) {
    return html;
  }
  for (const key in teleports) {
    const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
    if (matchClientComp) {
      const [, uid, clientId] = matchClientComp;
      if (!uid || !clientId) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
      continue;
    }
    const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
    if (matchSlot) {
      const [, uid, slot] = matchSlot;
      if (!uid || !slot) {
        continue;
      }
      html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
        return full + teleports[key];
      });
    }
  }
  return html;
}

const ISLAND_SUFFIX_RE = /\.json(\?.*)?$/;
const _SxA8c9 = defineEventHandler(async (event) => {
  const nitroApp = useNitroApp();
  setResponseHeaders(event, {
    "content-type": "application/json;charset=utf-8",
    "x-powered-by": "Nuxt"
  });
  const islandContext = await getIslandContext(event);
  const ssrContext = {
    ...createSSRContext(event),
    islandContext,
    noSSR: false,
    url: islandContext.url
  };
  const renderer = await getSSRRenderer();
  const renderResult = await renderer.renderToString(ssrContext).catch(async (error) => {
    await ssrContext.nuxt?.hooks.callHook("app:error", error);
    throw error;
  });
  const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult });
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  {
    const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
    const link = [];
    for (const resource of Object.values(styles)) {
      if ("inline" in getQuery(resource.file)) {
        continue;
      }
      if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
        link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
      }
    }
    if (link.length) {
      ssrContext.head.push({ link }, { mode: "server" });
    }
  }
  const islandHead = {};
  for (const entry of ssrContext.head.entries.values()) {
    for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
      const currentValue = islandHead[key];
      if (Array.isArray(currentValue)) {
        currentValue.push(...value);
      }
      islandHead[key] = value;
    }
  }
  islandHead.link ||= [];
  islandHead.style ||= [];
  const islandResponse = {
    id: islandContext.id,
    head: islandHead,
    html: getServerComponentHTML(renderResult.html),
    components: getClientIslandResponse(ssrContext),
    slots: getSlotIslandResponse(ssrContext)
  };
  await nitroApp.hooks.callHook("render:island", islandResponse, { event, islandContext });
  return islandResponse;
});
async function getIslandContext(event) {
  let url = event.path || "";
  const componentParts = url.substring("/__nuxt_island".length + 1).replace(ISLAND_SUFFIX_RE, "").split("_");
  const hashId = componentParts.length > 1 ? componentParts.pop() : void 0;
  const componentName = componentParts.join("_");
  const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
  const ctx = {
    url: "/",
    ...context,
    id: hashId,
    name: componentName,
    props: destr$1(context.props) || {},
    slots: {},
    components: {}
  };
  return ctx;
}

const _lazy_m973Fq = () => Promise.resolve().then(function () { return generate$3; });
const _lazy_TZpPjz = () => Promise.resolve().then(function () { return revoke$1; });
const _lazy_WLOX0K = () => Promise.resolve().then(function () { return stats$1; });
const _lazy_QFIx7F = () => Promise.resolve().then(function () { return _action_$1; });
const _lazy_8hz8oP = () => Promise.resolve().then(function () { return add; });
const _lazy_0kq_jd = () => Promise.resolve().then(function () { return check; });
const _lazy_Q0r4gR = () => Promise.resolve().then(function () { return generate$1; });
const _lazy_i22pDt = () => Promise.resolve().then(function () { return listTest$1; });
const _lazy_Z6UmSD = () => Promise.resolve().then(function () { return list$1; });
const _lazy_viEG9M = () => Promise.resolve().then(function () { return query$1; });
const _lazy_GGPpAi = () => Promise.resolve().then(function () { return validateSimple$1; });
const _lazy_3rrahw = () => Promise.resolve().then(function () { return validateUrl$1; });
const _lazy_4jTtdF = () => Promise.resolve().then(function () { return validate$1; });
const _lazy_XkJViq = () => Promise.resolve().then(function () { return login$1; });
const _lazy_JVJJiy = () => Promise.resolve().then(function () { return process$2; });
const _lazy_oosICO = () => Promise.resolve().then(function () { return renderer$1; });

const handlers = [
  { route: '', handler: _FagHBZ, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _bMg7Ze, lazy: false, middleware: true, method: undefined },
  { route: '/api/admin/generate', handler: _lazy_m973Fq, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin/revoke', handler: _lazy_TZpPjz, lazy: true, middleware: false, method: undefined },
  { route: '/api/admin/stats', handler: _lazy_WLOX0K, lazy: true, middleware: false, method: undefined },
  { route: '/api/blacklist/:action', handler: _lazy_QFIx7F, lazy: true, middleware: false, method: undefined },
  { route: '/api/blacklist/add', handler: _lazy_8hz8oP, lazy: true, middleware: false, method: undefined },
  { route: '/api/blacklist/check', handler: _lazy_0kq_jd, lazy: true, middleware: false, method: undefined },
  { route: '/api/codes/generate', handler: _lazy_Q0r4gR, lazy: true, middleware: false, method: undefined },
  { route: '/api/codes/list-test', handler: _lazy_i22pDt, lazy: true, middleware: false, method: undefined },
  { route: '/api/codes/list', handler: _lazy_Z6UmSD, lazy: true, middleware: false, method: undefined },
  { route: '/api/codes/query', handler: _lazy_viEG9M, lazy: true, middleware: false, method: undefined },
  { route: '/api/codes/validate-simple', handler: _lazy_GGPpAi, lazy: true, middleware: false, method: undefined },
  { route: '/api/codes/validate-url', handler: _lazy_3rrahw, lazy: true, middleware: false, method: undefined },
  { route: '/api/codes/validate', handler: _lazy_4jTtdF, lazy: true, middleware: false, method: undefined },
  { route: '/api/login', handler: _lazy_XkJViq, lazy: true, middleware: false, method: undefined },
  { route: '/api/payment/process', handler: _lazy_JVJJiy, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_error', handler: _lazy_oosICO, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: _SxA8c9, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_oosICO, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(nodeHandler, aRequest);
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = crypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = { "appName": "Nuxt", "version": "", "statusCode": 500, "statusMessage": "Server error", "description": "An error occurred in the application and the page could not be served. If you are the application owner, check your server logs for details.", "stack": "" };
const template$1 = (messages) => {
  messages = { ..._messages, ...messages };
  return '<!DOCTYPE html><html lang="en"><head><title>' + escapeHtml(messages.statusCode) + " - " + escapeHtml(messages.statusMessage || "Internal Server Error") + `</title><meta charset="utf-8"><meta content="width=device-width,initial-scale=1.0,minimum-scale=1.0" name="viewport"><style>.spotlight{background:linear-gradient(45deg,#00dc82,#36e4da 50%,#0047e1);bottom:-40vh;filter:blur(30vh);height:60vh;opacity:.8}*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:""}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1{font-size:inherit;font-weight:inherit}h1,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.pointer-events-none{pointer-events:none}.fixed{position:fixed}.left-0{left:0}.right-0{right:0}.z-10{z-index:10}.mb-6{margin-bottom:1.5rem}.mb-8{margin-bottom:2rem}.h-auto{height:auto}.min-h-screen{min-height:100vh}.flex{display:flex}.flex-1{flex:1 1 0%}.flex-col{flex-direction:column}.overflow-y-auto{overflow-y:auto}.rounded-t-md{border-top-left-radius:.375rem;border-top-right-radius:.375rem}.bg-black\\/5{background-color:#0000000d}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.p-8{padding:2rem}.px-10{padding-left:2.5rem;padding-right:2.5rem}.pt-14{padding-top:3.5rem}.text-6xl{font-size:3.75rem;line-height:1}.text-xl{font-size:1.25rem;line-height:1.75rem}.text-black{--un-text-opacity:1;color:rgb(0 0 0/var(--un-text-opacity))}.font-light{font-weight:300}.font-medium{font-weight:500}.leading-tight{line-height:1.25}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media (prefers-color-scheme:dark){.dark\\:bg-black{--un-bg-opacity:1;background-color:rgb(0 0 0/var(--un-bg-opacity))}.dark\\:bg-white\\/10{background-color:#ffffff1a}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media (min-width:640px){.sm\\:text-2xl{font-size:1.5rem;line-height:2rem}.sm\\:text-8xl{font-size:6rem;line-height:1}}</style><script>!function(){const e=document.createElement("link").relList;if(!(e&&e.supports&&e.supports("modulepreload"))){for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver((e=>{for(const o of e)if("childList"===o.type)for(const e of o.addedNodes)"LINK"===e.tagName&&"modulepreload"===e.rel&&r(e)})).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),"use-credentials"===e.crossOrigin?r.credentials="include":"anonymous"===e.crossOrigin?r.credentials="omit":r.credentials="same-origin",r}(e);fetch(e.href,r)}}();<\/script></head><body class="antialiased bg-white dark:bg-black dark:text-white flex flex-col font-sans min-h-screen pt-14 px-10 text-black"><div class="fixed left-0 pointer-events-none right-0 spotlight"></div><h1 class="font-medium mb-6 sm:text-8xl text-6xl">` + escapeHtml(messages.statusCode) + '</h1><p class="font-light leading-tight mb-8 sm:text-2xl text-xl">' + escapeHtml(messages.description) + '</p><div class="bg-black/5 bg-white dark:bg-white/10 flex-1 h-auto overflow-y-auto rounded-t-md"><div class="font-light leading-tight p-8 text-xl z-10">' + escapeHtml(messages.stack) + "</div></div></body></html>";
};

const errorDev = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;
function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    crypto.randomFillSync(rnds8Pool);
    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */

const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).slice(1));
}

function unsafeStringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  return byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]];
}

const native = {
  randomUUID: crypto.randomUUID
};

function v4(options, buf, offset) {
  if (native.randomUUID && true && !options) {
    return native.randomUUID();
  }

  options = options || {};
  const rnds = options.random || (options.rng || rng)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`

  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  return unsafeStringify(rnds);
}

class CodeGenerator {
  /**
   * 生成安全的激活码
   * @param length 激活码长度，默认32位
   * @returns 激活码字符串
   */
  static generateCode(length = 32) {
    const randomBytes = crypto.randomBytes(24);
    const uuid = v4().replace(/-/g, "");
    const combined = randomBytes.toString("base64") + uuid;
    const cleanCode = combined.replace(/[+/=]/g, "").replace(/[0OoIl1]/g, "").toUpperCase().substring(0, length);
    if (cleanCode.length < length) {
      const additional = crypto.randomBytes(Math.ceil((length - cleanCode.length) / 2)).toString("hex").toUpperCase().substring(0, length - cleanCode.length);
      return cleanCode + additional;
    }
    return cleanCode;
  }
  /**
   * 批量生成激活码
   * @param count 生成数量
   * @param length 激活码长度
   * @returns 激活码数组
   */
  static generateBatch(count, length = 32) {
    const codes = [];
    const codeSet = /* @__PURE__ */ new Set();
    while (codeSet.size < count) {
      const code = this.generateCode(length);
      if (!codeSet.has(code)) {
        codeSet.add(code);
        codes.push(code);
      }
    }
    return codes;
  }
  /**
   * 验证激活码格式
   * @param code 激活码
   * @returns 是否有效
   */
  static validateFormat(code) {
    if (code.length < 16) {
      return false;
    }
    const validPattern = /^[A-Z2-9]{16,}$/;
    return validPattern.test(code);
  }
  /**
   * 生成设备指纹
   * @param userAgent 用户代理
   * @param ip IP地址
   * @param additionalInfo 额外信息
   * @returns 设备指纹
   */
  static generateDeviceFingerprint(userAgent, ip, additionalInfo = {}) {
    const fingerprintData = {
      userAgent,
      ip,
      ...additionalInfo,
      timestamp: Date.now()
    };
    const dataString = JSON.stringify(fingerprintData);
    return crypto.createHash("sha256").update(dataString).digest("hex");
  }
  /**
   * 生成哈希值（用于安全存储）
   * @param data 原始数据
   * @param salt 盐值
   * @returns 哈希值
   */
  static generateHash(data, salt) {
    const saltValue = salt || crypto.randomBytes(16).toString("hex");
    return crypto.pbkdf2Sync(data, saltValue, 1e4, 64, "sha512").toString("hex");
  }
  /**
   * 验证哈希值
   * @param data 原始数据
   * @param hash 哈希值
   * @param salt 盐值
   * @returns 是否匹配
   */
  static verifyHash(data, hash, salt) {
    const computedHash = crypto.pbkdf2Sync(data, salt, 1e4, 64, "sha512").toString("hex");
    return computedHash === hash;
  }
}

function getClientIP(event) {
  var _a;
  const headers = getHeaders(event);
  const ipHeaders = [
    "x-forwarded-for",
    "x-real-ip",
    "x-client-ip",
    "cf-connecting-ip",
    // Cloudflare
    "x-forwarded",
    "forwarded-for",
    "forwarded"
  ];
  for (const header of ipHeaders) {
    const value = headers[header];
    if (value) {
      const ip = Array.isArray(value) ? value[0] : value;
      const cleanIP = ip.split(",")[0].trim();
      if (cleanIP && isValidIP(cleanIP)) {
        return cleanIP;
      }
    }
  }
  const nodeReq = event.node.req;
  const socketAddress = (_a = nodeReq.socket) == null ? void 0 : _a.remoteAddress;
  if (socketAddress && isValidIP(socketAddress)) {
    return socketAddress;
  }
  return "127.0.0.1";
}
function isValidIP(ip) {
  if (!ip || typeof ip !== "string") {
    return false;
  }
  const ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^(?:[0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$|^::1$|^::$/;
  if (ip === "::1" || ip === "127.0.0.1" || ip === "localhost") {
    return true;
  }
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

var ActivationCodeStatus = /* @__PURE__ */ ((ActivationCodeStatus2) => {
  ActivationCodeStatus2["UNUSED"] = "\u672A\u4F7F\u7528";
  ActivationCodeStatus2["ACTIVATED"] = "\u5DF2\u6FC0\u6D3B";
  ActivationCodeStatus2["EXPIRED"] = "\u5DF2\u8FC7\u671F";
  ActivationCodeStatus2["REVOKED"] = "\u5DF2\u540A\u9500";
  return ActivationCodeStatus2;
})(ActivationCodeStatus || {});
var PaymentMethod = /* @__PURE__ */ ((PaymentMethod2) => {
  PaymentMethod2["ALIPAY"] = "\u652F\u4ED8\u5B9D";
  PaymentMethod2["WECHAT"] = "\u5FAE\u4FE1\u652F\u4ED8";
  return PaymentMethod2;
})(PaymentMethod || {});
var PaymentStatus = /* @__PURE__ */ ((PaymentStatus2) => {
  PaymentStatus2["SUCCESS"] = "\u6210\u529F";
  PaymentStatus2["FAILED"] = "\u5931\u8D25";
  PaymentStatus2["PROCESSING"] = "\u5904\u7406\u4E2D";
  return PaymentStatus2;
})(PaymentStatus || {});
var OperationType = /* @__PURE__ */ ((OperationType2) => {
  OperationType2["GENERATE"] = "\u751F\u6210";
  OperationType2["ACTIVATE"] = "\u6FC0\u6D3B";
  OperationType2["REVOKE"] = "\u540A\u9500";
  OperationType2["EXPORT"] = "\u5BFC\u51FA";
  OperationType2["MODIFY"] = "\u4FEE\u6539";
  OperationType2["LOGIN"] = "\u767B\u5F55";
  return OperationType2;
})(OperationType || {});

const generate$2 = defineEventHandler(async (event) => {
  var _a;
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.count || body.count <= 0 || body.count > 1e4) {
      throw createError({
        statusCode: 400,
        message: "\u751F\u6210\u6570\u91CF\u5FC5\u987B\u57281-10000\u4E4B\u95F4"
      });
    }
    if (!body.price || body.price <= 0) {
      throw createError({
        statusCode: 400,
        message: "\u4EF7\u683C\u5FC5\u987B\u5927\u4E8E0"
      });
    }
    let expirationDate = null;
    if (body.expirationDays && body.expirationDays > 0) {
      expirationDate = /* @__PURE__ */ new Date();
      expirationDate.setDate(expirationDate.getDate() + body.expirationDays);
    }
    const codes = CodeGenerator.generateBatch(body.count);
    const db = Database$1;
    const insertPromises = codes.map(
      (code) => db.query(
        `INSERT INTO activation_code 
         (activationCode, status, price, userId, expirationDate, createdTime, lastModifiedTime) 
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          code,
          ActivationCodeStatus.UNUSED,
          body.price,
          body.userId || null,
          expirationDate
        ]
      )
    );
    await Promise.all(insertPromises);
    const operatorId = ((_a = event.context.user) == null ? void 0 : _a.userId) || 0;
    const clientIP = getClientIP(event);
    await db.query(
      `INSERT INTO operation_log 
       (operatorId, operationType, target, detail, ip, createdTime) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        operatorId,
        OperationType.GENERATE,
        `\u6279\u91CF\u751F\u6210${body.count}\u4E2A\u6FC0\u6D3B\u7801`,
        JSON.stringify({
          count: body.count,
          price: body.price,
          expirationDays: body.expirationDays
        }),
        clientIP
      ]
    );
    return {
      success: true,
      data: {
        codes,
        totalCount: codes.length
      },
      message: `\u6210\u529F\u751F\u6210${codes.length}\u4E2A\u6FC0\u6D3B\u7801`
    };
  } catch (error) {
    console.error("\u751F\u6210\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

const generate$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: generate$2
}, Symbol.toStringTag, { value: 'Module' }));

const revoke = defineEventHandler(async (event) => {
  var _a;
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.codes || !Array.isArray(body.codes) || body.codes.length === 0) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u8981\u540A\u9500\u7684\u6FC0\u6D3B\u7801\u5217\u8868"
      });
    }
    if (body.codes.length > 1e3) {
      throw createError({
        statusCode: 400,
        message: "\u5355\u6B21\u6700\u591A\u540A\u95001000\u4E2A\u6FC0\u6D3B\u7801"
      });
    }
    if (!body.reason || body.reason.trim().length === 0) {
      throw createError({
        statusCode: 400,
        message: "\u8BF7\u63D0\u4F9B\u540A\u9500\u539F\u56E0"
      });
    }
    const db = Database$1;
    const operatorId = ((_a = event.context.user) == null ? void 0 : _a.userId) || 0;
    const clientIP = getClientIP(event) || "127.0.0.1";
    const placeholders = body.codes.map(() => "?").join(",");
    const existingCodes = await db.query(
      `SELECT activationCode, status FROM activation_code WHERE activationCode IN (${placeholders})`,
      body.codes
    );
    if (existingCodes.length === 0) {
      throw createError({
        statusCode: 404,
        message: "\u672A\u627E\u5230\u4EFB\u4F55\u6307\u5B9A\u7684\u6FC0\u6D3B\u7801"
      });
    }
    const revokableCodes = existingCodes.filter(
      (code) => code.status !== ActivationCodeStatus.REVOKED
    );
    if (revokableCodes.length === 0) {
      return {
        success: false,
        message: "\u6240\u6709\u6307\u5B9A\u7684\u6FC0\u6D3B\u7801\u90FD\u5DF2\u88AB\u540A\u9500",
        data: {
          processedCount: 0,
          skippedCount: existingCodes.length
        }
      };
    }
    await db.transaction(async (connection) => {
      const revokePromises = revokableCodes.map(
        (code) => connection.query(
          `UPDATE activation_code 
           SET status = ?, lastModifiedTime = NOW() 
           WHERE activationCode = ?`,
          [ActivationCodeStatus.REVOKED, code.activationCode]
        )
      );
      await Promise.all(revokePromises);
      const logPromises = revokableCodes.map(
        (code) => connection.query(
          `INSERT INTO operation_log 
           (operatorId, operationType, target, detail, ip, createdTime) 
           VALUES (?, ?, ?, ?, ?, NOW())`,
          [
            operatorId,
            OperationType.REVOKE,
            code.activationCode,
            JSON.stringify({
              reason: body.reason,
              previousStatus: code.status
            }),
            clientIP
          ]
        )
      );
      await Promise.all(logPromises);
      const blacklistPromises = revokableCodes.map(
        (code) => connection.query(
          `INSERT INTO blacklist_code (activationCode, reason, createdTime) 
           VALUES (?, ?, NOW()) 
           ON DUPLICATE KEY UPDATE reason = VALUES(reason)`,
          [code.activationCode, `\u540A\u9500: ${body.reason}`]
        )
      );
      await Promise.all(blacklistPromises);
    });
    return {
      success: true,
      data: {
        processedCount: revokableCodes.length,
        skippedCount: existingCodes.length - revokableCodes.length,
        totalRequested: body.codes.length,
        notFound: body.codes.length - existingCodes.length
      },
      message: `\u6210\u529F\u540A\u9500${revokableCodes.length}\u4E2A\u6FC0\u6D3B\u7801`
    };
  } catch (error) {
    console.error("\u540A\u9500\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

const revoke$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: revoke
}, Symbol.toStringTag, { value: 'Module' }));

const stats = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "GET") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const db = Database$1;
    const codeStats = await db.query(`
      SELECT 
        status,
        COUNT(*) as count
      FROM activation_code 
      GROUP BY status
    `);
    let totalCodes = 0;
    let activatedCodes = 0;
    let expiredCodes = 0;
    let revokedCodes = 0;
    codeStats.forEach((stat) => {
      totalCodes += stat.count;
      switch (stat.status) {
        case ActivationCodeStatus.ACTIVATED:
          activatedCodes = stat.count;
          break;
        case ActivationCodeStatus.EXPIRED:
          expiredCodes = stat.count;
          break;
        case ActivationCodeStatus.REVOKED:
          revokedCodes = stat.count;
          break;
      }
    });
    const activationRate = totalCodes > 0 ? activatedCodes / totalCodes * 100 : 0;
    const revenueResult = await db.queryOne(`
      SELECT COALESCE(SUM(amount), 0) as totalRevenue 
      FROM payment_record 
      WHERE paymentStatus = '\u6210\u529F'
    `);
    const totalRevenue = (revenueResult == null ? void 0 : revenueResult.totalRevenue) || 0;
    const dailyStatsResult = await db.query(`
      SELECT 
        DATE(ac.createdTime) as date,
        COUNT(ac.activationCode) as total_generated,
        COUNT(CASE WHEN ac.status = '\u5DF2\u6FC0\u6D3B' THEN 1 END) as activated,
        COALESCE(SUM(pr.amount), 0) as revenue
      FROM activation_code ac
      LEFT JOIN payment_record pr ON pr.activationCodeId = ac.activationCode 
        AND pr.paymentStatus = '\u6210\u529F'
      WHERE ac.createdTime >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(ac.createdTime)
      ORDER BY date DESC
    `);
    const dailyStats = dailyStatsResult.map((row) => ({
      date: row.date,
      generated: row.total_generated,
      activated: row.activated,
      revenue: parseFloat(row.revenue) || 0
    }));
    const filledDailyStats = fillMissingDates(dailyStats, 30);
    return {
      success: true,
      data: {
        totalCodes,
        activatedCodes,
        expiredCodes,
        revokedCodes,
        activationRate: Math.round(activationRate * 100) / 100,
        totalRevenue,
        dailyStats: filledDailyStats
      },
      message: "\u7EDF\u8BA1\u6570\u636E\u83B7\u53D6\u6210\u529F"
    };
  } catch (error) {
    console.error("\u83B7\u53D6\u7EDF\u8BA1\u6570\u636E\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});
function fillMissingDates(dailyStats, days) {
  const result = [];
  const statsMap = /* @__PURE__ */ new Map();
  dailyStats.forEach((stat) => {
    statsMap.set(stat.date, stat);
  });
  for (let i = 0; i < days; i++) {
    const date = /* @__PURE__ */ new Date();
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];
    const existingStat = statsMap.get(dateStr);
    if (existingStat) {
      result.unshift(existingStat);
    } else {
      result.unshift({
        date: dateStr,
        generated: 0,
        activated: 0,
        revenue: 0
      });
    }
  }
  return result;
}

const stats$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: stats
}, Symbol.toStringTag, { value: 'Module' }));

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
class BlacklistChecker {
  /**
   * 检查激活码是否在黑名单中
   * @param code 激活码
   * @returns 是否在黑名单
   */
  static async isCodeBlacklisted(code) {
    try {
      const result = await this.db.queryOne(
        "SELECT * FROM blacklist_code WHERE activationCode = ?",
        [code]
      );
      return result !== null;
    } catch (error) {
      console.error("\u68C0\u67E5\u6FC0\u6D3B\u7801\u9ED1\u540D\u5355\u5931\u8D25:", error);
      return false;
    }
  }
  /**
   * 检查设备是否在黑名单中
   * @param deviceFingerprint 设备指纹
   * @returns 是否在黑名单
   */
  static async isDeviceBlacklisted(deviceFingerprint) {
    try {
      const result = await this.db.queryOne(
        "SELECT * FROM blacklist_device WHERE deviceFingerprint = ?",
        [deviceFingerprint]
      );
      return result !== null;
    } catch (error) {
      console.error("\u68C0\u67E5\u8BBE\u5907\u9ED1\u540D\u5355\u5931\u8D25:", error);
      return false;
    }
  }
  /**
   * 检查IP是否在黑名单中
   * @param ip IP地址
   * @returns 是否在黑名单
   */
  static async isIPBlacklisted(ip) {
    try {
      const result = await this.db.queryOne(
        "SELECT * FROM blacklist_ip WHERE ip = ?",
        [ip]
      );
      return result !== null;
    } catch (error) {
      console.error("\u68C0\u67E5IP\u9ED1\u540D\u5355\u5931\u8D25:", error);
      return false;
    }
  }
  /**
   * 综合检查是否被黑名单拦截
   * @param code 激活码
   * @param deviceFingerprint 设备指纹
   * @param ip IP地址
   * @returns 检查结果
   */
  static async checkBlacklist(code, deviceFingerprint, ip) {
    try {
      const [codeBlocked, deviceBlocked, ipBlocked] = await Promise.all([
        this.isCodeBlacklisted(code),
        this.isDeviceBlacklisted(deviceFingerprint),
        this.isIPBlacklisted(ip)
      ]);
      if (codeBlocked) {
        return {
          blocked: true,
          reason: "\u6FC0\u6D3B\u7801\u5DF2\u88AB\u52A0\u5165\u9ED1\u540D\u5355",
          type: "code"
        };
      }
      if (deviceBlocked) {
        return {
          blocked: true,
          reason: "\u8BBE\u5907\u5DF2\u88AB\u52A0\u5165\u9ED1\u540D\u5355",
          type: "device"
        };
      }
      if (ipBlocked) {
        return {
          blocked: true,
          reason: "IP\u5730\u5740\u5DF2\u88AB\u52A0\u5165\u9ED1\u540D\u5355",
          type: "ip"
        };
      }
      return { blocked: false };
    } catch (error) {
      console.error("\u9ED1\u540D\u5355\u68C0\u67E5\u5931\u8D25:", error);
      return { blocked: false };
    }
  }
  /**
   * 添加激活码到黑名单
   * @param code 激活码
   * @param reason 原因
   */
  static async addCodeToBlacklist(code, reason) {
    try {
      await this.db.query(
        "INSERT INTO blacklist_code (activationCode, reason, createdTime) VALUES (?, ?, NOW())",
        [code, reason]
      );
    } catch (error) {
      console.error("\u6DFB\u52A0\u6FC0\u6D3B\u7801\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 添加设备到黑名单
   * @param deviceFingerprint 设备指纹
   * @param reason 原因
   */
  static async addDeviceToBlacklist(deviceFingerprint, reason) {
    try {
      await this.db.query(
        "INSERT INTO blacklist_device (deviceFingerprint, reason, createdTime) VALUES (?, ?, NOW())",
        [deviceFingerprint, reason]
      );
    } catch (error) {
      console.error("\u6DFB\u52A0\u8BBE\u5907\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 添加IP到黑名单
   * @param ip IP地址
   * @param reason 原因
   */
  static async addIPToBlacklist(ip, reason) {
    try {
      await this.db.query(
        "INSERT INTO blacklist_ip (ip, reason, createdTime) VALUES (?, ?, NOW())",
        [ip, reason]
      );
    } catch (error) {
      console.error("\u6DFB\u52A0IP\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 从黑名单移除激活码
   * @param code 激活码
   */
  static async removeCodeFromBlacklist(code) {
    try {
      await this.db.query(
        "DELETE FROM blacklist_code WHERE activationCode = ?",
        [code]
      );
    } catch (error) {
      console.error("\u79FB\u9664\u6FC0\u6D3B\u7801\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 从黑名单移除设备
   * @param deviceFingerprint 设备指纹
   */
  static async removeDeviceFromBlacklist(deviceFingerprint) {
    try {
      await this.db.query(
        "DELETE FROM blacklist_device WHERE deviceFingerprint = ?",
        [deviceFingerprint]
      );
    } catch (error) {
      console.error("\u79FB\u9664\u8BBE\u5907\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 从黑名单移除IP
   * @param ip IP地址
   */
  static async removeIPFromBlacklist(ip) {
    try {
      await this.db.query(
        "DELETE FROM blacklist_ip WHERE ip = ?",
        [ip]
      );
    } catch (error) {
      console.error("\u79FB\u9664IP\u9ED1\u540D\u5355\u5931\u8D25:", error);
      throw error;
    }
  }
  /**
   * 获取黑名单统计信息
   * @returns 统计信息
   */
  static async getBlacklistStats() {
    try {
      const [codeCount, deviceCount, ipCount] = await Promise.all([
        this.db.queryOne("SELECT COUNT(*) as count FROM blacklist_code"),
        this.db.queryOne("SELECT COUNT(*) as count FROM blacklist_device"),
        this.db.queryOne("SELECT COUNT(*) as count FROM blacklist_ip")
      ]);
      return {
        codeCount: (codeCount == null ? void 0 : codeCount.count) || 0,
        deviceCount: (deviceCount == null ? void 0 : deviceCount.count) || 0,
        ipCount: (ipCount == null ? void 0 : ipCount.count) || 0
      };
    } catch (error) {
      console.error("\u83B7\u53D6\u9ED1\u540D\u5355\u7EDF\u8BA1\u5931\u8D25:", error);
      return {
        codeCount: 0,
        deviceCount: 0,
        ipCount: 0
      };
    }
  }
}
__publicField(BlacklistChecker, "db", Database$1);

async function addToBlacklist(event) {
  try {
    const body = await readBody(event);
    if (!body.type || !["code", "device", "ip"].includes(body.type)) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u65E0\u6548\u7684\u9ED1\u540D\u5355\u7C7B\u578B"
      });
    }
    if (!body.value || body.value.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u9ED1\u540D\u5355\u503C\u4E0D\u80FD\u4E3A\u7A7A"
      });
    }
    if (!body.reason || body.reason.trim().length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u5C01\u7981\u539F\u56E0\u4E0D\u80FD\u4E3A\u7A7A"
      });
    }
    switch (body.type) {
      case "code":
        await BlacklistChecker.addCodeToBlacklist(body.value, body.reason);
        break;
      case "device":
        await BlacklistChecker.addDeviceToBlacklist(body.value, body.reason);
        break;
      case "ip":
        await BlacklistChecker.addIPToBlacklist(body.value, body.reason);
        break;
    }
    return {
      success: true,
      message: `${body.type}\u5DF2\u6210\u529F\u6DFB\u52A0\u5230\u9ED1\u540D\u5355`
    };
  } catch (error) {
    console.error("\u6DFB\u52A0\u9ED1\u540D\u5355\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
}
async function checkBlacklist(event) {
  try {
    const query = getQuery$1(event);
    const { code, device, ip } = query;
    if (!code && !device && !ip) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u8BF7\u63D0\u4F9B\u8981\u68C0\u67E5\u7684\u6FC0\u6D3B\u7801\u3001\u8BBE\u5907\u6307\u7EB9\u6216IP\u5730\u5740"
      });
    }
    const results = {};
    if (code) {
      results.codeBlocked = await BlacklistChecker.isCodeBlacklisted(code);
    }
    if (device) {
      results.deviceBlocked = await BlacklistChecker.isDeviceBlacklisted(device);
    }
    if (ip) {
      results.ipBlocked = await BlacklistChecker.isIPBlacklisted(ip);
    }
    const isBlocked = Object.values(results).some((blocked) => blocked === true);
    return {
      success: true,
      data: {
        blocked: isBlocked,
        details: results
      },
      message: isBlocked ? "\u53D1\u73B0\u9ED1\u540D\u5355\u9879\u76EE" : "\u672A\u53D1\u73B0\u9ED1\u540D\u5355\u9879\u76EE"
    };
  } catch (error) {
    console.error("\u68C0\u67E5\u9ED1\u540D\u5355\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
}
async function listBlacklist(event) {
  try {
    const query = getQuery$1(event);
    const page = Math.max(1, parseInt(String(query.page)) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize)) || 20));
    const offset = (page - 1) * pageSize;
    const db = Database$1;
    let tableName = "";
    let valueColumn = "";
    switch (query.type) {
      case "code":
        tableName = "blacklist_code";
        valueColumn = "activationCode";
        break;
      case "device":
        tableName = "blacklist_device";
        valueColumn = "deviceFingerprint";
        break;
      case "ip":
        tableName = "blacklist_ip";
        valueColumn = "ip";
        break;
      default:
        throw createError({
          statusCode: 400,
          statusMessage: "\u8BF7\u6307\u5B9A\u9ED1\u540D\u5355\u7C7B\u578B (code, device, ip)"
        });
    }
    const conditions = [];
    const params = [];
    if (query.value) {
      conditions.push(`${valueColumn} LIKE ?`);
      params.push(`%${query.value}%`);
    }
    if (query.startDate) {
      conditions.push("createdTime >= ?");
      params.push(query.startDate);
    }
    if (query.endDate) {
      conditions.push("createdTime <= ?");
      params.push(query.endDate);
    }
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const countSql = `SELECT COUNT(*) as total FROM ${tableName} ${whereClause}`;
    const countResult = await db.queryOne(countSql, params);
    const total = (countResult == null ? void 0 : countResult.total) || 0;
    const dataSql = `
      SELECT 
        blacklistId,
        ${valueColumn} as value,
        reason,
        createdTime
      FROM ${tableName} 
      ${whereClause}
      ORDER BY createdTime DESC
      LIMIT ? OFFSET ?
    `;
    const dataParams = [...params, pageSize, offset];
    const items = await db.query(dataSql, dataParams);
    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      message: "\u67E5\u8BE2\u6210\u529F"
    };
  } catch (error) {
    console.error("\u67E5\u8BE2\u9ED1\u540D\u5355\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
}
const _action_ = defineEventHandler(async (event) => {
  const method = getMethod(event);
  const url = getRouterParam(event, "action") || "";
  try {
    if (method === "POST" && url === "add") {
      return await addToBlacklist(event);
    } else if (method === "GET" && url === "check") {
      return await checkBlacklist(event);
    } else if (method === "GET" && url === "list") {
      return await listBlacklist(event);
    } else {
      throw createError({
        statusCode: 404,
        statusMessage: "\u63A5\u53E3\u4E0D\u5B58\u5728"
      });
    }
  } catch (error) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

const _action_$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  addToBlacklist: addToBlacklist,
  checkBlacklist: checkBlacklist,
  default: _action_,
  listBlacklist: listBlacklist
}, Symbol.toStringTag, { value: 'Module' }));

const add = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const check = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null
}, Symbol.toStringTag, { value: 'Module' }));

const generate = defineEventHandler(async (event) => {
  var _a;
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.count || body.count <= 0 || body.count > 1e4) {
      throw createError({
        statusCode: 400,
        message: "\u751F\u6210\u6570\u91CF\u5FC5\u987B\u57281-10000\u4E4B\u95F4"
      });
    }
    if (!body.price || body.price <= 0) {
      throw createError({
        statusCode: 400,
        message: "\u4EF7\u683C\u5FC5\u987B\u5927\u4E8E0"
      });
    }
    let expirationDate = null;
    if (body.expirationDays && body.expirationDays > 0) {
      expirationDate = /* @__PURE__ */ new Date();
      expirationDate.setDate(expirationDate.getDate() + body.expirationDays);
    }
    const codes = CodeGenerator.generateBatch(body.count);
    const db = Database$1;
    const insertPromises = codes.map(
      (code) => db.query(
        `INSERT INTO activation_code 
         (activationCode, status, userId, expirationDate, createdTime, lastModifiedTime) 
         VALUES (?, ?, ?, ?, NOW(), NOW())`,
        [
          code,
          ActivationCodeStatus.UNUSED,
          body.userId || null,
          expirationDate
        ]
      )
    );
    await Promise.all(insertPromises);
    const operatorId = ((_a = event.context.user) == null ? void 0 : _a.userId) || 0;
    const clientIP = getClientIP(event);
    await db.query(
      `INSERT INTO operation_log 
       (operatorId, operationType, target, detail, ip, createdTime) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        operatorId,
        OperationType.GENERATE,
        `\u6279\u91CF\u751F\u6210${body.count}\u4E2A\u6FC0\u6D3B\u7801`,
        JSON.stringify({
          count: body.count,
          price: body.price,
          expirationDays: body.expirationDays
        }),
        clientIP
      ]
    );
    return {
      success: true,
      data: {
        codes,
        totalCount: codes.length
      },
      message: `\u6210\u529F\u751F\u6210${codes.length}\u4E2A\u6FC0\u6D3B\u7801`
    };
  } catch (error) {
    console.error("\u751F\u6210\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

const generate$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: generate
}, Symbol.toStringTag, { value: 'Module' }));

const listTest = defineEventHandler(async (event) => {
  try {
    const db = Database$1;
    const sql = `SELECT activationCode, status, price FROM activation_code LIMIT 5`;
    const codes = await db.query(sql);
    return {
      success: true,
      data: codes,
      message: "\u6D4B\u8BD5\u6210\u529F"
    };
  } catch (error) {
    console.error("\u6D4B\u8BD5\u67E5\u8BE2\u5931\u8D25:", error);
    return {
      success: false,
      message: error.message || "\u67E5\u8BE2\u5931\u8D25"
    };
  }
});

const listTest$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: listTest
}, Symbol.toStringTag, { value: 'Module' }));

const list = defineEventHandler(async (event) => {
  var _a;
  try {
    setHeader(event, "Content-Type", "application/json; charset=utf-8");
    if (getMethod(event) !== "GET") {
      throw createError({
        statusCode: 405,
        statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const token = ((_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace("Bearer ", "")) || "";
    console.log("\u6536\u5230\u7684\u4EE4\u724C:", token.substring(0, 20) + "...");
    if (!token) {
      console.log("\u672A\u63D0\u4F9B\u8BA4\u8BC1\u4EE4\u724C");
      throw createError({
        statusCode: 401,
        statusMessage: "\u672A\u63D0\u4F9B\u8BA4\u8BC1\u4EE4\u724C"
      });
    }
    const query = getQuery$1(event);
    const page = Math.max(1, parseInt(String(query.page)) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(String(query.pageSize)) || 20));
    const offset = (page - 1) * pageSize;
    const db = Database$1;
    const conditions = [];
    let whereClause = "";
    if (query.code && String(query.code).trim()) {
      conditions.push(`activationCode LIKE '%${String(query.code).trim()}%'`);
    }
    if (query.status && String(query.status).trim()) {
      conditions.push(`status = '${String(query.status).trim()}'`);
    }
    if (query.userId && Number(query.userId) > 0) {
      conditions.push(`userId = ${Number(query.userId)}`);
    }
    if (query.deviceFingerprint && String(query.deviceFingerprint).trim()) {
      conditions.push(`deviceFingerprint LIKE '%${String(query.deviceFingerprint).trim()}%'`);
    }
    if (query.startDate && String(query.startDate).trim()) {
      conditions.push(`createdTime >= '${String(query.startDate).trim()}'`);
    }
    if (query.endDate && String(query.endDate).trim()) {
      conditions.push(`createdTime <= '${String(query.endDate).trim()}'`);
    }
    whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
    const countSql = `SELECT COUNT(*) as total FROM activation_code ${whereClause}`;
    const countResult = await db.queryOne(countSql);
    const total = (countResult == null ? void 0 : countResult.total) || 0;
    const dataSql = `
      SELECT 
        activationCode,
        status,
        price,
        userId,
        deviceFingerprint,
        ip,
        activationDate,
        expirationDate,
        createdTime,
        lastModifiedTime
      FROM activation_code 
      ${whereClause}
      ORDER BY createdTime DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;
    const codes = await db.query(dataSql);
    const items = codes.map((code) => ({
      activationCode: code.activationCode,
      status: code.status,
      price: code.price ? parseFloat(code.price) : 0,
      userId: code.userId,
      deviceFingerprint: code.deviceFingerprint,
      ip: code.ip,
      activationDate: code.activationDate,
      expirationDate: code.expirationDate,
      createdTime: code.createdTime,
      lastModifiedTime: code.lastModifiedTime
    }));
    return {
      success: true,
      data: {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      },
      message: "\u67E5\u8BE2\u6210\u529F"
    };
  } catch (error) {
    console.error("\u67E5\u8BE2\u6FC0\u6D3B\u7801\u5217\u8868\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

const list$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: list
}, Symbol.toStringTag, { value: 'Module' }));

const query = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "GET") {
      return {
        success: false,
        data: {
          activationCode: "",
          status: "\u672A\u77E5",
          isValid: false,
          message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8\uFF0C\u4EC5\u652F\u6301GET\u8BF7\u6C42",
          statusCode: 2
        },
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8\uFF0C\u4EC5\u652F\u6301GET\u8BF7\u6C42"
      };
    }
    const query = getQuery$1(event);
    const { code } = query;
    if (!code || typeof code !== "string" || code.trim() === "") {
      return {
        success: false,
        data: {
          activationCode: "",
          status: "\u672A\u77E5",
          isValid: false,
          message: "\u6FC0\u6D3B\u7801\u53C2\u6570\u4E0D\u80FD\u4E3A\u7A7A",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u53C2\u6570\u4E0D\u80FD\u4E3A\u7A7A"
      };
    }
    const activationCode = code.trim();
    console.log(`\u67E5\u8BE2\u6FC0\u6D3B\u7801: ${activationCode}`);
    const db = Database$1;
    const codeInfo = await db.queryOne(
      "SELECT activationCode, status, activationDate, expirationDate, createdTime FROM activation_code WHERE activationCode = ?",
      [activationCode]
    );
    if (!codeInfo) {
      return {
        success: false,
        data: {
          activationCode,
          status: "\u672A\u77E5",
          isValid: false,
          message: "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728"
      };
    }
    const now = /* @__PURE__ */ new Date();
    let isValid = false;
    let remainingDays;
    let remainingHours;
    let message = "";
    switch (codeInfo.status) {
      case "\u672A\u4F7F\u7528":
        if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) > now) {
          isValid = true;
          const timeDiff = new Date(codeInfo.expirationDate).getTime() - now.getTime();
          remainingDays = Math.floor(timeDiff / (1e3 * 60 * 60 * 24));
          remainingHours = Math.floor(timeDiff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
          message = `\u6FC0\u6D3B\u7801\u6709\u6548\uFF0C\u5269\u4F59${remainingDays}\u5929${remainingHours}\u5C0F\u65F6`;
        } else {
          message = "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F";
        }
        break;
      case "\u5DF2\u6FC0\u6D3B":
        if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) > now) {
          isValid = true;
          const timeDiff = new Date(codeInfo.expirationDate).getTime() - now.getTime();
          remainingDays = Math.floor(timeDiff / (1e3 * 60 * 60 * 24));
          remainingHours = Math.floor(timeDiff % (1e3 * 60 * 60 * 24) / (1e3 * 60 * 60));
          message = `\u6FC0\u6D3B\u7801\u5DF2\u6FC0\u6D3B\u4E14\u6709\u6548\uFF0C\u5269\u4F59${remainingDays}\u5929${remainingHours}\u5C0F\u65F6`;
        } else {
          message = "\u6FC0\u6D3B\u7801\u5DF2\u6FC0\u6D3B\u4F46\u5DF2\u8FC7\u671F";
        }
        break;
      case "\u5DF2\u8FC7\u671F":
        message = "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F";
        break;
      case "\u5DF2\u540A\u9500":
        message = "\u6FC0\u6D3B\u7801\u5DF2\u88AB\u540A\u9500";
        break;
      default:
        message = "\u6FC0\u6D3B\u7801\u72B6\u6001\u672A\u77E5";
        break;
    }
    const responseData = {
      activationCode: codeInfo.activationCode,
      status: codeInfo.status,
      isValid,
      remainingDays,
      remainingHours,
      expirationDate: codeInfo.expirationDate,
      activationDate: codeInfo.activationDate,
      message,
      statusCode: 1
      // 查询成功
    };
    console.log(`\u6FC0\u6D3B\u7801\u67E5\u8BE2\u7ED3\u679C:`, {
      code: activationCode,
      status: codeInfo.status,
      isValid,
      remainingDays,
      message
    });
    return {
      success: true,
      data: responseData,
      message: "\u67E5\u8BE2\u6210\u529F"
    };
  } catch (error) {
    console.error("\u67E5\u8BE2\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    return {
      success: false,
      data: {
        activationCode: "",
        status: "\u672A\u77E5",
        isValid: false,
        message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF",
        statusCode: 2
      },
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    };
  }
});

const query$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: query
}, Symbol.toStringTag, { value: 'Module' }));

const validateSimple = defineEventHandler(async (event) => {
  const db = Database.getInstance();
  if (event.node.req.method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
    });
  }
  try {
    const body = await readBody(event);
    if (!body.code || !body.userId || !body.deviceFingerprint || !body.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u53C2\u6570\u4E0D\u5B8C\u6574"
      });
    }
    if (!/^[A-Z0-9]{32}$/.test(body.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u6FC0\u6D3B\u7801\u683C\u5F0F\u65E0\u6548"
      });
    }
    console.log("\u{1F50D} \u5F00\u59CB\u9A8C\u8BC1\u6FC0\u6D3B\u7801:", body.code);
    const rows = await db.query(
      "SELECT activationCode, status, deviceFingerprint, expirationDate FROM activation_code WHERE activationCode = ?",
      [body.code]
    );
    console.log("\u{1F50D} \u6570\u636E\u5E93\u67E5\u8BE2\u7ED3\u679C:", rows);
    console.log("\u{1F50D} \u67E5\u8BE2\u8FD4\u56DE\u884C\u6570:", rows ? rows.length : 0);
    if (!rows || rows.length === 0) {
      console.log("\u274C \u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
    const codeInfo = rows[0];
    console.log("\u{1F4CB} \u6FC0\u6D3B\u7801\u4FE1\u606F:", codeInfo);
    console.log("\u{1F4CB} \u6FC0\u6D3B\u7801\u4FE1\u606F:", {
      activationCode: codeInfo.activationCode,
      status: codeInfo.status,
      deviceFingerprint: codeInfo.deviceFingerprint,
      expires_at: codeInfo.expirationDate
    });
    if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) < /* @__PURE__ */ new Date()) {
      console.log("\u23F0 \u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
    if (codeInfo.status === "\u672A\u4F7F\u7528") {
      console.log("\u{1F195} \u9996\u6B21\u6FC0\u6D3B - \u7ED1\u5B9A\u8BBE\u5907\u6307\u7EB9");
      await db.query(
        "UPDATE activation_code SET status = ?, deviceFingerprint = ?, userId = ?, activationDate = NOW() WHERE activationCode = ?",
        ["\u5DF2\u6FC0\u6D3B", body.deviceFingerprint, body.userId, body.code]
      );
      console.log("\u2705 \u6FC0\u6D3B\u6210\u529F\uFF0C\u8BBE\u5907\u6307\u7EB9\u5DF2\u7ED1\u5B9A:", body.deviceFingerprint);
      return {
        success: true,
        data: {
          valid: true,
          message: "\u6FC0\u6D3B\u6210\u529F",
          statusCode: 1
        },
        message: "\u9A8C\u8BC1\u6210\u529F"
      };
    } else if (codeInfo.status === "\u5DF2\u6FC0\u6D3B") {
      console.log("\u{1F50D} \u5DF2\u6FC0\u6D3B\u72B6\u6001 - \u9A8C\u8BC1\u8BBE\u5907\u6307\u7EB9");
      if (codeInfo.deviceFingerprint === body.deviceFingerprint) {
        console.log("\u2705 \u8BBE\u5907\u6307\u7EB9\u5339\u914D\uFF0C\u9A8C\u8BC1\u901A\u8FC7");
        return {
          success: true,
          data: {
            valid: true,
            message: "\u9A8C\u8BC1\u901A\u8FC7",
            statusCode: 1
          },
          message: "\u9A8C\u8BC1\u6210\u529F"
        };
      } else {
        console.log("\u274C \u8BBE\u5907\u6307\u7EB9\u4E0D\u5339\u914D", {
          \u5B58\u50A8\u8BBE\u5907\u6307\u7EB9: codeInfo.deviceFingerprint,
          \u8BF7\u6C42\u8BBE\u5907\u6307\u7EB9: body.deviceFingerprint
        });
        return {
          success: false,
          data: {
            valid: false,
            message: "\u8BE5\u6FC0\u6D3B\u7801\u5DF2\u88AB\u5176\u4ED6\u8BBE\u5907\u4F7F\u7528",
            statusCode: 3
          },
          message: "\u8BBE\u5907\u6307\u7EB9\u51B2\u7A81"
        };
      }
    } else {
      console.log("\u274C \u6FC0\u6D3B\u7801\u72B6\u6001\u65E0\u6548:", codeInfo.status);
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u72B6\u6001\u65E0\u6548",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
  } catch (error) {
    console.error("\u{1F4A5} \u9A8C\u8BC1\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    console.error("\u9519\u8BEF\u5806\u6808:", error.stack);
    console.error("\u9519\u8BEF\u6D88\u606F:", error.message);
    console.error("\u9519\u8BEF\u4EE3\u7801:", error.code);
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF: " + error.message
    });
  }
});

const validateSimple$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: validateSimple
}, Symbol.toStringTag, { value: 'Module' }));

const validateUrl = defineEventHandler(async (event) => {
  const db = Database.getInstance();
  const method = getMethod(event);
  if (method !== "GET" && method !== "POST") {
    throw createError({
      statusCode: 405,
      statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8\uFF0C\u652F\u6301GET\u548CPOST"
    });
  }
  try {
    let params;
    if (method === "GET") {
      const query = getQuery$1(event);
      params = {
        code: query.code,
        userId: parseInt(query.userId),
        deviceFingerprint: query.deviceFingerprint,
        ip: query.ip
      };
    } else {
      params = await readBody(event);
    }
    if (!params.code || !params.userId || !params.deviceFingerprint || !params.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u53C2\u6570\u4E0D\u5B8C\u6574"
      });
    }
    if (!/^[A-Z0-9]{32}$/.test(params.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u6FC0\u6D3B\u7801\u683C\u5F0F\u65E0\u6548"
      });
    }
    console.log("\u{1F50D} \u5F00\u59CB\u9A8C\u8BC1\u6FC0\u6D3B\u7801:", params.code, "- \u8BF7\u6C42\u65B9\u5F0F:", method);
    const rows = await db.query(
      "SELECT activationCode, status, deviceFingerprint, expirationDate FROM activation_code WHERE activationCode = ?",
      [params.code]
    );
    console.log("\u{1F50D} \u6570\u636E\u5E93\u67E5\u8BE2\u7ED3\u679C:", rows);
    if (!rows || rows.length === 0) {
      console.log("\u274C \u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
    const codeInfo = rows[0];
    console.log("\u{1F4CB} \u6FC0\u6D3B\u7801\u4FE1\u606F:", {
      activationCode: codeInfo.activationCode,
      status: codeInfo.status,
      deviceFingerprint: codeInfo.deviceFingerprint,
      expires_at: codeInfo.expirationDate
    });
    if (codeInfo.expirationDate && new Date(codeInfo.expirationDate) < /* @__PURE__ */ new Date()) {
      console.log("\u23F0 \u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
    if (codeInfo.status === "\u672A\u4F7F\u7528") {
      console.log("\u{1F195} \u9996\u6B21\u6FC0\u6D3B - \u7ED1\u5B9A\u8BBE\u5907\u6307\u7EB9");
      await db.query(
        "UPDATE activation_code SET status = ?, deviceFingerprint = ?, userId = ?, activationDate = NOW() WHERE activationCode = ?",
        ["\u5DF2\u6FC0\u6D3B", params.deviceFingerprint, params.userId, params.code]
      );
      console.log("\u2705 \u6FC0\u6D3B\u6210\u529F\uFF0C\u8BBE\u5907\u6307\u7EB9\u5DF2\u7ED1\u5B9A:", params.deviceFingerprint);
      return {
        success: true,
        data: {
          valid: true,
          message: "\u6FC0\u6D3B\u6210\u529F",
          statusCode: 1
        },
        message: "\u9A8C\u8BC1\u6210\u529F"
      };
    } else if (codeInfo.status === "\u5DF2\u6FC0\u6D3B") {
      console.log("\u{1F50D} \u5DF2\u6FC0\u6D3B\u72B6\u6001 - \u9A8C\u8BC1\u8BBE\u5907\u6307\u7EB9");
      if (codeInfo.deviceFingerprint === params.deviceFingerprint) {
        console.log("\u2705 \u8BBE\u5907\u6307\u7EB9\u5339\u914D\uFF0C\u9A8C\u8BC1\u901A\u8FC7");
        return {
          success: true,
          data: {
            valid: true,
            message: "\u9A8C\u8BC1\u901A\u8FC7",
            statusCode: 1
          },
          message: "\u9A8C\u8BC1\u6210\u529F"
        };
      } else {
        console.log("\u274C \u8BBE\u5907\u6307\u7EB9\u4E0D\u5339\u914D", {
          \u5B58\u50A8\u8BBE\u5907\u6307\u7EB9: codeInfo.deviceFingerprint,
          \u8BF7\u6C42\u8BBE\u5907\u6307\u7EB9: params.deviceFingerprint
        });
        return {
          success: false,
          data: {
            valid: false,
            message: "\u8BE5\u6FC0\u6D3B\u7801\u5DF2\u88AB\u5176\u4ED6\u8BBE\u5907\u4F7F\u7528",
            statusCode: 3
          },
          message: "\u8BBE\u5907\u6307\u7EB9\u51B2\u7A81"
        };
      }
    } else {
      console.log("\u274C \u6FC0\u6D3B\u7801\u72B6\u6001\u65E0\u6548:", codeInfo.status);
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u72B6\u6001\u65E0\u6548",
          statusCode: 2
        },
        message: "\u6FC0\u6D3B\u7801\u9A8C\u8BC1\u5931\u8D25"
      };
    }
  } catch (error) {
    console.error("\u{1F4A5} \u9A8C\u8BC1\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    console.error("\u9519\u8BEF\u5806\u6808:", error.stack);
    console.error("\u9519\u8BEF\u6D88\u606F:", error.message);
    console.error("\u9519\u8BEF\u4EE3\u7801:", error.code);
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF: " + error.message
    });
  }
});

const validateUrl$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: validateUrl
}, Symbol.toStringTag, { value: 'Module' }));

const validate = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.code || !CodeGenerator.validateFormat(body.code)) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u6FC0\u6D3B\u7801\u683C\u5F0F\u65E0\u6548"
      });
    }
    if (!body.userId || !body.deviceFingerprint || !body.ip) {
      throw createError({
        statusCode: 400,
        statusMessage: "\u7F3A\u5C11\u5FC5\u8981\u53C2\u6570"
      });
    }
    const db = Database$1;
    const blacklistResult = await BlacklistChecker.checkBlacklist(
      body.code,
      body.deviceFingerprint,
      body.ip
    );
    if (blacklistResult.blocked) {
      return {
        success: false,
        data: {
          valid: false,
          message: blacklistResult.reason,
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    const activationCode = await db.queryOne(
      "SELECT * FROM activation_code WHERE activationCode = ?",
      [body.code]
    );
    if (!activationCode) {
      await recordFailedActivation(db, body, "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u4E0D\u5B58\u5728",
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    if (activationCode.status === ActivationCodeStatus.ACTIVATED) {
      if (activationCode.ip && activationCode.ip !== body.ip) {
        await recordFailedActivation(db, body, "\u8BE5\u6FC0\u6D3B\u7801\u5DF2\u88AB\u5176\u4ED6IP\u4F7F\u7528");
        return {
          success: false,
          data: {
            valid: false,
            message: "\u8BE5\u6FC0\u6D3B\u7801\u5DF2\u88AB\u5176\u4ED6IP\u4F7F\u7528",
            statusCode: 3
          },
          message: "\u9A8C\u8BC1\u5931\u8D25",
          code: 3
        };
      }
      const authInfo = await db.queryOne(
        "SELECT tokenContent, expiryTime FROM authorization_info WHERE activationCode = ? ORDER BY createdTime DESC LIMIT 1",
        [body.code]
      );
      return {
        success: true,
        data: {
          valid: true,
          token: authInfo == null ? void 0 : authInfo.tokenContent,
          expiryTime: (authInfo == null ? void 0 : authInfo.expiryTime) ? new Date(authInfo.expiryTime) : void 0,
          message: "\u9A8C\u8BC1\u6210\u529F",
          statusCode: 1
        },
        message: "\u9A8C\u8BC1\u6210\u529F",
        code: 1
      };
    } else if (activationCode.status !== ActivationCodeStatus.UNUSED) {
      let message = "\u6FC0\u6D3B\u7801\u65E0\u6548";
      switch (activationCode.status) {
        case ActivationCodeStatus.EXPIRED:
          message = "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F";
          break;
        case ActivationCodeStatus.REVOKED:
          message = "\u6FC0\u6D3B\u7801\u5DF2\u88AB\u540A\u9500";
          break;
      }
      await recordFailedActivation(db, body, message);
      return {
        success: false,
        data: {
          valid: false,
          message,
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    if (activationCode.expirationDate && new Date(activationCode.expirationDate) < /* @__PURE__ */ new Date()) {
      await db.query(
        "UPDATE activation_code SET status = ?, lastModifiedTime = NOW() WHERE activationCode = ?",
        [ActivationCodeStatus.EXPIRED, body.code]
      );
      await recordFailedActivation(db, body, "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u5DF2\u8FC7\u671F",
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    if (activationCode.deviceFingerprint && activationCode.deviceFingerprint !== body.deviceFingerprint) {
      await recordFailedActivation(db, body, "\u8BBE\u5907\u4E0D\u5339\u914D");
      return {
        success: false,
        data: {
          valid: false,
          message: "\u6FC0\u6D3B\u7801\u5DF2\u7ED1\u5B9A\u5176\u4ED6\u8BBE\u5907",
          statusCode: 2
        },
        message: "\u9A8C\u8BC1\u5931\u8D25",
        code: 2
      };
    }
    const expiryTime = activationCode.expirationDate ? new Date(activationCode.expirationDate) : new Date(Date.now() + 365 * 24 * 60 * 60 * 1e3);
    await db.query(
      `UPDATE activation_code 
       SET status = ?, deviceFingerprint = ?, ip = ?, 
           activationDate = NOW(), lastModifiedTime = NOW() 
       WHERE activationCode = ?`,
      [
        ActivationCodeStatus.ACTIVATED,
        body.deviceFingerprint,
        body.ip,
        body.code
      ]
    );
    const authToken = TokenGenerator.generateAuthToken(
      body.code,
      body.userId,
      body.deviceFingerprint,
      expiryTime
    );
    await db.query(
      `INSERT INTO authorization_info 
       (activationCode, tokenContent, effectiveTime, expiryTime, createdTime) 
       VALUES (?, ?, NOW(), ?, NOW())`,
      [body.code, authToken, expiryTime]
    );
    return {
      success: true,
      data: {
        valid: true,
        token: authToken,
        expiryTime,
        message: "\u6FC0\u6D3B\u6210\u529F",
        statusCode: 1
      },
      message: "\u9A8C\u8BC1\u6210\u529F",
      code: 1
    };
  } catch (error) {
    console.error("\u9A8C\u8BC1\u6FC0\u6D3B\u7801\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});
async function recordFailedActivation(db, request, errorMessage) {
  try {
    console.log("\u8BB0\u5F55\u5931\u8D25\u6FC0\u6D3B:", errorMessage);
  } catch (error) {
    console.error("\u8BB0\u5F55\u5931\u8D25\u6FC0\u6D3B\u5931\u8D25:", error);
  }
}

const validate$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: validate
}, Symbol.toStringTag, { value: 'Module' }));

const login = defineEventHandler(async (event) => {
  try {
    if (getMethod(event) !== "POST") {
      throw createError({
        statusCode: 405,
        message: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
    const body = await readBody(event);
    if (!body.username || !body.password) {
      throw createError({
        statusCode: 400,
        message: "\u7528\u6237\u540D\u548C\u5BC6\u7801\u4E0D\u80FD\u4E3A\u7A7A"
      });
    }
    const config = useRuntimeConfig();
    TokenGenerator.setSecret(config.jwtSecret);
    const db = Database$1;
    const user = await db.queryOne(
      "SELECT * FROM user WHERE username = ? OR email = ?",
      [body.username, body.username]
    );
    if (!user) {
      const clientIP2 = getClientIP(event) || "127.0.0.1";
      await db.query(
        `INSERT INTO operation_log 
         (operatorId, operationType, target, detail, ip, createdTime) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          0,
          // 系统操作
          OperationType.LOGIN,
          body.username,
          JSON.stringify({
            result: "failed",
            reason: "\u7528\u6237\u4E0D\u5B58\u5728"
          }),
          clientIP2
        ]
      );
      throw createError({
        statusCode: 401,
        message: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF"
      });
    }
    const passwordValid = await bcrypt.compare(body.password, user.passwordHash);
    if (!passwordValid) {
      const clientIP2 = getClientIP(event) || "127.0.0.1";
      await db.query(
        `INSERT INTO operation_log 
         (operatorId, operationType, target, detail, ip, createdTime) 
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [
          user.userId,
          OperationType.LOGIN,
          body.username,
          JSON.stringify({
            result: "failed",
            reason: "\u5BC6\u7801\u9519\u8BEF"
          }),
          clientIP2
        ]
      );
      throw createError({
        statusCode: 401,
        message: "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\u8BEF"
      });
    }
    const token = TokenGenerator.generateJWT({
      userId: user.userId,
      username: user.username
    });
    const clientIP = getClientIP(event) || "127.0.0.1";
    await db.query(
      `INSERT INTO operation_log 
       (operatorId, operationType, target, detail, ip, createdTime) 
       VALUES (?, ?, ?, ?, ?, NOW())`,
      [
        user.userId,
        OperationType.LOGIN,
        body.username,
        JSON.stringify({
          result: "success"
        }),
        clientIP
      ]
    );
    return {
      success: true,
      data: {
        token,
        user: {
          userId: user.userId,
          username: user.username,
          email: user.email
        }
      },
      message: "\u767B\u5F55\u6210\u529F"
    };
  } catch (error) {
    console.error("\u767B\u5F55\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});

const login$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: login
}, Symbol.toStringTag, { value: 'Module' }));

const process$1 = defineEventHandler(async (event) => {
  try {
    const method = getMethod(event);
    if (method === "POST") {
      return await handlePaymentRequest(event);
    } else if (method === "PUT") {
      return await handlePaymentCallback(event);
    } else {
      throw createError({
        statusCode: 405,
        statusMessage: "\u65B9\u6CD5\u4E0D\u5141\u8BB8"
      });
    }
  } catch (error) {
    console.error("\u652F\u4ED8\u5904\u7406\u5931\u8D25:", error);
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      statusMessage: "\u670D\u52A1\u5668\u5185\u90E8\u9519\u8BEF"
    });
  }
});
async function handlePaymentRequest(event) {
  const body = await readBody(event);
  if (!body.userId || !body.amount || body.amount <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u65E0\u6548\u7684\u652F\u4ED8\u53C2\u6570"
    });
  }
  if (!body.paymentMethod || !Object.values(PaymentMethod).includes(body.paymentMethod)) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u4E0D\u652F\u6301\u7684\u652F\u4ED8\u65B9\u5F0F"
    });
  }
  if (!body.count || body.count <= 0 || body.count > 1e4) {
    throw createError({
      statusCode: 400,
      statusMessage: "\u6FC0\u6D3B\u7801\u6570\u91CF\u5FC5\u987B\u57281-10000\u4E4B\u95F4"
    });
  }
  const db = Database$1;
  CodeGenerator.generateBatch(body.count);
  let expirationDate = null;
  if (body.expirationDays && body.expirationDays > 0) {
    expirationDate = /* @__PURE__ */ new Date();
    expirationDate.setDate(expirationDate.getDate() + body.expirationDays);
  }
  const paymentResult = await db.query(
    `INSERT INTO payment_record 
     (userId, amount, paymentMethod, paymentStatus, createdTime) 
     VALUES (?, ?, ?, ?, NOW())`,
    [
      body.userId,
      body.amount,
      body.paymentMethod,
      PaymentStatus.PROCESSING
    ]
  );
  const paymentId = paymentResult.insertId;
  ({
    userId: body.userId
  });
  const payUrl = generatePaymentUrl(paymentId, body.amount, body.paymentMethod);
  const qrCode = generateQRCode();
  return {
    success: true,
    data: {
      paymentId,
      payUrl,
      qrCode
    },
    message: "\u652F\u4ED8\u8BA2\u5355\u521B\u5EFA\u6210\u529F"
  };
}
async function handlePaymentCallback(event) {
  const body = await readBody(event);
  const db = Database$1;
  const paymentRecord = await db.queryOne(
    "SELECT * FROM payment_record WHERE paymentId = ?",
    [body.paymentId]
  );
  if (!paymentRecord) {
    throw createError({
      statusCode: 404,
      statusMessage: "\u652F\u4ED8\u8BB0\u5F55\u4E0D\u5B58\u5728"
    });
  }
  if (paymentRecord.paymentStatus !== PaymentStatus.PROCESSING) {
    return {
      success: true,
      message: "\u652F\u4ED8\u72B6\u6001\u5DF2\u5904\u7406"
    };
  }
  if (body.status === "success") {
    await db.transaction(async (connection) => {
      await connection.query(
        `UPDATE payment_record 
         SET paymentStatus = ?, transactionId = ? 
         WHERE paymentId = ?`,
        [PaymentStatus.SUCCESS, body.transactionId, body.paymentId]
      );
      const codes = CodeGenerator.generateBatch(10);
      const insertPromises = codes.map(
        (code) => connection.query(
          `INSERT INTO activation_code 
           (activationCode, status, userId, expirationDate, createdTime, lastModifiedTime) 
           VALUES (?, ?, ?, ?, NOW(), NOW())`,
          [
            code,
            ActivationCodeStatus.UNUSED,
            paymentRecord.userId,
            null
            // 这里应该从缓存获取实际过期时间
          ]
        )
      );
      await Promise.all(insertPromises);
      const linkPromises = codes.map(
        (code) => connection.query(
          "UPDATE payment_record SET activationCodeId = ? WHERE paymentId = ?",
          [code, body.paymentId]
        )
      );
      await Promise.all(linkPromises);
    });
    return {
      success: true,
      message: "\u652F\u4ED8\u6210\u529F\uFF0C\u6FC0\u6D3B\u7801\u5DF2\u751F\u6210"
    };
  } else {
    await db.query(
      `UPDATE payment_record 
       SET paymentStatus = ? 
       WHERE paymentId = ?`,
      [PaymentStatus.FAILED, body.paymentId]
    );
    return {
      success: false,
      message: "\u652F\u4ED8\u5931\u8D25"
    };
  }
}
function generatePaymentUrl(paymentId, amount, method) {
  const baseUrl = method === PaymentMethod.ALIPAY ? "https://openapi.alipay.com/gateway.do" : "https://api.mch.weixin.qq.com/pay/unifiedorder";
  return `${baseUrl}?paymentId=${paymentId}&amount=${amount}&method=${method}`;
}
function generateQRCode(url) {
  return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`;
}

const process$2 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: process$1
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
  return {
    body: stringify(splitPayload(ssrContext).payload, ssrContext._payloadReducers) ,
    statusCode: getResponseStatus(ssrContext.event),
    statusMessage: getResponseStatusText(ssrContext.event),
    headers: {
      "content-type": "application/json;charset=utf-8" ,
      "x-powered-by": "Nuxt"
    }
  };
}
function renderPayloadJsonScript(opts) {
  const contents = opts.data ? stringify(opts.data, opts.ssrContext._payloadReducers) : "";
  const payload = {
    "type": "application/json",
    "innerHTML": contents,
    "data-nuxt-data": appId,
    "data-ssr": !(opts.ssrContext.noSSR)
  };
  {
    payload.id = "__NUXT_DATA__";
  }
  if (opts.src) {
    payload["data-src"] = opts.src;
  }
  const config = uneval(opts.ssrContext.config);
  return [
    payload,
    {
      innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}`
    }
  ];
}
function splitPayload(ssrContext) {
  const { data, prerenderedAt, ...initial } = ssrContext.payload;
  return {
    initial: { ...initial, prerenderedAt },
    payload: { data, prerenderedAt }
  };
}

const renderSSRHeadOptions = {"omitLineBreaks":false};

globalThis.__buildAssetsURL = buildAssetsURL;
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const renderer = defineRenderHandler(async (event) => {
  const nitroApp = useNitroApp();
  const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
  if (ssrError && !("__unenv__" in event.node.req)) {
    throw createError({
      statusCode: 404,
      statusMessage: "Page Not Found: /__nuxt_error"
    });
  }
  const ssrContext = createSSRContext(event);
  const headEntryOptions = { mode: "server" };
  ssrContext.head.push(appHead, headEntryOptions);
  if (ssrError) {
    ssrError.statusCode &&= Number.parseInt(ssrError.statusCode);
    setSSRError(ssrContext, ssrError);
  }
  const isRenderingPayload = PAYLOAD_URL_RE.test(ssrContext.url);
  if (isRenderingPayload) {
    const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
    ssrContext.url = url;
    event._path = event.node.req.url = url;
  }
  const routeOptions = getRouteRules(event);
  if (routeOptions.ssr === false) {
    ssrContext.noSSR = true;
  }
  const renderer = await getRenderer(ssrContext);
  const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
    if (ssrContext._renderResponse && error.message === "skipping render") {
      return {};
    }
    const _err = !ssrError && ssrContext.payload?.error || error;
    await ssrContext.nuxt?.hooks.callHook("app:error", _err);
    throw _err;
  });
  const inlinedStyles = [];
  await ssrContext.nuxt?.hooks.callHook("app:rendered", { ssrContext, renderResult: _rendered });
  if (ssrContext._renderResponse) {
    return ssrContext._renderResponse;
  }
  if (ssrContext.payload?.error && !ssrError) {
    throw ssrContext.payload.error;
  }
  if (isRenderingPayload) {
    const response = renderPayloadResponse(ssrContext);
    return response;
  }
  const NO_SCRIPTS = routeOptions.noScripts;
  const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
  if (ssrContext._preloadManifest && !NO_SCRIPTS) {
    ssrContext.head.push({
      link: [
        { rel: "preload", as: "fetch", fetchpriority: "low", crossorigin: "anonymous", href: buildAssetsURL(`builds/meta/${ssrContext.runtimeConfig.app.buildId}.json`) }
      ]
    }, { ...headEntryOptions, tagPriority: "low" });
  }
  if (inlinedStyles.length) {
    ssrContext.head.push({ style: inlinedStyles });
  }
  const link = [];
  for (const resource of Object.values(styles)) {
    if ("inline" in getQuery(resource.file)) {
      continue;
    }
    link.push({ rel: "stylesheet", href: renderer.rendererContext.buildAssetsURL(resource.file), crossorigin: "" });
  }
  if (link.length) {
    ssrContext.head.push({ link }, headEntryOptions);
  }
  if (!NO_SCRIPTS) {
    ssrContext.head.push({
      link: getPreloadLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      link: getPrefetchLinks(ssrContext, renderer.rendererContext)
    }, headEntryOptions);
    ssrContext.head.push({
      script: renderPayloadJsonScript({ ssrContext, data: ssrContext.payload }) 
    }, {
      ...headEntryOptions,
      // this should come before another end of body scripts
      tagPosition: "bodyClose",
      tagPriority: "high"
    });
  }
  if (!routeOptions.noScripts) {
    const tagPosition = "head";
    ssrContext.head.push({
      script: Object.values(scripts).map((resource) => ({
        type: resource.module ? "module" : null,
        src: renderer.rendererContext.buildAssetsURL(resource.file),
        defer: resource.module ? null : true,
        // if we are rendering script tag payloads that import an async payload
        // we need to ensure this resolves before executing the Nuxt entry
        tagPosition,
        crossorigin: ""
      }))
    }, headEntryOptions);
  }
  const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
  const htmlContext = {
    htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
    head: normalizeChunks([headTags]),
    bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
    bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
    body: [
      replaceIslandTeleports(ssrContext, _rendered.html) ,
      APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG
    ],
    bodyAppend: [bodyTags]
  };
  await nitroApp.hooks.callHook("render:html", htmlContext, { event });
  return {
    body: renderHTMLDocument(htmlContext),
    statusCode: getResponseStatus(event),
    statusMessage: getResponseStatusText(event),
    headers: {
      "content-type": "text/html;charset=utf-8",
      "x-powered-by": "Nuxt"
    }
  };
});
function normalizeChunks(chunks) {
  return chunks.filter(Boolean).map((i) => i.trim());
}
function joinTags(tags) {
  return tags.join("");
}
function joinAttrs(chunks) {
  if (chunks.length === 0) {
    return "";
  }
  return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
  return `<!DOCTYPE html><html${joinAttrs(html.htmlAttrs)}><head>${joinTags(html.head)}</head><body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body></html>`;
}

const renderer$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: renderer
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
