import { useEffect, useCallback, useContext, useState } from 'react';
import { Data } from '../../Api/Data';
import { CardContainer, Slider, Tree, TreeData } from '../../Components';
import { Filters, FilterContext } from '../../App';
import { Constants } from '../../Constants';
import './Dashboard.css';

function sortObjectByKey(treeObject: any): TreeData {
    Object.keys(treeObject).sort().forEach((key: string) => {
        let value = treeObject[key];
        delete treeObject[key];
        treeObject[key] = value;
    });

    return treeObject;
}

//  Convert the actual data.json file data to the UI Tree component friendly format
function convertData(data: Data[] | []): TreeData {
    let convertedData: TreeData = {} as TreeData;

    data.forEach((d: Data) => {
        convertedData[d.BCAP1] = convertedData[d.BCAP1] || {};
        convertedData[d.BCAP1]['count'] = (convertedData[d.BCAP1!]['count'] ?? 0) + 1;
        convertedData[d.BCAP1][d.BCAP2!] = convertedData[d.BCAP1][d.BCAP2!] || {};
        convertedData[d.BCAP1][d.BCAP2!]['count'] = (convertedData[d.BCAP1][d.BCAP2!]['count'] ?? 0) + 1;
        convertedData[d.BCAP1][d.BCAP2!][d.BCAP3!] = convertedData[d.BCAP1][d.BCAP2!][d.BCAP3!] || {};
        convertedData[d.BCAP1][d.BCAP2!][d.BCAP3!]['count'] = (convertedData[d.BCAP1][d.BCAP2!][d.BCAP3!]['count'] ?? 0) + 1;
    });

    const sortedData: TreeData = sortObjectByKey(convertedData);
    Object.keys(sortedData).forEach(k => {
        sortedData[k] = sortObjectByKey(sortedData[k]);
        Object.keys(sortedData[k]).forEach(j => {
            sortedData[k][j] = sortObjectByKey(sortedData[k][j]);
        })
    });

    return sortedData;
}

//  Filter the data based on business capabilities and total spending value
function filterData(data: Data[] | [], filters: Filters) {
    let filteredData: Data[] = [], totalCount: number = 0, filteredCount: number = 0;
    if (filters?.bizCapability?.length) {
        filteredData = data?.filter(d =>
            d.BCAP1 === filters.bizCapability ||
            d.BCAP2 === filters.bizCapability ||
            d.BCAP3 === filters.bizCapability
        );

        totalCount = filteredData.length;

        if (filters.minSpending) {
            filteredData = filteredData.filter(d => d.spend >= filters.minSpending!);
            filteredCount = filteredData.length;
        } else {
            filteredCount = totalCount;
        }
    }

    return { data: filteredData, totalCount, filteredCount };
}

export const Dashboard = () => {
    const { filters } = useContext(FilterContext);
    const [actualData, setActualData] = useState<Data[] | []>([]);
    const [sidebarData, setSidebarData] = useState<TreeData>({});
    const [filteredData, setFilteredData] = useState<Data[] | []>([]);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [filteredCount, setFilteredCount] = useState<number>(0);

    const maxRange = Math.max.apply(Math, actualData.map(d => d.spend));
    const minRange = Math.min.apply(Math, actualData.map(d => d.spend));

    useEffect(() => {
        fetch('data.json').then(res => res.json()).then((data: Data[]) => {
            setActualData(data);
            setSidebarData(convertData(data));
        });
    }, []);

    const getFilteredData = useCallback(() => filterData(actualData, filters), [actualData, filters]);

    useEffect(() => {
        const { data, totalCount, filteredCount } = getFilteredData();
        setFilteredData(data);
        setTotalCount(totalCount);
        setFilteredCount(filteredCount);
    }, [getFilteredData]);

    return (
        <div className='root'>
            <div className='left-container'>
                <div className='sidebar-container'>
                    <h3 className='sidebarContainer-header'>
                        {Constants.navigationHeaderLabel}
                    </h3>
                    <div className='sidebarContainer-content'>
                        <Tree actualData={actualData} data={sidebarData} />
                    </div>
                </div>
                <hr className='separator' />
                <div className='slider-container'>
                    <h3 className='sliderContainer-header'>
                        {Constants.filtersHeaderLabel} {totalCount !== 0 && (
                            <span>{`(${filteredCount}/${totalCount})`}</span>
                        )}
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
                        No application data to display
                    </div>
                )}
            </div>
        </div>
    );
}