import { Arr, Obj } from "../../../nano-js";

export default {

    ctor(key, fallback = null)
    {
        let ctor = Obj.get(this.$vnode.componentOptions.Ctor,
            Arr.merge(['extendOptions'], key.split('.')), -1);

        if ( ctor === -1 ) {
            ctor = Obj.get(this.$vnode.componentOptions.Ctor,
                Arr.merge(['options'], key.split('.')), -1);
        }

        if ( ctor === -1 ) {
            ctor = fallback;
        }

        if ( typeof ctor !== 'function' ) {
            return ctor;
        }

        return (...args) => ctor.apply(this, args);
    }

}
