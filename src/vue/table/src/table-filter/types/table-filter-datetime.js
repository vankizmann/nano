import { Any, Locale } from "../../../../../nano-js";
import TableFilter from "../table-filter";

export default {

    name: 'NTableFilterDatetime',

    extends: TableFilter,

    methods: {

        resetFilter()
        {
            this.value = null;
            this.operator = 'eq';
        }

    },

    data()
    {
        let defaults = {
            property: this.column.filterProp, type: this.column.type, value: null, operator: 'eq'
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
                    <NSelectOption value="eq" label={Locale.trans('Exact date')} />
                    <NSelectOption value="lt" label={Locale.trans('Before date')} />
                    <NSelectOption value="gt" label={Locale.trans('After date')} />
                </NSelect>
            </NFormItem>
        </NForm>;
    }

}
