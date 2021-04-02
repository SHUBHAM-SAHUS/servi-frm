import { popOverCheckBox } from "../../common/popOverCheckBox";
import { CustomRangePicker } from "../../common/customRangePicker";
import { CustomSelect } from "../../common/customSelect";

export const searchOptions = props => [
  {
    label: "Client Name",
    value: "client_id",
    component: popOverCheckBox,
    props: {
      options:
        props.clients &&
        props.clients.map(job => ({
          label: job.name,
          value: job.id
        })),
      buttonTitle: "Client Name"
    }
  },
  {
    label: "Quote Name",
    value: "job_name",
    component: popOverCheckBox,
    props: {
      options:
        props.jobNames &&
        props.jobNames.map(job => ({ label: job, value: job })),
      buttonTitle: "Job Name"
    }
  },
  {
    label: "Site Name",
    value: "site_name",
    component: popOverCheckBox,
    props: {
      options:
        props.siteName &&
        props.siteName.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Site Name"
    }
  },
  {
    label: "ABN/ACN",
    value: "abn_acn",
    component: popOverCheckBox,
    props: {
      options:
        props.clients &&
        props.clients.map(client => ({
          label: client.abn_acn,
          value: client.abn_acn
        })),
      buttonTitle: "ABN/ACN"
    }
  },
  {
    label: "Primary Contact Person",
    value: "primary_contact_person",
    component: popOverCheckBox,
    props: {
      options:
        props.primaryPerson &&
        props.primaryPerson.map(person => ({
          label: person.name,
          value: person.id
        })),
      buttonTitle: "Primary Contact Person"
    }
  },
  {
    label: "Scope Doc Number",
    value: "scope_doc_code",
    component: popOverCheckBox,
    props: {
      options:
        props.scopedocNumbers &&
        props.scopedocNumbers.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Scope Doc Number"
    }
  },
  {
    label: "Quote Number",
    value: "quote_number",
    component: popOverCheckBox,
    props: {
      options:
        props.quotes &&
        props.quotes.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Quote Number"
    }
  },
  {
    label: "Site Address",
    value: "site_address",
    component: popOverCheckBox,
    props: {
      options:
        props.siteAddress &&
        props.siteAddress.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Site Address"
    }
  },
  {
    label: "Site City",
    value: "site_city",
    component: popOverCheckBox,
    props: {
      options:
        props.siteCities &&
        props.siteCities.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Site City"
    }
  },
  {
    label: "Task Name",
    value: "task_name",
    component: popOverCheckBox,
    props: {
      options:
        props.taskNameList &&
        props.taskNameList.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Task Name"
    }
  },
  {
    label: "Area",
    value: "area_name",
    component: popOverCheckBox,
    props: {
      options:
        props.areasList &&
        props.taskNameList.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Area"
    }
  },
  {
    label: "Notes",
    value: "note",
    component: CustomSelect,
    props: {
      label: "Notes",
      mode: "tags"
    },
    fieldSetClass: "note-drop"
  },
  {
    label: "Task Start Date",
    value: "task_start_date",
    component: CustomRangePicker,
    props: {
      placeholder: ["Task Start Date", "Task Start End date"]
    },
    fieldSetClass: "calendar-drop"
  },
  {
    label: "Site States",
    value: "site_state",
    component: popOverCheckBox,
    props: {
      options:
        props.siteState &&
        props.siteState.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Site States"
    }
  },
  {
    label: "Site Country",
    value: "site_country",
    component: popOverCheckBox,
    props: {
      options:
        props.siteContries &&
        props.siteContries.map(quote => ({
          label: quote,
          value: quote
        })),
      buttonTitle: "Site Countries"
    }
  },
  {
    label: "Account Manager",
    value: "am_assigned",
    component: popOverCheckBox,
    props: {
      options:
        props.accMngList &&
        props.accMngList.filter(quote => quote).map(quote => ({
          label: quote.first_name,
          value: quote.user_name
        })),
      buttonTitle: "Account Manager"
    }
  },
  {
    label: "Created By",
    value: "created_by",
    component: popOverCheckBox,
    props: {
      options:
        props.createdBy &&
        props.createdBy.map(quote => ({
          label: quote.first_name,
          value: quote.user_name
        })),
      buttonTitle: "Created By"
    }
  },
  {
    label: "Modified By",
    value: "modified_by",
    component: popOverCheckBox,
    props: {
      options:
        props.modifiedBy &&
        props.modifiedBy.map(quote => ({
          label: quote.first_name,
          value: quote.user_name
        })),
      buttonTitle: "Modified By"
    }
  },
  {
    label: "Created At",
    value: "created_at",
    component: CustomRangePicker,
    props: {
      placeholder: ["Start Date", "End Date"]
    },
    fieldSetClass: "calendar-drop"
  },
  {
    label: "Modified At",
    value: "modified_at",
    component: CustomRangePicker,
    props: {
      placeholder: ["Start Date", "End Date"]
    },
    fieldSetClass: "calendar-drop"
  },
  {
    label: "Admin Approved At",
    value: "admin_approved_at",
    component: CustomRangePicker,
    props: {
      placeholder: [
        "Start Date",
        "End Date"
      ]
    },
    fieldSetClass: "calendar-drop"
  },
  {
    label: "Client Approved At",
    value: "client_approved_at",
    component: CustomRangePicker,
    props: {
      placeholder: [
        "Start Date",
        "End Date"
      ]
    },
    fieldSetClass: "calendar-drop"
  }
];
