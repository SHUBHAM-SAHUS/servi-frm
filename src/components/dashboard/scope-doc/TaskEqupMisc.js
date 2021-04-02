import React from 'react';
import { reduxForm, Field, FieldArray, isDirty } from 'redux-form';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { Strings } from '../../../dataProvider/localize';
import { Icon } from 'antd';


export const renderTaskEquipments = ({ fields, equipmentList, meta: { error, submitFailed } }) => {
    if (fields.length === 0)
        fields.push({});
    return (
        <table className="equipmnt-table table equip-cast-tble no-label">
            {fields.map((equipments, index) => (
                <tr key={index}>
                    <td>
                        <fieldset className="form-group sf-form m-0">
                            <Field name={`${equipments}.equipment_id`} placeholder={Strings.equipment_id_scd} type="text"
                                options={equipmentList && equipmentList.map(equipment => ({ title: equipment.name, value: equipment.id }))}
                                component={CustomSelect} /></fieldset></td>
                    <td>
                        <fieldset className="form-group sf-form m-0 w-currency-symbl">
                            <Field name={`${equipments}.equipment_cost`} placeholder={Strings.equipment_cost_scd} type="number"
                                component={customInput} />
                        </fieldset>
                    </td>
                    <td>
                        {index === fields.length - 1 ?
                            <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button> :
                            <button className="exp-bnt delete" type="button" onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                        {submitFailed && error && <span class="error-input">{error}</span>}
                    </td>
                </tr>
            ))}

        </table>
    )
}

export const renderTaskMisc = ({ fields, equipmentList, meta: { error, submitFailed } }) => {
    if (fields.length === 0)
        fields.push({});
    return (
        <table className="equipmnt-table table equip-cast-tble no-label">
            {fields.map((equipments, index) => (
                <tr key={index}>
                    <td>
                        <fieldset className="form-group sf-form m-0">
                            <Field name={`${equipments}.miscellaneous_name`} type="text"
                                component={customInput} /></fieldset></td>
                    <td>
                        <fieldset className="form-group sf-form m-0 w-currency-symbl">
                            <Field name={`${equipments}.miscellaneous_cost`} placeholder={Strings.equipment_cost_scd} type="number"
                                component={customInput} />
                        </fieldset>
                    </td>
                    <td>
                        {index === fields.length - 1 ?
                            <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button> :
                            <button className="exp-bnt delete" type="button" onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                        {submitFailed && error && <span class="error-input">{error}</span>}
                    </td>
                </tr>
            ))}

        </table>
    )
}