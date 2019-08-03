import RouteSource from "../../source/component/route";
import Utility from "../../utility";

const { Obj, Any } = Utility;

export class Route extends RouteSource
{
    static locale = 'en';

    static setLocale(locale)
    {
        this.locale = locale.replace(/(^\/|\/$)/, '');
    }

    static getLocale()
    {
        return this.locale;
    }

    static get (key, values = null, params = null)
    {
        let route = key.match(/^https?:\/\//) ? key :
            (this.routes[key] ? '/{_locale}' + this.routes[key] : key);

        if ( values === null  || Any.isPlain(values) ) {
            values = Obj.assign({ _locale: this.getLocale() }, values);
        }

        Obj.each(values || {}, (value, key) => {
            route = route.replace(new RegExp('{' + key + '\\?*}', 'g'), value);
        });

        if ( Any.isObject(params) && params['_locale'] !== undefined ) {
            delete params._locale;
        }

        return route + (! Any.isEmpty(params) ? ('?' + $.param(params)) : '');
    }
}

export default Route;
