// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"Framework.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Framework = /*#__PURE__*/function () {
  function Framework(id, state, rootComponent) {
    _classCallCheck(this, Framework);

    state.init(this);
    this.id = id;
    this.rootComponent = rootComponent;
    this.componentId = 0;
    this.oldStyles = {};
    this.styles = {};
  } // renders nodes into this.id


  _createClass(Framework, [{
    key: "render",
    value: function render() {
      var _this = this;

      var t0 = performance.now(); // delete element content and add the new render

      this.componentId = 0;
      var el = document.getElementById(this.id);
      el.textContent = '';
      el.appendChild(this.renderComponent(this.rootComponent()));
      setTimeout(function () {
        Object.keys(_this.styles).forEach(function (id) {
          document.getElementById(id).style = _this.styles[id];
        });
      }, 0);
      this.oldStyles = this.styles;
      console.log('Render took', Math.round(performance.now() - t0), 'ms');
    }
    /***************************************************************************************
     * Returns a node from a component.
     * 
     * A component has the following structure:
     * { text: string } OR
     * {
     *  tag: string,
     *  name: string,
     *  attrs?: {
     *      attribute: value,
     *      ...
     *  },
     *  events?: {
     *      eventName: handler,
     *      ...
     *  },
     *  child?: Component,
     *  children?: [Component, ...],
     *  style: `string`
     * }
     **************************************************************************************/

  }, {
    key: "renderComponent",
    value: function renderComponent(component) {
      var _this2 = this;

      this.validateComponent(component);
      if (component.text !== undefined) return document.createTextNode(component.text);
      var el = document.createElement(component.tag);
      var id = "".concat(component.name, "-").concat(this.componentId);
      el.setAttribute('id', id);
      this.componentId++; // add all the attrs using element.setAttribute()

      if (component.attrs !== undefined) {
        Object.keys(component.attrs).forEach(function (attrName) {
          var attrValue = component.attrs[attrName];
          el.setAttribute(attrName, attrValue);
        });
      } // add all the event listeners using element.addEventListener()


      if (component.events !== undefined) {
        Object.keys(component.events).forEach(function (event) {
          var handler = component.events[event];
          el.addEventListener(event, handler);
        });
      } // add a single child component


      if (component.child !== undefined) {
        el.appendChild(this.renderComponent(component.child));
      } // add an array of children components


      if (component.children !== undefined) {
        component.children.forEach(function (child) {
          el.appendChild(_this2.renderComponent(child));
        });
      } // only set this.styles don't actually set the attribute, since it needs to be set after render for transitions to work


      if (component.style !== undefined) {
        el.setAttribute('style', this.oldStyles[id]);
        this.styles[id] = component.style;
      }

      return el;
    }
  }, {
    key: "validateComponent",
    value: function validateComponent(component) {
      var acceptedFields = ['text', 'name', 'tag', 'attrs', 'events', 'child', 'children', 'style'];
      Object.keys(component).forEach(function (key) {
        if (!acceptedFields.includes(key)) {
          throw "Field \"".concat(key, "\" is not an accepted component field, use one of ").concat(JSON.stringify(acceptedFields));
        }
      });

      if (component.text !== undefined && Object.keys(component).length !== 1) {
        throw 'Simple text components must only contain a "text" field ' + JSON.stringify(component);
      }

      if (component.text === undefined) {
        if (!component.tag) throw 'Component must have a "tag" ' + JSON.stringify(component);
        if (!component.name) throw 'Component must have a "name" ' + JSON.stringify(component);
      }

      if (component.text !== undefined && typeof component.text !== 'string') {
        throw 'Field "text" must be of type string ' + JSON.stringify(component);
      }

      if (component.name !== undefined && typeof component.name !== 'string') {
        throw 'Field "name" must be of type string ' + JSON.stringify(component);
      }

      if (component.tag !== undefined && typeof component.tag !== 'string') {
        throw 'Field "tag" must be of type string ' + JSON.stringify(component);
      }

      if (component.style !== undefined && typeof component.style !== 'string') {
        throw 'Field "style" must be of type string ' + JSON.stringify(component);
      }

      if (component.attrs !== undefined && _typeof(component.attrs) !== 'object') {
        throw 'Field "attrs" must be of type object ' + JSON.stringify(component);
      }

      if (component.attrs !== undefined) {
        Object.keys(component.attrs).forEach(function (key) {
          if (typeof component.attrs[key] !== 'string') {
            throw 'All "attrs" must be of type string ' + JSON.stringify(component);
          }
        });
      }

      if (component.events !== undefined && _typeof(component.events) !== 'object') {
        throw 'Field "events" must be of type object ' + JSON.stringify(component);
      }

      if (component.events !== undefined) {
        Object.keys(component.events).forEach(function (key) {
          if (typeof component.events[key] !== 'function') {
            throw 'All "events" must be of type function ' + JSON.stringify(component);
          }
        });
      }

      if (component.child !== undefined && _typeof(component.child) !== 'object') {
        throw 'Field "child" must be of type object ' + JSON.stringify(component);
      }

      if (component.children !== undefined && !Array.isArray(component.children)) {
        throw 'Field "children" must be an array ' + JSON.stringify(component);
      }
    }
  }]);

  return Framework;
}();

exports.default = Framework;
},{}],"State.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// state.js is a singleton object, so it can be imported everywhere and share the same state
var _default = {
  init: function init(framework) {
    this.framework = framework;
    this.boxDim = [100, 40];
    this.page = 'start';
  },

  // methods for modifying the state
  get actions() {
    var _this = this;

    return {
      setBoxDim: function setBoxDim(dim) {
        return _this.boxDim = dim;
      },
      setPage: function setPage(page) {
        return _this.page = page;
      }
    };
  },

  dispatch: function dispatch(action, arg) {
    console.log('dipatched', action, arg);
    this.actions[action](arg);
    this.framework.render();
  }
};
exports.default = _default;
},{}],"components/Box.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = _interopRequireDefault(require("../State"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  return {
    name: 'box',
    tag: 'div',
    events: {
      click: function click() {
        return _State.default.dispatch('setBoxDim', [500, 300]);
      }
    },
    style: "\n            width: ".concat(_State.default.boxDim[0], "px;\n            height: ").concat(_State.default.boxDim[1], "px;\n            max-width: 100vw;\n            border: 1px solid grey;\n            transition: 0.5s;\n        ")
  };
};

exports.default = _default;
},{"../State":"State.js"}],"components/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Box = _interopRequireDefault(require("./Box"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  return {
    name: 'app',
    tag: 'div',
    attrs: {
      class: 'grid3x3'
    },
    style: "\n            width: 100vw;\n            height: 100vh;\n            overflow: hidden;\n        ",
    child: (0, _Box.default)()
  };
};

exports.default = _default;
},{"./Box":"components/Box.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _Framework = _interopRequireDefault(require("./Framework"));

var _State = _interopRequireDefault(require("./State"));

var _App = _interopRequireDefault(require("./components/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// render into the div with id='app'
new _Framework.default('app', _State.default, _App.default).render();
},{"./Framework":"Framework.js","./State":"State.js","./components/App":"components/App.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "56565" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/framework.e31bb0bc.js.map