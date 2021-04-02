import { AutoComplete, Icon } from 'antd';
import React, { useEffect } from 'react';
import $ from 'jquery';

export const CustomAutoComplete = ({ input, label, dataSource, placeholder, meta: { touched, error, warning } }) => {
    var id = "CustomAutoComplete-" + Math.random().toString(36).substr(7)

    useEffect(() => {
        $(`#${id} .ant-input.ant-select-search__field`).attr('id', `${input.name}-focus`)
    })

    return (
        <div id="stickAutoComplete" className="sf-select select-wibg">
            <label>{label}</label>
            <div>
                <AutoComplete id={id}
                    placeholder={placeholder} dataSource={input.value ? dataSource : []} value={dataSource.
                        find(data => input.value === data.value) ?
                        dataSource.find(data => input.value === data.value).text
                        : input.value
                    }
                    onChange={input.onChange}
                    defaultOpen={false}
                    getPopupContainer={() => document.getElementById('stickAutoComplete')}
                    filterOption={(inputValue, option) =>
                        option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}
                >

                </AutoComplete>
                {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
        </div>
    );
}