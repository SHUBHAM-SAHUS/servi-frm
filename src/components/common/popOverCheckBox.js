import React, { useEffect, useState } from "react";
import { Popover, Button, Checkbox } from "antd";
import $ from "jquery";

/*NOTE: Please make sure you handle the 'onSelect' prop whenever you're using this custom component. */

export const popOverCheckBox = ({
  input,
  options,
  buttonTitle,
  placeholder,
  meta: { touched, error, warning }
}) => {
  const [searchKey, setKey] = useState("");

  return (
    <Popover
      className="ad-srch-content"
      overlayClassName="ad-srh-popup"
      content={
        <div className="advance-search-popup">
          <div className="ad-srch-box sf-form">
            <input
              type="text"
              className="form-container"
              placeholder={placeholder}
              value={searchKey}
              onChange={e => setKey(e.target.value)}
            />
          </div>
          <Checkbox.Group
            options={
              options &&
              options.filter &&
              options.filter(
                opt =>
                  opt.label &&
                  opt.label.toUpperCase().indexOf(searchKey.toUpperCase()) != -1
              )
            }
            onChange={input.onChange}
            value={input.value ? input.value : []}
          />
        </div>
      }
      placement="bottomLeft"
      title={false}
      trigger="click"
    >
      <Button className="normal-bnt ad-srch-btn">
        {input.value && input.value.length > 0
          ? buttonTitle + ":" + input.value.map(
            (val, index) => " " + (options.find(obj => obj.value == val) ? options.find(obj => obj.value == val).label:"")
          )
          : buttonTitle + ": ALL"}
        <i class="material-icons">arrow_drop_down</i>
      </Button>
    </Popover>
  );
};
