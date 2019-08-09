import { Arr, Obj, Any } from "../../../../index";
import CtorMixin from "../../../mixins/src/ctor";

export default {

    name: 'NCascader',

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

        cascade: {
            default()
            {
                return [];
            },
            type: [Array]
        },

        size: {
            default()
            {
                return 'default';
            },
            type: [String]
        },

        trigger: {
            default()
            {
                return 'click';
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

        valueProp: {
            default()
            {
                return 'value';
            },
            type: [String]
        },

        childProp: {
            default()
            {
                return 'childs';
            },
            type: [String]
        }

    },

    methods: {

        ...CtorMixin,

        toggleHover(cascade)
        {
            Any.debounce((value) => this.hoverCascade = value, 50, this)(cascade);
        },

        toggleOption(cascade)
        {
            cascade = Arr.filter(cascade, (item) => {
                return Any.isEmpty(item) === false;
            });

            cascade = Arr.each(cascade, (item) => {
                return Obj.get(item, this.valueProp);
            });

            if ( this.trigger !== 'click' ) {
                this.visible = false;
            }

            this.$emit('input', this.nativeCascade = cascade);
        },

        solveSelectedCascade()
        {
            let selected = [], items = this.items;

            Arr.each(this.nativeCascade, (value) => {

                let item = Arr.find(items, { [this.valueProp]: value });

                selected.push(item);

                items = Obj.get(item, this.childProp, []);
            });

            this.selectedCascade = selected;
        }

    },

    watch: {

        nativeCascade: {
            handler: 'solveSelectedCascade',
            intermediate: true
        }

    },

    data()
    {
        return {
            visible: false, timeout: null, hoverCascade: [null], nativeCascade: [], selectedCascade: []
        };
    },

    renderLabel(item, cascade = [])
    {
        let value = Obj.get(item, this.valueProp);

        let className = [
            'n-cascader-option'
        ];

        if ( Arr.has(this.nativeSelected, value) ) {
            className.push('n-cascader-option--active');
        }

       return [
           <div class={className} vOn:click={() => this.toggleOption(cascade)}>
               {Obj.get(item, this.labelProp)}
           </div>
       ]
    },

    renderChilds(item, cascade = [])
    {
        let childs = Obj.get(item, this.childProp, []);

        if ( Any.isEmpty(childs) === true ) {
            return null;
        }

        let value = Obj.get(item, this.valueProp);

        return [
            <div>
                {
                    Arr.each(childs, (child) => {

                        let subCascade = Arr.merge(Arr.clone(cascade), [child]);

                        return [
                            this.ctor('renderLabel')(child, subCascade),
                            this.ctor('renderChilds')(child, subCascade)
                        ];
                    })
                }
            </div>
        ];
    },

    render()
    {
        let className = [
            'n-cascader', 'n-cascader--' + this.size
        ];

        let displayItems = Arr.each(this.selectedCascade, (item) => {
            return Obj.get(item, this.labelProp);
        });

        return (
            <div class="n-cascader__wrapper">
                <div class={className}>
                    <div class="n-cascader__label">
                        { displayItems.join(' / ') }
                    </div>
                    <div class="n-cascader__arrow">
                        <span class="fa fa-angle-down"></span>
                    </div>
                </div>
                <NPopover vModel={this.visible} type="cascader" trigger="click" position="bottom-start">
                    {
                        Arr.each(this.hoverCascade, (hover, index) => {

                            let items = Obj.get(hover, this.childProp);

                            if ( index === 0 ) {
                                items = this.items;
                            }

                            if ( Any.isEmpty(items) === true ) {
                                return;
                            }

                            return (
                                <div class="n-cascader__options">
                                    {
                                        Arr.each(items, (item) => {

                                            let selectEvent = () => {

                                                let clone = Arr.slice(this.hoverCascade,
                                                    0, index + 1);

                                                this.toggleHover(Arr.merge(clone, [item]));
                                            };

                                            let events = {
                                                mouseup: () => {

                                                    let clone = Arr.slice(this.hoverCascade,
                                                        0, index + 1);

                                                    this.toggleOption(Arr.merge(clone, [item]));
                                                }
                                            };

                                            if ( this.trigger === 'hover' ) {
                                                events.mousemove = selectEvent;
                                            }

                                            if ( this.trigger === 'click' ) {
                                                events.mousedown = selectEvent;
                                            }

                                            let value = Obj.get(item, this.valueProp);

                                            let className = [
                                                'n-cascader-option'
                                            ];

                                            if ( Arr.has(this.nativeCascade, value) ) {
                                                className.push('n-cascader-option--active');
                                            }

                                            return (
                                                <div class={className} on={events}>
                                                    { Obj.get(item, this.labelProp) }
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </NPopover>
            </div>

        );
    }

}