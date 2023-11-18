import dayjs from 'dayjs';
import esLocale from 'dayjs/locale/es';
import weekday from 'dayjs/plugin/weekday';

import { DAY_FORMAT } from '@/types/other';

dayjs.extend(weekday);

export const getMonthMatrix = (month = dayjs().month()) => {
    const year = dayjs().locale(esLocale).year();
    const firstDayOfTheMonth = dayjs(new Date(year, month, 1)).locale(esLocale).weekday();
    let currentMonthCount = 0 - firstDayOfTheMonth;
    const monthMatrix = new Array(6).fill([]).map(() => {
        return new Array(7).fill(null).map(() => {
            currentMonthCount++;
            return dayjs(new Date(year, month, currentMonthCount)).locale(esLocale);
        });
    });
    return monthMatrix;
};

export const getYear = (monthIndex: number): string => {
    return dayjs(new Date(dayjs().year(), monthIndex))
        .locale(esLocale)
        .format('MMMM YYYY')
        .replace(/[a-zа-я]+/gi, (match) => match[0].toUpperCase() + match.substr(1));
};

export const getMonthIndexFromDate = (date: string) => {
    return dayjs(date).month();
};

export const getCurrentDay = () => {
    return dayjs().locale(esLocale).format(DAY_FORMAT.YYYY_MM_DD);
};

export const getMonthIndexFromZeroToEleven = (monthIndex: number) => {
    return dayjs().month(monthIndex).month();
};

export const convertDateToNumber = (date: string) => {
    const splitDate = date.split('-');
    const [year, month, day] = splitDate;
    return new Date().setFullYear(+year, +month, +day);
};
