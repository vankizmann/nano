
import ArrSource from "./library/utility/array";
import ObjSource from "./library/utility/object";
import NumSource from "./library/utility/number";
import StrSource from "./library/utility/string";
import AnySource from "./library/utility/any";
import DomSource from "./library/utility/dom";
import AjaxSource from "./library/component/ajax";
import AssetSource from "./library/component/asset";
import AuthSource from "./library/component/auth";
import DataSource from "./library/component/data";
import ElementSource from "./library/component/element";
import EventSource from "./library/component/event";
import ExtensionSource from "./library/component/extension";
import LocaleSource from "./library/component/locale";
import QueueSource from "./library/component/queue";
import RouteSource from "./library/component/route";

let UUID = require('uuid/v1');
export { UUID };

let Cookie = require('js-cookie');
export { Cookie };

export function NanoInstance() {

    this.UUID = UUID;
    this.Cookie =  Cookie;

    this.Arr = ArrSource;
    this.Obj =  ObjSource;
    this.Num =  NumSource;
    this.Str =  StrSource;
    this.Any =  AnySource;
    this.Dom =  DomSource;

    this.Ajax =  AjaxSource;
    this.Asset =  AssetSource;
    this.Auth =  AuthSource;
    this.Data =  DataSource;
    this.Element =  ElementSource;
    this.Event =  EventSource;
    this.Extension =  ExtensionSource;
    this.Locale =  LocaleSource;
    this.Queue =  QueueSource;
    this.Route =  RouteSource;

    this.extends = (extend) => {
        AnySource.keys(extend).forEach((key) => this[key] = extend[key]);
    };

    this.install = (target) => {
        AnySource.keys(this).forEach((key) => target[key] = this[key]);
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

export const Nano = new NanoInstance(scope.Nano);

if ( typeof scope.Nano === 'undefined' ) {
    scope.Nano = Nano;
}

if ( typeof scope.Vue !== 'undefined' ) {
    VueGlobal(VueNano);
}

export const Arr = scope.Nano.Arr;
export const Obj = scope.Nano.Obj;
export const Num = scope.Nano.Num;
export const Str = scope.Nano.Str;
export const Any = scope.Nano.Any;
export const Dom = scope.Nano.Dom;

export const Ajax = scope.Nano.Ajax;
export const Asset = scope.Nano.Asset;
export const Auth = scope.Nano.Auth;
export const Data = scope.Nano.Data;
export const Element = scope.Nano.Element;
export const Event = scope.Nano.Event;
export const Extension = scope.Nano.Extension;
export const Locale = scope.Nano.Locale;
export const Queue = scope.Nano.Queue;
export const Route = scope.Nano.Route;

export default scope.Nano;
