import ResizeObserver from 'resize-observer-polyfill';

import Arr from './array';
import Obj from './object';
import Str from './string';
import Num from './number';
import Any from './any';

export class Dom
{
    el = null;

    static events = [];

    constructor(el)
    {
        if ( el instanceof NodeList ) {
            el = Array.prototype.slice.call(el);
        }

        this.el = el;
    }

    static ready(callback, delay = 0, count = 0)
    {
        let ready = document.readyState !== 'loading';

        if ( delay === 0 && (ready === false || count < delay) ) {
            Dom.find(document).on('DOMContentLoaded', callback);
            return this;
        }

        if ( delay !== 0 && (ready === false || count < delay) ) {
            setTimeout(() => Dom.ready(callback, delay, count + 100), 100);
            return this;
        }

        callback();

        return this;
    }

    static complete(callback, delay = 0, count = 0)
    {
        let ready = document.readyState === 'complete';

        if ( delay === 0 && (ready === false || count < delay) ) {
            Dom.find(document).on('DOMContentLoaded', callback);
            return this;
        }

        if ( delay !== 0 && (ready === false || count < delay) ) {
            setTimeout(() => Dom.ready(callback, delay, count + 100), 100);
            return this;
        }

        callback();

        return this;
    }

    static find(element)
    {
        let el = typeof element !== 'string' ?
            element : document.querySelectorAll(element);

        return new Dom(el);
    }

    static make(element, options = {})
    {
        let el = typeof element !== 'string' ?
            element : document.createElement(element);

        Obj.assign(el, options);

        return new Dom(el);
    }

    static location(posx, posy)
    {
        let el = document.elementsFromPoint(posx, posy);

        return new Dom(el);
    }

    static title(text = null, glue = ' - ')
    {
        document.title = window.baseTitle !== undefined ?
            text + glue + window.baseTitle : text;

        return this;
    }

    static clearSelection()
    {
        if (
            window.getSelection !== undefined &&
            window.getSelection.empty !== undefined
        ) {
            window.getSelection().empty()
        }

        if (
            window.getSelection !== undefined &&
            window.getSelection.removeAllRanges !== undefined
        ) {
            window.getSelection().removeAllRanges()
        }

        if (
            window.selection !== undefined &&
            window.selection.removeAllRanges !== undefined
        ) {
            window.selection().empty()
        }

        return this;
    }

    length()
    {
        return Any.isArray(this.el) ?
            this.el.length : 0;
    }

    empty()
    {
        return this.length() === 0 || this.el === null;
    }

    visible()
    {
        return this.get(0) && this.get(0).is(':visible');
    }

    is(selector)
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) === true ) {
            return false;
        }

        if ( el instanceof Element === false ) {
            return false;
        }

        return Any.isString(selector) ?
            el.matches(selector) : el === selector;
    }

    isParent(selector)
    {
        let el = this.parent();

        if ( Any.isEmpty(el) === true ) {
            return false;
        }

        return Any.isString(selector) ?
            this.get(0).matches(selector) : this.get(0) === selector;
    }

    first(offset = 0)
    {
        let els = Any.isArray(this.el) ?
            this.el : [this.el];

        return els[offset];
    }

    last(offset = 1)
    {
        let els = Any.isArray(this.el) ?
            this.el : [this.el];

        return els[els.length - offset];
    }

    get(index = -1)
    {
        let els = Any.isArray(this.el) ?
            this.el : [this.el];

        return index !== -1 ? els[index] || null : els;
    }

    getNot(el)
    {
        for ( let node of this.el ) {
            if ( node !== el ) {
                return Dom.find(node);
            }
        }

        return null;
    }

    each(callback)
    {
        return Any.isArray(this.el) ? Arr.each(this.el, callback) :
            callback(this.el, 0);
    }

    closest(selector)
    {
        if ( Any.isString(selector) === true ) {
            return this.get(0).closest(selector) || null;
        }

        for (let el = this.get(0); el !== null; el = el.parentNode) {
            if ( el === selector ) {
                return el;
            }
        }

        return null;
    }

    contains(selector)
    {
        if ( Any.isString(selector) === true ) {
            return this.find(selector).get(0) !== null;
        }


        if ( selector instanceof Element === false ) {
            return false;
        }

        return this.get(0).contains(selector);
    }

    inside(selector)
    {
        return this.closest(selector) !== null;
    }

    parent()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) === true ) {
            return Dom.find(null);
        }

        return Dom.find(this.el.parentNode);
    }

    child(selector)
    {
        let nodes = this.get(0).childNodes;

        nodes = Array.prototype.slice.call(nodes);

        Arr.each(nodes, (node, index) => {
            if ( node.nodeType === 3 ) {
                nodes = Arr.splice(nodes, index);
            }
        });

        if ( selector === null ) {
            return Dom.find(nodes[0] || null);
        }

        Arr.each(nodes, (node, index) => {
            if ( Any.isEmpty(node) || Dom.find(node).is(selector) === false ) {
                nodes = Arr.splice(nodes, index);
            }
        });

        return Dom.find(nodes[0] || null);
    }

    childs(selector = null, filter = true)
    {
        let nodes = this.get(0).childNodes;

        nodes = Array.prototype.slice.call(nodes);

        Arr.each(nodes, (node, index) => {
            if ( node.nodeType === 3 && filter === true ) {
                nodes = Arr.splice(nodes, index);
            }
        });

        if ( selector === null ) {
            return Dom.find(nodes);
        }

        Arr.each(nodes, (node, index) => {
            if ( Any.isEmpty(node) || Dom.find(node).is(selector) === false ) {
                nodes = Arr.splice(nodes, index);
            }
        });

        return Dom.find(nodes);
    }

    find(selector)
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) === true ) {
            return Dom.find(null);
        }

        let nodes = el.querySelectorAll(selector);

        nodes = Array.prototype.slice.call(nodes);

        Arr.each(nodes, (node, index) => {
            if ( node.nodeType === 3 ) {
                nodes = Arr.splice(nodes, index);
            }
        });

        return Dom.find(nodes);
    }

    where(selector)
    {
        let nodes = this.get();

        Arr.each(nodes, (el, index) => {
            if ( Any.isEmpty(el) || Dom.find(el).is(selector) === false ) {
                nodes = Arr.splice(nodes, index);
            }
        });

        return Dom.find(nodes);
    }

    not(selector)
    {
        let nodes = this.get();

        Arr.each(nodes, (el, index) => {
            if ( Any.isEmpty(el) || Dom.find(el).is(selector) === true ) {
                nodes = Arr.splice(nodes, index);
            }
        });

        return Dom.find(nodes);
    }

    prepend(val)
    {
        this.each((el) => el.prepend(val));

        return this;
    }

    prependTo(el)
    {
        Dom.find(el).each((val) => val.prepend(this.el));

        return this;
    }

    append(val)
    {
        this.each((el) => el.append(val));

        return this;
    }

    appendTo(el)
    {
        Dom.find(el).each((val) => val.append(this.el));

        return this;
    }

    replace(el)
    {
        // Append node to element
        this.parent().get(0).insertBefore(el, this.get(0));

        // Remove existing element
        this.parent().get(0).removeChild(this.get(0));

        return this;
    }

    loaded(callback)
    {
        let el = this.get(0), timeout = null;

        timeout = setInterval(() => {

            if ( ! el.complete || el.naturalWidth === 0 ) {
                return;
            }

            callback(el);
            clearInterval(timeout);

        }, 100);

        return this;
    }

    bind(event, callback)
    {
        this.each((el) => el[event] = (e) => callback.call(el, e));

        return this;
    }

    unbind(event)
    {
        this.each((el) => delete el[event]);
    }

    on(event, callback, options = {}, paused = false)
    {
        if ( Any.isArray(event) === true ) {

            Arr.each(event, (e) => {
                this.on(e, callback, options);
            });

            return this;
        }

        let func = (e) => {
            callback.call(e.target, e, e.target);
        };

        let selector = null;

        this.each((el) => {

            Dom.events = Arr.push(Dom.events, {
                el, event, options, selector, paused, func
            });

            el.addEventListener(event, func, options);
        });

        return this;
    }

    live(event, selector, callback, options = {}, paused = false)
    {
        if ( Any.isArray(event) === true ) {

            Arr.each(event, (e) => {
                this.live(e, selector, callback, options);
            });

            return this;
        }

        let func = (e) => {

            let target = e.srcElement || e.target;

            if ( event.match(/^(drag|drop$)/) ) {
                target = Dom.location(e.clientX, e.clientY);
            }

            if ( ! Dom.find(target).inside(selector) ) {
                return;
            }

            callback.call(target, e, Dom.find(target).closest(selector));
        };

        this.each((el) => {

            Dom.events = Arr.push(Dom.events, {
                el, event, options, selector, paused, func
            });

            el.addEventListener(event, func, options);
        });

        return this;
    }

    one(event, callback, options = {})
    {
        this.on(event, (e) => {
            callback(e); this.off(event);
        }, options);

        return this;
    }

    fire(event)
    {
        let callback = new Event(event);

        this.each((el) => {
            el.dispatchEvent(callback);
        });

        return this;
    }

    delayed(event, callback, delay = 0, options = {})
    {
        this.on(event, Any.debounce(callback, delay), options);

        return this;
    }

    off(event, selector = null, options = {})
    {
        if ( Any.isArray(event) === true ) {

            Arr.each(event, (e) => {
                this.off(e, selector);
            });

            return this;
        }

        this.each((el) => {

            let val = Arr.find(Dom.events, {
                el, event, selector, options
            });

            if ( val === null ) {
                return;
            }

            Dom.events = Arr.remove(Dom.events, {
                el, event, selector, options
            });

            el.removeEventListener(event, val.func, val.options);
        });

        return this;
    }

    unpause(event, selector = null, options = {})
    {
        if ( Any.isArray(event) === true ) {

            Arr.each(event, (e) => {
                this.unpause(e, selector, options);
            });

            return this;
        }

        this.each((el) => {

            let val = Arr.find(Dom.events, {
                el, event, selector, options
            });

            if ( val === null ) {
                return;
            }

            val.paused = true;

            el.addEventListener(event, val.func, val.options);
        });

        return this;
    }

    pause(event, selector = null, options = {})
    {
        if ( Any.isArray(event) === true ) {

            Arr.each(event, (e) => {
                this.pause(e, selector, options);
            });

            return this;
        }

        this.each((el) => {

            let val = Arr.find(Dom.events, {
                el, event, selector, options
            });

            if ( val === null ) {
                return;
            }

            val.paused = true;

            el.removeEventListener(event, val.func, val.options);
        });

        return this;
    }

    observer(callback, initial = true)
    {
        if ( initial === true ) {
            this.each((el) => callback(el, {}));
        }

        let observer = new MutationObserver((mutation) => {
            this.each((el) => Any.throttle(callback(el, mutation), 50));
        });

        return (el, options) => {
            observer.observe(Dom.find(el).get(0), options);
        };
    }

    observerDimentions(callback, initial = true)
    {
        if ( initial === true ) {
            this.each((el) => callback(el));
        }

        let observer = new ResizeObserver(() => {
            this.each((el) => Any.debounce(callback(el), 50));
        });

        return (el) => {
            observer.observe(Dom.find(el).get(0));
        }
    }

    value(val)
    {
        this.each((el) => el.value = val);

        return this;
    }

    html(html)
    {
        this.each((el) => el.innerHTML = html);

        return this;
    }

    css(vals)
    {
        let styles = this.attr('style');

        styles = Obj.assign({}, Str.objectify(styles), Str.objectify(vals));

        this.attr('style', styles);
    }

    class(vals)
    {
        if ( Any.isString(vals) ) {
            vals = vals.split(' ');
        }

        if ( ! Any.isArray(vals) ) {
            vals = [vals];
        }

        this.attr('class', vals.join(' '));
    }

    hasClass(vals)
    {
        let cls = this.attr('class') || [];

        if ( Any.isString(vals) ) {
            vals = vals.split(' ');
        }

        if ( Any.isString(cls) ) {
            cls = cls.split(' ');
        }

        if ( ! Any.isArray(vals) ) {
            vals = [vals];
        }

        if ( ! Any.isArray(cls) ) {
            cls = [cls];
        }

        return Arr.intersect(vals, cls).length !== 0;
    }

    addClass(vals)
    {
        if ( this.length() > 1 ) {
            return this.each((el) => Dom.find(el).addClass(vals));
        }

        let cls = this.attr('class') || [];

        if ( Any.isString(vals) ) {
            vals = vals.split(' ');
        }

        if ( Any.isString(cls) ) {
            cls = cls.split(' ');
        }

        if ( ! Any.isArray(vals) ) {
            vals = [vals];
        }

        if ( ! Any.isArray(cls) ) {
            cls = [cls];
        }

        Arr.each(vals, (val) => {
            Arr.add(cls, val);
        });

        this.attr('class', cls.join(' '));
    }

    removeClass(vals)
    {
        if ( this.length() > 1 ) {
            return this.each((el) => Dom.find(el).removeClass(vals));
        }

        let cls = this.attr('class') || [];

        if ( Any.isString(vals) ) {
            vals = vals.split(' ');
        }

        if ( Any.isString(cls) ) {
            cls = cls.split(' ');
        }

        if ( ! Any.isArray(vals) ) {
            vals = [vals];
        }

        if ( ! Any.isArray(cls) ) {
            cls = [cls];
        }

        Arr.each(vals, (val) => {
            Arr.remove(cls, val);
        });

        this.attr('class', cls.join(' '));
    }

    attr(attr, val = undefined)
    {
        if ( Any.isEmpty(this.el) === true ) {
            return;
        }

        let res = this.get(0).getAttribute(attr);

        if ( val === undefined ) {
            return res;
        }

        if ( val === null ) {
            this.get(0).removeAttribute(attr);
            return res;
        }

        if ( Any.isPlain(val) ) {
            val = Str.stringify(val);
        }

        this.get(0).setAttribute(attr, val);
        return res;
    }

    actual(callback, val = null)
    {
        let style = this.attr('style');

        this.attr('style', val);

        callback.call(this.get(0), this.get(0));

        this.attr('style', style);

        return this;
    }

    offsetLeft(target = null)
    {
        if ( target === null ) {
            target = window;
        }

        target = Dom.find(target);

        let offset = 0, targetOffset = 0;

        for (let el = this.get(0); ! Any.isEmpty(el); el = el.offsetParent) {
            if ( el.offsetLeft !== undefined ) {
                offset += Num.float(el.offsetLeft);
            }
        }

        for (let el = target.get(0); ! Any.isEmpty(el); el = el.offsetParent) {
            if ( el.offsetLeft !== undefined ) {
                targetOffset += Num.float(el.offsetLeft);
            }
        }

        return offset - targetOffset;
    }

    offsetRight(target = null)
    {
        if ( target === null ) {
            target = window;
        }

        target = Dom.find(target);

        let offset = Dom.find(window).width() - this.width(),
            targetOffset = Dom.find(window).width() - target.width();

        for (let el = this.get(0); ! Any.isEmpty(el); el = el.offsetParent) {
            if ( el.offsetLeft !== undefined ) {
                offset -= Num.float(el.offsetLeft);
            }
        }

        for (let el = target.get(0); ! Any.isEmpty(el); el = el.offsetParent) {
            if ( el.offsetLeft !== undefined ) {
                targetOffset -= Num.float(el.offsetLeft);
            }
        }

        return offset - targetOffset;
    }

    offsetTop(target = null)
    {
        if ( target === null ) {
            target = window;
        }

        target = Dom.find(target);

        let offset = 0, targetOffset = 0;

        for (let el = this.get(0); ! Any.isEmpty(el); el = el.offsetParent) {
            if ( el.offsetTop !== undefined ) {
                offset += Num.float(el.offsetTop);
            }
        }

        for (let el = target.get(0); ! Any.isEmpty(el); el = el.offsetParent) {
            if ( el.offsetTop !== undefined ) {
                targetOffset += Num.float(el.offsetTop);
            }
        }

        return offset - targetOffset;
    }

    offsetBottom(target = null)
    {
        if ( target === null ) {
            target = window;
        }

        target = Dom.find(target);

        let offset = Dom.find(window).height() - this.height(),
            targetOffset = Dom.find(window).height() - target.height();

        for (let el = this.get(0); Any.isEmpty(el) === false; el = el.offsetParent) {
            if ( el.offsetTop !== undefined ) {
                offset -= Num.float(el.offsetTop);
            }
        }

        for (let el = target.get(0); Any.isEmpty(el) === false; el = el.offsetParent) {
            if ( el.offsetTop !== undefined ) {
                targetOffset -= Num.float(el.offsetTop);
            }
        }

        return offset - targetOffset;
    }

    scrollTop(val = undefined)
    {
        if ( val === undefined ) {
            return this.get(0).scrollTop;
        }

        this.each((el) => {
            el.scrollTop = val;
        });

        return this;
    }

    scrollTopGlobal()
    {
        let scrollTop = 0;

        for (let el = this.get(0); el !== null; el = el.parentNode) {
            if ( el.scrollTop !== undefined ) {
                scrollTop += el.scrollTop;
            }
        }

        return scrollTop;
    }

    scrollTopBoundry(target)
    {
        let scrollTop = 0;

        for (let el = this.get(0); el !== null; el = el.parentNode) {

            if ( Dom.find(el).is(target) ) {
                return scrollTop;
            }

            if ( el.scrollTop !== undefined ) {
                scrollTop += el.scrollTop;
            }

        }

        return scrollTop;
    }

    scrollLeft(val = undefined)
    {
        if ( val === undefined ) {
            return this.get(0).scrollLeft;
        }

        this.each((el) => {
            el.scrollLeft = val;
        });

        return this;
    }

    scrollLeftGlobal()
    {
        let scrollLeft = 0;

        for (let el = this.get(0); el !== null; el = el.parentNode) {
            if ( el.scrollLeft !== undefined ) {
                scrollLeft += el.scrollLeft;
            }
        }

        return scrollLeft;
    }

    scrollLeftBoundry(target)
    {
        let scrollLeft = 0;

        for (let el = this.get(0); el !== null; el = el.parentNode) {

            if ( Dom.find(el).is(target) ) {
                return scrollLeft;
            }

            if ( el.scrollLeft !== undefined ) {
                scrollLeft += el.scrollLeft;
            }

        }

        return scrollLeft;
    }

    height()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        if ( el === window ) {
            return el.innerHeight;
        }

        return el.offsetHeight;
    }

    innerHeight()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        let computedStyle = getComputedStyle(el);

        return this.get(0).clientHeight -
            Num.float(computedStyle.paddingTop) -
            Num.float(computedStyle.paddingBottom);
    }

    realHeight()
    {
        let height = 'auto';

        this.actual(() => height = this.height(), {
            display: 'block'
        });

        return height;
    }

    evaluateHeight(target = null, auto = true)
    {
        if ( Any.isString(target) ) {
            target = Dom.find(target);
        }

        if ( target === null ) {
            target = this.parent();
        }

        let height = 'auto';

        this.actual(() => {
            height = target.innerHeight();
        }, { display: 'none' });

        if ( auto === true ) {
            this.css({ height: height + 'px' });
        }

        return height;
    }

    width()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        if ( el === window ) {
            return el.innerWidth;
        }

        return el.offsetWidth;
    }

    innerWidth()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        let computedStyle = getComputedStyle(el);

        return this.get(0).clientWidth -
            Num.float(computedStyle.paddingLeft) -
            Num.float(computedStyle.paddingRight);
    }

    realWidth()
    {
        let width = 0;

        this.actual(() => width = this.width());

        return width;
    }

    evaluateWidth(target = null, auto = true)
    {
        if ( target === null ) {
            target = this.parent();
        }

        let width = 'auto';

        this.actual(() => {
            width = target.innerWidth();
        }, { display: 'none' });

        if ( auto === true ) {
            this.css({ width: width + 'px' });
        }

        return width;
    }

}

export default Dom;