import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, Fields, FieldArray } from 'redux-form';

import { Strings } from '../../../../dataProvider/localize';
import { customInput } from '../../../common/custom-input';
import { taskAreaRequired } from '../../../../utils/Validations/scopeDocValidation';
import { Icon } from 'antd';

export class AddAreas extends Component {
  render() {
    var { fields, meta: { error, submitFailed } } = this.props;
    if (fields.length === 0) {
      fields.push({});
    }

    return (
      <div className="sr-client-area">
        <label>{Strings.area_txt}</label>
        <div className="area-lists">
          {
            fields.map((area, index) => {
              return (
                <div className="d-flex no-label area-items">
                  <Field
                    name={`${area}.area_name`}
                    placeholder={Strings.area_name_sd_task}
                    type="text"
                    validate={taskAreaRequired}
                    component={customInput} />
                  {index === fields.length - 1
                    ? <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button>
                    : <button className='exp-bnt delete' type='button' onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                </div>
              )
            })
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps)(AddAreas)
