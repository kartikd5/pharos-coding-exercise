import { useEffect, useCallback, useContext, useState } from 'react';
import { Data } from '../../Api/Data';
import { CardContainer, Slider, Tree, TreeData } from '../../Components';
import { Filters, FilterContext } from '../../App';
import { Constants } from '../../Constants';
import './Dashboard.css';

//  Convert the actual data.json file data to the UI Tree component friendly format
function convertData(data: Data[] | []): TreeData[] {
    const convertedData: TreeData[] = data.map(d => {
        let obj: TreeData = (({ id, name, spend }) => ({ id, name, spend }))(d);
        obj['label'] = d.BCAP1;
        obj['children'] = [{
            label: d.BCAP2!,
            children: [{
                label: d.BCAP3!
            }]
        }];
        return obj;
    });

    return convertedData;
}

//  Filter the data based on business capabilities and total spending value
function filterData(data: Data[] | [], filters: Filters): Data[] {
    if (filters?.bizCapability?.length) {
        return data?.filter(d =>
            (d.BCAP1 === filters.bizCapability ||
            d.BCAP2 === filters.bizCapability ||
            d.BCAP3 === filters.bizCapability) &&
            d.spend >= (filters.startingRange ?? 0)
        );
    } else {
        return [] as Data[];
    }
}

export const Dashboard = () => {
    const [actualData, setActualData] = useState<Data[] | []>([]);
    const [sidebarData, setSidebarData] = useState<TreeData[] | []>([]);
    const [filteredData, setFilteredData] = useState<Data[] | []>([]);

    const maxRange = Math.max.apply(Math, actualData.map(d => d.spend));
    const minRange = Math.min.apply(Math, actualData.map(d => d.spend));

    const { filters } = useContext(FilterContext);

    const getData = () => {
        fetch('data.json').then(res => res.json()).then((data: Data[]) => {
            setActualData(data);
            setSidebarData(convertData(data));
        });
    }

    useEffect(() => {
        getData();
    }, []);

    const getFilteredData = useCallback(() => filterData(actualData, filters), [actualData, filters]);

    useEffect(() => {
        setFilteredData(getFilteredData);
    }, [getFilteredData]);

    return (
        <div className='root'>
            <div className='left-container'>
                <div className='sidebar-container'>
                    <h3 className='sidebarContainer-header'>
                        {Constants.navigationHeaderLabel}
                    </h3>
                    <div className='sidebarContainer-content'>
                        <Tree data={sidebarData} />
                    </div>
                </div>
                <hr className='separator' />
                <div className='slider-container'>
                    <h3 className='sliderContainer-header'>
                        {Constants.filtersHeaderLabel}
                    </h3>
                    <div className='sliderContainer-content'>
                        <Slider
                            label={Constants.filtersSpendingLabel}
                            maxRange = {maxRange}
                            minRange = {minRange}
                        />
                    </div>
                </div>
            </div>
            <div className='right-container'>
                {!!filteredData.length ? (
                    <CardContainer data={filteredData} />
                ) : (
                    <div className='dashboard-alttext'>
                        No data to display
                    </div>
                )}
            </div>
        </div>
    );
}