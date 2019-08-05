let scope = window || this;

let UUID = require('uuid/v1');
export { UUID };

import Utility from "./library/utility";
export * from "./library/utility";

import Component from "./library/component";
export * from "./library/component";

export const Nano = scope.Nano = {
    ...Utility, ...Component, extend: (extend) => {
        Nano.Any.keys(extend).forEach((key) => scope.Nano[key] = extend[key]);
    }
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

export function extend (extend) {
    console.log(scope.Nano, extend);
    Nano.Obj.assign(scope.Nano, extend);
}

VueGlobal(VueNano);

export default scope.Nano;
