import React from 'react';
import {
    sortableContainer,
    sortableElement,
    sortableHandle,
} from 'react-sortable-hoc';

const DragHandle = sortableHandle(() => <button 
className="dragde-bnt normal-bnt"
 type="button">
    <i className="material-icons" >more_horiz</i>
    <i className="material-icons" >more_horiz</i>
</button>);

export const SortableItem = sortableElement(({ children }) => (
    <li>
        <DragHandle />
        {children}
    </li>
));

export const SortableContainer = sortableContainer(({ children }) => {
    return <ul>{children}</ul>;
});
