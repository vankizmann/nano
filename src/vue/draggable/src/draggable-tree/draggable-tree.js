import { Nano } from "../../../../index";
import NDraggable from "../draggable/draggable";

let { Arr, Obj, Any } = Nano;

export default {

    name: 'NDraggableTree',

    model: {
        prop: 'items'
    },

    props: {

        items: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        defaultCascade: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        use: {
            default()
            {
                return null;
            }
        },

        depth: {
            default()
            {
                return 0;
            },
            type: [Number]
        },

        group: {
            default()
            {
                return ['default'];
            },
            type: [Array]
        },

        safezone: {
            default()
            {
                return (height) => height * 0.25;
            }
        },

        showEmpty: {
            default()
            {
                return false;
            }
        },

        itemHeight: {
            default()
            {
                return 34;
            },
            type: [Number]
        },

        uniqueProp: {
            default()
            {
                return 'id';
            }
        },

        childProp: {
            default()
            {
                return 'children';
            }
        },

        defaultExpanded: {
            default()
            {
                return [];
            }
        },

        transformDrop: {
            default()
            {
                return (item) => item;
            }
        },

        insertNode: {
            default()
            {
                return () => true;
            }
        },

        removeNode: {
            default()
            {
                return () => true;
            }
        },

        allowSelect: {
            default()
            {
                return true;
            }
        },

        allowDrag: {
            default()
            {
                return true;
            }
        },

        allowDrop: {
            default()
            {
                return true;
            }
        },

        className: {
            default()
            {
                return ['n-draggable', 'n-draggable-tree'];
            }
        }

    },

    watch: {

        cascade()
        {
            this.$emit('update:defaultCascade', this.cascade);
        }

    },

    methods: {

        renderAfter(h, value)
        {
            let key = Any.integer(value.key);

            let item = this.items[key];

            let events = {
                input: Any.throttle((input) => {
                    item[this.childProp] = input;
                }, 7),
                cascade: Any.throttle((input) => {
                    this.$emit('cascade', this.cascade = Arr.merge([value.value[this.uniqueProp]], input));
                }, 7),
                move: Any.throttle((...args) => {
                    this.$emit('move', ...args);
                }, 7)
            };

            let props = Obj.assign({}, this.$props, {
                items: item[this.childProp], depth: this.depth + 1
            });

            let visible = Arr.has(this.defaultExpanded,
                value.value[this.uniqueProp]);

            return Any.isEmpty(item[this.childProp]) === false && visible ? h('NDraggableTree', {
                key: value.value._dragid, props: props, on: events, scopedSlots: this.$scopedSlots
            }) : null;
        },

        renderDefault(h, value)
        {
            let key = Any.integer(value.key);

            let events = {
                input: Any.throttle((input) => {
                    this.items.splice(key, 1, input);
                }, 7),
                cascade: Any.throttle((input) => {
                    this.$emit('cascade', this.cascade = [input])
                }, 7),
                expand: Any.throttle((input) => {
                    Arr.toggle(this.defaultExpanded, input);
                }, 7),
            };

            return h('NDraggableTreeItem', { props: value, on: events }, [
                this.use === null ? this.$scopedSlots.default(value) :
                    h(this.use, { props: value, on: events })
            ]);
        }

    },

    provide()
    {
        return {
            NDraggableTree: this
        }
    },

    data()
    {
        return {
            cascade: this.defaultCascade
        };
    },

    render(h)
    {
        let scopedSlots = {
            default: (p) => this.renderDefault(h, p), after: (p) => this.renderAfter(h, p)
        };

        let events = {
            input: Any.throttle((...args) => {
                this.$emit('input', ...args);
            }, 7),
            move: Any.throttle((...args) => {
                this.$emit('move', ...args);
            }, 7)
        };

        let props = Obj.assign({}, this.$props, {
            use: null
        });

        return h('NDraggable', {
            props: props, on: events, scopedSlots
        });
    }

}
