import { Nano } from "../../../../index";

let { Obj, Any, Dom } = Nano;

export default {

    name: 'NPopover',

    model: {
        prop: 'visible'
    },

    props: {

        visible: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        disabled: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        selector: {
            default()
            {
                return null;
            },
        },

        boundry: {
            default()
            {
                return document.body;
            },
        },

        trigger: {
            default()
            {
                return 'hover';
            },
            type: [String]
        },

        type: {
            default()
            {
                return 'default';
            },
            type: [String]
        },

        position: {
            default()
            {
                return 'bottom-center';
            },
            type: [String]
        },

        closeInside: {
            default()
            {
                return true;
            },
            type: [Boolean]
        }

    },

    computed: {

        parent()
        {
            return this.node.parentNode;
        },

        element()
        {
            if ( this.selector === null ) {
                return (this.node).previousElementSibling;
            }

            return Dom.find(this.node).parent().find(this.selector).get(0);
        },

        style()
        {
            let style = {};

            if ( this.node === null ) {
                return { display: 'none' };
            }

            let clientX = Dom.find(this.element).offsetLeft(this.parent);

            if ( this.trigger === 'context' ) {
                clientX = this.clientX + Dom.find(this.parent).scrollLeft();
            }

            let clientY = Dom.find(this.element).offsetTop(this.parent);

            if ( this.trigger === 'context' ) {
                clientY = this.clientY + Dom.find(this.parent).scrollTop();
            }

            let height = this.trigger === 'context' ? 0 :
                Dom.find(this.element).height();

            let width = this.trigger === 'context' ? 0 :
                Dom.find(this.element).width();

            let nodeWidth = Dom.find(this.node).realWidth();
            let nodeHeight = Dom.find(this.node).realHeight();

            let parentWidth = Dom.find(this.parent).scrollWidth();
            let parentHeight = Dom.find(this.parent).scrollHeight();

            if ( this.position.match(/^top-(start|center|end)$/) ) {
                style.bottom = clientY;
            }

            if ( this.position.match(/^bottom-(start|center|end)$/) ) {
                style.top = clientY + height;
            }

            if ( this.position.match(/^(top|bottom)-start$/) ) {
                style.left = clientX;
            }

            if ( this.position.match(/^(top|bottom)-end$/) ) {
                style.left = clientX + width - nodeWidth;
            }

            if ( this.position.match(/^(top|bottom)-center$/) ) {
                style.left = clientX + (width / 2) - (nodeWidth / 2);
            }

            if ( this.position.match(/^left-(start|center|end)$/) ) {
                style.left = clientX;
            }

            if ( this.position.match(/^right-(start|center|end)$/) ) {
                style.left = clientX + width;
            }

            if ( this.position.match(/^(left|right)-start$/) ) {
                style.top = clientY;
            }

            if ( this.position.match(/^(left|right)-end$/) ) {
                style.top = clientY + height - nodeHeight;
            }

            if ( this.position.match(/^(left|right)-center$/) ) {
                style.top = clientY + (height / 2) - (nodeHeight / 2);
            }

            let pseudo = Obj.map(Obj.clone(style), (prop) => prop + 'px');

            Dom.find(this.node).actual((el) => {

                let offsetTop = Dom.find(el).offsetTop(this.boundry);

                if ( offsetTop < 0 ) {
                    pseudo.top = (style.top - offsetTop) + 'px';
                }

                if ( offsetTop + nodeHeight > parentHeight ) {
                    pseudo.top = (parentHeight - nodeHeight) + 'px';
                }

                let offsetBottom = Dom.find(el).offsetBottom(this.boundry);

                if ( offsetBottom < 0 ) {
                    pseudo.bottom = (style.bottom + offsetBottom) + 'px';
                }

                if ( offsetBottom + nodeHeight > parentHeight ) {
                    pseudo.bottom = (parentHeight - nodeHeight) + 'px';
                }

                let offsetLeft = Dom.find(el).offsetLeft(this.boundry);

                if ( offsetLeft < 0 ) {
                    pseudo.left = (style.left - offsetLeft) + 'px';
                }

                if ( offsetLeft + nodeWidth > parentWidth ) {
                    pseudo.left = (parentWidth - nodeWidth) + 'px';
                }

                let offsetRight = Dom.find(el).offsetRight(this.boundry);

                if ( offsetRight < 0 ) {
                    pseudo.left = (style.left + offsetRight) + 'px';
                }

                if ( offsetRight + nodeWidth > parentWidth ) {
                    pseudo.right = (parentWidth - nodeWidth) + 'px';
                }

            }, pseudo);

            if ( this.nativeVisible === false && this.visible === false ) {
                pseudo.display = 'none';
            }

            return pseudo;
        }

    },

    watch: {

        visible()
        {
            if ( ! Any.isEqual(this.nativeVisible, this.visible) ) {
                this.nativeVisible = this.visible;
            }
        },

        nativeVisible()
        {
            if ( this.nativeVisible === true ) {

                Any.delay(() => {
                    Dom.find(this.node).addClass('n-modal--open');
                });

                Dom.find(this.element).addClass('n-popover--open');
            }

            if ( this.nativeVisible === false ) {
                Dom.find(this.element).removeClass('n-popover--open');
            }
        }

    },

    methods: {


        clickTrigger(event, target)
        {
            if ( ! Dom.find(target).inside(this.parent) && this.nativeVisible === false ) {
                return;
            }

            if ( this.trigger !== 'click' || this.disabled === true ) {
                return;
            }

            let final = Dom.find(target).closest(this.element),
                popover = Dom.find(target).closest(this.node);

            let visible = popover !== null ||
                (final !== null && this.nativeVisible === false);

            if ( visible === true && final !== null && event.which !== 1 ) {
                visible = false;
            }

            if ( this.closeInside === false && final !== null ) {
                visible = true;
            }

            if ( visible === true && this.nativeVisible === true ) {
                return;
            }

            if ( visible === false && this.nativeVisible === false ) {
                return;
            }

            this.$emit('input', this.nativeVisible = visible);
        },

        hoverTrigger(event, target)
        {
            if ( ! Dom.find(target).inside(this.parent) && this.nativeVisible === false ) {
                return;
            }

            if ( this.trigger !== 'hover' || this.disabled === true ) {
                return;
            }

            let final = Dom.find(target).closest(this.element),
                popover = Dom.find(target).closest(this.node);


            let visible = final !== null || popover !== null;

            if ( visible === true && this.nativeVisible === true ) {
                return;
            }

            if ( visible === false && this.nativeVisible === false ) {
                return;
            }

            this.$emit('input', this.nativeVisible = visible);
        },

        contextTrigger(event, target)
        {
            if ( ! Dom.find(target).inside(this.parent) && this.nativeVisible === false ) {
                return;
            }

            if ( this.trigger !== 'context' || this.disabled === true ) {
                return;
            }

            let final = Dom.find(target).closest(this.element),
                popover = Dom.find(target).closest(this.node);

            let visible = popover !== null ||
                (final !== null && this.nativeVisible === false);

            if ( visible === true && final !== null && event.which !== 3 ) {
                visible = false;
            }

            if ( this.closeInside === false && final !== null ) {
                visible = true;
            }

            if ( visible === true && this.nativeVisible === true ) {
                return;
            }

            if ( visible === false && this.nativeVisible === false ) {
                return;
            }

            this.clientX = event.clientX;
            this.clientY = event.clientY;

            this.$emit('input', this.nativeVisible = visible);
        },

        contextPrevent(event, target)
        {
            if ( this.trigger !== 'context' ) {
                return;
            }

            if ( Dom.find(target).closest(this.node) ) {
                event.preventDefault();
            }

            if ( Dom.find(target).closest(this.element) ) {
                event.preventDefault();
            }
        }

    },

    data()
    {
        return {
            node: null, nativeVisible: this.visible, clientX: 0, clientY: 0
        };
    },

    mounted()
    {
        Dom.find(document).on('mousedown',
            Any.throttle(this.clickTrigger, 150), { _uid: this._uid });

        Dom.find(document).on('mousemove',
            Any.debounce(this.hoverTrigger, 150), { _uid: this._uid });

        Dom.find(document).on('mousedown',
            Any.throttle(this.contextTrigger, 150), { _uid: this._uid });

        Dom.find(document).on('contextmenu',
            Any.throttle(this.contextPrevent, 150), { _uid: this._uid });

        this.node = this.$el;
    },

    destroyed()
    {
        Dom.find(document).off('mousedown',
            null, { _uid: this._uid });

        Dom.find(document).off('mousemove',
            null, { _uid: this._uid });

        Dom.find(document).off('contextmenu',
            null, { _uid: this._uid });
    },

    render()
    {
        let className = [
            'n-popover',
            'n-popover--' + this.type,
            'n-popover--' + this.position
        ];

        return (
            <div class={className} style={this.style}>
                { this.$slots.raw ||
                    <div class="n-popover__frame">
                        { this.$slots.header &&
                            <div class="n-popover__header">
                                {this.$slots.header}
                            </div>
                        }
                        <div class="n-popover__body">
                            {this.$slots.default}
                        </div>
                        { this.$slots.footer &&
                            <div class="n-popover__footer">
                                {this.$slots.footer}
                            </div>
                        }
                    </div>
                }
            </div>
        );
    }

}
