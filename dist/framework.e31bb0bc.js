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
})({"Framework/Component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Component = function Component(tag) {
  _classCallCheck(this, Component);

  this.tag = tag;
  this.id = null;
  this.attributes = {};
  this.data = {};
  this.events = {};
  this.listeners = [];

  this.children = function () {
    return [];
  };

  this.oldStyle = null;

  this.onCreate = function () {};

  this.isNew = true;

  this.rerender = function () {};
};

exports.default = Component;
},{}],"Framework/TextComponent.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TextComponent = function TextComponent() {
  var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

  _classCallCheck(this, TextComponent);

  this.tag = null;
  this.text = text;
};

exports.default = TextComponent;
},{}],"Framework/Renderer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var postRenderJobs = [];
var _default = {
  render: function render(component, id) {
    var isProxy = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    var t0 = performance.now();
    var componentObject = isProxy ? component.$component : component;
    var render = this.renderComponent(componentObject, id);
    var element = document.getElementById(id);
    element && element.parentNode.replaceChild(render, element);
    var renderTime = Math.round(performance.now() - t0);
    renderTime > 10 && console.log('Render took', renderTime, 'ms id:', id);
  },
  renderComponent: function renderComponent(component, id) {
    var _this = this;

    // console.log('rendering component', component)
    if (component.tag === null) return this.renderTextComponent(component);
    component.attributes.id = id;

    component.rerender = function () {
      return _this.render(component, id, false);
    };

    var element = document.createElement(component.tag);
    this.setAttributes(element, component);
    this.setChildren(element, component, id);
    this.setEventHandlers(element, component);
    this.runOnCreate(component);
    return element;
  },
  renderTextComponent: function renderTextComponent(component) {
    return document.createTextNode(component.text);
  },
  setAttributes: function setAttributes(element, component) {
    Object.keys(component.attributes).forEach(function (attribute) {
      if (attribute === 'style') return;
      var value = component.attributes[attribute];

      if (typeof value === 'function') {
        element.setAttribute(attribute, value.bind(component)());
      } else {
        element.setAttribute(attribute, value);
      }
    });

    if (component.oldStyle !== null) {
      element.setAttribute('style', component.oldStyle);
    }

    setTimeout(function () {
      if (component.attributes.style) {
        var style = component.attributes.style;
        var styleObject = typeof style === 'function' ? style.bind(component)() : style;
        element.setAttribute('style', styleObject);
        component.oldStyle = styleObject;
      }
    }, 0);
  },
  setEventHandlers: function setEventHandlers(element, component) {
    var handlers = component.events;
    Object.keys(handlers).forEach(function (eventName) {
      var handler = component.events[eventName];
      element.addEventListener(eventName, function (e) {
        handler.bind(component)(e);
        e.stopPropagation();
      });
    });
  },
  setChildren: function setChildren(element, component, id) {
    var _this2 = this;

    var children = typeof component.children === 'function' ? component.children.bind(component)() : component.children;
    children.forEach(function (child, index) {
      var childElement = _this2.renderComponent(child.$component, id + '-' + index);

      element.appendChild(childElement);
    });
  },
  runOnCreate: function runOnCreate(component) {
    setTimeout(function () {
      if (component.isNew) {
        component.onCreate.bind(component)();
        component.rerender();
      }

      component.isNew = false;
    }, 1);
  }
};
exports.default = _default;
},{}],"Framework/State.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var State = /*#__PURE__*/function () {
  function State(state) {
    var _this = this;

    _classCallCheck(this, State);

    this.state = new Proxy(state, {
      set: function set(target, key, value) {
        target[key] = value;
        console.log('state', key, '=', value);

        _this.updateSubscribers(key);

        return true;
      }
    });
    this.subscriptions = {};
  }

  _createClass(State, [{
    key: "subscribe",
    value: function subscribe(component, variable) {
      if (!this.subscriptions[variable]) this.subscriptions[variable] = [];
      if (this.subscriptions[variable].includes(component)) return;
      this.subscriptions[variable].push(component);
    }
  }, {
    key: "updateSubscribers",
    value: function updateSubscribers(variable) {
      var subscribed = this.subscriptions[variable];
      subscribed && subscribed.forEach(function (component) {
        component.rerender();
      });
    }
  }]);

  return State;
}();

exports.default = State;
},{}],"Framework/Framework.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Renderer", {
  enumerable: true,
  get: function () {
    return _Renderer.default;
  }
});
Object.defineProperty(exports, "State", {
  enumerable: true,
  get: function () {
    return _State.default;
  }
});
exports.br = exports.text = exports.div = void 0;

var _Component = _interopRequireDefault(require("./Component"));

var _TextComponent = _interopRequireDefault(require("./TextComponent"));

var _Renderer = _interopRequireDefault(require("./Renderer"));

var _State = _interopRequireDefault(require("./State"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var componentProxy = function componentProxy(component) {
  return new Proxy(component, {
    get: function get(_, property) {
      if (property === '$event') {
        return this.getEventSetter();
      } else if (property === '$data') {
        return this.setData;
      } else if (property === '$listeners') {
        return this.setListeners;
      } else if (property === '$children') {
        return this.setChildren;
      } else if (property === '$onCreate') {
        return this.setOnCreate;
      } else if (property === '$component') {
        return component;
      } else {
        return this.getAttributeSetter(property);
      }
    },
    getEventSetter: function getEventSetter() {
      var self = this;
      return new Proxy({}, {
        get: function get(_, eventName) {
          return function (handler) {
            return self.setEventHandler(eventName, handler);
          };
        }
      });
    },
    setEventHandler: function setEventHandler(eventName, handler) {
      component.events[eventName] = handler;
      return componentProxy(component);
    },
    getAttributeSetter: function getAttributeSetter(property) {
      var _this = this;

      return function (value) {
        _this.setAttribute(property, value);

        return componentProxy(component);
      };
    },
    setAttribute: function setAttribute(property, value) {
      component.attributes[property] = value;
      return componentProxy(component);
    },
    setData: function setData(data) {
      component.data = new Proxy(data, {
        set: function set(target, key, value) {
          target[key] = value;
          console.log('data', key, '=', value);
          component.rerender();
          return true;
        }
      });
      return componentProxy(component);
    },
    setListeners: function setListeners(names) {
      component.listeners = names;
      return componentProxy(component);
    },
    setChildren: function setChildren(children) {
      component.children = children;
      return componentProxy(component);
    },
    setOnCreate: function setOnCreate(func) {
      component.onCreate = func;
      return componentProxy(component);
    }
  });
};

var text = function text(content) {
  return {
    $component: new _TextComponent.default(content)
  };
};

exports.text = text;

var div = function div() {
  return componentProxy(new _Component.default('div'));
};

exports.div = div;

var br = function br() {
  return componentProxy(new _Component.default('br'));
};

exports.br = br;
},{"./Component":"Framework/Component.js","./TextComponent":"Framework/TextComponent.js","./Renderer":"Framework/Renderer.js","./State":"Framework/State.js"}],"state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _State = _interopRequireDefault(require("./Framework/State"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = new _State.default({
  count: 0,
  boxExpanding: false,
  incrementCount: function incrementCount(amount) {
    this.count += amount;
  },
  resetCount: function resetCount() {
    this.count = 0;
  },
  setBoxExpanding: function setBoxExpanding(bool) {
    this.boxExpanding = bool;
  }
});

exports.default = _default;
},{"./Framework/State":"Framework/State.js"}],"components/Counter.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../Framework/Framework");

var _state = _interopRequireDefault(require("../state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _Framework.div)().class('a2').$data({
  opacity: 0
}).$onCreate(function () {
  _state.default.subscribe(this, 'count');
}).$children(function () {
  return [(0, _Framework.text)("Count: ".concat(_state.default.state.count))];
});

exports.default = _default;
},{"../Framework/Framework":"Framework/Framework.js","../state":"state.js"}],"components/ExitButton.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../Framework/Framework");

var _default = function _default(handler) {
  return (0, _Framework.div)().class('a8 grid3x3').style(function () {
    return "\n                width: 100px;\n                height: 50px;\n                border: 1px solid grey;\n                cursor: pointer;\n            ";
  }).$event.click(handler).$children([(0, _Framework.div)().$children([(0, _Framework.text)('exit')])]);
};

exports.default = _default;
},{"../Framework/Framework":"Framework/Framework.js"}],"components/Button.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../Framework/Framework");

var _state = _interopRequireDefault(require("../state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(number) {
  var className = '';
  if (number === 1) className = 'a4';
  if (number === 2) className = 'a5';
  if (number === 3) className = 'a6';
  return (0, _Framework.div)().class("".concat(className, " grid3x3 button")).$data({
    myCount: 0
  }).$event.click(function () {
    this.data.myCount += 1;

    _state.default.state.incrementCount(number);
  }).$children(function () {
    return [(0, _Framework.div)().$children([(0, _Framework.text)("+".concat(number, " (").concat(this.data.myCount, ")"))])];
  });
};

exports.default = _default;
},{"../Framework/Framework":"Framework/Framework.js","../state":"state.js"}],"components/Box.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../Framework/Framework");

var _state = _interopRequireDefault(require("../state"));

var _Counter = _interopRequireDefault(require("./Counter"));

var _ExitButton = _interopRequireDefault(require("./ExitButton"));

var _Button = _interopRequireDefault(require("./Button"));

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

var _default = (0, _Framework.div)().class('box grid3x3').style(function () {
  return "\n            width: ".concat(this.data.dimensions[0], "px;\n            height: ").concat(this.data.dimensions[1], "px;\n            transition: ").concat(animationTime, "s;\n            cursor: ").concat(this.data.state === states.START ? 'pointer' : 'initial', ";\n            opacity: ").concat(this.data.opacity, ";\n        ");
}).$data({
  dimensions: dimensions.START,
  state: states.START,
  opacity: 0,
  text: 'start'
}).$event.click(function () {
  var _this = this;

  if (this.data.state === states.EXPANDED) return;
  this.data.dimensions = dimensions.EXPANDED;
  this.data.state = states.EXPANDING;

  _state.default.state.setBoxExpanding(true);

  setTimeout(function () {
    _this.data.state = states.EXPANDED;

    _state.default.state.setBoxExpanding(false);
  }, animationTime * 1000);
}).$onCreate(function () {
  this.data.opacity = 1;

  _state.default.subscribe(this, 'boxExpanding');
}).$children(function () {
  var _this2 = this;

  var start = [(0, _Framework.div)().$children([(0, _Framework.text)('start')])];

  var exitHandler = function exitHandler() {
    _this2.data.dimensions = dimensions.START;
    _this2.data.state = states.EXPANDING;

    _state.default.state.resetCount();

    _state.default.state.setBoxExpanding(true);

    setTimeout(function () {
      _this2.data.state = states.START;

      _state.default.state.setBoxExpanding(false);
    }, animationTime * 1000);
  };

  var buttons = [_Counter.default, (0, _Button.default)(1), (0, _Button.default)(2), (0, _Button.default)(3), (0, _ExitButton.default)(exitHandler)];
  if (this.data.state === states.START) return start;
  if (this.data.state === states.EXPANDING) return [];
  if (this.data.state === states.EXPANDED) return buttons;
});

exports.default = _default;
},{"../Framework/Framework":"Framework/Framework.js","../state":"state.js","./Counter":"components/Counter.js","./ExitButton":"components/ExitButton.js","./Button":"components/Button.js"}],"components/App.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../Framework/Framework");

var _Box = _interopRequireDefault(require("./Box"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _Framework.div)().class('app grid3x3').$children([_Box.default]);

exports.default = _default;
},{"../Framework/Framework":"Framework/Framework.js","./Box":"components/Box.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _App = _interopRequireDefault(require("./components/App"));

var _Framework = require("./Framework/Framework");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_Framework.Renderer.render(_App.default, 'app'); // import Framework from './Framework/Framework'
// import App from './components/App'
// import StateConfig from './StateConfig'
// // render into the div with id='app'
// Framework.init(App, 'app', StateConfig)
},{"./components/App":"components/App.js","./Framework/Framework":"Framework/Framework.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "49743" + '/');

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