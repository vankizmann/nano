import Nano from "./library/nano";
export * from "./library/nano";

export function VueGlobal (callback) {
    if ( scope !== undefined && scope.Vue ) {
        callback.call(scope, scope.Vue);
    }
}

export function VueNano (Vue) {

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

let scope = {};

if (typeof global !== 'undefined') {
    scope = global;
}

if (typeof window !== 'undefined') {
    scope = window;
}

scope.Nano = new Nano(scope.Nano);

if ( typeof scope.Vue !== 'undefined' ) {
    scope.Vue.use(VueNano);
}

export default scope.Nano;
