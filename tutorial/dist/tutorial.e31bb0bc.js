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
})({"../Framework/Component.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Component = /*#__PURE__*/function () {
  function Component(tag) {
    _classCallCheck(this, Component);

    this.tag = tag;
    this.id = null;
    this.attributes = {};
    this.localState = {};
    this.events = {};
    this.listeners = [];

    this.children = function () {
      return [];
    };

    this.oldStyle = null;

    this.onCreate = function () {};

    this.isOld = false;

    this.rerender = function () {};
  } // a proxy is used to override the behaviour of reading and writing attributes of an object
  // for example, with a proxy we can allow the attribute of a component to be set using:
  // <component>.<property>(<value>) [e.g. div().class('button')]
  // which has the equivalent behaviour of component.attributes[property] = value (see setAttribute)


  _createClass(Component, [{
    key: "getProxy",
    value: function getProxy() {
      var component = this;
      return new Proxy(component, {
        // get is called whenever the attribute of an object is read such as in div().class or div().children
        get: function get(_, property) {
          // event, localState, listeners, children, onCreate, component are attributes reserved for special component behaviour
          // if the component attribute is not one of these, then you are setting a DOM attribute
          if (property === 'event') {
            return this.getEventSetter();
          } else if (property === 'localState') {
            return this.setLocalState;
          } else if (property === 'listeners') {
            return this.setListeners;
          } else if (property === 'children') {
            return this.setChildren;
          } else if (property === 'onCreate') {
            return this.setOnCreate;
          } else if (property === 'component') {
            return component;
          } else {
            return this.getAttributeSetter(property);
          }
        },
        getEventSetter: function getEventSetter() {
          var proxy = this;
          return new Proxy({}, {
            get: function get(_, eventName) {
              return function (handler) {
                return proxy.setEventHandler(eventName, handler);
              };
            }
          });
        },
        setEventHandler: function setEventHandler(eventName, handler) {
          component.events[eventName] = handler;
          return component.getProxy();
        },
        getAttributeSetter: function getAttributeSetter(property) {
          var _this = this;

          return function (value) {
            _this.setAttribute(property, value);

            return component.getProxy();
          };
        },
        setAttribute: function setAttribute(property, value) {
          component.attributes[property] = value;
          return component.getProxy();
        },
        setLocalState: function setLocalState(localState) {
          component.localState = new Proxy(localState, {
            set: function set(target, key, value) {
              target[key] = value;
              console.log('Local State', key, '=', value);
              component.rerender();
              return true;
            }
          });
          return component.getProxy();
        },
        setListeners: function setListeners(names) {
          component.listeners = names;
          return component.getProxy();
        },
        setChildren: function setChildren(children) {
          component.children = children;
          return component.getProxy();
        },
        setOnCreate: function setOnCreate(func) {
          component.onCreate = func;
          return component.getProxy();
        }
      });
    }
  }]);

  return Component;
}();

var _default = Component;
exports.default = _default;
},{}],"../Framework/TextComponent.js":[function(require,module,exports) {
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
},{}],"../Framework/Renderer.js":[function(require,module,exports) {
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
    var componentObject = isProxy ? component.component : component;
    var render = this.renderComponent(componentObject, id);
    var element = document.getElementById(id);
    element && element.parentNode.replaceChild(render, element);
    var renderTime = Math.round(performance.now() - t0);
    renderTime > 10 && console.log('Render took', renderTime, 'ms id:', id);
    this.runPostRenderJobs();
  },
  renderComponent: function renderComponent(component, id) {
    var _this = this;

    if (component.tag === null) return this.renderTextComponent(component); // set the attribute id, create new if doesnt exist

    if (!component.attributes) component.attributes = {};
    component.attributes.id = id;

    component.rerender = function () {
      return _this.render(component, id, false);
    };

    var element = document.createElement(component.tag);
    if (component.attributes) this.setAttributes(element, component);
    if (component.children) this.setChildren(element, component, id);
    if (component.events) this.setEventHandlers(element, component);
    if (component.onCreate) this.runOnCreate(component);
    return element;
  },
  runPostRenderJobs: function runPostRenderJobs() {
    setTimeout(function () {
      while (postRenderJobs.length !== 0) {
        postRenderJobs.pop()();
      }
    }, 0);
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

    postRenderJobs.push(function () {
      if (component.attributes.style) {
        var style = component.attributes.style;
        var styleObject = typeof style === 'function' ? style.bind(component)() : style;
        element.setAttribute('style', styleObject);
        component.oldStyle = styleObject;
      }
    });
  },
  setEventHandlers: function setEventHandlers(element, component) {
    var handlers = component.events;
    Object.keys(handlers).forEach(function (eventName) {
      var handler = component.events[eventName];
      element.addEventListener(eventName, function (e) {
        handler.bind(component)(e);
        e.stopPropagation();
        component.rerender();
      });
    });
  },
  setChildren: function setChildren(element, component, id) {
    var _this2 = this;

    var children = typeof component.children === 'function' ? component.children.bind(component)() : component.children;
    children.forEach(function (child, index) {
      var childComponent = child.component ? child.component : child;

      var childElement = _this2.renderComponent(childComponent, id + '-' + index);

      element.appendChild(childElement);
    });
  },
  runOnCreate: function runOnCreate(component) {
    postRenderJobs.push(function () {
      if (!component.isOld) {
        component.onCreate.bind(component)();
        component.rerender();
      }

      component.isOld = true;
    });
  }
};
exports.default = _default;
},{}],"../Framework/State.js":[function(require,module,exports) {
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
        console.log('Global State', key, '=', value);

        _this.updateSubscribers(key);

        return true;
      }
    });
    this.subscriptions = {};
  }

  _createClass(State, [{
    key: "subscribe",
    value: function subscribe(component, variable) {
      console.log('subscribe', component, variable);
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
},{}],"../Framework/Framework.js":[function(require,module,exports) {
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
exports.h6 = exports.h5 = exports.h4 = exports.h3 = exports.h2 = exports.h1 = exports.br = exports.div = exports.text = void 0;

var _Component = _interopRequireDefault(require("./Component.js"));

var _TextComponent = _interopRequireDefault(require("./TextComponent.js"));

var _Renderer = _interopRequireDefault(require("./Renderer.js"));

var _State = _interopRequireDefault(require("./State.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// the framework exports all the html tags
var text = function text(content) {
  return {
    component: new _TextComponent.default(content)
  };
};

exports.text = text;

var div = function div() {
  return new _Component.default('div').getProxy();
};

exports.div = div;

var br = function br() {
  return new _Component.default('br').getProxy();
};

exports.br = br;

var h1 = function h1() {
  return new _Component.default('h1').getProxy();
};

exports.h1 = h1;

var h2 = function h2() {
  return new _Component.default('h2').getProxy();
};

exports.h2 = h2;

var h3 = function h3() {
  return new _Component.default('h3').getProxy();
};

exports.h3 = h3;

var h4 = function h4() {
  return new _Component.default('h4').getProxy();
};

exports.h4 = h4;

var h5 = function h5() {
  return new _Component.default('h5').getProxy();
};

exports.h5 = h5;

var h6 = function h6() {
  return new _Component.default('h6').getProxy();
};

exports.h6 = h6;
},{"./Component.js":"../Framework/Component.js","./TextComponent.js":"../Framework/TextComponent.js","./Renderer.js":"../Framework/Renderer.js","./State.js":"../Framework/State.js"}],"components/Example1.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _default = (0, _Framework.div)().class('example');

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js"}],"components/Example2.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _default = (0, _Framework.div)().class('example').children([(0, _Framework.text)('I am a text component!')]);

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js"}],"components/Example3.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _default = (0, _Framework.div)().class('example').localState({
  text: 'I am a text component!'
}).event.click(function () {
  this.localState.text = 'I was clicked!';
}).children(function () {
  return [(0, _Framework.text)(this.localState.text)];
});

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js"}],"components/Example4.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _default = (0, _Framework.div)().class('example').localState({
  text: 'I am a text component!',
  dimensions: [200, 300]
}).style(function () {
  return "\n            height: ".concat(this.localState.dimensions[0], "px;\n            width: ").concat(this.localState.dimensions[1], "px;\n            transition: 1s;\n        ");
}).event.click(function () {
  this.localState.text = 'I was clicked!';
  this.localState.dimensions = [300, 500];
}).children(function () {
  return [(0, _Framework.text)(this.localState.text)];
});

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js"}],"components/Example5child.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _default = function _default(number) {
  return (0, _Framework.div)().children([(0, _Framework.h2)().children([(0, _Framework.text)('child ' + number)]), (0, _Framework.text)("I am a child component with prop: ".concat(number))]);
};

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js"}],"components/Example5.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _Example5child = _interopRequireDefault(require("./Example5child"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _Framework.div)().class('example').children([(0, _Example5child.default)(1), (0, _Framework.br)(), (0, _Example5child.default)(2)]);

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js","./Example5child":"components/Example5child.js"}],"components/Example6child.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _default = function _default(number) {
  return (0, _Framework.div)().localState({
    count: 0
  }).event.click(function () {
    this.localState.count++;
  }).children(function () {
    return [(0, _Framework.h2)().children([(0, _Framework.text)('child ' + number)]), (0, _Framework.text)("I have my own local state! click count: ".concat(this.localState.count, "."))];
  });
};

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js"}],"components/Example6.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _Example6child = _interopRequireDefault(require("./Example6child"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _Framework.div)().class('example').children([(0, _Example6child.default)(1), (0, _Framework.br)(), (0, _Example6child.default)(2)]);

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js","./Example6child":"components/Example6child.js"}],"components/state.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _default = new _Framework.State({
  totalCount: 0,
  incrementCount: function incrementCount(amount) {
    this.totalCount += amount;
  }
});

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js"}],"components/Example7Child.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(number) {
  return (0, _Framework.div)().localState({
    count: 0
  }).event.click(function () {
    this.localState.count++;

    _state.default.state.incrementCount(number);
  }).children(function () {
    return [(0, _Framework.h2)().children([(0, _Framework.text)('child ' + number)]), (0, _Framework.text)("I increase the total count by ".concat(number, ". click count: ").concat(this.localState.count, "."))];
  });
};

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js","./state":"components/state.js"}],"components/Example7CountDisplay.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _state = _interopRequireDefault(require("./state"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _Framework.h1)().onCreate(function () {
  _state.default.subscribe(this, 'totalCount');
}).children(function () {
  return [(0, _Framework.text)('Total count: ' + _state.default.state.totalCount)];
});

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js","./state":"components/state.js"}],"components/Example7.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Framework = require("../../Framework/Framework");

var _Example7Child = _interopRequireDefault(require("./Example7Child"));

var _Example7CountDisplay = _interopRequireDefault(require("./Example7CountDisplay"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _Framework.div)().class('example').children([_Example7CountDisplay.default, (0, _Example7Child.default)(1), (0, _Framework.br)(), (0, _Example7Child.default)(2)]);

exports.default = _default;
},{"../../Framework/Framework":"../Framework/Framework.js","./Example7Child":"components/Example7Child.js","./Example7CountDisplay":"components/Example7CountDisplay.js"}],"components/Example7ChildJSON.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = function _default(number) {
  return {
    tag: 'div',
    localState: {
      count: 0
    },
    events: {
      click: function click() {
        this.localState.count++;

        _state.default.state.incrementCount(number);
      }
    },
    children: function children() {
      return [{
        tag: 'h2',
        children: [{
          tag: null,
          text: 'child ' + number
        }]
      }, {
        tag: null,
        text: "I increase the total count by ".concat(number, ". click count: ").concat(this.localState.count, ".")
      }];
    }
  };
};

exports.default = _default;
},{"./state.js":"components/state.js"}],"components/Example7CountDisplayJSON.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _state = _interopRequireDefault(require("./state.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  tag: 'h1',
  onCreate: function onCreate() {
    _state.default.subscribe(this, 'totalCount');
  },
  children: function children() {
    return [{
      tag: null,
      text: 'Total count: ' + _state.default.state.totalCount
    }];
  }
};
exports.default = _default;
},{"./state.js":"components/state.js"}],"components/Example7JSON.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Example7ChildJSON = _interopRequireDefault(require("./Example7ChildJSON.js"));

var _Example7CountDisplayJSON = _interopRequireDefault(require("./Example7CountDisplayJSON.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  tag: 'div',
  attributes: {
    class: 'example'
  },
  children: [_Example7CountDisplayJSON.default, (0, _Example7ChildJSON.default)(1), {
    tag: 'br'
  }, (0, _Example7ChildJSON.default)(2)]
};
exports.default = _default;
},{"./Example7ChildJSON.js":"components/Example7ChildJSON.js","./Example7CountDisplayJSON.js":"components/Example7CountDisplayJSON.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _Framework = require("../Framework/Framework.js");

var _Example = _interopRequireDefault(require("./components/Example1.js"));

var _Example2 = _interopRequireDefault(require("./components/Example2.js"));

var _Example3 = _interopRequireDefault(require("./components/Example3.js"));

var _Example4 = _interopRequireDefault(require("./components/Example4.js"));

var _Example5 = _interopRequireDefault(require("./components/Example5.js"));

var _Example6 = _interopRequireDefault(require("./components/Example6.js"));

var _Example7 = _interopRequireDefault(require("./components/Example7.js"));

var _Example7JSON = _interopRequireDefault(require("./components/Example7JSON.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Renderer.render(Example1, 'app')
// Renderer.render(Example2, 'app')
// Renderer.render(Example3, 'app')
// Renderer.render(Example4, 'app')
// Renderer.render(Example5, 'app')
// Renderer.render(Example6, 'app')
_Framework.Renderer.render(_Example7.default, 'app'); // Renderer.render(Example7JSON, 'app', false)
},{"../Framework/Framework.js":"../Framework/Framework.js","./components/Example1.js":"components/Example1.js","./components/Example2.js":"components/Example2.js","./components/Example3.js":"components/Example3.js","./components/Example4.js":"components/Example4.js","./components/Example5.js":"components/Example5.js","./components/Example6.js":"components/Example6.js","./components/Example7.js":"components/Example7.js","./components/Example7JSON.js":"components/Example7JSON.js"}],"../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "51792" + '/');

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
},{}]},{},["../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/tutorial.e31bb0bc.js.map