let UUID = require('uuid/v1');
export { UUID };

import Utility from "./library/utility";
export * from "./library/utility";

import Component from "./library/component";
export * from "./library/component";

export const Nano = {
    ...Utility, ...Component
};

export function install(obj) {
    Nano.Any.keys(Nano).forEach((key) => obj[key] = Nano[key]);
}

import ReadyElement from './element/ready';
Nano.Element.alias('ready', ReadyElement);

import MenuElement from './element/menu';
Nano.Element.alias('menu', MenuElement);

import ResizerElement from './element/resizer';
Nano.Element.alias('resizer', ResizerElement);

export default Nano;
