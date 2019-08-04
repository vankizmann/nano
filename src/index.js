if ( window === undefined ) {
    window = this;
}

let UUID = require('uuid/v1');
export { UUID };

import Utility from "./library/utility";
export * from "./library/utility";

import Component from "./library/component";
export * from "./library/component";

export function install(obj) {
    Nano.Any.keys(Nano).forEach((key) => obj[key] = Nano[key]);
}

export function VueGlobal (callback) {
    if ( window !== undefined && window.Vue ) {
        callback.call({}, window.Vue);
    }
}

export function VueNano (Vue) {

    install(Vue);
    install(Vue.prototype);

    Vue.UUID = UUID;
    Vue.prototype.UUID = UUID;

    Vue.ready = Nano.Dom.ready;
    Vue.prototype.ready = Nano.Dom.ready;

    Vue.trans = Nano.Locale.trans;
    Vue.prototype.trans = Nano.Locale.trans;

    Vue.choice = Nano.Locale.choice;
    Vue.prototype.choice = Nano.Locale.choice;

    require("./vue/bootstrap");
    // require("./pro/bootstrap");

    return Vue;
}

export const Nano = {
    ...Utility, ...Component
};

// import ReadyElement from './element/ready';
// Nano.Element.alias('ready', ReadyElement);
//
// import MenuElement from './element/menu';
// Nano.Element.alias('menu', MenuElement);
//
// import ResizerElement from './element/resizer';
// Nano.Element.alias('resizer', ResizerElement);

if ( window !== undefined ) {
    window.Nano = Nano;
}

export default Nano;
