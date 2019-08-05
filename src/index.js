let scope = window || this;

let UUID = require('uuid/v1');

import Arr from "./library/extend/utility/array";
import Obj from "./library/extend/utility/object";
import Num from "./library/extend/utility/number";
import Str from "./library/extend/utility/string";
import Any from "./library/extend/utility/any";
import Dom from "./library/extend/utility/dom";
import Ajax from "./library/extend/component/ajax";
import Asset from "./library/extend/component/asset";
import Auth from "./library/extend/component/auth";
import Data from "./library/extend/component/data";
import Element from "./library/extend/component/element";
import Event from "./library/extend/component/event";
import Extension from "./library/extend/component/extension";
import Locale from "./library/extend/component/locale";
import Queue from "./library/extend/component/queue";
import Route from "./library/extend/component/route";

export { Arr, Obj, Num, Str, Any, Dom, Ajax, Asset, Auth, Data, Element, Event, Extension, Locale, Queue, Route, UUID };

let extend = (extend) => {
    Nano.Any.keys(extend).forEach((key) => scope.Nano[key] = extend[key]);
};

export const Nano = scope.Nano = {
    Arr, Obj, Num, Str, Any, Dom, Ajax, Asset, Auth, Data, Element, Event, Extension, Locale, Queue, Route, extend
};

export function NanoInstall(obj) {
    Nano.Any.keys(scope.Nano).forEach((key) => obj[key] = scope.Nano[key]);
}

export function VueGlobal (callback) {
    if ( window !== undefined && window.Vue ) {
        callback.call({}, window.Vue);
    }
}

export function VueNano (Vue) {

    NanoInstall(Vue);
    NanoInstall(Vue.prototype);

    Vue.UUID = UUID;
    Vue.prototype.UUID = UUID;

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

VueGlobal(VueNano);

export default scope.Nano;
