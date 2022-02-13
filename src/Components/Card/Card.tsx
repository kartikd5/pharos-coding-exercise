import { memo } from 'react';
import { Data } from '../../Api/Data';
import { formatCurrency } from '../../utils';
import './Card.css';

interface CardContainerProps {
    data: Data[];
}

interface CardProps {
    data: Data;
}

export const CardContainer = memo(({ data }: CardContainerProps) => {
    return (
        <div className='cardContainer'>
            {data?.map((d: Data, i: number) => (
                <Card data={d} key={i} />
            ))}
        </div>
    )
})

const Card = memo(({ data }: CardProps) => {
    return (
        <div className='card-container'>
            <h3 className='card-app'>{data.name}</h3>
            <div className='card-spending'>Total Spend: {formatCurrency(data.spend)}</div>
        </div>
    )
})