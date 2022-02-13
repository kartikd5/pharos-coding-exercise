import { useEffect, useCallback, useContext, useState } from 'react';
import { Data } from '../../Api/Data';
import { CardContainer, Slider, Tree, TreeData, TreeNodeChildren } from '../../Components';
import { Filters, FilterContext } from '../../App';
import { Constants } from '../../Constants';
import './Dashboard.css';

function sortObjectByKey(treeObject: any): TreeData {
    const ordered =  Object.keys(treeObject).sort().reduce((obj: TreeData, key: string) => {
        obj[key] = treeObject[key];
        return obj;
    }, {});

    return ordered;
}

//  Convert the actual data.json file data to the UI Tree component friendly format
function convertData(data: Data[] | []): TreeData {
    let convertedData: TreeData = {} as TreeData;

    data.forEach((d: Data) => {
        const appData: TreeNodeChildren = (({ id, name, spend }) => ({ id, name, spend }))(d);

        convertedData[d.BCAP1] = convertedData[d.BCAP1] || {};
        convertedData[d.BCAP1][d.BCAP2!] = convertedData[d.BCAP1][d.BCAP2!] || {};
        convertedData[d.BCAP1][d.BCAP2!][d.BCAP3!] = convertedData[d.BCAP1][d.BCAP2!][d.BCAP3!] || [];
        convertedData[d.BCAP1][d.BCAP2!][d.BCAP3!].push(appData);
    });

    let ordered: TreeData = convertedData;

    ordered = sortObjectByKey(ordered);
    Object.keys(ordered).forEach(k => {
        ordered[k] = sortObjectByKey(ordered[k]);
        Object.keys(ordered[k]).forEach(j => {
            ordered[k][j] = sortObjectByKey(ordered[k][j]);
        })
    })

    return ordered;
}

//  Filter the data based on business capabilities and total spending value
function filterData(data: Data[] | [], filters: Filters): Data[] {
    if (filters?.bizCapability?.length) {
        return data?.filter(d =>
            (d.BCAP1 === filters.bizCapability ||
            d.BCAP2 === filters.bizCapability ||
            d.BCAP3 === filters.bizCapability) &&
            d.spend >= (filters.minSpending ?? 0)
        );
    } else {
        return [] as Data[];
    }
}

export const Dashboard = () => {
    const { filters } = useContext(FilterContext);
    const [actualData, setActualData] = useState<Data[] | []>([]);
    const [sidebarData, setSidebarData] = useState<TreeData>({});
    const [filteredData, setFilteredData] = useState<Data[] | []>([]);

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