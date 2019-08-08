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

        toggleOption(cascade)
        {
            let selected = Arr.each(cascade, (item) => {
                return Obj.get(item, this.valueProp);
            });

            if ( this.trigger !== 'click' ) {
                this.visible = false;
            }

            this.$emit('update:cascade', this.nativeCascade = cascade);
            this.$emit('input', this.nativeSelected = selected);
        }

    },

    data()
    {
        return {
            visible: false, hoverCascade: [null], nativeCascade: [], nativeSelected: []
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

        let sub = Arr.find(this.items, {[this.valueProp]: Arr.first(this.hoverCascade)}, {});

        return (
            <div class="n-cascader__wrapper">
                <div class={className}>
                    <div class="n-cascader__label">
                        { 'Foobar' }
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

                                            let events = {
                                                mouseenter: () => {

                                                    let clone = Arr.slice(this.hoverCascade,
                                                        0, index + 1);

                                                    this.hoverCascade = Arr.merge(clone, [item]);
                                                }
                                            };

                                            return (
                                                <div class="n-cascader-option" on={events}>
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