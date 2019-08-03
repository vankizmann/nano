import { Obj, Dom } from "../index";

export default class Ready
{
    el = null;

    options = {
        selector: '.js__resizable',
        resizeMode: 'horizontal',
        baseName: 'js__resizer',
        readyModifier: 'ready'
    };

    constructor(el, options)
    {
        this.el = el;
        this.options = Obj.assign(this.options, options);
    }

    bind()
    {
        Dom.find(this.el).find(this.options.selector).each((el) => {
            this.createResizers(el);
        });
    }

    createResizers(el)
    {
        let resizer = Dom.make('div');

        resizer.class([
            this.options.baseName, this.getModeClass()
        ]);

        let unbindCallback = () => {

            Dom.find(document.body)
                .removeClass(this.getModeClass());

            Dom.find(document.body).off('mousemove');
            Dom.find(document.body).off('selectstart');
        };

        resizer.on('mousedown', (e) => {

            if ( e.which !== 1 ) {
                return;
            }

            e.stopPropagation();
            e.preventDefault();

            Dom.find(document.body)
                .addClass(this.getModeClass());

            this.resizeElement(e, el);

            Dom.find(document.body).on('selectstart', (e) => {
                e.preventDefault();
            });

            Dom.find(document.body).on('mousemove', (e) => {
                this.resizeElement(e, el);
            });

            Dom.find(window).on('mouseup', unbindCallback);

        });

        resizer.appendTo(el);
    }

    resizeElement(event, el)
    {
        if ( this.options.resizeMode === 'horizontal' ) {

            let pos = Dom.find(el).attr('ui-resizer-pos') || 'right';

            let width = pos === 'right' ?
                (Dom.find(el).offsetLeft() * -1) + event.clientX :
                (Dom.find(el).offsetRight() * -1) + (window.outerWidth - event.clientX);

            Dom.find(el).css({ width: width + 'px' });
        }

        if ( this.options.resizeMode === 'vertical' ) {

            let pos = Dom.find(el).attr('ui-resizer-pos') || 'bottom';

            let height = pos === 'bottom' ?
                (Dom.find(el).offsetTop() * -1) + event.clientY :
                (Dom.find(el).offsetBottom() * -1) + (window.outerHeight - event.clientY);

            Dom.find(el).css({ height: height + 'px' });
        }
    }

    getModeClass()
    {
        return this.options.baseName + '--' + this.options.resizeMode;
    }

}
