import React, { useState, useCallback, useEffect } from "react";
import { Dropdown, notification, Upload } from "antd";
import { Strings } from "../../../../dataProvider/localize";
import { VALIDATE_STATUS } from "../../../../dataProvider/constant";

const ClientDetails = ({
  jobDetails,
  clientAcceptanceMannual,
  getTaskJobDetails,
}) => {
  const [file, setFile] = useState([]);
  const [poNumber, setPoNum] = useState();
  useEffect(() => {
    setPoNum(jobDetails.quote_po_no);
  }, [jobDetails.quote_po_no]);

  const uploadPicProps = {
    beforeUpload: (file) => {
      setFile([file]);
      return false;
    },
    multiple: false,
    accept: ".jpeg,.jpg,.png,.pdf",
    fileList: file,
    onRemove: () => setFile([]),
  };
  const handleClientApproval = () => {
    var formData = {
      client_approve_status: 3,
      quote_id: jobDetails.quote_id,
      scope_doc_id: jobDetails.scope_doc_id,
      quote_po_no: poNumber,
    };
    var finalFormData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) finalFormData.append(key, formData[key]);
    });
    if (file && file.length > 0) finalFormData.append("po_document", file[0]);
    clientAcceptanceMannual(finalFormData, jobDetails.scope_doc_id)
      .then((res) => {
        getTaskJobDetails(jobDetails.id);
        notification.success({
          message: Strings.success_title,
          description: res.message,
          onClick: () => {},
          className: "ant-success",
        });
      })
      .catch((error) => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description:
              error && error.data && typeof error.data.message == "string"
                ? error.data.message
                : Strings.generic_validate,
            onClick: () => {},
            className: "ant-warning",
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description:
              error &&
              error.data &&
              error.data.message &&
              typeof error.data.message == "string"
                ? error.data.message
                : Strings.generic_error,
            onClick: () => {},
            className: "ant-error",
          });
        }
      });
  };
  return (
    <div className="sf-card mt-4">
      <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
        <h2 className="sf-pg-heading">Client Details</h2>
        <div className="info-btn disable-dot-menu">
          <Dropdown className="more-info" disabled>
            <i className="material-icons">more_vert</i>
          </Dropdown>
        </div>
      </div>

      <div className="sf-card-body">
        <div className="row">
          <div className="col-md-9 col-sm-9">
            <div className="data-v-row">
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>Name</label>
                  <span>{jobDetails.client_name}</span>
                </div>
              </div>
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>Primary Contact Person</label>
                  <span>{jobDetails.client_person_name}</span>
                </div>
              </div>
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>Phone Number</label>
                  <span>{jobDetails.client_person_phone}</span>
                </div>
              </div>
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>Email</label>
                  <span>{jobDetails.client_person_email}</span>
                </div>
              </div>
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>Address</label>
                  <span>{jobDetails.client_address}</span>
                </div>
              </div>
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>ABN/ACN</label>
                  <span>{jobDetails.client_abn_acn}</span>
                </div>
              </div>
              {jobDetails.quote_po_no ? (
                <>
                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>PO Number</label>
                      <span>{jobDetails.quote_po_no}</span>
                    </div>
                  </div>
                </>
              ) : (
                <div className="data-v-col po-num-txt d-flex">
                  <div className="view-text-value">
                    <div class="sf-form form-group">
                      <label>PO Number</label>
                      <input
                        type="text"
                        onChange={useCallback((event) =>
                          setPoNum(event.target.value)
                        )}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="po-doc-w-save-bnt">
                {jobDetails.po_file ? (
                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>PO Document</label>
                      <a
                        href={jobDetails.po_file}
                        download
                        className="normal-bnt"
                        target="_blank"
                      >
                        <i class="material-icons">get_app</i>
                        <span className="edit-image-logo">
                          {"Open document"}
                        </span>
                      </a>
                    </div>
                  </div>
                ) : (
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
                  </div>
                )}
                {jobDetails.quote_po_no ? (
                  jobDetails.po_file ? null : (
                    <div className="save-po-no-file">
                      <button
                        className="normal-bnt"
                        type="button"
                        onClick={handleClientApproval}
                      >
                        <i class="material-icons">save</i>
                      </button>
                    </div>
                  )
                ) : (
                  <div className="save-po-no-file">
                    <button
                      className="normal-bnt"
                      type="button"
                      onClick={handleClientApproval}
                    >
                      <i class="material-icons">save</i>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="col-md-3 col-sm-3 d-flex justify-content-end">
            <div className="client-fdbk approved">Client Approved</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDetails;
