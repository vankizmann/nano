import { UUID, Num, Obj, Any, Locale } from "../../../../index";

export default {

    name: 'NInput',

    props: {

        value: {
            default()
            {
                return null;
            }
        },

        icon: {
            default()
            {
                return '';
            },
            type: [String]
        },

        iconDisabled: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        defaultValue: {
            default()
            {
                return '';
            },
            type: [String]
        },

        size: {
            default()
            {
                return 'default';
            },
            type: [String]
        },

        nativeType: {
            default()
            {
                return 'text';
            },
            type: [String]
        },

        disabled: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        placeholder: {
            default()
            {
                return '';
            },
            type: [String]
        }

    },

    watch: {

        value(value)
        {
            // if ( value === null || value ===  undefined ) {
            //     return this.$emit('input', this.defaultValue);
            // }

            this.nativeValue = value;
        }

    },

    methods: {

    },

    data()
    {
        return {
            nativeValue: this.value || this.defaultValue
        };
    },

    render(h)
    {
        let className = [
            'n-input', 'n-input--' + this.size
        ];

        if ( this.disabled === true ) {
            className.push('n-input--disabled');
        }

        if ( Any.isEmpty(this.icon) === false ) {
            className.push('n-input--icon');
        }

        let props = {
            value: this.nativeValue
        };

        let domProps = {
            value: this.nativeValue,
            type: this.nativeType,
            disabled: this.disabled,
            placeholder: this.placeholder
        };

        let events = Obj.assign({}, this.$listeners, {
            input: (event) => this.$emit('input', event.target.value)
        });

        let element = h('input', {
            class: className, props: props, domProps: domProps, on: events
        });

        let icon = null;

        if ( Any.isEmpty(this.icon) === false ) {
            icon = (
                <NButton type="input" disabled={this.iconDisabled} vOn:click={() => this.$emit('icon-click')}>
                    <span class={this.icon}></span>
                </NButton>
            );
        }

        return <div class={['n-input__wrapper', this.disabled && 'n-disabled']}>
            { [element, icon] }
        </div>;
    }

}
