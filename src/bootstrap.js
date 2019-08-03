import { install, VueNano } from "./index";

if ( window !== undefined ) {
    install(window);
}

if ( window !== undefined && window.Vue !== undefined ) {
    window.Vue.use(VueNano);
}