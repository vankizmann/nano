import Medium from "medium.js";

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
        this.medium = new Medium({
            element: this.$refs.editor,
            mode: Medium.richMode
        });

        this.$refs.editor.highlight = () => {
            if (document.activeElement !== this.$refs.editor) {
                this.medium.select();
            }
        };
    },

    render()
    {

        let test = () => {

            this.$refs.editor.highlight();

            this.medium.invokeElement('b', {
                title: "I'm bold!",
                style: "color: #66d9ef"
            });

            console.log(this.medium);
        };

        return (
            <div>
                <NButton vOn:mousedown={test}>Run test</NButton>
                <div ref="editor"><p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Accusantium animi aut consequuntur culpa dicta dignissimos fugit nisi possimus reiciendis voluptates.</p></div>
            </div>
        );
    }

}