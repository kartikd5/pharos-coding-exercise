import React, { memo, useContext, useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { FilterContext } from '../../App';
import './Tree.css';

export interface TreeData {
    [key: string]: any;
}

interface TreeProps {
    data: TreeData
}

interface TreeNodeProps {
    label: string;
    children: TreeData;
}

export interface TreeNodeChildren {
    id: string;
    name: string;
    spend: number;
}

export const Tree = memo(({ data }: TreeProps) => {
    return (
        <div className='tree'>
            <ul className='tree-container'>
                {Object.keys(data).map((key: string, index: number) => (
                    <TreeNode children={data[key]} key={index} label={key} />
                ))}
            </ul>
        </div>
    )
})

const TreeNode = memo(({ children, label }: TreeNodeProps) => {

    const [childVisible, setChildVisibility] = useState(false);
    const { filters, setFilters } = useContext(FilterContext);

    return (
        <li className='treeNode-container'>
            <div className='treeNode-parent'>
                <div
                    className='treeNode-arrow'
                    onClick={() => setChildVisibility(t => !t)}
                >
                    {!Array.isArray(children) && (
                        <BsFillCaretDownFill className={childVisible ? 'activeCaret' : ''} />
                    )}
                </div>
                <div className='treeNode-label-container'>
                    <div
                        className={`treeNode-label
                            ${(filters.bizCapability === label) ? 'activeLabel' : ''}`
                        }
                        onClick={() => setFilters({...filters, bizCapability: label})}
                    >
                        {label}
                    </div>
                    {!Array.isArray(children) && (
                        <div className='treeNode-badge'>{Object.keys(children).length}</div>
                    )}
                </div>
            </div>

            {!Array.isArray(children) && childVisible && (
                <div className='treeNode-children'>
                    <Tree data={children as TreeData} />
                </div>
            )}
        </li>
    )
})