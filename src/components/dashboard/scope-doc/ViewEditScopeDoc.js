import React, { useMemo } from 'react';
import { reduxForm, Field, FieldArray, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Menu, Dropdown, Modal, Select, notification, Upload, Collapse, Popconfirm, message, Tooltip, Checkbox } from 'antd';
import moment from 'moment';
import { getStorage, currencyFormat, handleFocus } from '../../../utils/common';
import * as actions from '../../../actions/scopeDocActions';
import * as rolePermissionAction from '../../../actions/permissionManagementAction';
import * as calendarActions from '../../../actions/jobCalendarActions'
import * as serviceAgentActions from '../../../actions/organizationAction'
import * as bookingCalendarActions from '../../../actions/bookingCalendarActions'
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, USER_NAME, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { validate, isRequired } from '../../../utils/Validations/scopeDocValidation';
import EditClientDetails from './EditClientDetails'
import EditSiteServiceDetails from './EditSiteServiceDetails'
import EditInternalNotes from './EditInternalNotes'
import EditSiteTask from './EditSiteTask'
import AreaSWMSUpdate from './SWMS/AreaSWMSUpdate';
import * as swmsAction from '../../../actions/SWMSAction';
import * as quoteAction from '../../../actions/quoteAction';
import AddSites from './AddNewScopeDoc/AddSites'
import { AddTasks } from './AddNewScopeDoc/AddTasks';
import AddNotes from './AddNewScopeDoc/AddNotes';
import $ from 'jquery';
import { customInput } from '../../common/custom-input';
import PreviewScopeDocQuote from './PreviewScopeDocQuote';
import HistoryScopeDoc from './HistoryScopeDoc';
import { CustomSelect } from '../../common/customSelect';
import TaskFileViews from '../job/taskFilesView';
import ReactHtmlParser from 'react-html-parser';
import { SortableContainer, SortableItem } from '../../common/handleSortHOC'
import arrayMove from 'array-move';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { DeepTrim } from '../../../utils/common';
import { renderTaskEquipments, renderTaskMisc } from './TaskEqupMisc';

import * as consequncesAction from '../../../actions/consequenceBeforeActions'
import * as likelyHoodAction from '../../../actions/likelyhoodBeforeControlAction'
import BookJob from './BookJob/BookJob';
import EditSiteTaskView from './EditSiteTaskView';
import _ from "lodash"

import BookingCalendar from './BookingCalendar/BookingCalendar'
import EditConditions from './EditConditions';
import HtmlParser from 'react-html-parser';

const { Option, OptGroup } = Select;
const { Panel } = Collapse;
class ViewEditScopeDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'none',
      showSWMS: 'none',
      showBookJob: 'none',
      addNewInternalNoteFlag: false,
      selectedSite: {},
      selectedSiteTask: {},
      selectedSiteTaskSWMS: {},
      selectedSiteItem: {},
      cardExpnadBtn: true,
      sameTaskId: [],
      generateQuote: false,
      previewQuote: false,
      clientAcceptance: false,
      viewTaskFiles: false,
      taskFiles: [],
      sites: [],
      hisVisible: false,
      showBookingCalendar: false,
      taskSelected: [],
      selectedTaskId: null,
      selectedSWMSId: null,

    }
    this.apiLock = true;
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    //this.getScoopeDocDetails()
  }

  taskselected = _.memoize((props) => this.getAllTasks(props).
    map(tsk => tsk.task_selected_for_quote ? tsk.id : undefined).filter(tsk => tsk)
  )

  componentWillReceiveProps(currentProps) {

    this.state.sites = currentProps.selectedScopeDoc.sites
    // this.state.taskSelected = this.taskselected(currentProps);
    if (currentProps.selectedScopeDoc.id !== this.props.selectedScopeDoc.id) {
      this.quoteAmt = 0;
      this.equipmentCost = 0;
      this.state.showClientDetailsEdit = 'none'
      this.state.showConditionsEdit = false
        this.state.showSSDEdit = 'none'
      this.state.showNotesEdit = 'none'
      this.state.showTaskEdit = 'none'
      this.state.showSWMS = 'none'
      this.state.showBookJob = 'none'
      this.state.generateQuote = false
      this.admin_user_name = undefined
      this.state.clientAcceptance = false
      this.state.poNumber = undefined
      this.state.file = [];
      this.state.taskSelected = this.taskselected(currentProps);
      /* this.state.quote_number = currentProps.selectedScopeDoc.quote_number ?
        currentProps.selectedScopeDoc.quote_number : this.state.quote_number */
      this.state.sites = currentProps.selectedScopeDoc.sites
      if (currentProps.selectedScopeDoc && currentProps.selectedScopeDoc.client_person && currentProps.selectedScopeDoc.client_person.id && currentProps.selectedScopeDoc.client_person.client_id) {
        currentProps.action.getSitesListByClientPerson(currentProps.selectedScopeDoc.client_person.client_id, currentProps.selectedScopeDoc.client_person.id)
          .then((flag) => {

          })
          .catch((message) => {
            notification.error({
              key: ERROR_NOTIFICATION_KEY,
              message: Strings.error_title,
              description: message ? message : Strings.generic_error,
              onClick: () => { },
              className: 'ant-error'
            });
          });
      }

    }
  }

  componentDidMount() {
    this.props.swmsAction.getOrgSWMS();
    this.props.swmsAction.getToolbox();
    this.props.swmsAction.getSWMSControl();
    this.props.action.getEquipments();
    this.props.action.getTaskTags();
    this.props.likelyHoodAction.initLikelyhoodBeforeControl()
    this.props.consequncesAction.initConsequenceBefore()
    this.setState({
      sites: this.props.selectedScopeDoc.sites,
      taskSelected: this.taskselected(this.props)
    })
    if (this.props.selectedScopeDoc && this.props.selectedScopeDoc.client_person && this.props.selectedScopeDoc.client_person.id && this.props.selectedScopeDoc.client_person.client_id) {
      this.props.action.getSitesListByClientPerson(this.props.selectedScopeDoc.client_person.client_id, this.props.selectedScopeDoc.client_person.id)
        .then((flag) => {

        })
        .catch((message) => {
          notification.error({
            key: ERROR_NOTIFICATION_KEY,
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        });
    }

    // fixed right panel 
    $(document).ready(function () {
      $(window).bind('scroll', function () {
        var navHeight = $('header.ant-layout-header').height() + $('.dash-header').height() + 10;
        if ($(window).scrollTop() > navHeight) {
          $('body').addClass('scroll-f-scopdoc');
        }
        else {
          $('body').removeClass('scroll-f-scopdoc');
        }
      });
    });
      
    //fixed check expand
    $(document).on('click', 'label.tsk_select_check', e=>{
      console.log(e, "!!!!!!!!!!!!!!!!!!!")
      e.stopImmediatePropagation();})
  }


  getScoopeDocDetails = () => {

    this.props.action.getScopeDocDetails(this.props.location.state).then((flag) => {
      this.setState({
        showClientDetailsEdit: 'none',
        showSSDEdit: 'none',
        showNotesEdit: 'none',
        showTaskEdit: 'none',
        addNewInternalNoteFlag: false,
        selectedSite: {},
        selectedSiteTask: {},
        previewQuote: false,

      })
    }).catch((message) => {

      notification.error({
        key: ERROR_NOTIFICATION_KEY,
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  onSubmit = async (formData, callback, props, admin_approve_status) => {
    formData = await DeepTrim(formData);

    var sitesArray = []
    var { sitetask, internal_notes, sites } = formData;
    if (sitetask) {
      for (let i = 0; i < sitetask.length; i++) {
        if (sitetask[i] != null && sitetask[i][0]) {
          const task = sitetask[i]
          // if (task[0] && task[0].frequency) {
          //   sitetask[i][0].frequency = task[0].frequency.toUpperCase().split(' ').join('_')
          // }

          // if (task[0] && task[0].duration) {
          //   sitetask[i][0].duration = task[0].duration.toUpperCase().split(' ').join('_')
          // }
          sitesArray.push({ id: task[0].site_id, site_id: task[0].site_id, site_name: task[0].site_name, client_id: this.props.selectedScopeDoc.client_id, tasks: sitetask[i] })
        }
      }
    }


    if (sites) {
      for (let i = 0; i < sites.length; i++) {
        if (sites[i].tasks) {
          let task = sites[i].tasks
          // for (let j = 0; j < task.length; j++) {
          //   if (task[j].frequency) {
          //     sites[i].tasks[j].frequency = task[j].frequency.toUpperCase().split(' ').join('_')
          //   }

          //   if (task[j].duration) {
          //     sites[i].tasks[j].duration = task[j].duration.toUpperCase().split(' ').join('_')
          //   }
          // }
        }
        //If site slected from autocompelte starts
        let selectedSite = this.props.sitesListByPersons && this.props.sitesListByPersons.find(site1 =>
          site1.site.id.toString() === sites[i].site_name.toString()
        )
        if (selectedSite) {
          const refinedSite = (({ job_name, site_name, street_address, city, state, zip_code, country }) => ({
            job_name, site_name, street_address, city, state, zip_code, country
          }))(selectedSite.site)

          sites[i] = { tasks: sites[i].tasks, ...refinedSite, site_id: parseInt(sites[i].site_name), selectedSiteFlag: true };
        }
        //If site slected from autocompelte end

        sitesArray.push(sites[i])
      }
    }
    if (this.state.generateQuote) {
      var valueKeys = Object.keys(formData).filter(key => key.startsWith('value$'))
      formData.sites_quote = formData.sites_quote.map(site => { return { ...site, ...site.site } })
      if (valueKeys.length > 0) {
        valueKeys.forEach(key => {
          var keyIds = key.split('$')[1].split('_');
          var siteIndex = formData.sites_quote.findIndex(site => site.site_id == keyIds[0])
          if (siteIndex >= 0) {
            var taskIndex = formData.sites_quote[siteIndex].tasks.findIndex(task => task.id == keyIds[1]);
            if (taskIndex >= 0) {
              formData.sites_quote[siteIndex].tasks[taskIndex].amount = formData[key]
              if (formData.sites_quote[siteIndex].tasks[taskIndex].frequency) {
                formData.sites_quote[siteIndex].tasks[taskIndex].frequency = formData.sites_quote[siteIndex].tasks[taskIndex].frequency.toUpperCase().split(' ').join('_')
              }
              if (formData.sites_quote[siteIndex].tasks[taskIndex].duration) {
                formData.sites_quote[siteIndex].tasks[taskIndex].duration = formData.sites_quote[siteIndex].tasks[taskIndex].duration.toUpperCase().split(' ').join('_')
              }
            }
          }
        })
      }

      /* For amount and  */

      var adjustmentKeys = Object.keys(formData).filter(key => key.startsWith('adjustment$'))
      if (adjustmentKeys.length > 0) {
        adjustmentKeys.forEach(key => {
          var keyIds = key.split('$')[1].split('_');
          var siteIndex = formData.sites_quote.findIndex(site => site.site_id == keyIds[0])
          if (siteIndex >= 0) {
            var taskIndex = formData.sites_quote[siteIndex].tasks.findIndex(task => task.id == keyIds[1]);
            if (taskIndex >= 0) {
              formData.sites_quote[siteIndex].tasks[taskIndex].adjustment_value = formData[key]
            }
          }
        })
      }

      var equipmentsKeys = Object.keys(formData).filter(key => key.startsWith('equipments$'))
      if (equipmentsKeys.length > 0) {
        equipmentsKeys.forEach(key => {
          var keyIds = key.split('$')[1].split('_');
          var siteIndex = formData.sites_quote.findIndex(site => site.site_id == keyIds[0])
          if (siteIndex >= 0) {
            var taskIndex = formData.sites_quote[siteIndex].tasks.findIndex(task => task.id == keyIds[1]);
            if (taskIndex >= 0) {
              formData.sites_quote[siteIndex].tasks[taskIndex].equipments = formData[key]
            }
          }
        })
      }

      var miscKeys = Object.keys(formData).filter(key => key.startsWith('miscellaneous$'))
      if (miscKeys.length > 0) {
        miscKeys.forEach(key => {
          var keyIds = key.split('$')[1].split('_');
          var siteIndex = formData.sites_quote.findIndex(site => site.site_id == keyIds[0])
          if (siteIndex >= 0) {
            var taskIndex = formData.sites_quote[siteIndex].tasks.findIndex(task => task.id == keyIds[1]);
            if (taskIndex >= 0) {
              formData.sites_quote[siteIndex].tasks[taskIndex].miscellaneous = formData[key]
            }
          }
        })
      }

      var calcuKeys = Object.keys(formData).filter(key => key.startsWith('calculated$'))
      if (calcuKeys.length > 0) {
        calcuKeys.forEach(key => {
          var keyIds = key.split('$')[1].split('_');
          var siteIndex = formData.sites_quote.findIndex(site => site.site_id == keyIds[0])
          if (siteIndex >= 0) {
            var taskIndex = formData.sites_quote[siteIndex].tasks.findIndex(task => task.id == keyIds[1]);
            if (taskIndex >= 0) {
              formData.sites_quote[siteIndex].tasks[taskIndex].calculated_value = formData[key]
            }
          }
        })
      }


      /* ---- */
      sitesArray = [...formData.sites_quote, ...sitesArray];
    }

    var equipments = []
    if (formData.quote_equipments) {
      for (let i = 0; i < formData.quote_equipments.length; i++) {
        if (formData.quote_equipments[i].equipment_cost && formData.quote_equipments[i].equipment_id) {
          equipments.push(formData.quote_equipments[i])
        }
      }
    }

    if (internal_notes && internal_notes.length > 0) {
      let internalNotes = [];
      internal_notes.forEach(note => {
        if (note.note) {
          internalNotes.push(note);
        }
      })
      internal_notes = internalNotes;
    } else {
      internal_notes = [];
    }

    var values = {
      scope_docs_id: this.props.selectedScopeDoc.id,
      scope_doc_code: this.props.selectedScopeDoc.scope_doc_code,
      org_id: this.props.selectedScopeDoc.created_by_organisation_id,
      client_id: this.props.selectedScopeDoc.client_id,
      person_id: (this.props.selectedScopeDoc.client_person && this.props.selectedScopeDoc.client_person && this.props.selectedScopeDoc.client_person.id) ? this.props.selectedScopeDoc.client_person.id : null,
      sites: sitesArray,
      internal_notes: internal_notes ? internal_notes : [],
      save_quote_flag: +this.state.generateQuote,
      total_amount: this.quoteAmt + (this.quoteAmt * this.props.selectedScopeDoc.GSTINPERCENT / 100),
      sub_total_amount: this.quoteAmt,
      quote_number: this.props.selectedScopeDoc.quote_number ? this.props.selectedScopeDoc.quote_number :
        this.state.quote_number,
      quote_label: this.props.selectedScopeDoc.quote_label ? this.props.selectedScopeDoc.quote_label :
        this.state.quote_label,
      version_number: this.props.selectedScopeDoc.version_number ? this.props.selectedScopeDoc.version_number :
        this.state.version_number,
      quote_equipments: equipments,
      client_approve_status: this.props.quote_client_approve_status,
      conditions: formData.conditions
    }

    if (this.props.selectedScopeDoc.quote_number) {

      this.props.quoteAction.updateQuote(values).then((res) => {

        this.props.reset()
        if (admin_approve_status && callback) {
          callback(admin_approve_status)
        } else {
          this.props.action.getScopeDoc();
          notification.success({
            message: Strings.success_title,
            description: res.message,
            onClick: () => { },
            className: 'ant-success'
          });
        }
        this.setState({ showSSDEdit: 'none', generateQuote: false, showConditionsEdit: false })
      }).catch((error) => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description: error && error.data && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_validate,
            onClick: () => { },
            className: 'ant-warning'
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description: error && error.data && error.data.message && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        }
      });

    }
    else {
      this.props.action.UpdateScopeDoc(values).then((res) => {
        this.props.action.getScopeDoc();
        if (admin_approve_status && callback) {
          callback(admin_approve_status)
        } else {
          this.props.action.getScopeDoc();
          notification.success({
            message: Strings.success_title,
            description: res.message,
            onClick: () => { },
            className: 'ant-success'
          });
        }
        this.props.reset()
        this.setState({ showSSDEdit: 'none', generateQuote: false, showConditionsEdit: false })
      }).catch((error) => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description: error && error.data && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_validate,
            onClick: () => { },
            className: 'ant-warning'
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description: error && error.data && error.data.message && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        }
      });
    }

  }

  handleSiteSWMSSelect = (task_item, site_item, task_number) => {
    console.log(site_item, "site_item")

    var allTasks = this.getAllTasks()
    var sameNameTask = allTasks.filter(task => task.task_name.toUpperCase() === task_item.task_name.toUpperCase());
    // var selectedTask = { ...task_item };
    // selectedTask.areas = []
    // sameNameTask.forEach(task => selectedTask.areas = [...selectedTask.areas, ...task.areas]);
    var sameTaskId = sameNameTask.map(task => task.id)
    this.props.swmsAction.getSWMSByTask(JSON.stringify(this.props.selectedScopeDoc.id));
    this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'none',
      selectedSiteTaskSWMS: task_item,
      showSWMS: 'block',
      showBookJob: 'none',
      sameTaskId, selectedSiteItem: site_item,
      task_number: task_number,
      allTasks: allTasks,
      selectedSWMSId: task_item.id,

    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleBookJob = (task_item) => {
    var allTasks = this.getAllTasks();
    this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'none',
      selectedSiteTaskSWMS: task_item,
      showSWMS: 'none',
      showBookJob: 'block',
      allTasks: allTasks,

    });
  }

  updateBookTask = () => {
    var allTasks = this.getAllTasks();
    this.setState({ allTasks: allTasks });
  }
  handleEditClientDetailsClick = () => {
    this.setState({
      showClientDetailsEdit: 'block',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'none',
      showSWMS: 'none',
      showBookJob: 'none',

    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleEditConditions = () => {
    this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'none',
      showSWMS: 'none',
      showBookJob: 'none',
      showConditionsEdit: true,
    });
  }

  handlePermissionEditClick = () => {
    this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'block',
      showSWMS: 'none',
      showBookJob: 'none',

    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleEditSSDClick = (site_item) => {
    this.props.reset()
    this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'block',
      showNotesEdit: 'none',
      showTaskEdit: 'none',
      selectedSite: site_item,
      showSWMS: 'none'
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleEditNotesClick = () => {
    this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'block',
      showTaskEdit: 'none',
      showSWMS: 'none',
      showBookJob: 'none',

    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleEditTaskClick = (task_item) => {
    var allTasks = this.getAllTasks();
    this.setState({
      showTaskEdit: 'none'
    }, () => this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'block',
      selectedSiteTask: task_item,
      showSWMS: 'none',
      allTasks: allTasks,
      selectedTaskId: task_item.id
    }))
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleCancel = () => {
    this.setState({
      showClientDetailsEdit: 'none',
      showSSDEdit: 'none',
      showNotesEdit: 'none',
      showTaskEdit: 'none',
      showSWMS: 'none',
      showBookJob: 'none',
      sameTaskId: [],
      viewTaskFiles: false,
      taskFiles: [],

    });
  }

  // History modal function	
  showHistoryModal = (versionNumber) => {
    this.props.action.getScopeDocVersionHistory(this.props.selectedScopeDoc.id, versionNumber)
      .then(() => {
        this.setState({
          hisVisible: true,
        });
      })
      .catch(err => {
      })
  };
  hisHandleCancel = e => {
    this.setState({
      hisVisible: false,
    });
  };

  handleChildClick = (e) => {
    e.stopPropagation();
  }

  getAllTasks = (props) => {
    let allTasks = []
    let sites = props && props.selectedScopeDoc && props.selectedScopeDoc.sites
      ? props.selectedScopeDoc.sites
      : this.props.selectedScopeDoc.sites
    sites && sites.forEach(site => {
      allTasks = [...allTasks, ...site.tasks];
    });
    return allTasks;
  }

  taskSelectionApi = () => {
    const { taskSelected } = this.state;
    this.props.quoteAction.taskSelection({
      tasks: this.getAllTasks().map(tsk => (
        { id: tsk.id, task_selected_for_quote: +taskSelected.includes(tsk.id) }
      ))
    })
    console.log(this.getAllTasks().map(tsk => (
      { id: tsk.id, task_selected_for_quote: +taskSelected.includes(tsk.id) }
    )))
  }

  handleQuoteClick = () => {
    this.taskSelectionApi();
    this.props.action.swmsCompleted(this.props.selectedScopeDoc.id)
      .then(() => {
        this.props.history.push('./sendQuoteMail')
      }).catch((message) => {
        notification.warning({
          message: Strings.validate_title,
          description: message ? message : Strings.generic_validate,
          onClick: () => { },
          className: 'ant-warning'
        });
      })
  }

  handlePreviewClick = () => {
    this.setState({ previewQuote: true })
  }

  cancelQuotePreview = () => {
    this.setState({ previewQuote: false })
  }

  handleTaskDelete = (task_item) => {
    this.setState({ showTaskEdit: 'none' })
    Modal.confirm({
      title: "Delete Task",
      content: "Do you wants to delete this Task",
      onOk: () => this.handdleOk(task_item),
      cancelText: "Cancel",
    });
  }

  handdleOk = (task_item) => {
    var scope_docs_id = this.props.selectedScopeDoc.id
    this.props.action.deleteSiteTask(task_item.id, scope_docs_id, this.props.location.state).then((res) => {
      this.props.action.getScopeDoc();
      notification.success({
        message: Strings.success_title,
        description: res.message,
        onClick: () => { },
        className: 'ant-success'
      });
    }).catch((message) => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  getSSDAreas = (areas) => {
    if (areas.length > 0) {
      const str = areas.map(area => {
        return area.area_name
      })
      const jointString = str.join(', ');
      return jointString;
    }
    return ''
  }

  addNewNoteField = () => {
    this.setState({
      addNewInternalNoteFlag: true
    })
  }

  removeNewNoteField = () => {
    this.setState({
      addNewInternalNoteFlag: false
    })
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  handleGenerateQuote = () => {
    this.props.quoteAction.generateQuote({ scope_doc_id: this.props.selectedScopeDoc.id })
      .then(data => {
        this.setState({ generateQuote: true, quote_number: data.quote_number, quote_label: data.quote_label, version_number: data.version_number })
        this.props.change("test", true);
      })
      .catch((message) => {

        notification.warning({
          message: Strings.validate_title,
          description: message ? message : Strings.generic_validate,
          onClick: () => { },
          className: 'ant-warning'
        });
      });

  }

  calculateQuoteAmount = () => {
    if (this.state.generateQuote || this.props.selectedScopeDoc.quote_number) {
      var { formValues } = this.props;
      var amount = 0;
      var valueKeys = Object.keys(formValues).filter(key => key.startsWith('value$'))
      if (valueKeys.length > 0)
        amount = valueKeys.reduce((acc, key) => acc + parseFloat(formValues[key]), 0);
      var { sitetask, sites, sites_quote } = formValues;
      if (sitetask) {
        for (let i = 0; i < sitetask.length; i++) {
          if (sitetask[i] != null && sitetask[i][0] && sitetask[i][0].amount) {
            amount = amount + parseFloat(sitetask[i][0].amount)
          }
        }
      }
      if (sites) {
        sites.forEach((site) => {
          if (site.tasks) {
            amount = site.tasks.reduce((acc, task) => {
              if (task.amount) {
                return acc + parseFloat(task.amount);
              }
              return acc;
            }
              , amount)
          }
        })
      }
      if (sites_quote) {
        sites_quote.forEach((site) => {
          if (site.tasks) {
            amount = site.tasks.reduce((acc, task) => {
              if (task.amount) {
                return acc + parseFloat(task.amount);
              }
              return acc;
            }
              , amount)
          }
        })
      }
      return amount;
    }
  }

  handleSendForApproval = () => {
    this.props.quoteAction.adminListGet().then(flag => {
      Modal.confirm({
        title: Strings.quote_select_admin,
        content:
          <div className="slt-org-mdl">
            <Select className="sf-form w-100 "
              // defaultValue={this.props.adminList && this.props.adminList[0] &&
              // this.props.adminList[0].user_name}
              onChange={(value) => {
                this.admin_user_name = value;
              }}>
              {this.props.adminList ? this.props.adminList.map((item) =>
                (<Option value={item.user_name}>{item.first_name}</Option>)) :
                null}
            </Select>
          </div>
        ,
        onOk: () => {
          if (this.admin_user_name) {
            this.props.quoteAction.adminApproval({
              admin_user_name: this.admin_user_name,
              quote_id: this.props.selectedScopeDoc.quotes[0].id,
              // quote_number: this.props.quote_number,
              scope_doc_id: this.props.selectedScopeDoc.id,
              quote_number: this.props.selectedScopeDoc.quote_number
            }).then((res) => {
              notification.success({
                message: Strings.success_title,
                description: res.message,
                onClick: () => { },
                className: 'ant-success'
              });
            }).catch((message) => {

              notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
              });
            });
          }
        },
        okButtonProps: { disabled: (this.props.adminList.length === 0) },
        onCancel() { },
      });
    })
  }

  handleAdminApproval = (admin_approve_status) => {
    this.onSubmit(this.props.formValues, this.adminApprovalFunc, {}, admin_approve_status)

  }
  adminApprovalFunc = (admin_approve_status) => {
    this.props.quoteAction.acceptQuote({
      admin_approve_status, quote_id: this.props.selectedScopeDoc.quotes[0].id,
      scope_doc_id: this.props.selectedScopeDoc.id
    })
      .then((res) => {
        this.props.action.getScopeDoc();
        notification.success({
          message: Strings.success_title,
          description: res.message,
          onClick: () => { },
          className: 'ant-success'
        });
      }).catch((message) => {

        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  calculateEquipmentAmount = () => {
    if (this.state.generateQuote || this.props.selectedScopeDoc.quote_number) {
      var { formValues } = this.props;
      var amount = 0;
      var { quote_equipments } = formValues;
      if (quote_equipments) {
        for (let i = 0; i < quote_equipments.length; i++) {
          if (quote_equipments[i] != null && quote_equipments[i].equipment_cost) {
            amount = amount + parseFloat(quote_equipments[i].equipment_cost)
          }
        }
      }
      return amount
    }
  }

  renderEquipments = ({ fields, meta: { error, submitFailed } }) => {
    const { selectedScopeDoc, equipmentList } = this.props
    /*  if (fields.length === 0)
       fields.push({ equipment_id: [] }); */
    return (
      <table className="equipmnt-table table equip-cast-tble mb-0 no-label">
        <tr>
          <th>Type of Equipment</th>
          <th>Note</th>
          <th>Cost ($)</th>
          <th></th>
        </tr>

        {/* {selectedScopeDoc && selectedScopeDoc.quotes && selectedScopeDoc.quotes[0].equipments ? selectedScopeDoc.quotes[0].equipments.map((item) => (
          <tr>
            <td>{item.equipment.name}</td>
            <td>${item.equipment_cost}</td>
            <td><button type="button" class="delete-bnt delete-bnt"><i class="fa fa-trash-o"></i></button></td>
          </tr>
        )) : ''} */}

        {fields.map((equipments, index) => (
          <tr key={index}>
            <td>
              <fieldset className="form-group sf-form m-0">
                <Field name={`${equipments}.equipment_id`} placeholder={Strings.equipment_id_scd} type="text"
                  options={equipmentList.map(equipment => ({ title: equipment.name, value: equipment.id }))}
                  component={CustomSelect} /></fieldset></td>
            <td style={{ width: '30%' }}>
              <fieldset className="form-group sf-form m-0 ">
                <Field name={`${equipments}.note`} placeholder={Strings.equipment_note} type="text"
                  component={customInput} />
              </fieldset>
            </td>
            <td style={{ width: '10%' }}>
              <fieldset className="form-group sf-form m-0 w-currency-symbl">
                <Field name={`${equipments}.equipment_cost`} placeholder={Strings.equipment_cost_scd} type="text"
                  component={customInput} />
              </fieldset>
            </td>
            {/* <td style={{ width: '30%' }}>
              <fieldset className="form-group sf-form m-0">
                <Field name={`${equipments}.note`} placeholder={Strings.equipment_note} type="text"
                  component={customInput} />
              </fieldset>
            </td> */}

            <td>
              {index === fields.length - 1 ?
                <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button> :
                <button className="exp-bnt delete" type="button" onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
              {submitFailed && error && <span class="error-input">{error}</span>}
            </td>
          </tr>
        ))}
        <tr>
          <td></td>
          <td></td>
          <td colspan="2">
            <div className="eqip-total-vlue">
              <span>Total</span>
              <b>{currencyFormat(this.equipmentCost)}</b>
            </div>
          </td>
        </tr>
      </table>
    )
  }

  handleClientApproval = () => {
    this.taskSelectionApi();
    var formData = {
      client_approve_status: 3, quote_id: this.props.selectedScopeDoc.quotes[0].id,
      scope_doc_id: this.props.selectedScopeDoc.id, quote_po_no: this.state.poNumber
    };
    var finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key])
        finalFormData.append(key, formData[key]);
    })
    if (this.state.file && this.state.file.length > 0)
      finalFormData.append("po_document", this.state.file[0]);
    this.props.quoteAction.clientAcceptanceMannual(finalFormData, this.props.selectedScopeDoc.id)
      .then((res) => {
        this.props.action.getScopeDoc();
        this.setState({ clientAcceptance: false })
        notification.success({
          message: Strings.success_title,
          description: res.message,
          onClick: () => { },
          className: 'ant-success'
        });
      }).catch((error) => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description: error && error.data && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_validate,
            onClick: () => { },
            className: 'ant-warning'
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description: error && error.data && error.data.message && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        }
      });
  }

  handleCalendarClick = (event, task) => {
    this.props.serviceAgentActions.getServiceAgent();
    this.props.history.push({
      pathname: '/dashboard/jobCalendar',
      qid: this.props.selectedScopeDoc && this.props.selectedScopeDoc.quotes && this.props.selectedScopeDoc.quotes.length > 0 && this.props.selectedScopeDoc.quotes[0].id,
      jumpToDate: task.start_date
    })
  }

  handleTaskFileView = (files, e) => {
    e.stopPropagation();
    if (files && files.length > 0) {
      this.setState({
        viewTaskFiles: true, taskFiles: files
      });
    }
  }



  checkParsed = (stringToTest) => {
    try {
      if (JSON.parse(stringToTest)) {
        return true
      }
    }
    catch (err) {
      return false
    }
    return false;
  }
  removeFile = () => this.setState({ file: [], logoImageURL: '' });

  callReorderApi = (index) => {
    this.apiLock = false;
    var scope_docs_id = this.props.selectedScopeDoc.id;
    var formData = { tasks: [] }
    if (this.state.sites)
      this.state.sites.forEach(site => {
        if (site.tasks)
          site.tasks.forEach((task, index) => {
            formData.tasks.push({ id: task.id, task_order: index + 1 });
          })
      })

    setTimeout(() => {
      this.props.action.reorderTasks(scope_docs_id, formData)
        .then((res) => {
          notification.success({
            message: Strings.success_title,
            description: res.message,
            onClick: () => { },
            className: 'ant-success'
          });
          this.apiLock = true;
        }).catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
          this.apiLock = true;
        });
    }, 3000);

  }

  calulateTotal(site_id, task_id, estimate) {
    var { formValues } = this.props;
    var equipments = formValues[`equipments$${site_id}_${task_id}`]
    var miscs = formValues[`miscellaneous$${site_id}_${task_id}`]
    var total = 0;
    if (equipments)
      total = equipments.reduce((acc, curr) => {
        if (curr.equipment_cost)
          return acc + parseFloat(curr.equipment_cost)
        else
          return acc
      }, total);
    if (miscs)
      total = miscs.reduce((acc, curr) => {
        if (curr.miscellaneous_cost)
          return acc + parseFloat(curr.miscellaneous_cost)
        else
          return acc
      }, total);
    total = total + parseFloat(estimate) + parseFloat(formValues[`adjustment$${site_id}_${task_id}`]);
    this.props.change(`value$${site_id}_${task_id}`, total)
    this.props.change(`calculated$${site_id}_${task_id}`, total - parseFloat(formValues[`adjustment$${site_id}_${task_id}`]))
    return total;
    /* Object.keys(formValues).filter(key => key.startsWith('value$')) */

  }

  showQuoteInstanceDetails = (scopeDocId, clientId, quote_number) => {
    this.props.action
      .getScopeDocDetails(scopeDocId, null, quote_number)
      .then(flag => {
        this.props.action.getPrimaryPersons(clientId);
        this.props.history.push({ pathname: '../scopedoc/showScopeDoc', state: scopeDocId })
      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      });
  };

  handleRebookQuote = (scopeDocId, quote_number, clientId) => {
    this.props.action
      .rebookQuote(scopeDocId, quote_number)
      .then(message => {
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: message ? message : "Quote Rebook Successfully.",
            onClick: () => { },
            className: 'ant-success'
          });
          this.props.action.getPrimaryPersons(clientId);
          this.props.history.push({ pathname: '../scopedoc/showScopeDoc', state: scopeDocId })
        }
      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      });
  }

  handleBookCalendarView = () => {
    const allTasks = this.getAllTasks();
    this.setState({ showBookingCalendar: true, showBookJob: "block", allTasks })
    this.props.bookingCalendarActions.setBookingCalendarStatus(this.state.showBookingCalendar)
  }

  handleShowQuote = () => {
    this.setState({ showBookingCalendar: false, showBookJob: "none" })
  }

  onTaskSelect = (id) => {
    let { taskSelected } = this.state;
    const index = taskSelected.findIndex(tsk => tsk === id);
    if (index >= 0) {
      taskSelected.splice(index, 1);
    }
    else {
      taskSelected.push(id)
    }
    this.setState({ taskSelected })
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.location.state !== this.props.location.state) {
      this.setState({ showBookingCalendar: false })
    }

  }

  render() {
    const { handleSubmit, selectedScopeDoc, formValues, historyMetadata } = this.props;
    this.quoteAmt = this.calculateQuoteAmount();
    this.equipmentCost = this.calculateEquipmentAmount()
    this.quoteAmt = this.quoteAmt + this.equipmentCost;
    let task_number = 1;
    const uploadPicProps = {
      beforeUpload: file => {
        this.setState({
          file: [file],
        });
        return false;
      },
      multiple: false,
      onChange: (info) => {
        this.props.change(`isDirty`, false)
      },
      accept: ".jpeg,.jpg,.png,.pdf",
      fileList: this.state.file,
      onRemove: this.removeFile
    };

    var menu = (
      <Menu>
        <Menu.Item onClick={this.handleEditClientDetailsClick}>
          Client Details
        </Menu.Item>
      </Menu>
    );
    let existFrequncyFlag = false;
    if (selectedScopeDoc && selectedScopeDoc.sites && selectedScopeDoc.sites.length > 0) {
      for (let site of selectedScopeDoc.sites) {
        if (site && site.tasks && site.tasks.length > 0) {
          for (let task of site.tasks) {
            if (task.frequency) {
              existFrequncyFlag = true;
            }
          }
        }
      }
    }

    return (
      <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="row">
          {
            !this.state.showBookingCalendar
              ? <div className="col-lg-8 col-md-12 mb-4">
                <form onSubmit={handleSubmit(this.onSubmit)} >
                  <div className="sf-card-wrap">
                    {/* zoom button  */}
                    <div className="card-expands">
                      <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                        <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} />
                      </button>
                    </div>
                    <div className="sf-card scope-v-value">
                      <div className="sf-card-head">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="doc-vlue">{Strings.scope_doc_txt_scop_doc}
                            <span>{selectedScopeDoc.scope_doc_code} <i class="material-icons">lock</i></span>
                            {this.state.generateQuote || selectedScopeDoc.quote_number ?
                              <div className="quote doc-vlue">Quote #: <span>{selectedScopeDoc.quote_number ? selectedScopeDoc.quote_number :
                                this.state.quote_number}</span></div> : null}
                          </div>
                          <strong className="doc-v-usr"><span>{selectedScopeDoc.role_name}:</span>{selectedScopeDoc.organisation_name}</strong>
                        </div>
                        <div className="scp-doc-hs-qut">
                          {
                            this.props.versionCount !== 0
                              ? <div className="quote view-jd-history sf-page-history mt-2">
                                <Collapse className="show-frquency-box his-li-table" bordered={false} accordion
                                  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                  <Panel header="View History" key="1">
                                    <div className="history-lists">
                                      <table className="table">
                                        <tr>
                                          <th>Date/Time</th>
                                          <th>Status</th>
                                          <th>User</th>
                                          <th>Role</th>
                                        </tr>
                                        {
                                          this.props.versions.map((versionNumber, index) => (
                                            <tr>
                                              <td>
                                                <button type="button" class="normal-bnt" onClick={() => this.showHistoryModal(versionNumber)}>{`${historyMetadata && historyMetadata[index] && historyMetadata[index].created_at ? moment(historyMetadata[index].created_at).format('DD/MM/YY H:mm:ss') : ''}`}</button>
                                              </td>
                                              <td>{historyMetadata && historyMetadata[index] && historyMetadata[index].status}</td>
                                              <td>{historyMetadata && historyMetadata[index] && historyMetadata[index].created_by_user}</td>
                                              <td>{historyMetadata && historyMetadata[index] && historyMetadata[index].created_by_role}</td>
                                            </tr>
                                          ))
                                        }
                                      </table>
                                    </div>
                                  </Panel>
                                </Collapse>
                              </div>
                              : null
                          }</div>
                        <div className="scp-doc-hs-qut">
                          {
                            selectedScopeDoc && selectedScopeDoc.quote_list && selectedScopeDoc.quote_list.length > 0
                              ? <div className="quote view-jd-history sf-page-history mt-2">
                                <Collapse className="show-frquency-box his-li-table" bordered={false} accordion
                                  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                  <Panel header="Quote Instances" key="1">
                                    <div className="history-lists">
                                      <table className="table">
                                        <tr>
                                          <th>Quote Number</th>
                                          <th>Admin Approve Status</th>
                                          <th>Client Approve Status</th>
                                        </tr>
                                        {
                                          selectedScopeDoc.quote_list.map((quote, index) => (
                                            <tr>
                                              <td>
                                                <button type="button" class="normal-bnt" onClick={() => this.showQuoteInstanceDetails(selectedScopeDoc.id, selectedScopeDoc.client_id, quote.quote_number)}>{quote.quote_number}</button>
                                              </td>
                                              <td>{quote && quote.admin_approve_status == 3 ? "Approved" : "Not Approved"}</td>
                                              <td>{quote && quote.client_approve_status == 3 ? "Approved" : "Not Approved"}</td>
                                            </tr>
                                          ))
                                        }
                                      </table>
                                    </div>
                                  </Panel>
                                </Collapse>
                              </div>
                              : null
                          }
                        </div>
                      </div>
                    </div>

                    <div className="sf-card mt-4">
                      <Collapse defaultActiveKey="1" className="sc-doc-collapse-pnl" bordered={false} accordion
                        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                        <div className="info-btn">
                          <Dropdown className="more-info" overlay={menu}>
                            <i className="material-icons">more_vert</i>
                          </Dropdown>
                        </div>
                        <Panel className="sc-doc-co-head"
                          header={
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                              <h2 className="sf-pg-heading hd-w-clps">{Strings.client_details}</h2>
                            </div>
                          } key="1">

                          <div className="sf-card-body">
                            <div className="row">
                              <div className={selectedScopeDoc.quotes
                                && selectedScopeDoc.quotes[0].admin_approve_status === 0 ?
                                "col-md-9 col-sm-9 col-lg-12" : "col-md-9 col-sm-9"}>
                                <div className="data-v-row">
                                  <div className="data-v-col">
                                    <div className="view-text-value">
                                      <label>{Strings.name_txt}</label>
                                      <span>{selectedScopeDoc.client ? selectedScopeDoc.client.name : ''}</span>
                                    </div>
                                  </div>
                                  <div className="data-v-col">
                                    <div className="view-text-value">
                                      <label>{Strings.org_pri_person}</label>
                                      <span>{selectedScopeDoc.client_person ? selectedScopeDoc.client_person.name : ''}</span>
                                    </div>
                                  </div>
                                  <div className="data-v-col">
                                    <div className="view-text-value">
                                      <label>{Strings.phone_no_txt}</label>
                                      <span>{selectedScopeDoc.client_person ? selectedScopeDoc.client_person.phone : ''}</span>
                                    </div>
                                  </div>
                                  <div className="data-v-col">
                                    <div className="view-text-value">
                                      <label>{Strings.email_txt}</label>
                                      <span>{selectedScopeDoc.client_person ? selectedScopeDoc.client_person.email : ''}</span>
                                    </div>
                                  </div>
                                  <div className="data-v-col">
                                    <div className="view-text-value">
                                      <label>{Strings.address_txt}</label>
                                      <span>{selectedScopeDoc.client ? selectedScopeDoc.client.address : ''}</span>
                                    </div>
                                  </div>
                                  <div className="data-v-col">
                                    <div className="view-text-value">
                                      <label>{Strings.abn_txt}</label>
                                      <span>{selectedScopeDoc.client ? selectedScopeDoc.client.abn_acn : ''}</span>
                                    </div>
                                  </div>
                                  {/*   {this.state.clientAcceptance ?
                            } */}

                                  {selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].quote_po_no ?
                                    <>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>PO Number</label>
                                          <span>{selectedScopeDoc.quotes[0].quote_po_no}</span>
                                        </div>
                                      </div>

                                    </> :
                                    selectedScopeDoc.quotes &&
                                      selectedScopeDoc.quotes[0].admin_approve_status === 3
                                      && selectedScopeDoc.quotes[0].client_approve_status === 3 ?
                                      <div className="data-v-col po-num-txt d-flex">
                                        <div className="view-text-value">
                                          <div class="sf-form form-group">
                                            <label>PO Number</label>
                                            <input type="text" onChange={(event) => this.setState({ poNumber: event.target.value })} />
                                          </div>
                                        </div>
                                      </div> : null
                                  }
                                  <div className="po-doc-w-save-bnt">
                                    {selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].po_file ?
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>PO Document</label>
                                          <a href={selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] &&
                                            selectedScopeDoc.quotes[0].po_file} download
                                            className="normal-bnt" target='_blank'>
                                            <i class="material-icons">get_app</i>
                                            <span className="edit-image-logo">{"Open document"}</span></a>
                                        </div></div> :
                                      selectedScopeDoc.quotes &&
                                        selectedScopeDoc.quotes[0].admin_approve_status === 3
                                        && selectedScopeDoc.quotes[0].client_approve_status === 3 ?
                                        <div className="data-v-col no-border">
                                          <div className="view-text-value">
                                            <div class="sf-form form-group">
                                              <label>PO Document</label>
                                              <div className="sm-upload-box">
                                                <Upload {...uploadPicProps}>
                                                  <p className="ant-upload-drag-icon">
                                                    <i class="anticon material-icons">cloud_upload</i>
                                                  </p>
                                                  <p className="ant-upload-text">Update document</p>
                                                </Upload>
                                              </div>
                                            </div>
                                          </div>
                                        </div> : null}

                                    {
                                      selectedScopeDoc.quotes &&
                                        selectedScopeDoc.quotes[0].admin_approve_status === 3
                                        && selectedScopeDoc.quotes[0].client_approve_status === 3 ?
                                        selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].quote_po_no ?
                                          selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].po_file ?
                                            null :
                                            <div className="save-po-no-file">
                                              <button className="normal-bnt" type="button"
                                                onClick={() => this.handleClientApproval()}>
                                                <i class="material-icons">save</i></button>
                                            </div>
                                          :
                                          <div className="save-po-no-file">
                                            <button className="normal-bnt" type="button"
                                              onClick={() => this.handleClientApproval()}>
                                              <i class="material-icons">save</i></button>
                                          </div> : null
                                    }
                                    {selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].client_email_sent_at && selectedScopeDoc.quotes[0].admin_approve_status === 3
                                      && selectedScopeDoc.quotes[0].client_approve_status === 1 ?
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>Last sent to client</label>
                                          <span>{moment(selectedScopeDoc.quotes[0].client_email_sent_at).format("YYYY-MM-DD HH:mm")}</span>
                                        </div>
                                      </div> : null
                                    }
                                  </div>
                                </div>

                              </div>
                              {selectedScopeDoc.quote_number ?
                                selectedScopeDoc.quotes && selectedScopeDoc.quotes[0].admin_approve_status === 1 ?
                                  <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                                    <div className="client-fdbk">Pending Admin Approval</div>
                                  </div> :

                                  selectedScopeDoc.quotes &&
                                    selectedScopeDoc.quotes[0].admin_approve_status === 3
                                    && selectedScopeDoc.quotes[0].client_approve_status === 0 ?
                                    <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                                      <div className="client-fdbk approved">Admin Approved</div>
                                    </div> :

                                    selectedScopeDoc.quotes &&
                                      selectedScopeDoc.quotes[0].admin_approve_status === 3
                                      && selectedScopeDoc.quotes[0].client_approve_status === 1 ?
                                      <>
                                        <div class="col-md-3 col-sm-3 text-center">
                                          <div className="client-fdbk ">Pending Client Approval</div>
                                          <div className="btn-hs-icon">
                                            <button type="button" className="bnt bnt-active btn-xs" /*disabled={this.state.clientAcceptance}*/
                                              // onClick={() => this.setState({ clientAcceptance: true })}
                                              onClick={this.handleClientApproval}
                                            >
                                              Accept</button>
                                          </div>
                                          <div className="btn-hs-icon resend-bnt">
                                            <button type="button" className="bnt bnt-active btn-xs" /*disabled={this.state.clientAcceptance}*/
                                              // onClick={() => this.setState({ clientAcceptance: true })}
                                              onClick={this.handleQuoteClick}
                                            >
                                              Resend Quote</button>
                                          </div>
                                        </div>
                                      </> :

                                      selectedScopeDoc.quotes
                                        && selectedScopeDoc.quotes[0].admin_approve_status === 3
                                        && selectedScopeDoc.quotes[0].client_approve_status === 3
                                        ? (
                                          <>
                                            <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                                              <div className="client-fdbk approved">Client Approved</div>
                                            </div>
                                            <div className="col-md-12 col-sm-12 d-flex justify-content-center">
                                              <button className="bnt bnt-active" onClick={this.handleBookCalendarView}>Book Calendar</button>
                                            </div>
                                          </>
                                        )
                                        : null
                                : null}

                            </div>
                          </div>
                        </Panel>
                      </Collapse>
                    </div>

                    <div className="sf-card mt-4 view-a-n-task">
                      <Collapse defaultActiveKey="1" className="sc-doc-collapse-pnl" bordered={false} accordion
                        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                        <Panel className="sc-doc-co-head"
                          header={
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                              {/* <h2 className="sf-pg-heading">{Strings.site_service_details}</h2> */}
                              <h2 className="sf-pg-heading hd-w-clps">Job Details</h2>
                              <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled overlay={''}>
                                  <i className="material-icons">more_vert</i>
                                </Dropdown>
                              </div>
                            </div>
                          } key="1">

                          <div className="sf-card-body">
                            {/* <FormSection name="valuesOfTask"> */}
                            <div className="sf-card-inn-bg scop-inn-bg">
                              <div className="data-v-row">
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.quote_request_by}</label>
                                    <span>{selectedScopeDoc.client_person ? moment(selectedScopeDoc.client_person.quote_requested_by).format('DD-MM-YYYY') : ''}</span>
                                  </div>
                                </div>
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{"Quote Name"}</label>
                                    <span>{selectedScopeDoc.job_name ? selectedScopeDoc.job_name : ''}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {this.state.sites ? this.state.sites.map((site_item, site_index) => (
                              <div className="add-n-site">
                                <Collapse className="sc-doc-collapse-pnl sc-site-name-pnl" bordered={false} accordion expandIconPosition="right" defaultActiveKey='site0'
                                  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                  <Panel className="sc-doc-co-head"
                                    header={
                                      <div className="data-v-row">
                                        <div className="data-v-col">
                                          {/*   <div className="view-text-value">
                              <label>{Strings.job_name}</label>
                              <span>{site_item.site.job_name}</span>
                            </div> */}
                                          <div className="info-btn">
                                            {/* Drop down for card */}
                                            {/*<Dropdown className="more-info" overlay={ssdMenu(site_item)}>
                                                            <i className="material-icons">more_vert</i></Dropdown>*/}
                                            {/*Drop down*/}
                                          </div>

                                        </div>
                                        <div className="data-v-col">
                                          <div className="view-text-value">
                                            <label>{Strings.site_name}</label>
                                            <span>{site_item.site.site_name}</span>
                                          </div>
                                        </div>
                                        <div className="data-v-col">
                                          <div className="view-text-value">
                                            <label>{Strings.address_txt}</label>
                                            <span>{site_item.site.street_address + ", " + site_item.site.city + ", " + site_item.site.state + ", " + site_item.site.zip_code}</span>
                                          </div>
                                        </div>
                                      </div>
                                    } key={"site" + site_index}>

                                    {/* ----------------------------
                                                site service details
                                        ---------------------------- */}
                                    <div className="site-ser-table">
                                      <SortableContainer useDragHandle onSortEnd={({ oldIndex, newIndex }) => {
                                        var sites = this.state.sites;
                                        sites[site_index].tasks = arrayMove(site_item.tasks, oldIndex, newIndex)
                                        this.setState({
                                          sites: sites
                                        });
                                        if (this.apiLock) {
                                          this.callReorderApi(site_index)
                                        }
                                      }}>
                                        {site_item.tasks.map((task_item, index) => (

                                          <div className="task-wrapper sc-task-wrap">
                                            <SortableItem key={`item-${index}`} index={index}>
                                            {selectedScopeDoc.quotes &&
                                                              selectedScopeDoc.quotes[0].admin_approve_status === 3 &&
                                                              <Checkbox className="tsk_select_check" key={"check" + index}
                                                                checked={this.state.taskSelected.includes(task_item.id)}
                                                                onChange={(evt) => {
                                                                  evt.stopPropagation();
                                                                  evt.preventDefault();
                                                                  this.onTaskSelect(task_item.id)
                                                                }} />
                                                            }
                                              <div className="doc-action-bnt">
                                                {
                                                  this.props.selectedScopeDoc.quote_number ? (
                                                    <button className="normal-bnt calendar-bnt-ico" type="button" onClick={(event) => this.handleCalendarClick(event, task_item)}>
                                                      <i class="fa fa-calendar"></i>
                                                    </button>
                                                  )
                                                    : null
                                                }

                                                {/* {

                                                  selectedScopeDoc.quotes &&
                                                    selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].quote_managements
                                                    && selectedScopeDoc.quotes[0].quote_managements[index] && selectedScopeDoc.quotes[0].quote_managements[index].booked_for_calendar ?

                                                    (<Tooltip title="Calendar"><button className="normal-bnt" type="button" onClick={(event) => this.handleCalendarClick(event, task_item)}><i class="fa fa-calendar"></i></button></Tooltip>
                                                    ) : null
                                                } */}

                                                {/* {selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] &&
                                                  selectedScopeDoc.quotes[0].admin_approve_status === 3
                                                  && selectedScopeDoc.quotes[0].client_approve_status === 3 ?
                                                  <Tooltip title="Book Job"> <button className="normal-bnt" type="button" onClick={() => this.handleBookJob(task_item, site_item)}>
                                                    {
                                                      selectedScopeDoc.quotes &&
                                                        selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].quote_managements
                                                        && selectedScopeDoc.quotes[0].quote_managements[index] && selectedScopeDoc.quotes[0].quote_managements[index].booked_for_calendar ?

                                                        < span class="material-icons">
                                                          book
                                                  </span> : < span class="material-icons ico-red">book</span>
                                                    }

                                                  </button></Tooltip>
                                                  : null} */}


                                                <Tooltip title="Edit"><button className="normal-bnt" type="button" onClick={() => this.handleEditTaskClick(task_item, site_item)}>
                                                  {task_item.modified_at ?
                                                    <i className="fa fa-pencil"></i> : <i class="fa fa-pencil ico-red">
                                                    </i>}

                                                </button>
                                                </Tooltip>

                                                <Tooltip title="SWMS">
                                                  <button className="normal-bnt" type="button" onClick={() => this.handleSiteSWMSSelect(task_item, site_item)}>
                                                    {task_item.swms_added ?
                                                      <i class="sficon      sf-hard-hat-solid">
                                                      </i> : <i class="sficon      sf-hard-hat-solid ico-red">
                                                      </i>}
                                                  </button>
                                                </Tooltip>

                                                <Tooltip title="Delete"><button className="normal-bnt" type="button" onClick={() => this.handleTaskDelete(task_item)}><i className="fa fa-trash-o"></i></button></Tooltip>
                                              </div>
                                              <div className={this.state.sameTaskId.includes(task_item.id) ? "site-ser-view active" : "site-ser-view"}>
                                                <Collapse
                                                  // defaultActiveKey="0"
                                                  className="sc-doc-collapse-pnl sc-task-name-pnl"
                                                  bordered={false}
                                                  accordion
                                                  expandIconPosition="right"
                                                  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}
                                                  onChange={() => console.log(task_item)}
                                                >
                                                  <Panel className="sc-doc-co-head"
                                                    header={
                                                      <div className="site-s-head" >
                                                        <div className="site-s-footer pt-0">
                                                          <div className="view-text-value scodc-site-title">
                                                            
                                                            <label className="ml-2">{task_item.task_label}</label>
                                                            {selectedScopeDoc && selectedScopeDoc.quotes && selectedScopeDoc.quotes[0].client_approve_status === 3 ?
                                                              this.state.taskSelected.includes(task_item.id) ?
                                                                <img className="thumb-ico" src="/images/thumbsupicon.png" /> :
                                                                <img className="thumb-ico" src="/images/thumbsDownIcon.png" />
                                                              : null
                                                            }
                                                          </div>
                                                          <div className="sm-tsk-view">
                                                            <div className="view-text-value scodc-site-title d-bn-txt-bx">
                                                              <label>Scope</label>
                                                              <span>{task_item.task_name}</span>
                                                            </div>
                                                            {/* <div className="view-text-value scodc-site-title d-bn-txt-bx">
                                                          <label >{Strings.task_duration_txt}</label>
                                                          <span>{task_item.duration}</span>
                                                        </div> */}
                                                            <div className="view-text-value scodc-site-title d-bn-txt-bx">
                                                              <label>Area</label>
                                                              <span>{task_item.areas && task_item.areas[0] && task_item.areas[0].area_name}</span>
                                                            </div>
                                                            {/* <div className="view-text-value scodc-site-title d-bn-txt-bx">
                                                          <label >{Strings.expected_start_date_txt}</label>
                                                          <span>{moment(task_item.start_date).format("DD-MM-YYYY")}</span>
                                                        </div> */}
                                                            <div className="view-text-value scodc-site-title d-bn-txt-bx">
                                                              <label>Notes</label>
                                                              <span>{task_item.note}</span>
                                                            </div>
                                                            <div className="view-text-value scodc-site-title d-bn-txt-bx">
                                                              <label >{"Total"}</label>
                                                              <span>{task_item.amount && currencyFormat(task_item.amount)}</span>
                                                            </div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    } key={index}>

                                                    <div className="site-s-body view-esti-sec">
                                                      <div className="d-flex flex-wrap justify-content-between">
                                                        <div className="data-v-row">
                                                          {/* <div className="data-v-col">
                                                        <div className="view-text-value">
                                                          <label>{Strings.area_txt}</label>
                                                          <span>{
                                                            this.getSSDAreas(task_item.areas ? task_item.areas : [])
                                                          }</span>
                                                        </div>
                                                      </div> */}
                                                          {/* <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.estimate_txt}</label>
                                          <span>{task_item.estimate}</span>
                                        </div>
                                      </div> */}

                                                          {/* <div className="data-v-col">
                                                        <div className="view-text-value">
                                                          <label>{Strings.task_duration_txt}</label>
                                                          <span>{task_item.duration}</span>
                                                        </div>
                                                      </div>
                                                      <div className="data-v-col">
                                                        <div className="view-text-value">
                                                          <label>{Strings.repeat_txt}</label>
                                                          <span>{task_item.frequency}</span>
                                                        </div>
                                                      </div>
                                                      <div className="data-v-col">
                                                        <div className="view-text-value">
                                                          <label>{`Frequency End Date`}</label>
                                                          <span>{task_item.frequency_end_date ? moment(task_item.frequency_end_date).format("DD-MM-YYYY") : null}</span>
                                                        </div>
                                                      </div> */}
                                                          <div className="data-v-col">
                                                            <div className="view-text-value">
                                                              <label>{"Additional Task Tags"}</label>
                                                              <span className="att-tags">
                                                                {task_item.additional_tags && task_item.additional_tags.map(tag =>
                                                                  <span>{tag.tag_name}</span>)}
                                                              </span>
                                                            </div>
                                                          </div>

                                                          {/* <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.start_date_txt}</label>
                                          <span>{moment(task_item.start_date).format("DD-MM-YYYY")}</span>
                                        </div>
                                      </div> */}
                                                          {/* {
                                                        task_item.file && task_item.file.length > 0 ? <div className="doc-sr-img" onClick={(evt) => this.handleTaskFileView(task_item.file, evt)} >
                                                          <img alt="taskImage" src={task_item.file.length > 0 ? task_item.file[0].file_url : ''} />
                                                        </div> : null
                                                      } */}
                                                          {
                                                            task_item.file && task_item.file.length > 0 ? <div className="doc-sr-img" onClick={(evt) => this.handleTaskFileView(task_item.file, evt)} >
                                                              {
                                                                task_item.file.length > 1
                                                                  ? task_item.file.length > 9
                                                                    ? <span className="sl-no-img"><i class="material-icons">filter_9_plus</i></span>
                                                                    : <span className="sl-no-img"><i class="material-icons">{`filter_${task_item.file.length}`}</i></span>
                                                                  : null
                                                              }
                                                              <img alt="taskImage" src={task_item.file.length > 0 ? task_item.file[0].file_url : ''} />

                                                            </div> : null
                                                          }
                                                        </div>
                                                        {/* estimate details tables */}


                                                        {task_item.estimate ? <div className="esti-data-view">
                                                          {typeof task_item.estimate === 'string' ?
                                                            <div className="data-v-col">
                                                              <div className="view-text-value">
                                                                <label>{Strings.estimate_txt}</label>
                                                                <span>{task_item.estimate}</span>
                                                              </div>
                                                            </div>
                                                            :
                                                            <>
                                                              <label className="esti-hrs-hd">{Strings.estimate_txt}
                                                                <span className="qunty-rate">{currencyFormat(calculateEstimate(task_item.estimate))}</span> <b>{task_item.estimate && task_item.estimate.estimate_type
                                                                  && task_item.estimate.estimate_type.toUpperCase()}</b></label>
                                                              <div className="esti-table">
                                                                {task_item.estimate && task_item.estimate.estimate_type === "hours" ? <table className="table">
                                                                  <tr className="est-sc-thd">
                                                                    <th>Staff</th>
                                                                    <th>Hours</th>
                                                                    <th>Days</th>
                                                                    <th>Rate</th>
                                                                  </tr>
                                                                  <tr>
                                                                    <td>{task_item.estimate.staff}</td>
                                                                    <td>{task_item.estimate.hours}</td>
                                                                    <td>{task_item.estimate.days}</td>
                                                                    <td>{currencyFormat(task_item.estimate.rate)}</td>
                                                                  </tr>
                                                                </table> :
                                                                  task_item.estimate && task_item.estimate.estimate_type === "area" ?

                                                                    <table className="table">
                                                                      <tr className="est-sc-thd">
                                                                        <th>SQM</th>
                                                                        <th>Rate</th>
                                                                      </tr>
                                                                      <tr>
                                                                        <td>{task_item.estimate.sqm}</td>
                                                                        <td>{currencyFormat(task_item.estimate.rate)}</td>
                                                                      </tr>
                                                                    </table> :
                                                                    task_item.estimate && task_item.estimate.estimate_type === "quant" ?
                                                                      <table className="table">
                                                                        <tr className="est-sc-thd">
                                                                          <th>Quantity</th>
                                                                          <th>Rate</th>
                                                                        </tr>
                                                                        <tr>
                                                                          <td>{task_item.estimate.quant}</td>
                                                                          <td>{currencyFormat(task_item.estimate.rate)}</td>
                                                                        </tr>
                                                                      </table> : null}
                                                              </div>
                                                            </>}
                                                        </div> : null}
                                                      </div>

                                                      <div className="equip-miscell-dtl">
                                                        {/* {this.state.generateQuote ?
                                                      <div className="eq-mill-edit esti-data-view"><label>Equipments</label>
                                                        <span onClick={this.handleChildClick}>
                                                          <FieldArray name={`equipments$${site_item.site_id}_${task_item.id}`}
                                                            equipmentList={this.props.equipmentList}
                                                            component={renderTaskEquipments} /></span> </div> : null} */}

                                                        {/* {selectedScopeDoc.quote_number ?
                                                      <div className="eq-mill-view esti-data-view"><label className="e-m-lbl">Equipments</label>
                                                        <div className="esti-table">
                                                          <table className="table">
                                                            <tr className="est-sc-thd">
                                                              <th>Equipment</th>
                                                              <th>Cost</th>
                                                            </tr>
                                                            {task_item.equipments && task_item.equipments.map(eqp =>
                                                              <tr>
                                                                <td>{eqp && eqp.equipment && eqp.equipment.name ? eqp.equipment.name : ''}</td>
                                                                <td>{currencyFormat(eqp && eqp.equipment_cost ? eqp.equipment_cost : 0)}</td>
                                                              </tr>)}
                                                          </table></div> </div> : null} */}
                                                      </div>

                                                      <div className="equip-miscell-dtl miscell-equip-dtl">
                                                        {/* {this.state.generateQuote ?
                                                      <div className="eq-mill-edit esti-data-view"><label>Additional Costs</label>
                                                        <span onClick={this.handleChildClick}><FieldArray name={`miscellaneous$${site_item.site_id}_${task_item.id}`}
                                                          component={renderTaskMisc} /></span> </div> : null} */}

                                                        {/* selectedScopeDoc.quote_number ? */
                                                          <div className="eq-mill-view esti-data-view"><label className="e-m-lbl">Additional Costs</label>
                                                            <div className="esti-table"><table className="table ">
                                                              <tr className="est-sc-thd">
                                                                <th>Name</th>
                                                                <th>Cost</th>
                                                              </tr>
                                                              {task_item.miscellaneous && task_item.miscellaneous.map(misc =>
                                                                <tr>
                                                                  <td>{misc && misc.miscellaneous_name ? misc.miscellaneous_name : ''}</td>
                                                                  <td>{currencyFormat(misc && misc.miscellaneous_cost ? misc.miscellaneous_cost : 0)}</td>
                                                                </tr>)}
                                                            </table></div> </div>
                                                        /* : null */}
                                                      </div>

                                                      <div className="calculate-dtl">
                                                        <div className="data-v-row no-note-brder">
                                                          {/* {this.state.generateQuote ? <div className="data-v-col">
                                                        <div className="view-text-value">
                                                          <label>Calculated</label>
                                                          <span>{currencyFormat(this.calulateTotal(site_item.site_id, task_item.id, calculateEstimate(task_item.estimate))
                                                            - parseFloat(formValues[`adjustment$${site_item.site_id}_${task_item.id}`]))}</span>
                                                        </div>
                                                      </div> : null} */}

                                                          {/* selectedScopeDoc.quote_number ? */
                                                            <div className="data-v-col">
                                                              <div className="view-text-value">
                                                                <label>Calculated</label>
                                                                <span>{currencyFormat(task_item.calculated_value)}</span>
                                                              </div>
                                                            </div>
                                                      /* : null */}

                                                          {/* selectedScopeDoc.quote_number ? */ <div className="data-v-col">
                                                            <div className="view-text-value">
                                                              <label>Adjustment</label>
                                                              <span>{currencyFormat(task_item.adjustment_value)}</span>
                                                            </div>
                                                          </div>
                                                      /* : null */}
                                                          {/* {this.state.generateQuote ?
                                                        <div className="data-v-col" onClick={this.handleChildClick}>
                                                          <div className="quote-vlue qto-position-st">
                                                            <fieldset className="form-group sf-form w-currency-symbl" >
                                                              <Field
                                                                label="Adjustment"
                                                                name={`adjustment$${site_item.site_id}_${task_item.id}`}
                                                                type="number"
                                                                // validate={isRequired}
                                                                id="name"
                                                                component={customInput}
                                                              />
                                                            </fieldset>
                                                          </div>
                                                        </div> : null} */}
                                                          {/* {this.state.generateQuote ?
                                                        <div className="data-v-col">
                                                          <div className="view-text-value">
                                                            <label>{"Total"}</label>
                                                            <span>{currencyFormat(this.calulateTotal(site_item.site_id, task_item.id, calculateEstimate(task_item.estimate)))}</span>
                                                          </div>
                                                        </div> : null} */}

                                                          {/* selectedScopeDoc.quote_number && */ task_item.amount ?
                                                            <div className="data-v-col">
                                                              <div className="view-text-value">
                                                                <label>{"Total"}</label>
                                                                <span>{currencyFormat(task_item.amount)}</span>
                                                              </div>
                                                            </div> : null}
                                                        </div>
                                                      </div>
                                                      <div className="site-s-footer d-flex justify-content-between sco-note-vlue">
                                                        <div className="data-v-row no-note-brder">
                                                          <div className="data-v-col">
                                                            <div className="view-text-value">
                                                              <label>Notes</label>
                                                              <span>{task_item.note}</span>
                                                            </div>
                                                          </div>
                                                          {/* <div className="data-v-col">
                                                        <div className="view-text-value">
                                                          <label>{Strings.expected_start_date_txt}</label>
                                                          <span>{moment(task_item.start_date).format("DD-MM-YYYY")}</span>
                                                        </div>
                                                      </div> */}
                                                        </div>
                                                      </div>
                                                    </div>

                                                    {/* for sub tasks */}

                                                    {
                                                      task_item.sub_tasks && task_item.sub_tasks.length > 0 ?
                                                        task_item.sub_tasks.map(subtask =>
                                                          <div className="site-s-body view-sub-task">
                                                            <div className="d-flex flex-wrap justify-content-between">
                                                              <div className="data-v-row">
                                                                <div className="data-v-col">
                                                                  <div className="view-text-value">
                                                                    <label>{Strings.area_txt}</label>
                                                                    <span>{
                                                                      this.getSSDAreas(subtask.areas ? subtask.areas : [])
                                                                    }</span>
                                                                  </div>
                                                                </div>
                                                                <div className="data-v-col">
                                                                  <div className="view-text-value">
                                                                    <label>{Strings.task_duration_txt}</label>
                                                                    <span>{subtask.duration}</span>
                                                                  </div>
                                                                </div>
                                                                <div className="data-v-col">
                                                                  <div className="view-text-value">
                                                                    <label>{Strings.repeat_txt}</label>
                                                                    <span>{subtask.frequency}</span>
                                                                  </div>
                                                                </div>
                                                                <div className="data-v-col">
                                                                  <div className="view-text-value">
                                                                    <label>{Strings.expected_start_date_txt}</label>
                                                                    <span>{moment(subtask.start_date).format("DD-MM-YYYY")}</span>
                                                                  </div>
                                                                </div>
                                                              </div>

                                                              {/* estimate details tables */}


                                                              {subtask.estimate ? <div className="esti-data-view">
                                                                {this.checkParsed(subtask.estimate) ?
                                                                  <>
                                                                    <label className="esti-hrs-hd">{Strings.estimate_txt}
                                                                      <span className="qunty-rate">{currencyFormat(calculateEstimate(JSON.parse(subtask.estimate)))}</span> <b>{subtask.estimate && JSON.parse(subtask.estimate).estimate_type
                                                                        && JSON.parse(subtask.estimate).estimate_type.toUpperCase()}</b></label>
                                                                    <div className="esti-table">
                                                                      {subtask.estimate && JSON.parse(subtask.estimate).estimate_type === "hours" ? <table className="table">
                                                                        <tr className="est-sc-thd">
                                                                          <th>Staff</th>
                                                                          <th>Hours</th>
                                                                          <th>Days</th>
                                                                          <th>Rate</th>
                                                                        </tr>
                                                                        <tr>
                                                                          <td>{JSON.parse(subtask.estimate).staff}</td>
                                                                          <td>{JSON.parse(subtask.estimate).hours}</td>
                                                                          <td>{JSON.parse(subtask.estimate).days}</td>
                                                                          <td>{currencyFormat(JSON.parse(subtask.estimate).rate)}</td>
                                                                        </tr>
                                                                      </table> :
                                                                        subtask.estimate && JSON.parse(subtask.estimate).estimate_type === "area" ?

                                                                          <table className="table ">
                                                                            <tr className="est-sc-thd">
                                                                              <th>SQM</th>
                                                                              <th>Rate</th>
                                                                            </tr>
                                                                            <tr>
                                                                              <td>{JSON.parse(subtask.estimate).sqm}</td>
                                                                              <td>{currencyFormat(JSON.parse(subtask.estimate).rate)}</td>
                                                                            </tr>
                                                                          </table> :
                                                                          subtask.estimate && JSON.parse(subtask.estimate).estimate_type === "quant" ?
                                                                            <table className="table">
                                                                              <tr className="est-sc-thd">
                                                                                <th>Quantity</th>
                                                                                <th>Rate</th>
                                                                              </tr>
                                                                              <tr>
                                                                                <td>{JSON.parse(subtask.estimate).quant}</td>
                                                                                <td>{currencyFormat(JSON.parse(subtask.estimate).rate)}</td>
                                                                              </tr>
                                                                            </table> : null}
                                                                    </div>
                                                                  </> :
                                                                  <div className="data-v-col">
                                                                    <div className="view-text-value">
                                                                      <label>{Strings.estimate_txt}</label>
                                                                      <span>{subtask.estimate}</span>
                                                                    </div>
                                                                  </div>}
                                                              </div> : null}
                                                            </div>
                                                          </div>) : null
                                                    }
                                                  </Panel>
                                                </Collapse>
                                              </div>
                                            </SortableItem>
                                          </div>

                                        ))}
                                      </SortableContainer>
                                    </div>
                                    {/* ----------------------------
                                      End
                        ---------------------------- */}
                                    <FieldArray
                                      name={`sitetask[${site_index}]`}
                                      siteItem={site_item}
                                      editChange={this.props.change}
                                      isFromEdit={true}
                                      isSiteTask={true}
                                      site_index={site_index}
                                      component={AddTasks}
                                      ViewEditScopeDoc={{ values: formValues }}
                                      generateQuote={this.state.generateQuote || selectedScopeDoc.quote_number ? true : false}
                                      equipmentList={this.props.equipmentList}
                                      taskTags={this.props.taskTags}
                                    />
                                  </Panel>
                                </Collapse>
                              </div>
                            )) : ''}
                            {/* </FormSection> */}
                            <FieldArray
                              name={'sites'}
                              change={this.props.change}
                              isFromEdit={true}
                              editChange={this.props.change}
                              component={AddSites}
                              generateQuote={this.state.generateQuote || selectedScopeDoc.quote_number ? true : false}
                              equipmentList={this.props.equipmentList}
                              ViewEditScopeDoc={{ values: formValues }}
                              taskTags={this.props.taskTags}
                            />

                            {/* Equipment Cost */}
                            {/* {this.props.equipmentList.length > 0 && (this.state.generateQuote || selectedScopeDoc.quote_number) ?
                          <div className="sf-card no-shadow br-xy">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                              <h2 className="sf-pg-heading">Equipment Cost</h2>
                              <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled overlay={''}>
                                  <i className="material-icons">more_vert</i>
                                </Dropdown>
                              </div>
                            </div>
                            <div className="sf-card-body">
                              <FieldArray name={'quote_equipments'} formValues={formValues} component={this.renderEquipments} />
                            </div>
                          </div> : ''} */}

                            {/* quote total value */}
                            {this.state.generateQuote || selectedScopeDoc.quote_number ?
                              <div className="quote-total">
                                <div className="quote-table">
                                  <table>
                                    <tr>
                                      <th>Subtotal (Exc GST)</th>
                                      <th>{currencyFormat(this.quoteAmt)}</th>
                                    </tr>
                                    <tr>
                                      <td>Total (Inc GST)</td>
                                      <td><strong>{currencyFormat((this.quoteAmt + (this.quoteAmt * selectedScopeDoc.GSTINPERCENT / 100)))}</strong></td>
                                    </tr>
                                  </table>
                                </div>
                              </div> : null}
                            {/* <div className="btn-hs-icon sm-bnt">
                                        <button className="bnt bnt-normal" type="button" >{Strings.add_site_btn}</button>
                                    </div> */}
                          </div>
                        </Panel>
                      </Collapse>
                    </div>

                    {/* Internal Notes */}
                    <div className="sf-card mt-4">
                      <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{"Conditions"}</h2>
                        <div className="info-btn ">
                          <Dropdown className="more-info" overlay={(
                            <Menu>
                              <Menu.Item onClick={this.handleEditConditions}>
                                Edit Conditions
                              </Menu.Item>
                            </Menu>
                          )}>
                            <i className="material-icons">more_vert</i>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="sf-card-body">
                        {this.state.showConditionsEdit ? <EditConditions formValues={formValues} change={this.props.change} /> :
                          selectedScopeDoc.conditions && 
                          <div className="view-internal-note dynamic-html-cnt">
                            <label>{HtmlParser(selectedScopeDoc.conditions)}</label>
                          </div>}
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="sf-card mt-4">
                      <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{"Notes"}</h2>
                        <div className="info-btn disable-dot-menu">
                          <Dropdown className="more-info" disabled overlay={''}>
                            <i className="material-icons">more_vert</i>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="sf-card-body">
                        {selectedScopeDoc.internal_notes ? selectedScopeDoc.internal_notes.map((note_item) => (
                          <div className="view-internal-note">
                            <span>{ReactHtmlParser(note_item.note)}</span>
                            <span className="note-dtls">{`By ${note_item.organisation_user.first_name}, ${moment(note_item.created_at).format('DD MMM YYYY')}`}</span>
                          </div>
                        )) : ''}
                        <div className="int-notes">
                          <FieldArray
                            name="internal_notes"
                            isFromEdit={true}
                            component={AddNotes} />
                        </div>

                      </div>
                    </div>
                    {/* zoom save button  */}
                    <div className="row zoom-save-bnt">
                      <div className="col-md-12">
                        <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                          <div className="btn-hs-icon">
                            <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                              <i class="material-icons">save</i> {Strings.save_btn}</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                    {
                      selectedScopeDoc.quotes && selectedScopeDoc.quotes[0].admin_approve_status === 0 ?
                        <>
                          <div className="btn-hs-icon">
                            <button type="button" className="bnt bnt-normal" onClick={this.handleSendForApproval}>
                              <i class="material-icons">send</i> {Strings.send_for_admin_approval_bnt}</button>
                          </div>
                          {/* <div className="btn-hs-icon">
                        <button type="button" className="bnt bnt-normal" onClick={this.handlePreviewClick}>
                          <i class="material-icons">remove_red_eye</i> {Strings.preview_btn}</button>
                      </div> */}
                        </>
                        : null

                    }
                    {selectedScopeDoc.quote_number ?
                      <div className="btn-hs-icon">
                        <button type="button" className="bnt bnt-normal" onClick={this.handlePreviewClick}>
                          <i class="material-icons">remove_red_eye</i> {Strings.preview_btn}</button>
                      </div> : null}
                    {
                      selectedScopeDoc.quotes && selectedScopeDoc.quotes[0].admin_approve_status === 1 &&
                        selectedScopeDoc.quotes[0].admin_approver === JSON.parse(getStorage(USER_NAME)) ?
                        <>
                          <div className="btn-hs-icon">
                            <button type="button" className="bnt bnt-normal" onClick={() => this.handleAdminApproval(2)}>
                              Reject</button>
                          </div>
                          <div className="btn-hs-icon">
                            <button type="button" className="bnt bnt-active" onClick={() => this.handleAdminApproval(3)}>
                              Accept</button>
                          </div>
                        </>
                        : null

                    }
                    {/* <button type="button" className="bnt bnt-active" onClick={() => this.handleAdminApproval(3)}>
                  Accept</button> */}

                    {selectedScopeDoc.quotes &&
                      selectedScopeDoc.quotes[0].admin_approve_status === 3 && selectedScopeDoc.quotes[0].client_approve_status === 0 ?
                      <div className="btn-hs-icon">
                        <button onClick={this.handleQuoteClick} type="button" className="bnt bnt-normal">
                          <i class="fa fa-envelope-o"></i> {Strings.email_quote_to_client_bnt}</button>
                      </div> : null
                    }
                    {selectedScopeDoc.quote_number || this.state.generateQuote ? null :
                      <div className="btn-hs-icon">
                        <button type="button" className="bnt bnt-normal" onClick={this.handleGenerateQuote}>
                          <i class="material-icons">assignment</i> {Strings.generate_quote_btn}</button>
                      </div>}
                    {/* {selectedScopeDoc.quotes &&
                  selectedScopeDoc.quotes[0].admin_approve_status === 3 && selectedScopeDoc.quotes[0].client_approve_status > 0 ? null : */}

                    {
                      (selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].client_approve_status) && selectedScopeDoc.quotes[0].client_approve_status === 3
                        ? <>{(selectedScopeDoc && selectedScopeDoc.quotes && selectedScopeDoc.quotes[0]
                          && selectedScopeDoc.quotes[0].quote_managements
                          && selectedScopeDoc.quotes[0].quote_managements[0]
                          && selectedScopeDoc.quotes[0].quote_managements[0].booked_for_calendar > 0) ? <div className="btn-hs-icon">
                            <button type="button" className="bnt bnt-normal" disabled={this.props.isDirty} onClick={() => this.handleRebookQuote(selectedScopeDoc.id, selectedScopeDoc.quote_number, selectedScopeDoc.client_id)}>
                              <i class="material-icons">book</i> {Strings.rebook_btn}</button>
                          </div> : null}
                          <Popconfirm title={Strings.confirm_quote_update} okText="Yes" cancelText="No" onConfirm={() => this.onSubmit(this.props.formValues)}>
                            <div className="btn-hs-icon">
                              <button type="submit" className="bnt bnt-active"
                              // disabled={!this.props.isDirty}
                              >
                                <i class="material-icons">save</i> {Strings.save_btn}</button>
                            </div>
                          </Popconfirm></>
                        : <>
                          {/* <div className="btn-hs-icon"> 
                        <button type="button" className="bnt bnt-active" onClick={() => this.handleRebookQuote(selectedScopeDoc.id)}>
                          <i class="material-icons">save</i> {Strings.rebook_btn}</button>
                      </div> */}
                          <div className="btn-hs-icon">
                            <button type="submit" className="bnt bnt-active"
                            // disabled={!this.props.isDirty}
                            >
                              <i class="material-icons">save</i> {Strings.save_btn}</button>
                          </div>
                        </>
                    }
                    {/* } */}
                  </div>
                </form>
              </div>
              : <div className="col-lg-8 col-md-12 mb-4">
                <BookingCalendar
                  quoteId={selectedScopeDoc.quotes && selectedScopeDoc.quotes[0].id}
                  quoteDetails={this.props.selectedScopeDoc}
                  onGoBack={() => this.handleShowQuote()}
                />
              </div>
          }


          {/* ------------------------
                         Right panel
                    ------------------------ */}
          {/* Update SWMS */}
          <div className="col-lg-4 col-md-12 swms-dymic-w" style={{ display: this.state.showSWMS }}>
            <AreaSWMSUpdate selectedSiteTaskSWMS={this.state.selectedSiteTaskSWMS}
              selectedSiteItem={this.state.selectedSiteItem} allTasks={this.state.allTasks}
              selectedSWMSId={this.state.selectedSWMSId}
              handleCancel={this.handleCancel} />
          </div>

          {/* Book Job */}
          <div className="col-lg-4 col-md-12 swms-dymic-w" style={{ display: this.state.showBookJob }}>
            <BookJob selectedSiteTaskSWMS={this.state.selectedSiteTaskSWMS}
              allTasks={this.state.allTasks && this.state.allTasks.filter(tsk => tsk.task_selected_for_quote)}
              handleCancel={this.handleCancel} selectedScopeDocID={selectedScopeDoc.id}
              quoteId={selectedScopeDoc.quotes && selectedScopeDoc.quotes[0].id} updateBookTask={this.updateBookTask}
              quoteManagement={selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].quote_managements}
              history={this.props.history}
              initialValues={selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0]}
              selectedScopeDoc={this.props.selectedScopeDoc}
            />
          </div>

          {/** Edit Client Details */}
          <div className="col-lg-4 col-md-12" style={{ display: this.state.showClientDetailsEdit }}>
            <EditClientDetails selectedScopeDocID={selectedScopeDoc.id} handleCancel={this.handleCancel} showClientDetailsEdit={this.state.showClientDetailsEdit} />
          </div>

          {/* Edit Site/Service Details */}
          {<div className="col-lg-4 col-md-12"
            style={{ display: this.state.showSSDEdit }}
          >
            <EditSiteServiceDetails initialValues={this.state.selectedSite.site} selectedScopeDocID={selectedScopeDoc.id} handleCancel={this.handleCancel} showClientDetailsEdit={this.state.showClientDetailsEdit} />
          </div>}

          {/* Edit Internal Notes */}
          <div className="col-lg-4 col-md-12" style={{ display: this.state.showNotesEdit }}>
            <EditInternalNotes selectedScopeDocID={selectedScopeDoc.id} handleCancel={this.handleCancel} showClientDetailsEdit={this.state.showClientDetailsEdit} />
          </div>

          {/** Show Edit Task */}
          {this.state.showTaskEdit == 'block' ? <div className="col-lg-4 col-md-12 swms-dymic-w"
          // style={{ display: this.state.showTaskEdit }}
          >
            {/* <EditSiteTask selectedScopeDoc={selectedScopeDoc}
              initialValues={{
                ...this.state.selectedSiteTask, additional_tags:
                  (this.state.selectedSiteTask.additional_tags && this.state.selectedSiteTask.additional_tags.length
                    && this.state.selectedSiteTask.additional_tags.length > 0 ? this.state.selectedSiteTask.additional_tags.map(tag => tag.id) : [])
              }} fileItems={this.state.selectedSiteTask.file}
              selectedScopeDocID={selectedScopeDoc.id} handleCancel={this.handleCancel}
              showClientDetailsEdit={this.state.showClientDetailsEdit}
              allTasks={this.state.allTasks}
            /> */}
            <EditSiteTaskView selectedScopeDoc={selectedScopeDoc}
              initialValues={{
                ...this.state.selectedSiteTask, additional_tags:
                  (this.state.selectedSiteTask.additional_tags && this.state.selectedSiteTask.additional_tags.length
                    && this.state.selectedSiteTask.additional_tags.length > 0 ? this.state.selectedSiteTask.additional_tags.map(tag => tag.id) : [])
              }} fileItems={this.state.selectedSiteTask.file}
              selectedScopeDocID={selectedScopeDoc.id} handleCancel={this.handleCancel}
              showClientDetailsEdit={this.state.showClientDetailsEdit}
              allTasks={this.state.allTasks}
              selectedTaskId={this.state.selectedTaskId}
            />
          </div> : null}

          {/** Preview Quote Doc */}
          <Modal
            title="]"
            visible={this.state.previewQuote}
            zIndex="99999"
            footer={null}
            width="100%"
            className="job-doc-preview"
          >
            <PreviewScopeDocQuote handleQuoteClick={this.handleQuoteClick} cancelQuotePreview={this.cancelQuotePreview} />
          </Modal>

          {/* task file view  */}

          <Modal
            visible={this.state.viewTaskFiles}
            className="job-img-gallery"
            zIndex="99999"
            footer={null}
            onCancel={this.handleCancel}>
            <TaskFileViews taskFiles={this.state.taskFiles} />
          </Modal>

          {/* history popup  */}
          <Modal
            title="Basic Modal"
            visible={this.state.hisVisible}
            okButtonProps={{ style: { display: 'none' } }}
            width="100%"
            className="job-doc-preview"
            onCancel={this.hisHandleCancel}>
            <HistoryScopeDoc
              sites={this.state.sites}
              equipmentList={this.props.equipmentList}
              quoteAmt={this.quoteAmt}
            />
          </Modal>

        </div>
      </div >
    );
  }
}

export const calculateEstimate = (estimate) => {
  if (estimate) {
    if (estimate.estimate_type && estimate.estimate_type === 'hours' &&
      estimate.staff && estimate.hours && estimate.days && estimate.rate) {
      return estimate.staff * estimate.hours * estimate.days * estimate.rate;
    }
    if (estimate.estimate_type && estimate.estimate_type === 'area' && estimate.sqm && estimate.rate) {
      return estimate.sqm * estimate.rate;
    }
    if (estimate.estimate_type && estimate.estimate_type === 'quant' && estimate.quant && estimate.rate) {
      return estimate.quant * estimate.rate;
    }
  }
  return 0
}

const initalizeValueFieldFunc = (selectedScopeDoc) => {
  var valuesFields = {}
  if (selectedScopeDoc && selectedScopeDoc.sites) {
    selectedScopeDoc.sites.forEach((site_item, index) => {
      site_item.tasks.forEach((task_item) => {
        if (!task_item.amount)
          valuesFields[`adjustment$${site_item.site_id}_${task_item.id}`] = 0
      })
    })
  }

  return valuesFields;
}

const mapStateToProps = (state, ownProps) => {
  var value = state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : {};
  var initalizeValueField = initalizeValueFieldFunc(value)
  var initialValues = {
    ...value,
    ...initalizeValueField,
    sites: undefined,
    internal_notes: [],
    quote_equipments: value && value.quotes && value.quotes.length > 0 && value.quotes[0].equipments ? value.quotes[0].equipments : [{ equipment_id: [] }]
  };
  initialValues.sites_quote = value && value.sites;
  return {
    selectedScopeDoc: (value ? value : {}),
    initialValues: initialValues,
    formValues: state.form.ViewEditScopeDoc &&
      state.form.ViewEditScopeDoc.values ? state.form.ViewEditScopeDoc.values : {},
    adminList: state.scopeDocs.adminList,
    equipmentList: state.scopeDocs.equipmentList ? state.scopeDocs.equipmentList : [],
    isDirty: isDirty('ViewEditScopeDoc')(state),
    versionCount: (!state.scopeDocs.versionCount || isNaN(state.scopeDocs.versionCount) || state.scopeDocs.versionCount === '') ? 0 : state.scopeDocs.versionCount,
    versions: state.scopeDocs.versions,
    historyMetadata: state.scopeDocs.historyMetadata,
    taskTags: state.scopeDocs.taskTags ? state.scopeDocs.taskTags : [],
    sitesListByPersons: state.scopeDocs.sitesListByPersons,
    quote_client_approve_status: state.scopeDocs.scopeDocs && state.scopeDocs.scopeDocs[0] && state.scopeDocs.scopeDocs[0].quote_client_approve_status ? state.scopeDocs.scopeDocs[0].quote_client_approve_status : null,

  }
}
const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    calendarActions: bindActionCreators(calendarActions, dispatch),
    serviceAgentActions: bindActionCreators(serviceAgentActions, dispatch),
    rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch),
    swmsAction: bindActionCreators(swmsAction, dispatch),
    quoteAction: bindActionCreators(quoteAction, dispatch),

    likelyHoodAction: bindActionCreators(likelyHoodAction, dispatch),
    consequncesAction: bindActionCreators(consequncesAction, dispatch),
    bookingCalendarActions: bindActionCreators(bookingCalendarActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'ViewEditScopeDoc', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ViewEditScopeDoc)