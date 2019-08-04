import { UUID, Num, Obj, Any, Locale, Arr } from "../../../../nano-js";
import CtorMixin from "../../../../vue/mixins/src/ctor";

export default {

    name: 'NMatrixColumn',

    model: {
        prop: 'visible'
    },

    inject: {

        NMatrix: {
            default: undefined
        }

    },

    props: {

        value: {
            default()
            {
                return null;
            }
        },

        disabled: {
            default()
            {
                return false;
            }
        },

        label: {
            default()
            {
                return null;
            }
        }

    },

    methods: {

        ...CtorMixin

    },

    mounted()
    {
        this.NMatrix.addColumn(this);
    },

    renderLabel()
    {
        return this.label;
    },

    renderBody(props)
    {
        let key = Arr.findIndex(this.NMatrix.columns, {
            _uid: this._uid
        });

        let value = Num.int(this.value) || Math.pow(2, key);

        let events = {
            input: () => this.NMatrix.changeRow(props.row, value)
        };

        let disabled = typeof this.disabled === 'function' ?
            this.disabled : () => this.disabled;

        return (
            <NCheckbox checked={this.NMatrix.isChecked(props.row, value)} disabled={disabled(props.row)} on={events} />
        );
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
