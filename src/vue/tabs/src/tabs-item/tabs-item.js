import { UUID, Num, Obj, Any, Locale } from "../../../../nano-js";

export default {

    name: 'NTabsItem',

    inject: {

        NTabs: {
            default: undefined
        }

    },

    props: {

        label: {
            default()
            {
                return '';
            },
            type: [String]
        },

        name: {
            default()
            {
                return 'default';
            },
            type: [String]
        },

        icon: {
            default()
            {
                return '';
            },
            type: [String]
        },

        preload: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        raw: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        keepAlive: {
            default()
            {
                return true;
            },
            type: [Boolean]
        }


    },

    methods: {

        checkInitialized()
        {
            if ( this.NTabs.current === this.name ) {
                this.initialized = true;
            }
        }

    },

    provide()
    {
        return {
            NTabsItem: this
        };
    },

    data()
    {
        return {
            initialized: false
        }
    },

    beforeMount()
    {
        this.NTabs.addTab(this);
        this.checkInitialized();
    },

    mounted()
    {
        this.NTabs.$watch('current', this.checkInitialized);
    },

    destroyed()
    {
        this.NTabs.removeTab(this);
    },

    render()
    {
        if ( this.NTabs.current !== this.name && this.keepAlive === false ) {
            return null;
        }

        if ( this.preload === false && this.initialized === false ) {
            return null;
        }

        let className = [
            'n-tabs-item'
        ];

        if ( this.raw === true ) {
            className.push('n-tabs-item--raw');
        }

        let style = {};

        if ( this.NTabs.current !== this.name ) {
            style.display = 'none';
        }

        return (
            <div class={className} style={style}>
                { this.$slots.default }
            </div>
        );
    }
}
