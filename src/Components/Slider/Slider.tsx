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
        setValue(maxRange);
    }, [maxRange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(parseInt(e.target.value));
        setFilters({...filters, minSpending: (maxRange + minRange) - parseInt(e.target.value)});
    }

    return (
        <>
            <div className='slider-header-container'>
                {label && (<div className='slider-label'>{label}</div>)}
                <div className='slider-selected'>{`>=`} {formatCurrency(filters.minSpending ?? minRange)}</div>
            </div>

            <div className='slider-container'>
                <input
                    className='slider-input'
                    max ={maxRange}
                    min={minRange}
                    onChange={handleChange}
                    title={filters.minSpending?.toString() ?? minRange.toString()}
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