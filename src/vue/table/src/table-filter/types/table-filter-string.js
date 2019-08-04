import { Any, Locale } from "../../../../../index";
import TableFilter from "../table-filter";

export default {

    name: 'NTableFilterString',

    extends: TableFilter,

    methods: {

        resetFilter()
        {
            this.value = null;
            this.operator = 'li';
        }

    },

    data()
    {
        let defaults = {
            property: this.column.filterProp, type: this.column.type, value: null, operator: 'li'
        };

        return this.getFilterProps(defaults);
    },

    renderForm()
    {
        return <NForm vModel={this.$data} vOn:change={Any.debounce(this.changeFilter)}>
            <NFormItem>
                <NInput size="small" vModel={this.value}/>
            </NFormItem>
            <NFormItem>
                <NSelect size="small" vModel={this.operator}>
                    <NSelectOption value="li" label={Locale.trans('Includes value')} />
                    <NSelectOption value="nl" label={Locale.trans('Excludes value')} />
                    <NSelectOption value="eq" label={Locale.trans('Equal value')} />
                    <NSelectOption value="ne" label={Locale.trans('Except value')} />
                </NSelect>
            </NFormItem>
        </NForm>;
    }

}
