import { Nano } from "../../../../index";

let { UUID, Str, Arr, Obj, Any, Locale } = Nano;

export default {

    name: 'NTransfer',

    props: {

        value: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        items: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        labelProp: {
            default()
            {
                return 'label';
            },
            type: [String]
        },

        uniqueProp: {
            default()
            {
                return 'id';
            },
            type: [String]
        }

    },

    computed: {

        selectedLeft()
        {
            let selected = Arr.each(this.selectedKeysLeft, (key) => {
                return Arr.find(this.valueSource, { [this.uniqueProp]: key });
            });

            return Arr.clone(selected);
        },

        selectedRight()
        {
            let selected = Arr.each(this.selectedKeysRight, (key) => {
                return Arr.find(this.value, { [this.uniqueProp]: key });
            });

            return Arr.clone(selected);
        }

    },

    data()
    {
        return {
            valueSource: [],
            valueTarget: [],
            selectedKeysLeft: [],
            selectedKeysRight: []
        };
    },

    created()
    {
        this.valueSource = Arr.filter(this.items, (item) => {

            let target = Arr.find(this.value, {
                [this.uniqueProp]: Obj.get(item, this.uniqueProp)
            });

            return target === null;
        });
    },

    render()
    {

        let renderLabel = ({ value }) => {
            return (
                <div>
                    <NCheckbox key={Obj.get(value, '_dragid')} value={Obj.get(value, this.uniqueProp)} /> { Obj.get(value, this.labelProp) }
                </div>
            );
        };

        let propsLeft = {
            selected: this.selectedLeft,
            uniqueProp: this.uniqueProp
        };

        let eventsLeft = {

            'input': () => {
                this.selectedKeysLeft = [];
                this.selectedKeysRight = [];
            },

            'update:selected': (selected) => {
                this.selectedKeysLeft = Arr.each(selected,
                    (item) => item[this.uniqueProp]);
            }

        };

        let propsRight = {
            selected: this.selectedRight,
            uniqueProp: this.uniqueProp
        };

        let eventsRight = {

            'input': () => {
                this.selectedKeysLeft = [];
                this.selectedKeysRight = [];
            },

            'update:selected': (selected) => {
                this.selectedKeysRight = Arr.each(selected,
                    (item) => item[this.uniqueProp]);
            }

        };

        let scopedSlots = {
            default: renderLabel
        };

        return (
            <div class="n-transfer">
                <div class="n-transfer__pane">
                    <NCheckboxGroup vModel={this.selectedKeysLeft}>
                        <div class="n-transfer__pane-header">
                            <NCheckbox global={true}/>
                        </div>
                        <div class="n-transfer__pane-body">
                            <NDraggable items={this.valueSource} props={propsLeft} scopedSlots={scopedSlots} on={eventsLeft} />
                        </div>
                    </NCheckboxGroup>
                </div>
                <div class="n-transfer__pane">
                    <NCheckboxGroup vModel={this.selectedKeysRight}>
                        <div class="n-transfer__pane-header">
                            <NCheckbox global={true} />
                        </div>
                        <div class="n-transfer__pane-body">
                            <NDraggable items={this.value} props={propsRight} scopedSlots={scopedSlots} on={eventsRight} />
                        </div>
                    </NCheckboxGroup>
                </div>
            </div>
        );
    }

}