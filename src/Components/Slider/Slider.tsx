import React, { useContext, useState } from 'react';
import { FilterContext } from '../../App';
import './Slider.css';

interface SliderProps {
    label?: string;
    maxRange: number;
    minRange: number;
}

export const Slider = ({ label, maxRange, minRange }: SliderProps) => {
    const { filters, setFilters } = useContext(FilterContext);
    const [value, setValue] = useState<number>(filters.startingRange ?? 0);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
        setFilters({...filters, startingRange: parseInt(e.target.value)});
    }

    return (
        <>
            {label && (<div className='slider-label'>{label}</div>)}
            <div className='slider-container'>
                <input
                    className='slider-input'
                    max={maxRange}
                    min={minRange}
                    onChange={handleChange}
                    title={value.toString()}
                    type="range"
                    value={value}
                />
            </div>
            <div className='slider-range'>
                <div className='slider-range-start'>${minRange}</div>
                <div className='slider-range-end'>${maxRange}</div>
            </div>
        </>
    )
}