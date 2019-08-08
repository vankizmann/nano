import TableCell from "../table-cell";

export default {

    name: 'NTableCellImage',

    extends: TableCell,

    render()
    {
        let className = [
            'n-table__cell', 'n-table__cell--' + this.column.type
        ];

        return <div class={className}>
            <img src={this.value} />
        </div>;
    }

}
