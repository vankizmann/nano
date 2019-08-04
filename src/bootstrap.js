import { VueNano } from "./index";
export * from "./index";

if ( window !== undefined && window.Nano === undefined ) {
    window.Nano = Nano;
}

if ( window !== undefined && window.VueNano === undefined ) {
    window.VueNano = VueNano;
}

