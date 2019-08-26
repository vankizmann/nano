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
        let el = null;

        if ( document.elementsFromPoint !== undefined ) {
            el = document.elementsFromPoint(posx, posy);
        }

        if ( document.msElementsFromPoint !== undefined ) {
            el = document.msElementsFromPoint(posx, posy);
        }

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
        if ( this.empty() === true ) {
            return null;
        }

        if ( Any.isString(selector) === true ) {
            console.log(this.get(0));
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

    previous()
    {
        return Dom.find(this.get(0).previousElementSibling);
    }

    next()
    {
        return Dom.find(this.get(0).nextElementSibling);
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

    loopParent(callback, target = document.body)
    {
        for (let el = this.get(0); ! Any.isEmpty(el); el = el.parentNode) {

            if ( Dom.find(el).is(target) === true ) {
                return true;
            }

            callback.call({}, el);
        }

        return false;
    }

    loopOffsetParent(callback, target = document.body)
    {
        for (let el = this.get(0); ! Any.isEmpty(el); el = el.offsetParent) {

            if ( Dom.find(el).is(target) === true ) {
                return true;
            }

            callback.call({}, el);
        }

        return false;
    }

    offset(key = null, boundry = null)
    {
        let source = {
            top: 0, left: 0, bottom: 0, right: 0
        };

        this.loopOffsetParent((el) => {

            if ( el.offsetTop ) {
                source.top += Num.float(el.offsetTop);
            }

            if ( el.offsetLeft ) {
                source.left += Num.float(el.offsetLeft);
            }

        });

        source.bottom = Dom.find(document.body).scrollHeight() -
            source.top - this.height();

        source.right = Dom.find(document.body).scrollWidth() -
            source.left - this.width();

        let target = {
            top: 0, left: 0, bottom: 0, right: 0
        };

        Dom.find(boundry).loopOffsetParent((el) => {

            if ( el.offsetTop ) {
                target.top += Num.float(el.offsetTop);
            }

            if ( el.offsetLeft ) {
                target.left += Num.float(el.offsetLeft);
            }

        });

        target.bottom = Dom.find(document.body).scrollHeight() -
            target.top - Dom.find(boundry).scrollHeight();

        target.right = Dom.find(document.body).scrollWidth() -
            target.left - Dom.find(boundry).scrollHeight();

        let offset = {
            top: source.top - target.top,
            bottom: source.bottom - target.bottom,
            left: source.left - target.left,
            right: source.right - target.right
        };

        return key !== null ? Obj.get(offset, key, 0) : offset;
    }

    offsetTop(boundry = null)
    {
        return this.offset('top', boundry);
    }

    offsetBottom(boundry = null)
    {
        return this.offset('bottom', boundry);
    }

    offsetLeft(boundry = null)
    {
        return this.offset('left', boundry);
    }

    offsetRight(boundry = null)
    {
        return this.offset('right', boundry);
    }

    scroll(key = null, boundry = null)
    {
        let source = {
            top: 0, left: 0
        };

        this.loopParent((el) => {

            if (el !== window ) {
                source.top += Num.float(el.scrollTop);
            }

            if ( el === window ) {
                source.top += Num.float(el.pageYOffset);
            }

            if ( el !== window ) {
                source.left += Num.float(el.scrollLeft);
            }

            if ( el === window ) {
                source.left += Num.float(el.pageXOffset);
            }

        });

        let target = {
            top: 0, left: 0
        };

        Dom.find(boundry).loopParent((el) => {

            if ( el !== window ) {
                target.top += Num.float(el.scrollTop);
            }

            if ( el === window ) {
                target.top += Num.float(el.pageYOffset);
            }

            if ( el !== window ) {
                target.left += Num.float(el.scrollLeft);
            }

            if ( el === window ) {
                target.left += Num.float(el.pageXOffset);
            }

        });

        let win = {
            top: (window.pageYOffset || window.scrollTop || 0),
            left: (window.pageXOffset || window.scrollLeft || 0)
        };

        let scroll = {
            top: (source.top + win.top) - (target.top - win.top),
            left: (source.left + win.left) - (target.left - win.left)
        };

        return key !== null ? Obj.get(scroll, key, 0) : scroll;
    }

    scrollTop(val = null, boundry = null)
    {
        if ( val === null ) {
            return this.scroll('top', boundry);
        }

        this.each((el) => el.scrollTop = val);

        return this;
    }

    scrollTopGlobal()
    {
        return this.scroll('top', document.body);
    }

    scrollLeft(val = null, boundry = null)
    {
        if ( val === null ) {
            return this.scroll('left', boundry);
        }

        this.each((el) => el.scrollLeft = val);

        return this;
    }

    scrollLeftGlobal()
    {
        return this.scroll('left', document.body);
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

    clientHeight()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        return Any.integer(getComputedStyle(el, null)
            .height.replace("px", ""));
    }

    scrollHeight()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        return el.scrollHeight;
    }

    innerHeight()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        let computedStyle = getComputedStyle(el);

        return this.clientHeight() -
            Num.float(computedStyle.paddingTop) -
            Num.float(computedStyle.paddingBottom);
    }

    realHeight(styles = {})
    {
        let height = 'auto';

        this.actual(() => height = this.height(), styles);

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

    clientWidth()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        return Any.integer(getComputedStyle(el, null)
            .width.replace("px", ""));
    }

    scrollWidth()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        return el.scrollWidth;
    }

    innerWidth()
    {
        let el = this.get(0);

        if ( Any.isEmpty(el) ) {
            return 0;
        }

        let computedStyle = getComputedStyle(el);

        return this.clientWidth() -
            Num.float(computedStyle.paddingLeft) -
            Num.float(computedStyle.paddingRight);
    }

    realWidth(styles = {})
    {
        let width = 0;

        this.actual(() => width = this.width(), styles);

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
