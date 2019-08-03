import Utility from "../../utility";

const { Obj, Any } = Utility;

export default class Route
{
    static routes = {};

    static set (key, value)
    {
        this.routes[key] = value;
    }

    static get (key, values = null, params = null)
    {
        let route = key.match(/^https?:\/\//) ? key : this.routes[key] || key;

        Obj.each(values || {}, (value, key) => {
            route = route.replace(new RegExp('{' + key + '\\?*}', 'g'), value);
        });

        return route + (! Any.isEmpty(params) ? ('?' + $.param(params)) : '');
    }

    static goto (key, values = null, params = null)
    {
        window.location.href = this.get(key, values, params);
    }

}
