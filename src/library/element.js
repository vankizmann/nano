import { Str, Dom } from "../index";

export class Element
{
    /**
     * Prefix for attribute selector.
     */
    static prefix = 'ui';

    /**
     * Bind a class on selector.
     */
    static alias(key, instance)
    {
        Dom.ready(() => {
            this.bind(key, (el, options) => new instance(el, options).bind());
        });
    }

    /**
     * Bind callback on selector.
     */
    static bind(key, callback)
    {
        let selector = this.getPrefix(key), mounted = this.getPrefix('mounted');

        let options = {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: [selector]
        };

        Dom.find(document.body).observer(() => {
            Dom.find('[' + selector + ']:not(.' + mounted + ')').each((el) => {

                // Add mounted class
                el.classList.add(mounted);

                // Add mounted class
                let attributes = el.getAttribute(selector);

                // Bind option
                callback.call({}, el, Str.objectify(attributes));
            });
        })(document.body, options);

        return this;
    }

    /**
     * Return prefix with key.
     */
    static getPrefix(key)
    {
        return key ? this.prefix + '-' + key : this.prefix;
    }

    /**
     * Set prefix to given value.
     */
    static setPrefix(prefix)
    {
        this.prefix = prefix;
    }

}

export default Element;
