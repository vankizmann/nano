import Undo from "undo.js";
window.Undo = Undo;

import Medium from "medium.js";
window.Medium = Medium;

import { Nano } from "../../../../index";
let { Dom } = Nano;

export default {

    name: 'NWysiwyg',

    props: {

        value: {
            default()
            {
                return '';
            },
            type: String
        }

    },

    mounted()
    {
        let config = {
            element: this.$refs.editor
        };

        // config.beforeInvokeElement = () => {
        //         //     console.log(this.Medium.value());
        //         // };
        //         //
        //         // config.beforeInsertHtml = () => {
        //         //     console.log(this.Medium.value());
        //         // };

        this.Medium = new Medium(config);
    },

    methods: {

        bold()
        {
            let selection = window.getSelection(), node = selection.baseNode;

            // if ( Dom.find(node).is('p') ) {
            //     this.Medium.utils.selectNode(node);
            // }

            if ( Dom.find(node).closest('strong') ) {
                this.Medium.utils.selectNode(Dom.find(node).closest('strong'));
            }

            this.Medium.invokeElement('strong', {
                // className: ['test']
            });
        }

    },


    render()
    {

        return (
            <div>
                <NButton vOn:mousedown={this.bold}>Run test</NButton>
                <div ref="editor" domPropsInnerHTML={this.value} style="min-height: 100px; background: #eee;">

                </div>
            </div>
        );
    }

}