import { Nano } from "../../../../../index";
import InfoField from "../info-field";

let { Any } = Nano;

export default {

    name: 'NInfoFieldBoolean',

    extends: InfoField,

    render()
    {
        let className = [
            'n-info__field', 'n-info__field--' + this.column.type
        ];

        return <div class={className}>
            <span>{ Any.convertBoolean(this.value, this.column.trueText, this.column.falseText) }</span>
        </div>;
    }

}
