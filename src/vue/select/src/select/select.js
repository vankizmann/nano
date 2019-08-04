import { Str, Arr, Any, Locale } from "../../../../index";

export default {

    name: 'NSelect',

    props: {

        value: {
            default()
            {
                return null;
            },
        },

        defaultValue: {
            default()
            {
                return null;
            },
            type: [String, Array]
        },

        size: {
            default()
            {
                return 'default';
            },
            type: [String]
        },

        position: {
            default()
            {
                return 'bottom-center';
            },
            type: [String]
        },

        multiple: {
            default()
            {
                return false;
            },
            type: [Boolean]
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
                return Locale.trans('Please select');
            },
            type: [String]
        },

        emptyText: {
            default()
            {
                return Locale.trans('No Entries');
            },
            type: [String]
        },

        allowCreate: {
            default()
            {
                return false;
            },
            type: [Boolean]
        }

    },

    computed: {

        filteredOptions()
        {
            let options = this.options;

            options = Arr.filter(options, (option) => {
                return Str.has(option.label, this.search);
            });

            return options;
        }

    },

    methods: {

        getSelected(value)
        {
            if ( Any.isArray(value) === false ) {
                value = [value];
            }

            if ( Any.isEqual(this.nativeSelected, value) ) {
                return null;
            }

            value = Arr.filter(value, (selected) => {
                return Any.isEmpty(selected) === false;
            });

            return value;
        },

        getValue()
        {
            let value = this.nativeSelected;

            if ( this.multiple === false ){
                value = Arr.first(value);
            }

            return value;
        },

        addOption(option)
        {
            this.options.push(option);
        },

        removeOption(option)
        {
            Arr.remove(this.options, { _uid: option._uid });
        },

        toggleOption(value)
        {
            this.search = '';

            if ( this.multiple === false ) {
                this.visible = false;
            }

            if ( this.multiple === false ) {
                return this.nativeSelected = [value];
            }

            if ( this.multiple === true ) {
                this.$refs.input.focus();
            }

            Arr.toggle(this.nativeSelected, value);
        },

        selectCurrent()
        {
            if ( this.current === null ) {
                return;
            }

            let option = Arr.get(this.filteredOptions, this.current);

            if ( Any.isEmpty(option) === true ) {
                return;
            }

            if ( option.disabled === true ) {
                return;
            }

            this.toggleOption(option.realValue);
        },

        selectPrevious()
        {
            let total = this.filteredOptions.length;

            if ( Any.isEmpty(this.current) === true ) {
                return this.current = total - 1;
            }

            if ( this.current === 0 ) {
                return this.current = total - 1;
            }

            this.current--;
        },

        selectNext()
        {
            let total = this.filteredOptions.length;

            if ( Any.isEmpty(this.current) === true ) {
                return this.current = 0;
            }

            if ( this.current === total - 1 ) {
                return this.current = 0;
            }

            this.current++;
        },

        searchOptions(event)
        {
            this.search = event.target.value;
        },

        focusInput()
        {
            this.focus = true;
        },

        focusoutInput()
        {
            this.focus = false;
        },

        keydownInput(event)
        {
            if ( event.keyCode === 9 ) {
                this.search = '';
            }

            let createOption = this.allowCreate === true &&
                this.current === null && this.search !== '';

            if ( event.keyCode === 13 && createOption === true ) {
                this.toggleOption(this.search);
            }

            if ( event.keyCode === 13 && createOption === false ) {
                this.selectCurrent();
            }

            if ( event.keyCode === 38 ) {
                this.selectPrevious();
            }

            if ( event.keyCode === 40 ) {
                this.selectNext();
            }

            if ( event.keyCode === 9 || event.keyCode === 27 ) {
                return this.visible = false;
            }

            this.visible = true;
        }

    },

    watch: {

        value()
        {
            let selected = this.getSelected(this.value);

            if ( selected === null ) {
                return;
            }

            this.nativeSelected = selected;
        },

        nativeSelected()
        {
            let value = this.getValue();

            this.$emit('input', value);
            this.$emit('change', value);
        },

        search()
        {
            this.current = null;
        }

    },

    data()
    {
        return {
            focus: false,
            visible: false,
            search: '',
            current: null,
            options: [],
            nativeSelected: []
        };
    },

    provide()
    {
        return {
            NSelect: this
        };
    },

    beforeMount()
    {
        this.nativeSelected = this.getSelected(this.value);
        // if ( this.value === null || this.value === undefined ) {
        //     this.$emit('input', this.multiple === true ? [] : '');
        // }
    },

    updated()
    {
        if ( this.focus === false && this.visible === false ) {
            this.search = '';
        }
    },

    render(h)
    {
        let className = [
            'n-select', 'n-select--' + this.size
        ];

        if ( this.disabled === true ) {
            className.push('n-select--disabled');
        }

        let options = this.filteredOptions;

        options = Arr.each(options, (option, index) => {
            return option.render(h, Any.integer(index) === this.current);
        });

        let labels = this.nativeSelected;

        labels = Arr.each(labels, (selected) => {
            return Arr.find(this.options, { realValue: selected }) || {
                label: selected, realValue: selected
            };
        });

        let placeholder = '';

        if ( Any.isEmpty(labels) === true ) {
            placeholder = this.placeholder;
        }

        let option = Arr.find(this.options, {
            realValue: Arr.first(this.nativeSelected)
        });

        if ( option !== null && this.multiple === false && this.focus === true ) {
            placeholder = option.label;
        }

        let hideItems = Any.isEmpty(placeholder) === false ||
            (this.focus === true && this.multiple === false) ||
            (this.search !== '' && this.multiple === false);

        return (
            <div class="n-select__wrapper">
                <div class={className} onClick={() => this.$refs.input.focus()}>
                    <div class="n-select__label">
                        { ( Any.isEmpty(labels) === false && hideItems === false ) &&
                            Arr.each(labels, (option) => {

                                let className = [
                                    'n-select__item'
                                ];

                                if ( this.multiple === true ) {
                                    className.push('n-select__item--multiple');
                                }

                                let clickEvent = () => {
                                    this.toggleOption(option.realValue);
                                };

                                return <span class={className}>
                                    {option.label} { this.multiple && <i onClick={clickEvent} class="fa fa-times"></i>}
                                </span>;
                            })
                        }

                        <input ref="input" class="n-select__input" type="text" value={this.search} placeholder={placeholder} onInput={this.searchOptions} onFocus={this.focusInput} onFocusout={this.focusoutInput} onKeydown={this.keydownInput} />

                    </div>
                    <div class="n-select__arrow">
                        <span class="fa fa-angle-down"></span>
                    </div>
                </div>
                <NPopover vModel={this.visible} trigger="click" type="select" selector=".n-select" position={this.position} closeInside={false}>
                    { Any.isEmpty(options) === false ? options : <div class="n-select__empty">{ this.emptyText }</div> }
                </NPopover>
                { this.$slots.default }
            </div>
        );
    }

}
