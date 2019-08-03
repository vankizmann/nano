import AuthSource from "../../source/component/auth";
import Utility from "../../utility";
import Data from "./data";

const { Arr, Obj, Any } = Utility;

export class Auth extends AuthSource
{
    static user(key = null, fallback = null)
    {
        let user = Data.get('auth.data.user', null);

        if ( key !== null ) {
            return Obj.get(user, key, fallback)
        }

        return user;
    }

    static perms(key = null, fallback = null)
    {
        let perms = Data.get('auth.data.perms', null);

        if ( key !== null ) {
            return Obj.get(perms, key, fallback)
        }

        return perms;
    }

    static can(keys, requireAll = false)
    {
        let allowed = ['login', 'error'];

        if ( Any.isString(keys) ) {
            keys = [keys];
        }

        if ( keys === undefined || Arr.intersect(keys, allowed).length ) {
            return true;
        }

        if ( this.guest() === true ) {
            return false;
        }

        keys = Arr.each(keys, (key) => {
            return 'resource.modules.' + Arr.first(key.split('.')) + '.show';
        });

        let accessPerms = 0;

        Arr.each(keys, (key) => {

            let permission = Data.get('auth.data.perms.rights.' + key);

            if ( Any.bool(permission) === false ) {
                return;
            }

            accessPerms++;
        });

        let accessConfig = 0;

        Arr.each(keys, (key) => {

            let permission = Data.get('config.data.' + key);

            if ( Any.bool(permission) === false ) {
                return;
            }

            accessConfig++;
        });

        if ( requireAll === false ) {
            return accessConfig > 0 && accessPerms > 0;
        }

        return accessConfig === keys.length && accessPerms === keys.length;
    }
}

export default Auth;
