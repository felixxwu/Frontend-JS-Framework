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
})({"components/State.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// state.js is a singleton object, so it can be imported everywhere and share the same state
var _default = {
  init: function init(framework) {
    this.framework = framework;
    this.selected = null;
    this.appOpacity = 1;
    this.page = '1';
  },

  // methods for modifying the state
  get actions() {
    var _this = this;

    return {
      select: function select(number) {
        if (number === _this.selected) {
          _this.selected = null;
        } else {
          _this.selected = number;
        }
      },
      setOpaque: function setOpaque() {
        return _this.appOpacity = 1;
      },
      setTransparent: function setTransparent() {
        return _this.appOpacity = 0;
      },
      switch: function _switch() {
        return _this.page = _this.page === '1' ? '2' : '1';
      }
    };
  },

  // computed css variables, which are injected into the DOM for css files to use
  get cssVars() {
    return {
      bg: this.selected === 0 && 'red' || this.selected === 1 && 'green' || this.selected === 2 && 'blue' || 'white',
      width: "".concat(500 + this.selected * 100, "px"),
      opacity: this.appOpacity,
      transitionSpeed: '0.5s',
      transitionSpeedMS: 500
    };
  },

  dispatch: function dispatch(action, arg) {
    this.actions[action](arg);
    this.framework.render();
  }
};
exports.default = _default;
},{}],"Framework.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = _interopRequireDefault(require("./components/State"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Framework = /*#__PURE__*/function () {
  function Framework(id, rootComponent) {
    _classCallCheck(this, Framework);

    this.id = id;

    _State.default.init(this);

    this.rootComponent = rootComponent;
  } // renders nodes into this.id


  _createClass(Framework, [{
    key: "render",
    value: function render() {
      var t0 = performance.now(); // delete element content and add the new render

      var el = document.getElementById(this.id);
      el.textContent = '';
      el.appendChild(this.renderComponent(this.rootComponent())); // update the css variables

      var style = Object.keys(_State.default.cssVars).map(function (name) {
        return "--".concat(name, ": ").concat(_State.default.cssVars[name]);
      }).join('; ');
      el.setAttribute('style', style);
      console.log('Render took', Math.round(performance.now() - t0), 'ms');
    }
    /***************************************************************************************
     * Returns a node from a component.
     * 
     * A component has the following structure:
     * { text: string } OR
     * {
     *  tag: string,
     *  attrs?: {
     *      attribute: value,
     *      ...
     *  },
     *  events?: {
     *      eventName: handler,
     *      ...
     *  },
     *  child?: Component,
     *  children?: [Component, ...]
     * }
     **************************************************************************************/

  }, {
    key: "renderComponent",
    value: function renderComponent(component) {
      var _this = this;

      if (component.text !== undefined) return document.createTextNode(component.text);
      if (component.tag === undefined) throw 'must specify a tag for non-text components';
      var el = document.createElement(component.tag); // add all the attrs using element.setAttribute()

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
          el.appendChild(_this.renderComponent(child));
        });
      }

      return el;
    }
  }]);

  return Framework;
}();

exports.default = Framework;
},{"./components/State":"components/State.js"}],"components/Block.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = _interopRequireDefault(require("./State"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(number) {
  var className = 'block';
  if (number === _State.default.selected) className += ' selected';
  return {
    tag: 'div',
    attrs: {
      class: className
    },
    events: {
      click: function click() {
        return _State.default.dispatch('select', number);
      }
    },
    children: [{
      text: "block ".concat(number)
    }, {
      tag: 'br'
    }, {
      text: "selected ".concat(_State.default.selected)
    }]
  };
};

exports.default = _default;
},{"./State":"components/State.js"}],"components/SwitchButton.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = _interopRequireDefault(require("./State"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  return {
    tag: 'button',
    child: {
      text: 'switch'
    },
    events: {
      click: function click() {
        _State.default.dispatch('setTransparent');

        _State.default.dispatch('select', null);

        setTimeout(function () {
          _State.default.dispatch('switch');

          _State.default.dispatch('setOpaque');
        }, _State.default.cssVars.transitionSpeedMS);
      }
    }
  };
};

exports.default = _default;
},{"./State":"components/State.js"}],"components/Page1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Block = _interopRequireDefault(require("./Block"));

var _SwitchButton = _interopRequireDefault(require("./SwitchButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  return {
    tag: 'div',
    children: [(0, _Block.default)(0), (0, _Block.default)(1), (0, _Block.default)(2), (0, _SwitchButton.default)()]
  };
};

exports.default = _default;
},{"./Block":"components/Block.js","./SwitchButton":"components/SwitchButton.js"}],"components/SmallSquare.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default() {
  return {
    tag: 'div',
    attrs: {
      class: 'square'
    }
  };
};

exports.default = _default;
},{}],"components/Page2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _SwitchButton = _interopRequireDefault(require("./SwitchButton"));

var _SmallSquare = _interopRequireDefault(require("./SmallSquare"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

var _default = function _default() {
  var numSquares = 10000;
  return {
    tag: 'div',
    children: [{
      text: "Page 2 with ".concat(numSquares, " squares. check console for render time")
    }, {
      tag: 'br'
    }, (0, _SwitchButton.default)(), {
      tag: 'br'
    }].concat(_toConsumableArray(new Array(numSquares).fill((0, _SmallSquare.default)())))
  };
};

exports.default = _default;
},{"./SwitchButton":"components/SwitchButton.js","./SmallSquare":"components/SmallSquare.js"}],"components/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = _interopRequireDefault(require("./State"));

var _Page = _interopRequireDefault(require("./Page1"));

var _Page2 = _interopRequireDefault(require("./Page2"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default() {
  if (_State.default.page === '1') {
    return (0, _Page.default)();
  } else {
    return (0, _Page2.default)();
  }
};

exports.default = _default;
},{"./State":"components/State.js","./Page1":"components/Page1.js","./Page2":"components/Page2.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _Framework = _interopRequireDefault(require("./Framework"));

var _App = _interopRequireDefault(require("./components/App"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// render into the div with id='app'
new _Framework.default('app', _App.default).render();
},{"./Framework":"Framework.js","./components/App":"components/App.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "63223" + '/');

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