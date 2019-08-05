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
            visible: false, nativeCascade: [], nativeSelected: []
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
            <NPopover visible={Arr.has(this.nativeSelected, value)} type="select" trigger={this.trigger} position="right-start">
                {
                    Arr.each(childs, (child) => {

                        let subCascade = Arr.merge(Arr.clone(cascade), [child]);

                        return [
                            this.ctor('renderLabel')(child, subCascade),
                            this.ctor('renderChilds')(child, subCascade)
                        ];
                    })
                }
            </NPopover>
        ];
    },

    render()
    {
        let className = [
            'n-cascader', 'n-cascader--' + this.size
        ];

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
                <NPopover vModel={this.visible} type="select" trigger="click" position="bottom-start">
                    {
                        Arr.each(this.items, (item) => {
                            return [
                                this.ctor('renderLabel')(item, [item]),
                                this.ctor('renderChilds')(item, [item])
                            ];
                        })
                    }
                </NPopover>
            </div>

        );
    }

}