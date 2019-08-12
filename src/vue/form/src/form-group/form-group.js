import { Arr, Obj, Any, Dom } from "../../../../index";

export default {

    name: 'NFormGroup',

    inject: {

        NForm: {
            default: undefined
        }

    },

    props: {

        legend: {
            default()
            {
                return this.$slots.legend;
            },
            type: [String]
        },

        align: {
            default()
            {
                return 'vertical';
            },
            type: [String]
        },

        tooltip: {
            default()
            {
                return this.$slots.tooltip;
            },
            type: [String]
        },

        tooltipPosition: {
            default()
            {
                return 'right-center';
            },
            type: [String]
        }

    },

    render(h)
    {
        return <fieldset class={['n-form-group', 'n-form--' + this.align]}>
            { this.legend &&
                [
                    <legend class="n-form-group__legend">{ this.legend }</legend>,
                    this.tooltip && <NPopover type="tooltip" position={this.tooltipPosition}>{ this.tooltip }</NPopover>
                ]
            }
            <div class="n-form-group__body">
                { this.$slots.default }
            </div>
        </fieldset>;
    }
}
