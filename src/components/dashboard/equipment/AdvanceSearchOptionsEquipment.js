import { popOverCheckBox } from "../../common/popOverCheckBox";
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomSelect } from "../../common/customSelect";
import { CustomRangePicker } from "../../common/customRangePicker";

export const searchOptions = props => [
  {
    label: "Equipment Name",
    value: "name",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equipment_names &&
        props.equipmentList.equipment_names.map(name => ({
          label: name,
          value: name
        })),
      buttonTitle: "Equipment Name"
    }
  },
  {
    label: "Equipment ID",
    value: "equipment_id",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equipment_Id &&
        props.equipmentList.equipment_Id.map(id => ({
          label: id,
          value: id
        })),
      buttonTitle: "Equipment ID"
    }
  },
  {
    label: "Type",
    value: "type",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equipment_types &&
        props.equipmentList.equipment_types.map(type => ({
          label: type,
          value: type
        })),
      buttonTitle: "Type"
    }
  },
  {
    label: "Group",
    value: "equ_group",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equipment_groups &&
        props.equipmentList.equipment_groups.map(group => ({
          label: group,
          value: group
        })),
      buttonTitle: "Group"
    }
  },
  {
    label: "Equipment Cost",
    value: "cost",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equipment_cost &&
        props.equipmentList.equipment_cost.map(cost => ({
          label: cost.toString(),
          value: cost
        })),
      buttonTitle: "Equipment Cost"
    }
  },
  {
    label: "Year of Manufacture",
    value: "manufacture_year",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equ_manufacture_year &&
        props.equipmentList.equ_manufacture_year.map(year => ({
          label: year,
          value: year
        })),
      buttonTitle: "Year of Manufacture"
    }
  },
  {
    label: "Manufacturers Batch No.",
    value: "manufacture_batch_no",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equ_manufacture_batch_no &&
        props.equipmentList.equ_manufacture_batch_no.map(batchno => ({
          label: batchno,
          value: batchno
        })),
      buttonTitle: "Manufacturers Batch No."
    }
  },
  {
    label: "Serial No",
    value: "serial_no",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equ_serial_no &&
        props.equipmentList.equ_serial_no.map(serial_no => ({
          label: serial_no,
          value: serial_no
        })),
      buttonTitle: "Serial No"
    }
  },
  {
    label: "Brand",
    value: "brand",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equipment_brand &&
        props.equipmentList.equipment_brand.map(brand => ({
          label: brand,
          value: brand
        })),
      buttonTitle: "Brand"
    }
  },
  {
    label: "Purchase Date",
    value: "purchase_date",
    component: CustomRangePicker,
    props: {
      placeholder: "Purchase Date"
    },
    fieldSetClass: "calendar-drop"
  },
  {
    label: "Destroy After Date",
    value: "destroy_after_date",
    component: CustomRangePicker,
    props: {
      placeholder: "Destroy After Date"
    },
    fieldSetClass: "calendar-drop"
  },
  {
    label: "Notes",
    value: "notes",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.equipment_notes &&
        props.equipmentList.equipment_notes.map(note => ({
          label: note,
          value: note
        })),
      buttonTitle: "Notes"
    },
    fieldSetClass: "note-drop"
  },
  {
    label: "Test & Tag Result",
    value: "result",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.test_and_tag_result &&
        props.equipmentList.test_and_tag_result.map(result => ({
          label: result,
          value: result
        })),
      buttonTitle: "Test & Tag Result"
    }
  },
  {
    label: "Test & Tag Type",
    value: "test_type",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.test_tag_test_type &&
        props.equipmentList.test_tag_test_type.map(type => ({
          label: type,
          value: type
        })),
      buttonTitle: "Test & Tag Type"
    }
  },
  {
    label: "Tester Licences Type",
    value: "license_type",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.tester_licences_type &&
        props.equipmentList.tester_licences_type.map(type => ({
          label: type,
          value: type
        })),
      buttonTitle: "Tester Licences Type"
    }
  },
  {
    label: "Tester",
    value: "tester",
    component: popOverCheckBox,
    props: {
      options: props.equipmentList && props.equipmentList.tester &&
        props.equipmentList.tester.map(tester => ({
          label: tester,
          value: tester
        })),
      buttonTitle: "Tester"
    }
  },
];
