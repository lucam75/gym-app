import { FC } from 'react';

import { Left } from '@/compound/container-two-part/left';

import { Form } from './form';

type LeftSideType = {
    clearTemporaryExercise: () => void;
    editableWorkoutId: string;
};

export const LeftSide: FC<LeftSideType> = ({ clearTemporaryExercise, editableWorkoutId }) => {
    return (
        <Left title="Mi entrenamiento">
            <Form clearTemporaryExercise={clearTemporaryExercise} editableWorkoutId={editableWorkoutId} />
        </Left>
    );
};
