import { UUID, Num, Obj, Any, Locale, Arr, Dom } from "../../../../nano-js";
import CtorMixin from "../../../../vue/mixins/src/ctor";

export default {

    name: 'NMatrix',

    props: {

        value: {
            default()
            {
                return [];
            }
        },

        items: {
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

        label: {
            default()
            {
                return Locale.trans('Structure');
            },
            type: [String]
        },

        titleProp: {
            default()
            {
                return 'title';
            },
            type: [String]
        },

        uniqueProp: {
            default()
            {
                return 'id';
            },
            type: [String]
        },

        matrixProp: {
            default()
            {
                return 'matrix';
            },
            type: [String]
        },

        childProp: {
            default()
            {
                return 'children';
            },
            type: [String]
        },

        itemHeight: {
            default()
            {
                return 30;
            }
        },

        adaptHeight: {
            default()
            {
                return null;
            }
        },

        defaultExpanded: {
            default()
            {
                return [];
            },
            type: [Array]
        },

    },

    methods: {

        ...CtorMixin,

        updateValue(value)
        {
            if ( ! Any.isEqual(value, this.nativeValue) ) {
                this.nativeValue = value;
            }
        },

        calculateHeight()
        {
            this.height = Dom.find(this.$refs.head).height() +
                Dom.find(this.$refs.body).child().height();
        },

        bindObserver()
        {
            let element = this.$el.parentNode;

            if ( this.adaptHeight !== true ) {
                element = this.adaptHeight;
            }

            if ( Any.isString(element) === true ) {
                element = Dom.find(this.$el).closest(element);
            }

            Dom.find(element).observerDimentions(() => {
                Dom.find(element).actual(() => {
                    this.height = Dom.find(element).innerHeight();
                });
            })(element);
        },

        addColumn(column)
        {
            let columns = Arr.merge(this.columns, [
                column
            ]);

            this.columns = Arr.sort(columns, '_uid');
        },

        removeColumn(column)
        {
            Arr.remove(this.columns, {
                _uid: column._uid
            });
        },

        toggleRow(row)
        {
            Arr.toggle(this.expanded, Obj.get(row, this.uniqueProp));
        },

        changeRow(row, value)
        {
            let fallback = {
                [this.uniqueProp]: Obj.get(row, this.uniqueProp),
                [this.matrixProp]: 0
            };

            let index = Arr.findIndex(this.nativeValue, {
                [this.uniqueProp]: Obj.get(row, this.uniqueProp)
            });

            if ( index === -1 ) {
                this.nativeValue.push(fallback);
            }

            let item = Arr.find(this.nativeValue, {
                [this.uniqueProp]: Obj.get(row, this.uniqueProp)
            });

            let matrix = Arr.toggle(
                Num.matrix(item[this.matrixProp]), value);

            item[this.matrixProp] = Num.combine(matrix);

            this.$emit('input', this.nativeValue);
        },

        isChecked(row, value)
        {
            let item = Arr.find(this.nativeValue, {
                [this.uniqueProp]: Obj.get(row, this.uniqueProp)
            });

            if ( item === null ) {
                return false;
            }

            let matrix = Num.matrix(item[this.matrixProp]);

            return Arr.has(matrix, value);
        }

    },

    provide()
    {
        return {
            NMatrix: this
        };
    },

    data()
    {
        return {
            height: 0,
            nativeValue: this.value,
            expanded: this.defaultExpanded,
            columns: []
        };
    },

    mounted()
    {
        if ( this.adaptHeight === null ) {
            this.calculateHeight();
        }

        if ( this.adaptHeight !== null ) {
            this.$nextTick(this.bindObserver);
        }

        this.$watch('value', this.updateValue, { deep: true });
    },

    updated()
    {
        if ( this.adaptHeight === null ) {
            this.calculateHeight();
        }
    },

    renderHeadRow()
    {
        let className = [
            'n-matrix__row'
        ];

        return (
            <div class={className}>
                <div class="n-matrix__column n-matrix__column--item">
                    { this.$slots.label || this.label }
                </div>
                {
                    Arr.each(this.columns, (column) => {
                        return (
                            <div class="n-matrix__column" data-column-id={column._uid}>
                                { column.$scopedSlots.label({ column: column }) }
                            </div>
                        );
                    })
                }
            </div>
        );
    },

    renderBodyRow(props)
    {
        let title = Obj.get(props.value, this.titleProp);

        let expanded = Arr.has(this.expanded ,
            Obj.get(props.value, this.uniqueProp));

        let renderNode = (h, value, key) => {
            return this.ctor('renderBodyRow')({ value, key });
        };

        let items = Obj.get(props.value, this.childProp, []);

        let listProps = {
            items: items, itemHeight: this.itemHeight, renderNode: renderNode
        };

        let className = [
            'n-matrix__row', 'n-matrix__row--' + props.key
        ];

        if ( expanded === true ) {
            className.push('n-matrix__row--expanded');
        }

        if ( Any.isEmpty(items) === true ) {
            className.push('n-matrix__row--empty');
        }

        let toggleRow = () => {
            this.toggleRow(props.value);
        };

        return (
            <div class="n-matrix__group">
                <div class={className}>
                    <div class="n-matrix__column n-matrix__column--item" vOn:dblclick={toggleRow}>
                        <div class="n-matrix__expand" vOn:click={toggleRow}>
                            <span class="fa fa-angle-right"></span>
                        </div>
                        <div class="n-matrix__title">
                            { this.use ? this.h(this.use, { props }) : this.$slots.title || title }
                        </div>
                    </div>
                    {
                        Arr.each(this.columns, (column) => {
                            return (
                                <div class="n-matrix__column">
                                    { column.$scopedSlots.default({ column: column, row: props.value, key: props.key }) }
                                </div>
                            );
                        })
                    }
                </div>
                { expanded === true && Any.isEmpty(items) === false &&
                    <NRenderList props={listProps} />
                }
            </div>
        );
    },

    render(h)
    {
        this.h = h;

        let renderNode = (h, value, key) => {
            return this.ctor('renderBodyRow')({ value, key });
        };

        let listProps = {
            items: this.items, itemHeight: this.itemHeight, renderNode: renderNode
        };

        let style = {
            height: this.height + 'px'
        };

        return (
            <div class="n-matrix">
                <div ref="wrapper" class="n-matrix-wrapper" style={style}>
                    <div ref="head" class="n-matrix__head">
                        { this.ctor('renderHeadRow')() }
                    </div>
                    <div ref="body" class="n-matrix__body">
                        { Any.isEmpty(this.items) === false &&
                            h('NRenderList', { props: listProps })
                        }
                    </div>
                    { this.$slots.default }
                </div>
            </div>
        );
    }
}
