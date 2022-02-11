import React, { memo, useContext, useState } from 'react';
import { BsFillCaretDownFill } from 'react-icons/bs';
import { FilterContext } from '../../App';
import './Tree.css';

export interface TreeData {
    id?: string;
    name?: string;
    spend?: number;
    label?: string;
    children?: TreeDataChild[]
}

interface TreeDataChild {
    label: string;
    children?: TreeDataChild[]
}

interface TreeProps {
    data: TreeData[] | []
}

interface TreeNodeProps {
    node: TreeData
}

export const Tree = memo(({ data }: TreeProps) => {
    return (
        <div className='tree'>
            <ul className='tree-container'>
                {data?.map((tree: TreeData, i: number) => (
                    <TreeNode key={i} node={tree} />
                ))}
            </ul>
        </div>
    )
})

const TreeNode = memo(({ node }: TreeNodeProps) => {

    const [childVisible, setChildVisibility] = useState(false);
    const { filters, setFilters } = useContext(FilterContext);

    return (
        <li className='treeNode-container'>
            <div className='treeNode-parent' onClick={() => {
                    setChildVisibility(t => !t);
                    setFilters({...filters, bizCapability: node.label, id: node.id});
                }}
            >
                <div className='treeNode-arrow'>
                    {!!node.children && (
                        <BsFillCaretDownFill className={childVisible ? 'activeCaret' : ''} />
                    )}
                </div>
                <div
                    className={`treeNode-label
                        ${(filters.id === node.id && filters.bizCapability === node.label) ? 'activeLabel' : ''}`
                    }
                >
                    {node.label}
                </div>
            </div>

            {!!node.children && childVisible && (
                <div className='treeNode-children'>
                    <Tree data={node.children} />
                </div>
            )}
        </li>
    )
})