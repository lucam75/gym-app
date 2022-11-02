import { FC, useMemo } from 'react';
import { Dayjs } from 'dayjs';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hook';
import { getSelectedDay, getTempIdWorkout } from '@/store/selectors';
import {
    changeDaySelected,
    setModaleWorkoutIsOpen,
    setStepWorkoutModale,
    setTempIdWorkout,
} from '@/store/slices/modaleSlice';
import { DAY_FORMAT } from '@/types/day';
import { STEP_MODAL } from '@/types/modal';
import { WorkoutOnCalendar } from '@/types/workout';
import { getCurrentDay, getMonthIndexFromDate, getMonthIndexFromZeroToEleven } from '@/utils/dayjs';
import { getWorkoutForTheDay } from '@/utils/workout';
import Fade from '@mui/material/Fade';
import Grow from '@mui/material/Grow';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';

import styles from './index.module.scss';

interface DayProps {
    day: Dayjs;
    row: number;
    workoutsForMonth: WorkoutOnCalendar[];
    monthIndex: number;
}

export const Day: FC<DayProps> = ({ day, row, workoutsForMonth, monthIndex }) => {
    const dispatch = useAppDispatch();
    const selectedWorkoutId = useAppSelector(getTempIdWorkout);
    const daySelected = useAppSelector(getSelectedDay);

    const dayFormat = day.format(DAY_FORMAT.YYYY_MM_DD);
    const isDayNotThisMonth = day.month() !== getMonthIndexFromZeroToEleven(monthIndex);

    const workoutsForTheDay = useMemo(() => {
        return getWorkoutForTheDay(dayFormat, workoutsForMonth);
    }, [workoutsForMonth]);

    const clickHandler = (type: 'workout' | 'day', e?: any, id?: string) => {
        if (!isDayNotThisMonth) {
            dispatch(changeDaySelected(dayFormat));
            dispatch(setModaleWorkoutIsOpen(true));
            if (type === 'workout') {
                dispatch(setTempIdWorkout(id!));
                dispatch(setStepWorkoutModale(STEP_MODAL.EXERCISES));
            }
            if (type === 'day') {
                dispatch(setStepWorkoutModale(STEP_MODAL.WORKOUTS));
            }
        }
    };

    const dayCN = () => {
        const currentDayClass = dayFormat === getCurrentDay() ? `${styles.currentDay}` : '';
        const dayNotThisMonth = isDayNotThisMonth ? `${styles.dayOfTheLastMonth}` : '';
        const daySelectedClass = daySelected === dayFormat ? `${styles.daySelect}` : '';
        return `${styles.wrapper} ${currentDayClass} ${dayNotThisMonth} ${daySelectedClass}`;
    };

    const workoutCN = (id: string) => {
        const workoutClass =
            getMonthIndexFromDate(dayFormat) !== getMonthIndexFromZeroToEleven(monthIndex)
                ? `${styles.workout} ${styles.disabled}`
                : `${styles.workout}`;
        const workoutSelected = selectedWorkoutId === id ? `${styles.selectWorkout}` : '';
        return `${workoutClass} ${workoutSelected}`;
    };

    return (
        <div className={dayCN()} onClick={(e) => clickHandler('day', e)}>
            <div className={styles.dayHeader}>
                {row === 0 && <span className={styles.dayWeek}>{day.format('dd').toUpperCase()}</span>}
                <span className={styles.number}>{day.format('DD')}</span>
            </div>
            <div className={styles.workoutList}>
                {workoutsForTheDay.map(({ id, workoutName, color }) => (
                    <Slide key={id} direction="right" in={!!workoutName} mountOnEnter unmountOnExit>
                        <div
                            style={{ backgroundColor: color }}
                            className={workoutCN(id)}
                            onMouseDown={(e) => clickHandler('workout', e, id)}
                        >
                            {workoutName}
                        </div>
                    </Slide>
                ))}
            </div>
        </div>
    );
};
