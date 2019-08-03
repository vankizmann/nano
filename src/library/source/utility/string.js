import Arr from "./array";
import Num from "./number";
import Any from "./any";

export class Str
{
    static regexEscape(val)
    {
        return String(val).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    static lower(val)
    {
        return String(val).toLowerCase();
    }

    static ucfirst(val)
    {
        return val.charAt(0).toUpperCase() + val.slice(1);
    }

    static has(val, search)
    {
        return this.lower(val).indexOf(this.lower(search)) !== -1;
    }


    /**
     * Parse param string to object (e.g. foo: bar; test: lorem).
     */
    static objectify(params, seperator = ';')
    {
        let parsed = {};

        if ( Any.isPlain(params) || Any.isArray(params) ) {
            return params;
        }

        if ( ! Any.isString(params) || params === '' ) {
            return parsed;
        }

        if ( params.match(/^{(.*?)}$/) ) {
            return JSON.parse(params);
        }

        let result = params.match(
            /(^|;)(\s*(.*?)\s*:\s*(".*?"|'.*?'|.*?)\s*)(?=(;|$))/g
        );

        if ( result === undefined || result === null ) {
            return parsed;
        }

        Arr.each(result, (match) => {

            // Get key and value from match
            let attribute = match.match(
                /^;?\s*(.*?)\s*:\s*(".*?"|'.*?'|.*?)\s*$/
            );

            // Skip if length does not match
            if ( attribute.length !== 3 ) {
                return;
            }

            let value = attribute[2]
                .replace(/(^["']*|["']*$)/g, '');

            if ( typeof value === 'string' && value.match(/^(null)$/i) ) {
                value = null;
            }

            if ( typeof value === 'string' && value.match(/^(true|false)$/i) ) {
                value = Any.bool(value);
            }

            if ( typeof value === 'string' && value.match(/^[0-9]+$/) ) {
                value = Num.int(value);
            }

            if ( typeof value === 'string' && value.match(/^[0-9\\.]+$/) ) {
                value = Num.float(value);
            }

            // Add to parsed
            parsed[attribute[1]] = value;
        });

        return parsed;
    }

    static stringify(val)
    {
        let res = '';

        if ( typeof val === 'object' ) {

            for ( let key of Any.keys(val) ) {
                res += String(key) + ':' + Str.stringify(val[key]);
            }

            return res;
        }

        res = String(val);

        return (res + ';');
    }
}

export default Str;
