import React, { SetStateAction, useMemo } from 'react'
import styles from '../styles/components/CheckBox.module.scss'

type TProps = {
    checked: boolean
    label?: 'Выходной' | 'Перерыв' | 'На работе'
    onChange: (label?: 'Выходной' | 'Перерыв' | 'На работе') => void
}

export const CheckBox = ({ checked, label, onChange }: TProps) => {

    return (
        <div className={styles.container}>
            <input type="checkbox"  checked={checked} onChange={() => onChange(label)}  />
            <p>{label}</p>
        </div>
    );
};





