import CtorMixin from "../../../mixins/src/ctor";
import { Nano } from "../../../../index";

let { UUID, Num, Obj, Dom, Locale, Str } = Nano;

export default {

    name: 'NTableColumn',

    inject: {

        NTable: {
            default: undefined
        }

    },

    props: {

        prop: {
            default()
            {
                return 'id';
            },
            type: [String]
        },

        label: {
            default()
            {
                return '';
            },
            type: [String]
        },

        type: {
            default()
            {
                return 'string';
            },
            type: [String]
        },

        align: {
            default()
            {
                return 'left';
            },
            type: [String]
        },

        sort: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        filter: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        resize: {
            default()
            {
                return true;
            },
            type: [Boolean]
        },

        visible: {
            default()
            {
                return true;
            },
            type: [Boolean]
        },

        breakpoint: {
            default()
            {
                return 0;
            },
            type: [Number]
        },

        options: {
            default()
            {
                return [];
            },
            type: [Object, Array, Function]
        },

        optionsValue: {
            default()
            {
                return '$value';
            },
            type: [String]
        },

        optionsLabel: {
            default()
            {
                return '$value';
            },
            type: [String]
        },

        sortProp: {
            default()
            {
                return this.prop;
            },
            type: [String]
        },

        filterProp: {
            default()
            {
                return this.prop;
            },
            type: [String]
        },

        defaultWidth: {
            default()
            {
                return 100;
            }
        },

        fixedWidth: {
            default()
            {
                return 0;
            }
        },

        minWidth: {
            default()
            {
                return 100;
            }
        },

        maxWidth: {
            default()
            {
                return 700;
            }
        },

        emptyText: {
            default()
            {
                return Locale.trans('-');
            },
            type: [String]
        },

        trueText: {
            default()
            {
                return Locale.trans('Yes');
            },
            type: [String]
        },

        falseText: {
            default()
            {
                return Locale.trans('No');
            },
            type: [String]
        },

        datetimeFormat: {
            default()
            {
                return Locale.trans('YYYY-MM-DD hh:ii');
            },
            type: [String]
        }

    },

    computed: {

        styleBody()
        {
            let width = this.width;

            if ( this.NTable.visible !== 0 ) {
                width -= (this.NTable.visible / this.NTable.visibleColumns.length) + 1;
            }

            return {
                width: Num.fixed(width) + 'px'
            };
        },

        styleHead()
        {
            let width = this.width;

            if ( this.NTable.visible !== 0 ) {
                width -= (this.NTable.visible / this.NTable.visibleColumns.length) + 1;
            }

            return {
                width: Num.fixed(width) + 'px'
            };
        },


        fixed()
        {
            return this.fixedWidth !== 0;
        }

    },

    methods: {

        ...CtorMixin,

        sortColumn()
        {
            this.NTable.sortColumn(this.sortProp);
        },

        filterColumn(filter)
        {
            this.NTable.filterColumn(this.filterProp, filter);
        },

        getWidth()
        {
            let el = this.NTable.getColumnEl(this);

            let width = Dom.find(el).width();

            if ( width !== 0 && width === this.width ) {
                return;
            }

            this.setWidth(width);
        },

        setWidth(width)
        {
            if ( this.fixedWidth !== 0 ) {
                return this.width = this.fixedWidth;
            }

            let minWidth = Math.max(width, this.minWidth);

            if ( minWidth !== width && minWidth !== 0 ) {
                return this.width = minWidth;
            }

            let maxWidth = Math.min(width, this.maxWidth);

            if ( maxWidth !== width && maxWidth !== 0 ) {
                return this.width = maxWidth;
            }

            this.width = width;
        }

    },

    data()
    {
        return {
            width: 0
        };
    },

    created()
    {
        this.setWidth(this.defaultWidth);
    },

    beforeMount()
    {
        this.NTable.addColumn(this);
    },

    mounted()
    {
        this.NTable.$once('hook:updated', this.getWidth);
    },

    renderLabel({ column })
    {
        if ( this.type === 'selection' ) {
            return <NCheckbox key={UUID()} global={true} />;
        }

        let className = [
            'n-table-filter'
        ];

        if ( this.NTable.sortProp === this.sortProp ) {
            className.push('n-table-filter--' + this.NTable.sortDir);
        }

        return <div class={className}>

            { this.sort === true &&
                <div class="n-table-filter__sort" onClick={this.sortColumn}>
                    <span></span>
                </div>
            }

            <div class="n-table-filter__label">
                <span>{this.label}</span>
            </div>

            <NPopover class="n-popover-label" type="tooltip" trigger="hover" boundry={this.NTable.$refs.wrapper}>
                <span>{this.label}</span>
            </NPopover>

            { this.filter === true &&
                this.ctor('renderFilter')({ column })
            }

        </div>;
    },

    renderFilter({ column })
    {
        let name = 'NTableFilter' + Str.ucfirst(this.type);

        let component = this.h(name, {
            slot: 'raw', props: { column }
        });

        return [
            <div class="n-table-filter__filter">
                <span class="fa fa-angle-down"></span>
            </div>,
            <NPopover class="n-popover-filter" type="default" trigger="click" boundry={this.NTable.$refs.wrapper}>
                {component}
            </NPopover>
        ];
    },

    renderBody({ column, row, key })
    {
        let prop = Obj.get(row, this.NTable.uniqueProp);

        if ( this.type === 'selection' ) {
            return <NCheckbox key={prop} value={prop} sort={key} />;
        }

        return this.ctor('renderCell')({ column, row, key });
    },

    renderCell({ column, row, key })
    {
        let name = 'NTableCell' + Str.ucfirst(this.type);

        return this.h(name, {
            props: { column, row, key }
        });
    },

    render(h)
    {
        this.h = h;

        if ( ! this.$scopedSlots.label ) {
            this.$scopedSlots.label = this.ctor('renderLabel');
        }

        if ( ! this.$scopedSlots.default ) {
            this.$scopedSlots.default = this.ctor('renderBody');
        }

        return null;
    }

}
