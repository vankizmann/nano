import AjaxSource from "../../source/component/ajax";
import Utility from "../../utility";
import Route from "./route";

const { Arr } = Utility;

export class Ajax extends AjaxSource
{
    static rest(input, except = []) {

        let key = Arr.first(input);

        if ( ! Arr.has(except, 'index') ) {
            this.bind(key + '-index', (ajax, query, options) => {
                return ajax.get(Route.get(key + '.index', query, query), options);
            });
        }

        if ( ! Arr.has(except, 'delete') ) {
            this.bind(key + '-delete', (ajax, query, options) => {
                return ajax.delete(Route.get(key + '.delete', query), options);
            });
        }

        if ( ! Arr.has(except, 'show') ) {
            this.bind(key + '-show', (ajax, query, options) => {
                return ajax.get(Route.get(key + '.show', query), options);
            });
        }

        if ( ! Arr.has(except, 'edit') ) {
            this.bind(key + '-edit', (ajax, query, options) => {
                return ajax.post(Route.get(key + '.edit', query), query, options);
            });
        }

        return except.length;
    }
}

export default Ajax;
