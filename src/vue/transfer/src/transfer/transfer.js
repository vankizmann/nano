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

        sourceLabel: {
            default()
            {
                return Locale.trans('Source');
            },
            type: [String]
        },

        targetLabel: {
            default()
            {
                return Locale.trans('Target');
            },
            type: [String]
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

        selectedSource()
        {
            let selected = Arr.each(this.selectedKeysSource, (key) => {
                return Arr.find(this.valueSource, { [this.uniqueProp]: key });
            });

            return Arr.clone(selected);
        },

        selectedTarget()
        {
            let selected = Arr.each(this.selectedKeysTarget, (key) => {
                return Arr.find(this.value, { [this.uniqueProp]: key });
            });

            return Arr.clone(selected);
        }

    },

    methods: {

        moveToSource()
        {
            Arr.each(this.selectedTarget, (target) => {

                Arr.remove(this.value, {
                    [this.uniqueProp]: Obj.get(target, this.uniqueProp)
                });

                Arr.add(this.valueSource, target);
            });

            this.selectedKeysSource = [];
            this.selectedKeysTarget = [];
        },

        moveToTarget()
        {
            Arr.each(this.selectedSource, (source) => {

                Arr.remove(this.valueSource, {
                    [this.uniqueProp]: Obj.get(source, this.uniqueProp)
                });

                Arr.add(this.value, source);
            });

            this.selectedKeysSource = [];
            this.selectedKeysTarget = [];
        }

    },

    data()
    {
        return {
            valueSource: [],
            selectedKeysSource: [],
            selectedKeysTarget: []
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
                <div class="n-transfer__item">
                    <NCheckbox key={Obj.get(value, '_dragid')} value={Obj.get(value, this.uniqueProp)} /> <span class="n-transfer__item-title">{Obj.get(value, this.labelProp)}</span>
                </div>
            );
        };

        let propsSource = {
            selected: this.selectedSource,
            uniqueProp: this.uniqueProp
        };

        let eventsSource = {

            'input': () => {
                this.selectedKeysSource = [];
                this.selectedKeysTarget = [];
            },

            'update:selected': (selected) => {
                this.selectedKeysSource = Arr.each(selected,
                    (item) => item[this.uniqueProp]);
            }

        };

        let propsTarget = {
            selected: this.selectedTarget,
            uniqueProp: this.uniqueProp
        };

        let eventsTarget = {

            'input': () => {
                this.selectedKeysSource = [];
                this.selectedKeysTarget = [];
            },

            'update:selected': (selected) => {
                this.selectedKeysTarget = Arr.each(selected,
                    (item) => item[this.uniqueProp]);
            }

        };

        let scopedSlots = {
            default: this.$scopedSlots.default || renderLabel
        };

        return (
            <div class="n-transfer">
                <div class="n-transfer__pane">
                    <NCheckboxGroup vModel={this.selectedKeysSource}>
                        <div class="n-transfer__header">
                            <div class="n-transfer__item">
                                <NCheckbox global={true}/> <span class="n-transfer__item-title">{ this.sourceLabel }</span>
                            </div>
                        </div>
                        <div class="n-transfer__body">
                            <NDraggable vModel={this.valueSource} props={propsSource} scopedSlots={scopedSlots} on={eventsSource} />
                        </div>
                    </NCheckboxGroup>
                </div>
                <div class="n-transfer__controls">
                    <NButton square={true} disabled={this.selectedKeysSource.length === 0} icon="fa fa-angle-right" vOn:click={() => this.moveToTarget()} />
                    <NButton square={true} disabled={this.selectedKeysTarget.length === 0} icon="fa fa-angle-left" vOn:click={() => this.moveToSource()} />
                </div>
                <div class="n-transfer__pane">
                    <NCheckboxGroup vModel={this.selectedKeysTarget}>
                        <div class="n-transfer__header">
                            <div class="n-transfer__item">
                                <NCheckbox global={true} /> <span class="n-transfer__item-title">{ this.targetLabel }</span>
                            </div>
                        </div>
                        <div class="n-transfer__body">
                            <NDraggable vModel={this.value} props={propsTarget} scopedSlots={scopedSlots} on={eventsTarget} />
                        </div>
                    </NCheckboxGroup>
                </div>
            </div>
        );
    }

}