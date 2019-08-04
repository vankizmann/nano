import { UUID, Num, Str, Arr, Obj, Any, Ajax, Locale, Dom, Data, Event } from "../../../../../nano-js";
import CtorMixin from "../../../../vue/mixins/src/ctor";

export default {

    name: 'NDatatree',

    props: {

        indexQuery: {
            default()
            {
                return null;
            }
        },

        moveQuery: {
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

        localeProp: {
            default()
            {
                return '_locale';
            }
        },

        adaptHeight: {
            default()
            {
                return null;
            }
        },

        layout: {
            default()
            {
                return ['search', 'custom', 'refresh'];
            },
            type: [Array]
        },

        use: {
            default()
            {
                return null;
            }
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
                return true;
            }
        },

        removeNode: {
            default()
            {
                return true;
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

    },

    watch: {

        cascade()
        {
            this.$emit('cascade', this.cascade);
        }

    },

    methods: {

        ...CtorMixin,

        bindObserver()
        {
            let element = this.adaptHeight !== true ?
                this.adaptHeight : this.$el.parentNode;

            Dom.find(element).observerDimentions(() => {
                this.height = Dom.find(element).height();
            })(element);
        },

        queryDone(res)
        {
            this.value = res.data;
        },

        queryIndex(override = {})
        {
            let query = Obj.assign({}, this.query || {});

            this.query = Obj.assign(query, {
                [this.localeProp]: this.locale
            }, override);

            let options = {
                onLoad: () => this.load = true,
                onDone: () => this.load = false
            };

            Ajax.call(this.indexQuery, true, query, options)
                .then(this.queryDone);
        },

        queryMove(source, target, position)
        {
            let query = {
                source_id: source, target_id: target, position: position
            };

            let options = {
                onLoad: () => this.load = true,
                onDone: () => this.load = false
            };

            Ajax.call(this.moveQuery, false, query, options)
                .then(() => {}, () => this.queryIndex());
        },

        queryDelete(override = {})
        {
            console.log('delete');
        },

        restoreIndex()
        {
            this.value = Data.get(this.indexQuery);
        },

    },

    data()
    {
        let store = Data.get('NDatatree:' + this.indexQuery, {});

        let defaults = {
            query: null,
            locale: 'en',
            search: '',
            expanded: [],
            cascade: [],
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
        if ( Any.isEmpty(this.$root.locale) === false ) {
            this.locale = this.$root.locale;
        }

        if ( this.adaptHeight !== null ) {
            this.$nextTick(this.bindObserver);
        }

        Event.bind(this.updateEvents,
            this.queryIndex, { _uid: this._uid });

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
        Data.set('NDatatree:' + this.indexQuery, this.$data);
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
            <div class={'n-datatree__toolbar-' + slot}>
                { this.$slots[slot] }
            </div>
        );
    },

    renderSearch()
    {
        return (
            <div class="n-datatree__toolbar-search">
                <NInput vModel={this.search} placeholder={Locale.trans('Search')} iconDisabled={this.search === ''} vOn:icon-click={() => this.search = ''} icon="fa fa-times" />
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

    renderSpacer()
    {
        return (
            <div class="n-datatree__toolbar-spacer">
                <span></span>
            </div>
        );
    },

    renderHeader()
    {
        return (
            <div class="n-datatree__toolbar">
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
        let events = {
            'update:defaultCascade': (value) => this.cascade = value,
            'update:defaultExpanded': (value) => this.selected = value
        };

        let props = {
            use: this.use,
            group: this.group,
            insertNode: this.insertNode,
            removeNode: this.removeNode,
            allowDrag: this.allowDrag,
            allowDrop: this.allowDrop,
            // itemHeight: this.itemHeight,
            defaultCascade: this.cascade,
            defaultExpanded: this.expanded
        };

        return <NDraggableTree ref="tree" vOn:move={this.queryMove} items={Obj.get(this.value, 'data', [])} props={props} on={events} scopedSlots={this.$scopedSlots} />;
    },

    render()
    {
        this.h = h;

        let style = {};

        if ( Any.isNull(this.height) === false ) {
            style.height = this.height + 'px';
        }

        return <NLoader class="n-datatree" visible={this.load || Any.isNull(this.value)} style={style}>
            <div class="n-datatree__header">
                { this.ctor('renderHeader')() }
            </div>
            <div class="n-datatree__body">
                { this.ctor('renderBody')() }
            </div>
        </NLoader>;
    }
}
