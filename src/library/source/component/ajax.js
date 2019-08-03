import Utility from "../../utility";
import Data from "./data";
import Event from "./event";

const { Arr, Obj, Any } = Utility;

export class Ajax
{
    static apis = {};

    static has(input)
    {
        return Arr.has(this.apis, Arr.first(input));
    }

    static bind (input, api)
    {
        Ajax.apis[Arr.first(input)] = api;

        return this;
    }

    static solve(input, vars = {}, options = {})
    {
        let handler = window.axios || window.Vue.http;

        return Ajax.apis[Arr.first(input)](handler, vars, options);
    }

    static call (input, store = false, vars = {}, options = {})
    {
        let call = (resolve, reject) => {
            return this.solve(input, vars, options).then((res) => {

                if ( store === true ) {
                    Data.set(Arr.second(input), res.data);
                }

                Event.fire(Arr.first(input));

                return resolve(res);
            }, reject);
        };

        return new Promise(call);
    }

    static form (obj)
    {
        let form = new FormData();

        let appendField = (values, keys = []) => {
            Obj.each(values, (value, index) => {

                let inner = Arr.merge([], keys, index);

                if ( Any.isPlain(value) ) {
                    return appendField(value, inner);
                }

                if ( Any.isArray(value) ) {
                    return appendField(value, inner);
                }

                let key = inner.splice(0, 1)[0];

                Arr.each(inner, (index) => {
                    key += '[' + index + ']';
                });

                if ( value !== null ) {
                    form.append(key, value);
                }
            });

            return form;
        };

        return appendField(obj);
    }

}

export default Ajax;
