import CtorMixin from "../../../mixins/src/ctor";
import { Arr, Obj, Str, Now } from '../../../../index';

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
                return this.trans('YYYY-MM-DD');
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
                    this.trans('Jan'),
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

        yearsGrid()
        {
            return this.tempValue.getYears();
        },

        monthsGrid()
        {
            return this.tempValue.getMonths();
        },

        datesGrid()
        {
            return this.tempValue.getDatesGrid();
        }

    },

    watch: {

        value()
        {
            if ( this.value !== this.nativeValue.format(this.format) ) {
                this.nativeValue = this.tempValue = Now.make(this.value);
            }
        }

    },

    data()
    {
        return {
            nativeView: 'date',
            visible: false,
            tempValue: Now.make(this.value),
            nativeValue: Now.make(this.value)
        }
    },

    methods: {

        ...CtorMixin,

    },

    mounted()
    {
        this.$on('input', () => this.visible = false);
    },

    renderToolbar({ prev, next })
    {
        prev = Obj.assign({
            props: { icon: 'fa fa-angle-left', square: true, round: true }
        }, prev);

        next = Obj.assign({
            props: { icon: 'fa fa-angle-right', square: true, round: true }
        }, next);

        return (
            <div class="n-datepicker__toolbar">
                <div class="n-datepicker__prev">
                    <NButton {...prev}/>
                </div>
                <div class="n-datepicker__display">
                    <span class="n-datepicker__month" vOn:click={() => this.nativeView = 'month'}>
                        {this.months[this.tempValue.month() - 1]}
                    </span>
                    <span class="n-datepicker__year" vOn:click={() => this.nativeView = 'year'}>
                        {this.tempValue.year()}
                    </span>
                </div>
                <div class="n-datepicker__next">
                    <NButton {...next} />
                </div>
            </div>
        )
    },

    renderDateItem(now)
    {
        let classList = [
            'n-datepicker__day'
        ];

        if ( now.equalDate('now') ) {
            classList.push('n-datepicker__day--today');
        }

        if ( now.equalDate(this.nativeValue) ) {
            classList.push('n-datepicker__day--selected');
        }

        if ( now.month() === this.tempValue.month() ) {
            classList.push('n-datepicker__day--current');
        }

        let events = {
            'click': () => {
                this.$emit('input', now.format(this.format));
            }
        };

        return (
            <div on={events} class={classList}>
                <span>{ now.format('DD') }</span>
            </div>
        );
    },

    renderDate()
    {
        let prev = {
            on: {
                click: () => this.tempValue = this.tempValue.prevMonth()
            }
        };

        let next = {
            on: {
                click: () => this.tempValue = this.tempValue.nextMonth()
            }
        };

        return (
            <div class="n-datepicker__dateview">
                <div class="n-datepicker__header">
                    { this.ctor('renderToolbar')({ prev, next }) }
                </div>
                <div class="n-datepicker__legend">
                    {
                        Arr.each(this.weekdays, (day) => {
                            return (
                                <div class="n-datepicker__day">
                                    <span>{day}</span>
                                </div>
                            );
                        })
                    }
                </div>
                <div class="n-datepicker__body">
                    {
                        Arr.each(Arr.chunk(this.datesGrid, 7), (chunks) => {
                            return (
                                <div class="n-datepicker__week">
                                    {
                                        Arr.each(chunks, this.ctor('renderDateItem'))
                                    }
                                </div>
                            );
                        })
                    }
                </div>
            </div>
        );
    },

    renderMonthItem(now)
    {
        let classList = [
            'n-datepicker__month'
        ];

        if ( now.equalDate(this.nativeValue) ) {
            classList.push('n-datepicker__month--selected');
        }

        if ( now.month() === Now.make().month() ) {
            classList.push('n-datepicker__month--current');
        }

        let events = {
            'click': () => {
                this.tempValue = now; this.nativeView = 'date';
            }
        };

        return (
            <div on={events} class={classList}>
                <span>{ this.months[now.month() - 1] }</span>
            </div>
        )
    },

    renderMonth()
    {
        let prev = {
            on: {
                click: () => this.tempValue = this.tempValue.prevYear()
            }
        };

        let next = {
            on: {
                click: () => this.tempValue = this.tempValue.nextYear()
            }
        };

        return (
            <div class="n-datepicker__monthview">
                <div class="n-datepicker__header">
                    { this.ctor('renderToolbar')({ prev, next }) }
                </div>
                <div class="n-datepicker__body">
                    <div class="n-datepicker__year">
                        { Arr.each(this.monthsGrid, this.ctor('renderMonthItem')) }
                    </div>
                </div>
                <div class="n-datepicker__footer">
                    <NButton type="link" vOn:click={() => this.nativeView = 'date'}>
                        { this.trans('Go back') }
                    </NButton>
                </div>
            </div>
        );
    },

    renderYearItem(now)
    {
        let classList = [
            'n-datepicker__year'
        ];

        if ( now.equal(this.nativeValue, 'YYYY') ) {
            classList.push('n-datepicker__year--selected');
        }

        if ( now.year() === Now.make().year() ) {
            classList.push('n-datepicker__year--current');
        }


        let events = {
            'click': () => {
                this.tempValue = now; this.nativeView = 'month';
            }
        };

        return (
            <div on={events} class={classList}>
                <span>{ now.year() }</span>
            </div>
        )
    },

    renderYear()
    {
        let prev = {
            on: {
                click: () => this.tempValue = this.tempValue.prevDecade()
            }
        };

        let next = {
            on: {
                click: () => this.tempValue = this.tempValue.nextDecade()
            }
        };

        return (
            <div class="n-datepicker__yearview">
                <div class="n-datepicker__header">
                    { this.ctor('renderToolbar')({ prev, next }) }
                </div>
                <div class="n-datepicker__body">
                    <div class="n-datepicker__decade">
                        { Arr.each(this.yearsGrid, this.ctor('renderYearItem')) }
                    </div>
                </div>
                <div class="n-datepicker__footer">
                    <NButton type="link" vOn:click={() => this.nativeView = 'date'}>
                        { this.trans('Go back') }
                    </NButton>
                </div>
            </div>
        );
    },

    render()
    {
        return (
            <div class="n-datepicker__wrapper">
                <NInput value={this.nativeValue.format(this.displayFormat)} />
                <NPopover vModel={this.visible} width={300} disabled={this.disabled} type="datepicker" trigger="click" position="bottom-center">
                    { this.ctor('render' + Str.ucfirst(this.nativeView))() }
                </NPopover>
            </div>
        );
    }

}