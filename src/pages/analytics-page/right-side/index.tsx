import { FC } from 'react';

import { Right } from '@/compound/container-two-part/right';
import { ExerciseInWorkoutOnCalendar } from '@/types/workout';

import { Table } from '../table';

import styles from './index.module.scss';

type RightSideType = {
    selectedExerciseGroup: ExerciseInWorkoutOnCalendar[] | null;
};

export const RightSide: FC<RightSideType> = ({ selectedExerciseGroup }) => {
    return (
        <Right title="Estadísticas de ejercicio">
            {!selectedExerciseGroup && (
                <p className={styles.noContent}>Para ver las estadísticas de un ejercicio, selecciónelo</p>
            )}
            {selectedExerciseGroup && <h3 className={styles.title}>{selectedExerciseGroup[0].name}</h3>}
            {selectedExerciseGroup && <Table selectedExerciseGroup={selectedExerciseGroup} />}
        </Right>
    );
};
