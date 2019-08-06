
import Arr from "./library/utility/array";
import Obj from "./library/utility/object";
import Num from "./library/utility/number";
import Str from "./library/utility/string";
import Any from "./library/utility/any";
import Dom from "./library/utility/dom";

export {
    Arr, Obj, Num, Str, Any, Dom
}

import Ajax from "./library/component/ajax";
import Asset from "./library/component/asset";
import Auth from "./library/component/auth";
import Data from "./library/component/data";
import Element from "./library/component/element";
import Event from "./library/component/event";
import Extension from "./library/component/extension";
import Locale from "./library/component/locale";
import Queue from "./library/component/queue";
import Route from "./library/component/route";

export {
    Ajax, Asset, Auth, Data, Element, Event, Extension, Locale, Queue, Route
}

let UUID = require('uuid/v1');
export { UUID };

let Cookie = require('js-cookie');
export { Cookie };

export function NanoInstance() {

    this.UUID = UUID;
    this.Cookie =  Cookie;

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
    if ( typeof scope.Vue !== 'undefined' ) {
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

export const Nano = new NanoInstance;

if ( typeof scope.Nano === 'undefined' ) {
    scope.Nano = Nano;
}

import ReadyElement from './element/ready';
scope.Nano.Element.alias('ready', ReadyElement);

import MenuElement from './element/menu';
scope.Nano.Element.alias('menu', MenuElement);

import ResizerElement from './element/resizer';
scope.Nano.Element.alias('resizer', ResizerElement);

if ( typeof scope.Vue !== 'undefined' ) {
    VueNano(scope.Vue);
}

export default scope.Nano;
