import CtorMixin from "../../../mixins/src/ctor";
import { Arr, Now } from '../../../../index';

export default {

    name: 'NDatepicker',

    props: {

        value: {
            default()
            {
                return 'now';
            },
            type: [String]
        },

        disabled: {
            default()
            {
                return false;
            },
            type: [Boolean]
        },

        format: {
            default()
            {
                return 'YYYY-MM-DD hh:ii:ss';
            },
            type: [String]
        },

        displayFormat: {
            default()
            {
                return 'DD.MM.YYYY';
            },
            type: [String]
        },

        weekdays: {
            default()
            {
                return [
                    this.trans('Mo'),
                    this.trans('Tu'),
                    this.trans('We'),
                    this.trans('Th'),
                    this.trans('Fr'),
                    this.trans('Sa'),
                    this.trans('So'),
                ]
            },
            type: [Array]
        },

        months: {
            default()
            {
                return [
                    this.trans('Jun'),
                    this.trans('Feb'),
                    this.trans('Mar'),
                    this.trans('Apr'),
                    this.trans('May'),
                    this.trans('Jun'),
                    this.trans('Jul'),
                    this.trans('Aug'),
                    this.trans('Sep'),
                    this.trans('Oct'),
                    this.trans('Nov'),
                    this.trans('Dec'),
                ]
            },
            type: [Array]
        }

    },

    computed: {

        range()
        {
            return this.tempValue.getFullDates();
        }

    },

    watch: {

        value()
        {
            if ( this.value !== this.nativeValue.format(this.format) ) {
                this.nativeValue = Now.make(this.value)
            }
        }

    },

    data()
    {
        return {
            visible: false,
            tempValue: Now.make(this.value),
            nativeValue: Now.make(this.value)
        }
    },

    methods: {

        ...CtorMixin,

    },

    renderDay(date)
    {
        let classList = [
            'n-datepicker__day'
        ];

        if ( date.equalDate('now') ) {
            classList.push('n-datepicker__day--today');
        }

        if ( date.equalDate(this.nativeValue) ) {
            classList.push('n-datepicker__day--selected');
        }

        if ( date.month() === this.tempValue.month() ) {
            classList.push('n-datepicker__day--current');
        }

        let events = {
            'click': () => this.$emit('input', date.format(this.format))
        };

        return (
            <div on={events} class={classList}>
                <span>{ date.format('DD') }</span>
            </div>
        );
    },

    render()
    {
        return (
            <div class="n-datepicker__wrapper">
                <NInput value={this.nativeValue.format(this.displayFormat)} />
                <NPopover vModel={this.visible} disabled={this.disabled} type="datepicker" trigger="click" position="bottom-center">
                    <div class="n-datepicker__legend">
                        <div class="n-datepicker__prev">
                            <NButton icon="fa fa-angle-left" square={true} round={true} vOn:click={() => this.tempValue = this.tempValue.prevMonth()} />
                        </div>
                        <div class="n-datepicker__display">
                            <span class="n-datepicker__month">
                                { this.months[this.tempValue.month() - 1] }
                            </span>
                            <span class="n-datepicker__year">
                                { this.tempValue.year() }
                            </span>
                        </div>
                        <div class="n-datepicker__next">
                            <NButton icon="fa fa-angle-right" square={true} round={true} vOn:click={() => this.tempValue = this.tempValue.nextMonth()} />
                        </div>
                    </div>
                    <div class="n-datepicker__header">
                        {
                            Arr.each(this.weekdays, (day) => {
                                return (
                                    <div class="n-datepicker__day">
                                        <span>{ day }</span>
                                    </div>
                                );
                            })
                        }
                    </div>
                    <div class="n-datepicker__body">
                        {
                            Arr.each(Arr.chunk(this.range, 7), (chunks) => {
                                return (
                                    <div class="n-datepicker__week">
                                        {
                                            Arr.each(chunks, this.ctor('renderDay'))
                                        }
                                    </div>
                                );
                            })
                        }
                    </div>
                </NPopover>
            </div>
        );
    }

}