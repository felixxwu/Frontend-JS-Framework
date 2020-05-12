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

var Framework = {
  init: function init(root, id, stateConfig) {
    var _this = this;

    this.root = root;
    this.id = id;
    this.postRenderJobs = [];
    this.styleMemory = {};
    this.actions = stateConfig.actions;
    Object.keys(stateConfig.state).forEach(function (variable) {
      _this.state[variable] = stateConfig.state[variable];
    });
    this.render(this.root, this.id);
  },
  // STATE #######################################################################
  state: new Proxy({}, {
    set: function set(target, key, value) {
      target[key] = value;
      console.log(key, '=', value);
      updateSubscribers(key);
      return true;
    }
  }),
  dispatch: function dispatch(action, arg) {
    this.actions(this.state)[action](arg);
  },
  subscribe: function subscribe(name, variable) {
    if (!this.subscriptions[variable]) this.subscriptions[variable] = [];
    if (this.subscriptions[variable].includes(name)) return;
    this.subscriptions[variable].push(name);
  },
  subscriptions: {},
  // RENDERING #####################################################################
  // renders html element nodes using "component" into the DOM at id="id"
  render: function render(component, id) {
    var t0 = performance.now();
    if (!id) id = component.id;
    this.validateComponent(component);
    var render = this.renderElement(component, id);
    var el = document.getElementById(id);
    el && el.parentNode.replaceChild(render, el);
    this.postRender();
    console.log('Render took', Math.round(performance.now() - t0), 'ms id:', id);
  },
  // execture post-render jobs
  postRender: function postRender() {
    var _this2 = this;

    setTimeout(function () {
      while (_this2.postRenderJobs.length !== 0) {
        _this2.postRenderJobs.pop()();
      }
    }, 0);
  },
  // re-renders all components with that name
  renderByName: function renderByName(name) {
    this.renderComponentByName(this.root, name);
  },
  // re-renders all components with that name starting at this component
  renderComponentByName: function renderComponentByName(component, name) {
    var _this3 = this;

    if (component.name === name) {
      this.render(component);
      return;
    }

    if (component.child) {
      this.renderComponentByName(component.child.bind(component)(), name);
    }

    if (component.children) {
      component.children.bind(component)().forEach(function (child) {
        _this3.renderComponentByName(child, name);
      });
    }
  },
  // returns an element node from a json component
  renderElement: function renderElement(component, id) {
    var _this4 = this;

    if (id) {
      component.id = id;
    } // simple text component


    if (component.text !== undefined) return document.createTextNode(component.text); // other types

    var el = document.createElement(component.tag);
    el.setAttribute('id', component.id); // add all the attrs using element.setAttribute()

    if (component.attrs !== undefined) {
      Object.keys(component.attrs).forEach(function (attrName) {
        var attrValue = component.attrs[attrName];
        el.setAttribute(attrName, attrValue);
      });
    } // add all the event listeners using element.addEventListener()


    if (component.events !== undefined) {
      Object.keys(component.events).forEach(function (event) {
        var handler = component.events[event];
        el.addEventListener(event, function (e) {
          var flag = handler.bind(component)(e);

          if (flag !== _this4.flags.NO_SELF_RENDER) {
            _this4.render(component);
          }

          e.stopPropagation();
        });
      });
    } // add a single child component


    if (component.child !== undefined) {
      el.appendChild(this.renderElement(component.child.bind(component)(), "".concat(id, "-0")));
    } // add an array of children components


    if (component.children !== undefined) {
      component.children.bind(component)().forEach(function (child, index) {
        el.appendChild(_this4.renderElement(child, "".concat(id, "-").concat(index)));
      });
    } // only set this.styles don't actually set the attribute, since it needs to be set after render for transitions to work


    if (component.style !== undefined) {
      el.setAttribute('style', this.styleMemory[component.id]);
      this.postRenderJobs.push(function () {
        var newStyle = component.style.bind(component)();
        var el = document.getElementById(component.id);
        if (el) el.style = newStyle;
        _this4.styleMemory[component.id] = newStyle;
      });
    }

    if (component.subscribeTo !== undefined) {
      component.subscribeTo.forEach(function (variable) {
        _this4.subscribe(component.name, variable);
      });
    }

    return el;
  },
  // VALIDATION ##############################################################
  validateComponent: function validateComponent(component) {
    var acceptedFields = ['text', 'name', 'tag', 'data', 'attrs', 'events', 'child', 'children', 'style', 'id', 'subscribeTo'];
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
    } // type checking


    if (component.text !== undefined && typeof component.text !== 'string') {
      throw 'Field "text" must be of type string ' + JSON.stringify(component);
    }

    if (component.name !== undefined && typeof component.name !== 'string') {
      throw 'Field "name" must be of type string ' + JSON.stringify(component);
    }

    if (component.tag !== undefined && typeof component.tag !== 'string') {
      throw 'Field "tag" must be of type string ' + JSON.stringify(component);
    }

    if (component.style !== undefined && typeof component.style !== 'function') {
      throw 'Field "style" must be of type function ' + JSON.stringify(component);
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
    } // if (component.child !== undefined && typeof(component.child) !== 'object') {
    //     throw 'Field "child" must be of type object ' + JSON.stringify(component)
    // }
    // if (component.children !== undefined && !Array.isArray(component.children)) {
    //     throw 'Field "children" must be an array ' + JSON.stringify(component)
    // }

  },
  flags: Object.freeze({
    NO_SELF_RENDER: 1
  })
};

var updateSubscribers = function updateSubscribers(variable) {
  var subscribed = Framework.subscriptions[variable];
  subscribed && subscribed.forEach(function (name) {
    Framework.renderByName(name);
  });
};

var _default = Framework;
exports.default = _default;
},{}],"components/Button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = _interopRequireDefault(require("../Framework"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(number) {
  var className = '';
  if (number === 1) className = 'a4';
  if (number === 2) className = 'a5';
  if (number === 3) className = 'a6';
  return {
    name: 'button',
    tag: 'div',
    attrs: {
      class: "".concat(className, " grid3x3")
    },
    data: {
      myCount: 0
    },
    style: function style() {
      return "\n                width: 70px;\n                height: 70px;\n                border: solid 1px grey;\n                cursor: pointer;\n            ";
    },
    events: {
      click: function click() {
        this.data.myCount += 1;

        _Framework.default.dispatch('incrementCount', number);
      }
    },
    child: function child() {
      var _this = this;

      return {
        tag: 'div',
        child: function child() {
          return {
            text: "+".concat(number, " (").concat(_this.data.myCount, ")")
          };
        }
      };
    }
  };
};

exports.default = _default;
},{"../Framework":"Framework.js"}],"components/Counter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = _interopRequireDefault(require("../Framework"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'counter',
  tag: 'div',
  attrs: {
    class: 'a2'
  },
  subscribeTo: ['count'],
  child: function child() {
    return {
      text: "Count: ".concat(_Framework.default.state.count)
    };
  }
};
exports.default = _default;
},{"../Framework":"Framework.js"}],"components/ExitButton.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = function _default(handler) {
  return {
    name: 'exit',
    tag: 'div',
    attrs: {
      class: 'a8 grid3x3'
    },
    style: function style() {
      return "\n            width: 100px;\n            height: 50px;\n            border: 1px solid grey;\n            cursor: pointer;\n        ";
    },
    events: {
      click: handler
    },
    child: function child() {
      return {
        name: '',
        tag: 'div',
        child: function child() {
          return {
            text: 'exit'
          };
        }
      };
    }
  };
};

exports.default = _default;
},{}],"components/Box.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Button = _interopRequireDefault(require("./Button"));

var _Counter = _interopRequireDefault(require("./Counter"));

var _Framework = _interopRequireDefault(require("../Framework"));

var _ExitButton = _interopRequireDefault(require("./ExitButton"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var states = Object.freeze({
  START: 1,
  EXPANDING: 2,
  EXPANDED: 3
});
var dimensions = {
  START: [100, 50],
  EXPANDED: [500, 300]
};
var animationTime = 0.5;
var _default = {
  name: 'box',
  tag: 'div',
  attrs: {
    class: 'grid3x3'
  },
  data: {
    dimensions: dimensions.START,
    state: states.START
  },
  events: {
    click: function click() {
      var _this = this;

      if (this.data.state === states.EXPANDED) return _Framework.default.flags.NO_SELF_RENDER;
      this.data.dimensions = dimensions.EXPANDED;
      this.data.state = states.EXPANDING;

      _Framework.default.dispatch('setBoxExpanding', true);

      setTimeout(function () {
        _this.data.state = states.EXPANDED;

        _Framework.default.dispatch('setBoxExpanding', false);
      }, animationTime * 1000);
    }
  },
  subscribeTo: ['boxExpanding'],
  style: function style() {
    return "\n            width: ".concat(this.data.dimensions[0], "px;\n            height: ").concat(this.data.dimensions[1], "px;\n            max-width: 100vw;\n            border: 1px solid grey;\n            transition: ").concat(animationTime, "s;\n            cursor: ").concat(this.data.state === states.START ? 'pointer' : 'initial', ";\n        ");
  },
  children: function children() {
    var _this2 = this;

    var start = [{
      tag: 'div',
      child: function child() {
        return {
          text: 'start'
        };
      }
    }];

    var exit = function exit() {
      _this2.data.dimensions = dimensions.START;
      _this2.data.state = states.EXPANDING;

      _Framework.default.dispatch('resetCount');

      _Framework.default.dispatch('setBoxExpanding', true);

      setTimeout(function () {
        _this2.data.state = states.START;

        _Framework.default.dispatch('setBoxExpanding', false);
      }, animationTime * 1000);
    };

    var buttons = [_Counter.default, (0, _Button.default)(1), (0, _Button.default)(2), (0, _Button.default)(3), (0, _ExitButton.default)(exit)];
    if (this.data.state === states.START) return start;
    if (this.data.state === states.EXPANDING) return [];
    if (this.data.state === states.EXPANDED) return buttons;
  }
};
exports.default = _default;
},{"./Button":"components/Button.js","./Counter":"components/Counter.js","../Framework":"Framework.js","./ExitButton":"components/ExitButton.js"}],"components/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Box = _interopRequireDefault(require("./Box"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  name: 'app',
  tag: 'div',
  attrs: {
    class: 'grid3x3'
  },
  style: function style() {
    return "\n        width: 100vw;\n        height: 100vh;\n        overflow: hidden;\n        font-family: 'Lexend Deca', sans-serif;\n    ";
  },
  children: function children() {
    return [_Box.default];
  }
};
exports.default = _default;
},{"./Box":"components/Box.js"}],"StateConfig.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  state: {
    count: 0,
    boxExpanding: false
  },
  actions: function actions(state) {
    return {
      incrementCount: function incrementCount(amount) {
        return state.count += amount;
      },
      resetCount: function resetCount() {
        return state.count = 0;
      },
      setBoxExpanding: function setBoxExpanding(bool) {
        return state.boxExpanding = bool;
      }
    };
  }
};
exports.default = _default;
},{}],"index.js":[function(require,module,exports) {
"use strict";

var _Framework = _interopRequireDefault(require("./Framework"));

var _App = _interopRequireDefault(require("./components/App"));

var _StateConfig = _interopRequireDefault(require("./StateConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// render into the div with id='app'
_Framework.default.init(_App.default, 'app', _StateConfig.default);
},{"./Framework":"Framework.js","./components/App":"components/App.js","./StateConfig":"StateConfig.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49825" + '/');

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