import DataSource from "../../source/component/data";
import Utility from "../../utility";

const { Arr, Any } = Utility;

export class Data extends DataSource
{
    static domain(key, fallback = null)
    {
        let domains = Data.get('domains.data', fallback);

        return Arr.find(domains, { type: key }, fallback);
    }

    static domains(key, fallback = [])
    {
        let domains = Data.get('domains.data', fallback);

        return Arr.filter(domains, { type: key }) || fallback;
    }

    static config(key, fallback = null)
    {
        return Data.get('config.data.' + (Any.isArray(key)  ?
            key.join('.') : key), fallback);
    }

    static pagetypes(key, fallback = null)
    {
        return Data.config('resource.modules.article.pagetypes.' + (Any.isArray(key)  ?
            key.join('.') : key), fallback);
    }

    static article(key, fallback = null)
    {
        return Data.get('article.data.' + (Any.isArray(key)  ?
            key.join('.') : key), fallback);
    }

    static find(input, value, fallback = null)
    {
        let key = Arr.first(input) + '.data';

        return super.find(key, value, fallback)
    }
}

export default Data;
