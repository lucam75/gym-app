import { FC, useState } from 'react';
import _ from 'lodash';
import { useSnackbar } from 'notistack';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { ButtonStandard } from '@/components/buttons/button-standard';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hook';
import { selectSelectedDay } from '@/store/modal/selectors';
import { setModalWorkoutIsOpen, setStepWorkoutModal } from '@/store/modal/slice';
import { selectWorkouts } from '@/store/workout/selectors';
import { addWorkoutToCalendarAsync } from '@/store/workout-on-calendar/asyncActions';
import { selectIsLoadingWorkoutsCalendar } from '@/store/workout-on-calendar/selectors';
import { ROUTE_PATH, STEP_MODAL } from '@/types/other';
import { HOW_TO_REPEAT, Workout, WorkoutOnCalendar } from '@/types/workout';
import { generateWorkout } from '@/utils/workout';

import { SelectNumber } from './select-number';
import { SelectRepeat } from './select-repeat';

import styles from './index.module.scss';

export const ChoiceWorkouts: FC = () => {
    const [selectWorkout, setSelectWorkout] = useState<WorkoutOnCalendar | null>(null);
    const [howToRepeat, setHowToRepeat] = useState(HOW_TO_REPEAT.DONT_REPEAT);
    const [repeatInterval, setRepeatInterval] = useState(2);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const userWorkout = useAppSelector(selectWorkouts);
    const daySelected = useAppSelector(selectSelectedDay);
    const isLoadingWorkoutCalendar = useAppSelector(selectIsLoadingWorkoutsCalendar);

    const userWorkoutArr = _.toArray(userWorkout);

    const selectWorkoutClickHandler = (workout: WorkoutOnCalendar) => {
        setSelectWorkout(workout);
    };

    const howToRepeatCLickHandler = (howToRepeat: HOW_TO_REPEAT) => {
        setHowToRepeat(howToRepeat);
    };

    const repeatClickHandler = (repeatValue: number) => {
        setRepeatInterval(repeatValue);
    };

    const addWorkoutOnCalendarClickHandler = async () => {
        const workout = generateWorkout(daySelected, selectWorkout as WorkoutOnCalendar);
        await dispatch(addWorkoutToCalendarAsync(workout, howToRepeat, repeatInterval, enqueueSnackbar));
        dispatch(setModalWorkoutIsOpen(false));
    };

    const createWorkoutClickHandler = () => {
        navigate(ROUTE_PATH.CREATE_WORKOUT);
        dispatch(setModalWorkoutIsOpen(false));
    };

    const activeWorkoutClass = (workout: Workout) => {
        return _.isEqual(workout, selectWorkout) ? `${styles.activeWorkout}` : '';
    };

    return (
        <div className={styles.content}>
            <div className={styles.topBlock}>
                <span className={styles.back} onClick={() => dispatch(setStepWorkoutModal(STEP_MODAL.WORKOUTS))}>
                    <MdArrowBack size={20} />
                </span>
                <h3 className={styles.title}>Seleccione un entrenamiento de la lista</h3>
                {_.isEmpty(userWorkout) ? (
                    <p className={styles.noWorkout}>No se crearon entrenamientos</p>
                ) : (
                    <div className={styles.workoutList}>
                        {userWorkoutArr.map((workout) => (
                            <div
                                onClick={() => selectWorkoutClickHandler(workout)}
                                className={`${styles.workoutItem} ${activeWorkoutClass(workout)}`}
                                key={workout.id}
                            >
                                <span className={styles.workoutName}>{workout.workoutName}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.botBlock}>
                {_.isEmpty(userWorkout) ? (
                    <ButtonStandard handleClick={createWorkoutClickHandler} name={'Crear un entrenamiento'} />
                ) : (
                    <>
                        <div className={styles.selectGroup}>
                            <SelectRepeat howToRepeatCLickHandler={howToRepeatCLickHandler} howToRepeat={howToRepeat} />
                            {howToRepeat === HOW_TO_REPEAT.INTERVAL && (
                                <SelectNumber repeatInterval={repeatInterval} repeatClickHandler={repeatClickHandler} />
                            )}
                        </div>
                        <ButtonStandard
                            handleClick={addWorkoutOnCalendarClickHandler}
                            name={'Agregar'}
                            disabled={!selectWorkout}
                            isLoading={isLoadingWorkoutCalendar}
                        />
                    </>
                )}
            </div>
        </div>
    );
};
