import TableCell from "../table-cell";
import { Nano } from "../../../../../index";

let { Any } = Nano;

export default {

    name: 'NTableCellDatetime',

    extends: TableCell,

    render()
    {
        let className = [
            'n-table__cell', 'n-table__cell--' + this.column.type
        ];

        return <div class={className}>
            <span>{ Any.convertDatetime(this.value, this.column.datetimeFormat, this.column.emptyText) }</span>
        </div>;
    }

}
