import Arr from "./array";
import Any from "./any";

export class Obj
{
    static has(obj, key)
    {
        return this.get(obj, key, - 1) !== - 1;
    }

    static empty(obj, key)
    {
        return Any.isEmpty(this.get(obj, key, null));
    }

    static get(obj, keys, fallback = null)
    {
        if ( obj === null || obj === undefined ) {
            return fallback;
        }

        keys = (typeof keys === 'string') ?
            keys.split('.') : keys;

        if ( Any.isArray(keys) === false ) {
            keys = [keys];
        }

        let key = keys.shift();

        if ( typeof obj[key] === 'undefined' ) {
            return fallback;
        }

        if ( keys.length === 0 ) {
            return obj[key];
        }

        return this.get(obj[key], keys, fallback)
    }

    static set(obj, keys, val)
    {
        keys = (typeof keys === 'string') ?
            keys.split('.') : keys;

        let key = keys.shift();

        if ( obj[key] === undefined || obj[key] === null ) {
            obj[key] = {};
        }

        if ( keys.length === 0 ) {
            return obj[key] = val;
        }

        return this.set(obj[key], keys, val);
    }

    static unset(obj, keys)
    {
        keys = (typeof keys === 'string') ?
            keys.split('.') : keys;

        let key = keys.shift();

        if ( typeof obj[key] === 'undefined' ) {
            return obj;
        }

        if ( keys.length === 0 ) {
            delete obj[key];
            return obj;
        }

        return this.unset(obj[key], keys);
    }

    static only(obj, keys)
    {
        let result = {};

        this.each(obj, (val, key) => {
            if ( Arr.has(keys, key) === true ) {
                result[key] = val;
            }
        });

        return result;
    }

    static except(obj, keys)
    {
        let result = {};

        this.each(obj, (val, key) => {
            if ( Arr.has(keys, key) === false ) {
                result[key] = val;
            }
        });

        return result;
    }

    static includes(obj, val)
    {
        let result = true;

        for ( let key of Any.keys(obj) ) {
            if ( typeof val[key] !== 'undefined' ) {
                result = (Any.isPlain(obj[key]) || Any.isArray(obj[key]) ?
                    this.includes(obj[key], val[key]) : obj[key] === val[key]) && result;
            }
        }

        return result;
    }

    static matches(obj, val)
    {
        let result = true;

        for ( let key of Any.keys(obj) ) {
            if ( typeof val[key] !== 'undefined' ) {
                result = (Any.isObject(obj[key]) ?
                    this.matches(obj[key], val[key]) : obj[key] === val[key]) && result;
            }
        }

        return result;
    }

    static sort(obj, key)
    {
        let keys = Any.keys(obj).sort((a, b) => {
            return Any.integer(Obj.get(obj[a], key)) - Any.integer(Obj.get(obj[b], key));
        });

        let result = [];

        Arr.each(keys, (key, index) => {
            obj[key]['_key'] = key;
            result[index] = obj[key];
        });

        return result;
    }

    static filter(arr, filter)
    {
        return Obj.each(Obj.filterIndex(arr, filter), (key) => {
            return arr[key];
        });
    }

    static filterIndex(arr, filter)
    {
        return Any.keys(arr).filter((key) => {

            if ( Any.isFunction(filter) ) {
                return filter.call({}, arr[key], key);
            }

            if ( Any.isPlain(filter) ) {
                return Obj.includes(filter, arr[key]);
            }

            if ( Any.isArray(filter) ) {
                return Arr.includes(filter, arr[key]);
            }

            return filter === arr[key];
        });
    }

    static find(arr, obj, fallback = null)
    {
        return Arr.first(Obj.filter(arr, obj)) || fallback;
    }

    static findIndex(arr, obj, fallback = - 1)
    {
        return Arr.first(Obj.filterIndex(arr, obj)) || fallback;
    }

    static clone(obj)
    {
        let clone;

        if ( Any.isArray(obj) === true ) {
            return Arr.clone(obj);
        }

        if ( Any.isPlain(obj) === true ) {

            clone = {};

            for ( let key of Any.keys(obj) ) {
                clone[key] = Obj.clone(obj[key]);
            }

            return clone;
        }

        return clone || obj;
    }

    static assign(...args)
    {
        return Object.assign(...args);
    }

    static remove(obj, keys)
    {
        Arr.each(keys, (key) => delete obj[key]);

        return obj;
    }

    static each(obj, callback)
    {
        let result = {};

        if ( obj instanceof FormData ) {

            for (let [key, value] of obj.entries())
            {
                result[key] = callback(value, key);
            }

            return obj;
        }

        for ( let key of Any.keys(obj) ) {
            result[key] = callback(obj[key], key);
        }

        return result;
    }

    static map(obj, callback)
    {
        for ( let key of Any.keys(obj) ) {
            obj[key] = callback(obj[key], key);
        }

        return obj;
    }
}

export default Obj;
