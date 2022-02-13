import React, { useContext, useEffect, useState } from 'react';
import { FilterContext } from '../../App';
import { formatCurrency } from '../../utils';
import './Slider.css';

interface SliderProps {
    label?: string;
    maxRange: number;
    minRange: number;
}

export const Slider = ({ label, maxRange, minRange }: SliderProps) => {
    const { filters, setFilters } = useContext(FilterContext);
    const [value, setValue] = useState<number>(minRange);

    useEffect(() => {
        setValue(minRange);
    }, [minRange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
        setFilters({...filters, minSpending: parseInt(e.target.value)});
    }

    return (
        <>
            {label && (<div className='slider-label'>{label}</div>)}
            <div className='slider-container'>
                <input
                    className='slider-input'
                    max ={maxRange}
                    min={minRange}
                    onChange={handleChange}
                    title={value.toString()}
                    type="range"
                    value={value}
                />
            </div>
            <div className='slider-range'>
                <div className='slider-range-start'>{formatCurrency(maxRange)}</div>
                <div className='slider-range-end'>{formatCurrency(minRange)}</div>
            </div>
        </>
    )
}