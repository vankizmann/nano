import { Any, Arr } from "../index"

export class Num
{
    static int(num)
    {
        return ! Any.isString(num) ? parseInt(num) :
            parseInt(num.replace('px', ''));
    }

    static float(num)
    {
        return ! Any.isString(num) ? parseFloat(num) :
            parseFloat(num.replace('px', ''));
    }

    static ceil(num)
    {
        return Math.ceil(num);
    }

    static round(num)
    {
        return Math.round(num);
    }

    static floor(num)
    {
        return Math.floor(num);
    }

    static fixed(num, fixed = 2)
    {
        return this.float(num).toFixed(fixed);
    }

    static matrix(num, limit = 10, base = [])
    {
        let value = 0;

        for ( let i = 20; i >= 0; i-- ) {
            if ( num >= (value = Math.pow(2, i)) ) {
                base.push(value); num -= value;
            }
        }

        return base;
    }

    static combine(arr)
    {
        return Arr.reduce(arr, (acc, val) => acc + val, 0);
    }
}

export default Num;
