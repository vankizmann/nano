import { Arr, Num, Dom, Any, Obj } from "../../../../nano-js";
import CtorMixin from "../../../mixins/src/ctor";

export default {

    name: 'NTable',

    model: {
        prop: 'items'
    },

    props: {

        items: {
            default()
            {
                return [];
            }
        },

        current: {
            default()
            {
                return null;
            }
        },

        uniqueProp: {
            default()
            {
                return '_dragid';
            },
            type: [String, Array]
        },

        itemHeight: {
            default()
            {
                return 40;
            },
            type: [Number]
        },

        adaptHeight: {
            default()
            {
                return null;
            }
        },

        defaultSelectedKeys: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        defaultSortProp: {
            default()
            {
                return 'id';
            },
            type: [String]
        },

        defaultSortDir: {
            default()
            {
                return 'desc';
            },
            type: [String]
        },

        defaultFilterProps: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        group: {
            default()
            {
                return ['default'];
            },
            type: [Array]
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

        allowDrag: {
            default()
            {
                return () => true;
            }
        },

        allowDrop: {
            default()
            {
                return () => false;
            }
        },

    },

    computed: {

        selected()
        {
            let selected = Arr.each(this.selectedKeys, (key) => {
                return Arr.find(this.items, { [this.uniqueProp]: key });
            });

            return Arr.clone(selected);
        },

        rowStyle()
        {
            return {
                height: Num.fixed(this.itemHeight) + 'px'
            };
        },

    },

    methods: {

        ...CtorMixin,

        addColumn(column)
        {
            this.columns.push(column);
        },

        getColumnEl(column)
        {
            let selector = '[data-column-id="' + column._uid + '"]';

            return Dom.find(this.$el).find(selector).get(0);
        },

        resizeColumn(event, column)
        {
            let target = Dom.find(event.target)
                .closest('.n-table__column');

            Dom.find(document).on('mousemove', Any.throttle((event) => {

                event.preventDefault();
                event.stopPropagation();

                let width = event.clientX - Dom.find(target).offsetLeft() +
                    Dom.find(target).scrollLeftGlobal();

                if ( column.width !== width ) {
                    column.setWidth(width);
                }

            }, 7), { _uid: this._uid });

            Dom.find(document).on('mouseup', () => {

                Arr.each(this.columns, (column) => {
                    this.$nextTick(column.getWidth);
                });

                Dom.find(document).off('mousemove',
                    null, { _uid: this._uid });

                Dom.find(document).off('mouseup',
                    null, { _uid: this._uid });

            }, { _uid: this._uid });
        },

        sortColumn(prop, direction = null)
        {
            let cache = this.sortDir;

            if ( cache === 'asc' && this.sortProp === prop ) {
                this.sortDir = 'desc';
            }

            if ( cache === 'desc' && this.sortProp === prop ) {
                this.sortDir = 'asc';
            }

            if ( direction !== null ) {
                this.sortDir = direction;
            }

            this.sortProp = prop;

            this.$emit('update:defaultSortDir', this.sortDir);
            this.$emit('update:defaultSortProp', this.sortProp);

            this.$emit('sort', this.sortProp, this.sortDir)
        },

        filterColumn(prop, filter)
        {
            Arr.remove(this.filterProps, {
                property: prop
            });

            Arr.push(this.filterProps, filter);

            this.$emit('update:defaultFilterProps', this.filterProps);
            this.$emit('filter', this.filterProps);
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

            Dom.find(element).observerDimentions(() => {
                this.height = Dom.find(element).height();
            })(element);
        },

        selectPrevious()
        {
            let total = this.items.length;

            if ( total === 0 ) {
                return;
            }

            let keys = Arr.each(this.items, (item) => {
                return Obj.get(item, this.uniqueProp);
            });

            if ( Any.isEmpty(this.currentKey) === true ) {
                return this.currentKey = Arr.last(keys);
            }

            let index = Arr.findIndex(keys, this.currentKey);

            if ( index === 0 ) {
                return this.currentKey = Arr.last(keys);
            }

            this.currentKey = Arr.get(keys, index - 1);
        },

        selectNext()
        {
            let total = this.items.length;

            if ( total === 0 ) {
                return;
            }

            let keys = Arr.each(this.items, (item) => {
                return Obj.get(item, this.uniqueProp);
            });

            if ( Any.isEmpty(this.currentKey) === true ) {
                return this.currentKey = Arr.first(keys);
            }

            let index = Arr.findIndex(keys, this.currentKey);

            if ( index === total - 1 ) {
                return this.currentKey = Arr.first(keys);
            }

            this.currentKey = Arr.get(keys, index + 1);
        },

        tableKeydown(event)
        {
            if ( event.keyCode === 38 || event.keyCode === 40 ) {
                event.preventDefault();
            }

            if ( event.keyCode === 38 ) {
                this.selectPrevious();
            }

            if ( event.keyCode === 40 ) {
                this.selectNext();
            }
        },

        clearSelectedKeys()
        {
            this.selectedKeys = [];
        }

    },

    watch: {

        currentKey()
        {
            let current = Arr.find(this.items, {
                [this.uniqueProp]: this.currentKey
            });

            this.$emit('update:current', current);
        },

        selectedKeys()
        {
            this.$emit('update:defaultSelectedKeys', this.selectedKeys);
        },

        visibleColumns()
        {
            Arr.each(this.columns, (column) => column.getWidth());
        }

    },

    data()
    {
        return {
            width: 0,
            height: 0,
            columns: [],
            visibleColumns: [],
            currentKey: null,
            selectedKeys: this.defaultSelectedKeys,
            sortProp: this.defaultSortProp,
            sortDir: this.defaultSortDir,
            filterProps: this.defaultFilterProps
        }
    },

    provide()
    {
        return {
            NTable: this
        };
    },

    mounted()
    {
        Dom.find(document).on('keydown',
            this.tableKeydown, { _uid: this._uid });

        Arr.each(this.columns, (column) => {
            if ( column.breakpoint <= Dom.find(this.$el).width() && column.visible ) {
                this.visibleColumns.push(column._uid);
            }
        });

        this.width = Arr.reduce(this.columns, (count, column) => {
            return count + column.width;
        }, 0);

        if ( this.adaptHeight === null ) {
            this.calculateHeight();
        }

        if ( this.adaptHeight !== null ) {
            this.$nextTick(this.bindObserver);
        }
    },

    updated()
    {
        if ( this.adaptHeight === null ) {
            this.calculateHeight();
        }
    },

    destroyed()
    {
        Dom.find(document).off('keydown',
            null, { _uid: this._uid });
    },

    renderHeadRow()
    {
        return (
            <div class="n-table__row">
                {
                    Arr.each(this.columns, (column) => {

                        if ( Arr.has(this.visibleColumns, column._uid) === false ) {
                            return null;
                        }

                        let className = [
                            'n-table__column',
                            'n-table__column--' + column.align,
                            'n-table__column--' + column.type
                        ];

                        if ( column.fixed === true ) {
                            className.push('n-table__column--fixed');
                        }

                        if ( column.resize === true && column.fixedWidth === 0 ) {
                            className.push('n-table__column--resizable');
                        }

                        let filter = Arr.find(this.filterProps, {
                            property: column.prop
                        });

                        if ( filter !== null && Any.isEmpty(filter.value) === false ) {
                            className.push('n-table__column--filtered');
                        }

                        let events = {};

                        if ( column.resize === true ) {
                            events.mousedown = (e) => this.resizeColumn(e, column);
                        }

                        let resizer = h('div', {
                            class: 'n-table__resizer', on: events
                        }, [<span></span>]);

                        return (
                            <div class={className} style={column.style} data-column-id={column._uid}>
                                { [column.$scopedSlots.label({ column: column }), resizer] }
                            </div>
                        );
                    })
                }
            </div>
        );
    },

    renderBodyRow(props)
    {
        let uniqueValue = Obj.get(props.value, this.uniqueProp);

        let className = [
            'n-table__row', 'n-table__row--' + props.key
        ];

        if ( this.currentKey === uniqueValue ) {
            className.push('n-table__row--current');
        }

        let onClick = () => {
            this.currentKey = uniqueValue;
        };

        let onDblClick = () => {
            this.$emit('row-dblclick', {
                row: props.value, key: props.key
            });
        };

        return (
            <div class={className} style={this.rowStyle} vOn:click={onClick} vOn:dblclick={onDblClick}>
                {
                    Arr.each(this.columns, (column) => {

                        if ( Arr.has(this.visibleColumns, column._uid) === false ) {
                            return null;
                        }

                        let className = [
                            'n-table__column',
                            'n-table__column--' + column.align,
                            'n-table__column--' + column.type
                        ];

                        if ( column.fixed === true ) {
                            className.push('n-table__column--fixed');
                        }

                        return (
                            <div class={className} style={column.style}>
                                { column.$scopedSlots.default({ column: column, row: props.value, key: props.key }) }
                            </div>
                        );
                    })
                }
            </div>
        );
    },

    render()
    {
        let scopedSlots = {
            default: (props) => {
                return this.ctor('renderBodyRow')(props);
            }
        };

        let emptySlot = (
            <div class="n-draggable__empty n-table__empty" slot="empty">
                { this.$slots.empty }
            </div>
        );

        let props = {
            items: this.items,
            selected: this.selected,
            itemHeight: this.itemHeight,
            group: this.group,
            insertNode: this.insertNode,
            removeNode: this.removeNode,
            allowDrag: this.allowDrag,
            allowDrop: this.allowDrop,
        };

        let events = {

            'input': () => {
                this.selectedKeys = [];
            },

            'update:selected': (selected) => {
                this.selectedKeys = Arr.each(selected,
                    (item) => item[this.uniqueProp]);
            }

        };

        let style = {
            height: this.height + 'px'
        };

        return (
            <div class="n-table">
                <NCheckboxGroup vModel={this.selectedKeys}>
                    <div ref="wrapper" class="n-table-wrapper" style={style}>
                        <div ref="head" class="n-table__head">
                            { this.ctor('renderHeadRow')() }
                        </div>
                        <NPopover trigger="context" boundry={this.$refs.wrapper}>
                            <NCheckboxGroup vModel={this.visibleColumns}>
                                {
                                    Arr.each(this.columns, (column) => {
                                        return <NCheckbox size="small" value={column._uid}>{ column.label }</NCheckbox>;
                                    })
                                }
                            </NCheckboxGroup>
                        </NPopover>
                        <div ref="body" class="n-table__body">
                            {
                                h('NDraggable', { props: props, on: events, scopedSlots }, [
                                    this.$slots.empty && emptySlot
                                ])
                            }
                        </div>
                        { this.$slots.default }
                    </div>
                </NCheckboxGroup>
            </div>
        );
    }

}
