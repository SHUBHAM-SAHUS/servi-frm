import React from 'react';
import { reduxForm, Field, FieldArray, isDirty, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Modal, Upload, Radio, notification, Popconfirm, Collapse } from 'antd';
import { Strings } from '../../../dataProvider/localize';
import { customInput } from '../../common/custom-input';
import { customTextarea } from '../../common/customTextarea';
import { CustomDatepicker } from '../../common/customDatepicker';
import { siteTaskValidate, isTaskStartDateRequired, taskEstimateRequired } from '../../../utils/Validations/scopeDocValidation';
import * as actions from '../../../actions/scopeDocActions';
import AddAreas from './AddNewScopeDoc/AddAreas'
import moment from 'moment'
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { customRadioGroup } from '../../common/customEsitmateRadioGroup'
import { handleFocus, DeepTrim, currencyFormat } from '../../../utils/common';
import { renderTaskEquipments, renderTaskMisc } from './TaskEqupMisc';
import { calculateEstimate } from './ViewEditScopeDoc'
import { getFormValues } from 'redux-form' // ES6
import { cutomExpandableText } from '../../common/cutomExpandableText';
import { CustomSelect } from '../../common/customSelect';
import $ from 'jquery';
import ScrollArea from 'react-scrollbar';
import EditSiteTask from './EditSiteTask';

const Dragger = Upload.Dragger;
const Panel = Collapse.Panel;


class EditSiteTaskView extends React.Component {

  frequencies = ["Day", "Week", "Month", "Year"];
  durations = ["Day", "Week", "Fortnight", "Month", "Year"];

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      file: [],
      imageFileArray: [],
      frequencyDataSource: [],
      durationDataSource: [],
      estimate_type: null
    }
  }

  // componentDidMount() {
  //   $(document).ready(function () {

  //     var swmsMainDivW = $('.swms-dymic-w').width();
  //     $('.scdo-sidebar').css('width', swmsMainDivW);

  //     $(window).bind('scroll', function () {
  //       var navHeight = $('header.ant-layout-header').height() + $('.dash-header').height() + 10;
  //       var windowHeight = $(window).height() - 70;
  //       var swmsMainDivW = $('.swms-dymic-w').width();
  //       if ($(window).scrollTop() > navHeight) {
  //         $('.scdo-sidebar').addClass('fixed');
  //         $('.scdo-sidebar').css('width', swmsMainDivW);
  //         $('.scdo-sidebar.fixed .scrollarea.sf-scroll').css('max-height', windowHeight);
  //       }
  //       else {
  //         $('.scdo-sidebar').removeClass('fixed');
  //         $('.scdo-sidebar').css('width', 'auto');
  //         $('.scdo-sidebar .scrollarea.sf-scroll').css('max-height', 'none');
  //       }
  //     });
  //   });
  // }


  render() {
    const { handleSubmit, initialValues, formValues, selectedScopeDoc, taskTags, allTasks, fileItems, showClientDetailsEdit, selectedScopeDocID, handleCancel, selectedTaskId } = this.props;

    var selectedTask = [];
    selectedTask.push(selectedTaskId.toString());
    return (
      //<div className="scdo-sidebar">
      <div className="sf-card" >
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading">{Strings.update_task_txt}</h4>
          <button class="closed-btn" onClick={this.handdleCancel}><Icon type="close" /></button>
        </div>

        <Collapse
          defaultActiveKey={[selectedTaskId]}
          className="sf-collps-rt doc-collapse"
          onChange={(args) => this.setState({ expanded: args })}
          activeKey={this.state.expanded ? this.state.expanded : selectedTask}
          expandIcon={({ isActive }) => <Icon type="caret-down" rotate={isActive ? 180 : 0} />}>
          {allTasks && allTasks.length && allTasks.map((task, index) =>
            <Panel key={task.id} className="sc-doc-panel"
              header={
                <div className="d-flex justify-content-between scope-doc-task-header-panel align-items-center">
                  <h3 className="swms-hd">{task.task_label + "  >  " + task.task_name}
                  </h3>
                  {
                    task.modified_at
                      ? <span class="material-icons icon-task-panel">check</span>
                      : <span class="material-icons icon-task-panel">clear</span>

                  }
                </div>
              }>
              <div className="sf-card-body">
                <EditSiteTask
                  form={'EditSiteTask' + task.id}
                  selectedScopeDoc={selectedScopeDoc}
                  initialValues={{
                    ...task,
                    additional_tags:
                      (task.additional_tags && task.additional_tags.length
                        && task.additional_tags.length > 0 ? task.additional_tags.map(tag => tag.id) : [])
                  }}
                  fileItems={fileItems}
                  selectedScopeDocID={selectedScopeDocID}
                  handleCancel={handleCancel}
                  showClientDetailsEdit={showClientDetailsEdit}
                  allTasks={allTasks}
                />
              </div>
            </Panel>
          )}

        </Collapse>
        {/* </div> */}
      </div >
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'EditSiteTaskView',
    validate: siteTaskValidate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(EditSiteTaskView)