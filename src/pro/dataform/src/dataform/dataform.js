import { UUID, Num, Str, Arr, Obj, Any, Ajax, Locale, Dom, Data } from "../../../../../index";
import CtorMixin from "../../../../vue/mixins/src/ctor";

export default {

    name: 'NDataform',

    model: {
        prop: 'id'
    },

    props: {

        id: {
            required: true
        },

        use: {
            default()
            {
                return null;
            }
        },

        localized: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        layout: {
            default()
            {
                return ['copy', 'spacer', 'close', 'apply', 'save'];
            },
            type: [Array]
        },

        showQuery: {
            default()
            {
                return null;
            }
        },

        editQuery: {
            default()
            {
                return null;
            }
        },

        newTitle: {
            default()
            {
                return Locale.trans('Create');
            },
            type: [String]
        },

        editTitle: {
            default()
            {
                return Locale.trans('Edit');
            },
            type: [String]
        },

        newProp: {
            default()
            {
                return '_new';
            }
        },

        localeProp: {
            default()
            {
                return '_locale';
            }
        }

    },

    computed: {

        title()
        {
            let isNew = Obj.get(this.value, ['data', this.newProp], null);


            if ( isNew === null ) {
                return Locale.trans('Loading');
            }

            return isNew ? this.newTitle : this.editTitle;
        }

    },

    methods: {

        ...CtorMixin,

        setLoad(value, key)
        {
            let loading = Obj.set(this.loading, key, value);

            loading = Any.vals(this.loading);

            this.load = Arr.has(loading, true);
        },

        setOverride(override)
        {
            this.override = override;
        },

        queryDone(res)
        {
            this.value = res.data;
            this.errors = {};
        },

        queryClose()
        {
            this.$emit('close');
        },

        queryError(res)
        {
            this.errors = res.data.errors;
        },

        queryShow(override = {})
        {
            let query = Obj.get(this.value, 'data', {});

            query = Obj.assign(query, { id: this.id }, override);

            if ( Any.isEmpty(this.override) === false ) {
                query = Obj.assign(query, this.override);
            }

            query[this.localeProp] = this.locale;

            let options = {
                onLoad: () => this.setLoad(true, this.showQuery),
                onDone: () => this.setLoad(false, this.showQuery)
            };

            Ajax.call(this.showQuery, true, query, options)
                .then(this.queryDone);
        },

        queryApply(override = {})
        {
            let query = Obj.get(this.value, 'data', {});

            query = Obj.assign(query, { id: this.id }, override);

            if ( Any.isEmpty(this.override) === false ) {
                query = Obj.assign(query, this.override);
            }

            query[this.localeProp] = this.locale;

            let options = {
                onLoad: () => this.setLoad(true, this.editQuery),
                onDone: () => this.setLoad(false, this.editQuery)
            };

            Ajax.call(this.editQuery, true, query, options)
                .then(this.queryDone, this.queryError);
        },

        querySave(override = {})
        {
            let query = Obj.get(this.value, 'data', {});

            query = Obj.assign(query, { id: this.id }, override);

            if ( Any.isEmpty(this.override) === false ) {
                query = Obj.assign(query, this.override);
            }

            query[this.localeProp] = this.locale;

            let options = {
                onLoad: () => this.setLoad(true, this.editQuery),
                onDone: () => this.setLoad(false, this.editQuery)
            };

            Ajax.call(this.editQuery, true, query, options)
                .then(this.queryClose, this.queryError);
        },

        queryCopy(override = {})
        {
            console.log('delete');
        },

        closeForm()
        {
            this.confirm = true;
        }

    },

    provide()
    {
        return {
            NDataform: this
        };
    },

    data()
    {
        let store = Data.get('NDataform:' + this.showQuery, {});

        let defaults = {
            query: null,
            tab: 'default',
        };

        let override = {
            locale: 'en',
            override: null,
            value: null,
            errors: null,
            confirm: false,
            loading: {},
            load: false
        };

        return Obj.assign(defaults, store, override);
    },

    mounted()
    {
        if ( Any.isEmpty(this.$root.locale) === false ) {
           this.locale = this.$root.locale;
        }

        if ( this.showQuery !== null ) {
            this.queryShow();
        }
    },

    beforeDestroy()
    {
        Data.set('NDataform:' + this.showQuery, this.$data);
    },

    renderSlot(slot)
    {
        if ( Any.isEmpty(this.$slots[slot]) ) {
            return null;
        }

        return (
            <div class={'n-dataform__toolbar-' + slot}>
                { this.$slots[slot] }
            </div>
        );
    },

    renderApply()
    {
        return (
            <div class="n-dataform__toolbar-apply">
                <NButton type="success" vOn:click={() => this.queryApply()}>
                    { Locale.trans('Apply') }
                </NButton>
            </div>
        );
    },

    renderSave()
    {
        return (
            <div class="n-dataform__toolbar-save">
                <NButton type="primary" vOn:click={() => this.querySave()}>
                    { Locale.trans('Save') }
                </NButton>
            </div>
        );
    },

    renderClose()
    {
        return (
            <div class="n-dataform__toolbar-close">
                <NButton type="secondary" vOn:click={() => this.closeForm()}>
                    { Locale.trans('Close') }
                </NButton>
            </div>
        );
    },

    renderCopy()
    {
        return (
            <div class="n-dataform__toolbar-copy">
                <NButton type="warning" vOn:click={() => this.$emit('copy')}>
                    { Locale.trans('Copy') }
                </NButton>
            </div>
        );
    },

    renderNew()
    {
        return (
            <div class="n-dataform__toolbar-new">
                <NButton type="primary" vOn:click={() => this.$emit('new')}>
                    { Locale.trans('New') }
                </NButton>
            </div>
        );
    },

    renderSpacer()
    {
        return (
            <div class="n-dataform__toolbar-spacer">
                <span></span>
            </div>
        );
    },

    renderHeader()
    {

        return [
            <div class="n-dataform__title">
                <span>{ this.title }</span>
            </div>,
            this.localized === true &&
                <div class="n-dataform__locale">
                    <NSelect vModel={this.locale} vOn:input={() => this.queryShow()}>
                        {
                            Arr.each(Obj.get(this.$root, 'locales', []), (locale) => {
                                return <NSelectOption value={locale.key}>{locale.value}</NSelectOption>
                            })
                        }
                    </NSelect>
                </div>,
            <div class="n-dataform__close" vOn:click={() => this.closeForm()}>
                <span class="fa fa-times"></span>
            </div>
        ];
    },

    renderBody()
    {
        let props = {
            value: Obj.get(this.value, 'data', {}), errors: this.errors || {}
        };

        let component = this.h(this.use, {
            props: props, slots: this.$slots
        });

        return (
            <NTabs vModel={this.tab}>
                { this.use === null ? this.$scopedSlots.default(props) : component }
            </NTabs>
        );
    },

    renderFooter()
    {
        return (
            <div class="n-dataform__toolbar">
                {
                    Arr.each(this.layout, (render) => {
                        return this.ctor('render' + Str.ucfirst(render),
                            this.ctor('renderSlot'))(render);
                    })
                }
            </div>
        );
    },

    render()
    {
        this.h = h;

        return (
            <NLoader class="n-dataform" visible={this.load || Any.isNull(this.value)}>
                <div class="n-dataform__header">
                    { this.ctor('renderHeader')() }
                </div>
                <div class="n-dataform__body">
                    { this.ctor('renderBody')() }
                </div>
                <div class="n-dataform__footer">
                    { this.ctor('renderFooter')() }
                </div>
                <NConfirm type="warning" vModel={this.confirm} selector={false} vOn:confirm={() => this.$emit('close')}>
                    { Locale.trans('Close without saving?') }
                </NConfirm>
            </NLoader>
        );
    }
}
