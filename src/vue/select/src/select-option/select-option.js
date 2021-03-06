import { UUID, Num, Arr, Obj, Any, Dom, Locale } from "../../../../index";

export default {

    name: 'NSelectOption',

    inject: {

        NSelect: {
            default: undefined
        }

    },

    props: {

        value: {
            default()
            {
                return '';
            }
        },

        prop: {
            default()
            {
                return '';
            },
            type: [String]
        },

        label: {
            default()
            {
                return this.$slots.default[0].text;
            },
            type: [String]
        },

        disabled: {
            default()
            {
                return false;
            },
            type: [Boolean]
        }

    },

    computed: {

        realValue()
        {
            if ( Any.isEmpty(this.prop) ) {
                return this.value;
            }

            return Obj.get(this.value, this.prop);
        }

    },

    methods: {

        change()
        {
            if ( this.disabled === false ) {
                this.NSelect.toggleOption(this.realValue);
            }
        },

        render(h, current)
        {
            let className = [
                'n-select-option'
            ];

            if ( Arr.has(this.NSelect.nativeSelected, this.realValue) ) {
                className.push('n-select-option--active');
            }

            if ( this.disabled === true ) {
                className.push('n-select-option--disabled');
            }

            if ( current === true ) {
                className.push('n-select-option--current');
            }

            return (
                <div class={className} onClick={this.change}>
                    {this.$slots.default || this.label}
                </div>
            );
        }
    },

    data()
    {
        return {
            width: 0
        };
    },

    beforeMount()
    {
        this.NSelect.addOption(this);
    },

    destroyed()
    {
        this.NSelect.removeOption(this);
    },

    render(h)
    {
        return null;
    }

}
