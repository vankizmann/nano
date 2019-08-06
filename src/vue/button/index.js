import { VueGlobal } from "../../index";

import Button from './src/button/button';
VueGlobal(Vue => Vue.component(Button.name, Button));

import ButtonGroup from './src/button-group/button-group';
VueGlobal(Vue => Vue.component(ButtonGroup.name, ButtonGroup));
