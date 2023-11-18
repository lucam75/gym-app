import { ChangeEvent, FC, memo, RefObject } from 'react';
import { MdArrowBackIosNew, MdArrowForwardIos } from 'react-icons/md';

import { ButtonOutline } from '@/components/buttons/button-outline';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hook';
import { changeDaySelected, setModalWorkoutIsOpen, setStepWorkoutModal } from '@/store/modal/slice';
import { selectMonthIndex } from '@/store/month/selectors';
import { decMonthIndex, incMonthIndex, resetMonthIndex } from '@/store/month/slice';
import { STEP_MODAL } from '@/types/other';
import { getCurrentDay, getYear } from '@/utils/dayjs';
import { ActionCreatorWithoutPayload } from '@reduxjs/toolkit';

import styles from './index.module.scss';

type CalendarHeaderType = {
    changeDayRef: (ref: RefObject<any>) => void;
};

export const CalendarHeader: FC<CalendarHeaderType> = memo(({ changeDayRef }) => {
    const dispatch = useAppDispatch();
    const monthIndex = useAppSelector(selectMonthIndex);
    const buttonClickHandler = (reducer: ActionCreatorWithoutPayload<string>) => {
        dispatch(reducer());
    };
    const workoutForDayClickHandler = (e: ChangeEvent<any> | undefined) => {
        const daysNode = e!.target.offsetParent.lastChild.childNodes;
        const daysArr: HTMLElement[] = Array.from(daysNode);
        const currentNode = daysArr.find((day) => Array.from(day.classList).find((cl) => cl.includes('current')));
        changeDayRef({ current: currentNode });

        dispatch(changeDaySelected(getCurrentDay()));
        dispatch(setStepWorkoutModal(STEP_MODAL.WORKOUTS));
        dispatch(setModalWorkoutIsOpen(true));
    };
    return (
        <>
            <div className={styles.wrapper}>
                <div className={styles.wrapperGroupBtn}>
                    <div className={styles.btnWrapper} onMouseDown={() => dispatch(resetMonthIndex())}>
                        <ButtonOutline
                            text="Entrenamiento para hoy"
                            handleClick={(e) => workoutForDayClickHandler(e)}
                        />
                    </div>
                </div>
                <div className={styles.wrapperGroupBtn}>
                    <div className={styles.btnWrapper}>
                        <ButtonOutline text="Hoy" handleClick={() => buttonClickHandler(resetMonthIndex)} />
                    </div>
                    <button className={styles.btn} onClick={() => buttonClickHandler(decMonthIndex)}>
                        <MdArrowBackIosNew />
                    </button>
                    <button className={styles.btn} onClick={() => buttonClickHandler(incMonthIndex)}>
                        <MdArrowForwardIos />
                    </button>
                    <h3 className={styles.data}>{getYear(monthIndex)}</h3>
                </div>
            </div>
        </>
    );
});
