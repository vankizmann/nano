import { Num, Arr, Any } from "../index";

export class Now
{
    timestamp = null;

    static _months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];

    static _days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    constructor(date = null)
    {
        if ( Any.isEmpty(date) ) {
            date = new Date;
        }

        if ( Any.isString(date) ) {
            date = Now.datetime(date)
        }

        if ( date instanceof Now ) {
            date = date.get();
        }

        this.timestamp = date;
    }

    static make(date = null)
    {
        return new Now(date);
    }

    static datetime(val)
    {
        val = val.replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})/, '$1/$2/$3');

        return new Date(val);
    }

    get()
    {
        return this.timestamp;
    }

    clone()
    {
        return new Now(new Date(this.timestamp));
    }

    code(format = 'YYYYMMDDhhiiss')
    {
        return Num.int(this.format(format));
    }

    iso()
    {
        return new Date(this.timestamp.getTime() -
            (this.timestamp.getTimezoneOffset() * 60000));
    }

    format(format = 'YYYY-MM-DD hh:ii:ss')
    {
        format = format.replace(/YYYY/g,
            this.iso().toISOString().substr(0, 4));

        format = format.replace(/MM/g,
            this.iso().toISOString().substr(5, 2));

        format = format.replace(/DD/g,
            this.iso().toISOString().substr(8, 2));

        format = format.replace(/hh/g,
            this.iso().toISOString().substr(11, 2));

        format = format.replace(/ii/g,
            this.iso().toISOString().substr(14, 2));

        format = format.replace(/ss/g,
            this.iso().toISOString().substr(17, 2));

        return format;
    }

    before(before = null)
    {
        return this.code() < Now.make(before).code();
    }

    beforeDate(before = null)
    {
        return this.code('YYYYMMDD') <
            Now.make(before).code('YYYYMMDD');
    }

    beforeTime(before = null)
    {
        return this.code('hhiiss') <
            Now.make(before).code('hhiiss');
    }

    after(after = null)
    {
        return this.code() > Now.make(after).code();
    }

    afterDate(after = null)
    {
        return this.code('YYYYMMDD') >
            Now.make(after).code('YYYYMMDD');
    }

    afterTime(after = null)
    {
        return this.code('hhiiss') >
            Now.make(after).code('hhiiss');
    }

    equal(equal = null)
    {
        return this.code() === Now.make(equal).code();
    }

    equalDate(equal = null)
    {
        return this.code('YYYYMMDD') ===
            Now.make(equal).code('YYYYMMDD');
    }

    equalTime(equal = null)
    {
        return this.code('hhiiss') ===
            Now.make(equal).code('hhiiss');
    }

    humanDay()
    {
        return Now._days[this.day()];
    }

    humanMonth()
    {
        return Now._months[this.month()];
    }

    year()
    {
        return this.timestamp.getFullYear();
    }

    setYear(year)
    {
        this.timestamp.setFullYear(year);

        return this;
    }

    prevYear()
    {
        return this.clone().setYear(this.year() - 1);
    }

    nextYear()
    {
        return this.clone().setYear(this.year() + 1);
    }

    addYears(count = 1)
    {
        return this.setYear(this.year() + count);
    }

    subYears(count = 1)
    {
        return this.setYear(this.year() - count);
    }

    month()
    {
        return this.timestamp.getMonth() + 1;
    }

    setMonth(month)
    {
        this.timestamp.setMonth(month - 1);

        return this;
    }

    addMonths(count = 1)
    {
        return this.setMonth(this.month() + count);
    }

    subMonths(count = 1)
    {
        return this.setMonth(this.month() - count);
    }

    prevMonth()
    {
        return this.clone().setMonth(this.month() - 1);
    }

    nextMonth()
    {
        return this.clone().setMonth(this.month() + 1);
    }

    date()
    {
        return this.timestamp.getDate();
    }

    setDate(date)
    {
        this.timestamp.setDate(date);

        return this;
    }

    addDates(count = 1)
    {
        return this.setDate(this.date() + count);
    }

    subDates(count = 1)
    {
        return this.setDate(this.date() - count);
    }

    prevDate()
    {
        return this.clone().setDate(this.date() - 1);
    }

    nextDate()
    {
        return this.clone().setDate(this.date() + 1);
    }

    day()
    {
        return this.timestamp.getDay();
    }

    lastDate()
    {
        return this.prevMonth().setDate(0).date();
    }

    getDates()
    {
        return Arr.make(this.lastDate()).map((date) => {
            return this.clone().setDate(date);
        });
    }

    getRangeDates(target = null)
    {
        let range = [], targetNow = Now.make(target);

        if ( this.afterDate(target) ) {

            for (let day = targetNow; ! day.equalDate(this); day = day.nextDate()) {
                Arr.push(range, day);
            }

            Arr.push(range, this);
        }

        if ( this.beforeDate(target) ) {

            for (let day = this; ! day.equalDate(targetNow); day = day.nextDate()) {
                Arr.push(range, day);
            }

            Arr.push(range, targetNow);
        }

        return range;
    }

    getFullDates(start = 1, end = 0)
    {
        let dates = this.getDates(), before = [], after = [];

        let prev = Arr.first(dates);

        for (let day = prev.day(); prev.day() !== start; day = prev.day()) {
            Arr.prepend(before, prev = prev.prevDate());
        }

        let next = Arr.last(dates);

        for (let day = next.day(); next.day() !== end; day = next.day()) {
            Arr.append(after, next = next.nextDate());
        }

        return Arr.merge(before, dates, after);
    }

}

export default Now;
