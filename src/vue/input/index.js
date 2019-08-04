import { VueGlobal } from "../../index";

import Input from './src/input/input';
VueGlobal(Vue => Vue.component(Input.name, Input));
