import { Nano, VueNano } from "./index";

if ( window !== undefined && window.Nano === undefined ) {
    window.Nano = Nano;
}

if ( window !== undefined && window.VueNano === undefined ) {
    window.VueNano = VueNano;
}

export { VueNano, Nano };
export default Nano;