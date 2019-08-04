import { UUID, Num, Obj, Any, Dom, Locale } from "../../../../nano-js";

export default {

    name: 'NModal',

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

        width: {
            default()
            {
                return '50%';
            },
            type: [String]
        },

        height: {
            default()
            {
                return 'auto';
            },
            type: [String]
        },

        title: {
            default()
            {
                return '';
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
                return 'center-center';
            },
            type: [String]
        },

        closable: {
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
            return Dom.find(this.$el || this.node).parent().get(0);
        },

        element()
        {
            if ( this.selector === null ) {
                return (this.node).previousElementSibling;
            }

            return Dom.find(this.parent).find(this.selector).get(0);
        }

    },

    watch: {

        visible()
        {
            this.nativeVisible = this.visible;
        },

        nativeVisible()
        {
            if ( this.nativeVisible === true ) {

                Any.delay(() => {
                    Dom.find(this.$el).addClass('n-modal--open');
                });

                Dom.find(this.element).addClass('n-modal--open');
            }

            if ( this.nativeVisible === false ) {
                Dom.find(this.element).removeClass('n-modal--open');
            }
        }

    },

    methods: {

        clickTrigger(event, target)
        {
            if ( ! Dom.find(target).inside(this.parent) && this.nativeVisible === false ) {
                return;
            }

            let final = Dom.find(target).closest(this.element),
                frame = Dom.find(target).closest(this.$el.childNodes[0]),
                close = Dom.find(target).closest(this.$refs.close);

            if ( Dom.find(final).hasClass('n-disabled') ) {
                return;
            }

            let visible = frame !== null ||
                (final !== null && this.nativeVisible === false);

            if ( visible === true && final !== null && event.which !== 1 ) {
                visible = false;
            }

            if ( this.closable === false && this.$el === target ) {
                visible = true;
            }

            if ( close !== null && this.closable === true ) {
                visible = false;
            }

            if ( visible === true && this.nativeVisible === true ) {
                return;
            }

            if ( visible === false && this.nativeVisible === false ) {
                return;
            }

            this.$emit('input', this.nativeVisible = visible);
        },

    },

    data()
    {
        return {
            node: null, nativeVisible: this.visible
        };
    },

    mounted()
    {
        Dom.find(document).on('mousedown',
            Any.throttle(this.clickTrigger, 150), { _uid: this._uid });

        this.node = this.$el;
    },

    destroyed()
    {
        Dom.find(document).off('mousedown',
            null, { _uid: this._uid });
    },

    render(h)
    {
        if ( this.visible === false && this.nativeVisible === false ) {
            return null;
        }

        let className = [
            'n-modal', 'n-modal--' + this.type, 'n-modal--' + this.position
        ];

        if ( this.closable === true ) {
            className.push('n-modal--closable');
        }

        let style = {
            width: this.width, height: this.height
        };

        if ( ! this.$slots.header && ! Any.isEmpty(this.title) ) {
            this.$slots.header = this.title;
        }

        return (
            <div class={className}>
                { ! this.$slots.raw &&
                    <div class="n-modal__frame" style={style}>
                        { this.$slots.header &&
                            <div class="n-modal__header">
                                { this.$slots.header }
                                { this.closable === true &&
                                    <div ref="close" class="n-modal__close">
                                        <span class="fa fa-times"></span>
                                    </div>
                                }
                            </div>
                        }
                        <div class="n-modal__body">
                            { this.$slots.default }
                        </div>
                        { this.$slots.footer &&
                            <div class="n-modal__footer">
                                { this.$slots.footer }
                            </div>
                        }
                    </div>
                }
                { this.$slots.raw &&
                    <div class="n-modal__frame" style={style}>
                        { this.$slots.raw }
                    </div>
                }
            </div>
        );
    }

}
