import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dateFromNow'
})

export class DateFromNowPipe implements PipeTransform {
    transform(value: any, ...args: any[]): any {

        let now = new Date()
        let dateTimeNow =  Math.round((now.getTime() + (now.getTimezoneOffset() * 60000))/1000)
        // const dateTimeNow = Math.round(new Date(Date.now()).getTime()/1000);
        const dateTime = new Date(value).getTime()/1000
        const diff = dateTimeNow - dateTime;

        let timespan = '';

        if (diff <= 1)
        return 'Now';
        if (diff > 1 && diff <= 59)
        return diff + ' sec ago';
        if (diff > 59 && diff <= 3599)
        return  Math.round(diff / 60) + ' min ago';
        if (diff > 3599 && diff <= 86399)
        return Math.round(diff / 3600) + 'h ago';
        if (diff > 86399 && diff <= 2592000)
        return Math.round(diff / 86400) + 'd ago';
        if (diff > 2592000 && diff <= 31556926)
        return Math.round(diff / 2592000) + 'M ago';
        if (diff > 31556926)
        return Math.round(diff / 31556926) + 'y ago';
    }
}