import CtorMixin from "../../../../vue/mixins/src/ctor";
import { Nano } from "../../../../index";

let { Str, Arr, Obj, Any, Dom, Ajax, Data, Event, Locale } = Nano;

export default {

    name: 'NDatatable',

    props: {

        current: {
            default()
            {
                return null;
            }
        },

        indexQuery: {
            default()
            {
                return null;
            }
        },

        deleteQuery: {
            default()
            {
                return null;
            }
        },

        importQuery: {
            default()
            {
                return null;
            }
        },

        exportUrl: {
            default()
            {
                return null;
            }
        },

        updateEvents: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        showNew: {
            default()
            {
                return true;
            },
            type: [Boolean]
        },

        showDelete: {
            default()
            {
                return true;
            },
            type: [Boolean]
        },

        localeProp: {
            default()
            {
                return '_locale';
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

        defaultPage: {
            default()
            {
                return 1;
            },
            type: [Number]
        },

        defaultLimit: {
            default()
            {
                return 100;
            },
            type: [Number]
        },

        defaultSortProp: {
            default()
            {
                return 'modified';
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

        layout: {
            default()
            {
                return [
                    'search', 'new', 'delete', 'import', 'custom', 'spacer', 'reset', 'refresh'
                ];
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

        sort()
        {
            return [
                { property: this.sortProp, direction: this.sortDir }
            ];
        },

        filter()
        {
            return Arr.filter(this.filterProps, (filter) => {
                return Any.isEmpty(filter.value) === false;
            });
        }

    },

    methods: {

        ...CtorMixin,

        bindObserver()
        {
            let element = this.$el.parentNode;

            if ( this.adaptHeight !== true ) {
                element = this.adaptHeight;
            }

            Dom.find(element).observerDimentions(() => {
                this.height = Dom.find(element).innerHeight();
            })(element);
        },

        queryDone(res)
        {
            if ( this.$refs.table ) {
                this.$refs.table.clearSelectedKeys();
            }

            this.value = res.data;
        },

        queryIndex(override = {})
        {
            let query = Obj.assign({}, this.query || {});

            if ( Any.isEmpty(this.$root.locale) === false ) {
                query[this.localeProp] = this.$root.locale;
            }

            query[this.localeProp] = this.locale;

            this.query = Obj.assign(query, {
                search: this.search,
                sort: this.sort,
                filter: this.filter,
                page: this.page,
                limit: this.limit
            }, override);

            let options = {
                onLoad: () => this.load = true,
                onDone: () => this.load = false
            };

            Ajax.call(this.indexQuery, true, query, options)
                .then(this.queryDone);
        },

        queryDelete(override = {})
        {
            let query = {
                ids: this.selectedKeys.join(',')
            };

            query = Obj.assign(query, { [this.localeProp]: this.locale }, override);

            let options = {
                onLoad: () => this.load = true,
                onDone: () => this.load = false
            };

            Ajax.call(this.deleteQuery, false, query, options)
                .then(() => this.queryIndex());
        },

        restoreIndex()
        {
            this.value = Data.get(this.indexQuery);
        },

        resetFilters()
        {
            this.$refs.table.$emit('reset');
        },

        deleteItems(keys = null)
        {
            if ( keys !== null ) {
                this.selectedKeys = keys;
            }

            this.confirm = true;
        }

    },

    data()
    {
        let store = Data.get('NDatatable:' + this.indexQuery, {});

        let defaults = {
            query: null,
            locale: 'en',
            search: '',
            currentKey: null,
            selectedKeys: [],
            page: this.defaultPage,
            limit: this.defaultLimit,
            sortProp: this.defaultSortProp,
            sortDir: this.defaultSortDir,
            filterProps: this.defaultFilterProps
        };

        let override = {
            value: null,
            height: null,
            load: false,
            confirm: false,
        };

        return Obj.assign(defaults, store, override);
    },

    mounted()
    {
        console.log(Ajax.apis, this.Ajax.apis, Nano.Ajax.apis);

        if ( Any.isEmpty(this.$root.locale) === false ) {
            this.locale = this.$root.locale;
        }

        if ( this.adaptHeight !== null ) {
            this.$nextTick(this.bindObserver);
        }

        Event.bind(this.updateEvents,
            this.queryIndex, { _uid: this._uid });

        this.$refs.table.$on('sort',
            Any.debounce(() => this.queryIndex(), 250));

        this.$refs.table.$on('filter',
            Any.debounce(() => this.queryIndex(), 250));

        this.$refs.paginator.$on('paginate',
            Any.debounce(() => this.queryIndex(), 250));


        Any.delay(this.ctor('delayedMount'));
    },

    delayedMount()
    {
        this.value = Data.get(this.indexQuery, null);

        if ( this.value === null ) {
            this.queryIndex();
        }

        this.$watch('search',
            Any.debounce(() => this.queryIndex(), 500));
    },

    beforeDestroy()
    {
        Data.set('NDatatable:' + this.indexQuery, this.$data);
    },

    destroyed()
    {
        Event.unbind(this.updateEvents, { _uid: this._uid });
    },

    renderSlot(slot)
    {
        if ( Any.isEmpty(this.$slots[slot]) ) {
            return null;
        }

        return (
            <div class={'n-datatable__toolbar-' + slot}>
                { this.$slots[slot] }
            </div>
        );
    },

    renderSearch()
    {
        return (
            <div class="n-datatable__toolbar-search">
                <NInput vModel={this.search} placeholder={Locale.trans('Search')} iconDisabled={this.search === ''} vOn:icon-click={() => this.search = ''} icon="fa fa-times" />
            </div>
        );
    },

    renderNew()
    {
        if ( this.showNew !== true ) {
            return null;
        }

        return (
            <div class="n-datatable__toolbar-new">
                <NButton icon="fa fa-file" vOn:click={() => this.$emit('new-click')}>
                    { Locale.trans('New') }
                </NButton>
            </div>
        );
    },

    renderDelete()
    {
        if ( this.showDelete !== true ) {
            return null;
        }

        return (
            <div class="n-datatable__toolbar-delete">
                <NButton type="danger" icon="fa fa-trash" disabled={this.selectedKeys.length === 0} vOn:click={() => this.deleteItems()}>
                    { Locale.trans('Remove') }
                </NButton>
            </div>
        );
    },

    renderRefresh()
    {
        return (
            <div class="n-datatable__toolbar-refresh">
                <NButton icon="fa fa-sync" outline={true} vOn:click={() => this.queryIndex()} />
            </div>
        );
    },

    renderReset()
    {
        return (
            <div class="n-datatable__toolbar-reset">
                <NButton icon="fa fa-eraser" disabled={! this.$refs.table ||this.filter.length === 0} vOn:click={this.resetFilters}>
                    { Locale.trans('Reset filter') }
                </NButton>
            </div>
        );
    },

    renderImport()
    {
        if ( ! this.importQuery && ! this.exportUrl ) {
            return null;
        }

        return (
            <div class="n-datatable__toolbar-import">
                <NButtonGroup>
                    { this.importQuery !== null &&
                        [
                            <NButton type="secondary" icon="fa fa-cloud-upload">
                                { Locale.trans('Import') }
                            </NButton>,
                            <NModal width="33%" title={Locale.trans('Import')}>
                                <NForm>
                                    <NFormItem label={Locale.trans('File')}>
                                        <NFile></NFile>
                                    </NFormItem>
                                </NForm>
                                <NButton slot="footer">
                                    { Locale.trans('Import file') }
                                </NButton>
                            </NModal>
                        ]
                    }
                    { this.exportUrl !== null &&
                        <NButton type="secondary" icon="fa fa-cloud-download" vOn:click={() => window.open(this.exportUrl)}>
                            {Locale.trans('Export')}
                        </NButton>
                    }
                </NButtonGroup>

            </div>
        );
    },

    renderSpacer()
    {
        return (
            <div class="n-datatable__toolbar-spacer">
                <span></span>
            </div>
        );
    },

    renderHeader()
    {
        return (
            <div class="n-datatable__toolbar">
                {
                    Arr.each(this.layout, (render) => {
                        return this.ctor('render' + Str.ucfirst(render),
                            this.ctor('renderSlot'))(render);
                    })
                }
            </div>
        );
    },

    renderBody()
    {
        let events = Obj.assign({}, this.$listeners, {
            'update:current': (value) => this.$emit('update:current', value),
            'update:defaultSelectedKeys': (value) => this.selectedKeys = value,
            'update:defaultSortProp': (value) => this.sortProp = value,
            'update:defaultSortDir': (value) => this.sortDir = value,
            'update:defaultFilterProps': (value) => this.filterProps = value,
        });

        let props = {
            group: this.group,
            uniqueProp: this.uniqueProp,
            insertNode: this.insertNode,
            removeNode: this.removeNode,
            allowDrag: this.allowDrag,
            allowDrop: this.allowDrop,
            adaptHeight: true,
            itemHeight: this.itemHeight,
            defaultSortProp: this.sortProp,
            defaultSortDir: this.sortDir,
            defaultFilterProps: this.filterProps,
            defaultSelectedKeys: this.selectedKeys,
        };

        return <NTable ref="table" items={Obj.get(this.value, 'data', [])} props={props} on={events}>
            { this.$slots.default }
            <NTableColumn type="actions" label={Locale.trans('Actions')} fixed-width={90}>
                {
                    (props) => {

                        let unique = Obj.get(props.row, this.uniqueProp);

                        let editButtonProps = {
                            size: 'small',
                            type: 'primary',
                            outline: true,
                            icon: 'fa fa-edit'
                        };

                        let editButton = (
                            <NButton props={editButtonProps} vOn:click={() => this.$emit('row-dblclick', props)}></NButton>
                        );

                        let deleteButtonProps = {
                            size: 'small',
                            type: 'danger',
                            outline: true,
                            icon: 'fa fa-trash'
                        };

                        let deleteButton = (
                            <NButton props={deleteButtonProps} vOn:click={() => this.deleteItems([unique])}></NButton>
                        );

                        return [editButton, deleteButton];
                    }
                }
            </NTableColumn>
        </NTable>;
    },

    renderFooter()
    {
        let events = Obj.assign({}, this.$listeners, {
            'update:page': (value) => this.page = value,
            'update:limit': (value) => this.limit = value
        });

        return <NPaginator ref="paginator" page={this.page} limit={this.limit} total={Obj.get(this.value, 'total', 0)} on={events} />
    },

    render()
    {
        this.h = h;

        let style = {};

        if ( Any.isNull(this.height) === false ) {
            style.height = this.height + 'px';
        }

        return <NLoader class="n-datatable" visible={this.load || Any.isNull(this.value)} style={style}>
            <div class="n-datatable__header">
                { this.ctor('renderHeader')() }
            </div>
            <div class="n-datatable__body">
                { this.ctor('renderBody')() }
            </div>
            <div class="n-datatable__footer">
                { this.ctor('renderFooter')() }
            </div>
            <NConfirm vModel={this.confirm} selector={false} type="danger" vOn:confirm={() => this.queryDelete()}>
                { Locale.choice('Do you really want to delete :count item?|Do you really want to delete :count items?', this.selectedKeys.length) }
            </NConfirm>
        </NLoader>;
    }
}
