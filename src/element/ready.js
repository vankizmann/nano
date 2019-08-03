import { Obj, Dom } from "../index";

export default class Ready
{
    el = null;

    options = {
        duration: 500,
        delay: 1000,
        baseName: 'js__ready',
        readyModifier: 'ready'
    };

    constructor(el, options)
    {
        this.el = el;
        this.options = Obj.assign(this.options, options);
    }

    bind()
    {
        Dom.ready(this.bindAnimation.bind(this), this.options.delay);
    }

    bindAnimation()
    {
        $(this.el).addClass(this.options.baseName);

        let options = {
            duration: this.options.duration
        };

        options.complete = () => {
            $(this.el).css({ display: 'none' });
            $(this.el).addClass(this.getReadyClass());
        };

        $(this.el).css({ opacity: 1 });
        $(this.el).velocity({ opacity: 0 }, options);
    }

    getReadyClass()
    {
        return this.options.baseName + '--' + this.options.readyModifier;
    }

}
