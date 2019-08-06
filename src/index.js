
import Arr from "./library/source/utility/array";
export Arr from "./library/source/utility/array";

import Obj from "./library/source/utility/object";
export Obj from "./library/source/utility/object";

import Num from "./library/source/utility/number";
export Num from "./library/source/utility/number";

import Str from "./library/source/utility/string";
export Str from "./library/source/utility/string";

import Any from "./library/source/utility/any";
export Any from "./library/source/utility/any";

import Dom from "./library/source/utility/dom";
export Dom from "./library/source/utility/dom";

import Ajax from "./library/source/component/ajax";
export Ajax from "./library/source/component/ajax";

import Asset from "./library/source/component/asset";
export Asset from "./library/source/component/asset";

import Auth from "./library/source/component/auth";
export Auth from "./library/source/component/auth";

import Data from "./library/source/component/data";
export Data from "./library/source/component/data";

import Element from "./library/source/component/element";
export Element from "./library/source/component/element";

import Event from "./library/source/component/event";
export Event from "./library/source/component/event";

import Extension from "./library/source/component/extension";
export Extension from "./library/source/component/extension";

import Locale from "./library/source/component/locale";
export Locale from "./library/source/component/locale";

import Queue from "./library/source/component/queue";
export Queue from "./library/source/component/queue";

import Route from "./library/source/component/route";
export Route from "./library/source/component/route";

let UUID = require('uuid/v1');
export { UUID };

export function NanoInstance() {

    this.UUID = UUID;

    this.Arr = Arr;
    this.Obj =  Obj;
    this.Num =  Num;
    this.Str =  Str;
    this.Any =  Any;
    this.Dom =  Dom;

    this.Ajax =  Ajax;
    this.Asset =  Asset;
    this.Auth =  Auth;
    this.Data =  Data;
    this.Element =  Element;
    this.Event =  Event;
    this.Extension =  Extension;
    this.Locale =  Locale;
    this.Queue =  Queue;
    this.Route =  Route;

    this.extends = (extend) => {
        Any.keys(extend).forEach((key) => this[key] = extend[key]);
    };

    this.install = (target) => {
        Any.keys(this).forEach((key) => target[key] = this[key]);
    };

    return this;
}

export function VueGlobal (callback) {
    if ( scope !== undefined && scope.Vue ) {
        callback.call(scope, scope.Vue);
    }
}

function VueNano (Vue) {

    scope.Nano.install(Vue);
    scope.Nano.install(Vue.prototype);

    Vue.ready = scope.Nano.Dom.ready;
    Vue.prototype.ready = scope.Nano.Dom.ready;

    Vue.trans = scope.Nano.Locale.trans;
    Vue.prototype.trans = scope.Nano.Locale.trans;

    Vue.choice = scope.Nano.Locale.choice;
    Vue.prototype.choice = scope.Nano.Locale.choice;

    require("./vue/bootstrap");
    require("./pro/bootstrap");

    return Vue;
}

export { VueNano };

let scope = {};

if (typeof global !== 'undefined') {
    scope = global;
}

if (typeof window !== 'undefined') {
    scope = window;
}

export const Nano = new NanoInstance(scope.Nano);

console.log(Nano);

if ( typeof scope.Nano === 'undefined' ) {
    scope.Nano = Nano;
}

if ( typeof scope.Vue !== 'undefined' ) {
    scope.Vue.use(VueNano);
}

export default scope.Nano;
