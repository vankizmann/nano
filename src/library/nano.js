import Arr from "./source/utility/array";
export { Arr };

import Obj from "./source/utility/object";
export { Obj };

import Num from "./source/utility/number";
export { Num };

import Str from "./source/utility/string";
export { Str };

import Any from "./source/utility/any";
export { Any };

import Dom from "./source/utility/dom";
export { Dom };

import Ajax from "./source/component/ajax";
export { Ajax };

import Asset from "./source/component/asset";
export { Asset };

import Auth from "./source/component/auth";
export { Auth };

import Data from "./source/component/data";
export { Data };

import Element from "./source/component/element";
export { Element };

import Event from "./source/component/event";
export { Event };

import Extension from "./source/component/extension";
export { Extension };

import Locale from "./source/component/locale";
export { Locale };

import Queue from "./source/component/queue";
export { Queue };

import Route from "./source/component/route";
export { Route };

let UUID = require('uuid/v1');
export { UUID };


export function Nano() {

    this.Arr = Arr;
    this.Obj =  Obj;
    this.Num =  Num;
    this.Str =  Str;
    this.Any =  Any;
    this.Dom =  Dom;

    this.Ajax =  Ajax;
    this.Asset =  Asset;
    this.Auth =  Auth;
    this.Data =  Data;
    this.Element =  Element;
    this.Event =  Event;
    this.Extension =  Extension;
    this.Locale =  Locale;
    this.Queue =  Queue;
    this.Route =  Route;

    this.UUID = UUID;

    this.extends = (extend) => {
        Any.keys(extend).forEach((key) => this[key] = extend[key]);
    };

    this.install = (target) => {
        Any.keys(this).forEach((key) => target[key] = this[key]);
    };

    return this;
}

export default Nano;