import Vue from "vue";
import { UUID, Num, Arr, Obj, Any, Dom, Locale } from "../../index";

import Notifcation from './src/notification/notification';
Vue[Notifcation.alias] = Vue.prototype[Notifcation.alias] = Notifcation.handle;

console.log(Notifcation.alias, Any.keys(Vue));
