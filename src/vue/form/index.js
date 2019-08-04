import { VueGlobal } from "../../index";

import Form from './src/form/form';
VueGlobal(Vue => Vue.component(Form.name, Form));

import FormItem from './src/form-item/form-item';
VueGlobal(Vue => Vue.component(FormItem.name, FormItem));
