import { install, UUID, Nano } from "./nano-js";

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

if ( window !== undefined ) {
    window.VueNano = VueNano;
}

export default VueNano;