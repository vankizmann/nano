let UUID = require('uuid/v1');
export { UUID };

import Utility from "./library/utility";
export * from "./library/utility";

import Component from "./library/component";
export * from "./library/component";

export function install(obj) {
    Nano.Any.keys(Nano).forEach((key) => obj[key] = Nano[key]);
}

if ( window === undefined ) {
    window = this;
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
