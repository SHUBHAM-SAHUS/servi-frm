import { setStorage } from "../../../../utils/common"
import React from "react";

const LinksHeader = (props) => {
  const redirectToJobDocument = (jobId) => {
    setStorage("JOB_ID", jobId);
    props.history.push('./jobDocuments')
  }
  console.log(props)
  return (
    <div className="dash-header">
      <h2 className="page-mn-hd">
        <div className="jobs-detail-tools">
          <div className="tools-lists-row">
            <button
              className="tools-items normal-bnt color-6"
              onClick={() => redirectToJobDocument(props.jobDetails.id)}
            >
              <i className="material-icons">link</i>
              <span>Job docs link</span>
            </button>
            <button
              className="tools-items normal-bnt color-5"
            >
              <i className="sficon sf-incident-report"></i>
              <span>Download SWMS</span>
            </button>
            <button
              className="tools-items normal-bnt color-11"
              onClick={() => { }}
            >
              <i className="material-icons">photo_camera</i>
              <span>Create Report</span>
            </button>
            <button
              className="tools-items normal-bnt color-1"
              onClick={() => { }}
            >
              <i className="sficon sf-sign-swms"></i>
              <span>Signoff Job</span>
            </button>
            <button
              className="tools-items normal-bnt color-6"

            >
              <i className="material-icons">settings_applications</i>
              <span>Job File</span>
            </button>
            <button className="tools-items normal-bnt color-3">
              <i className="material-icons">description</i>
              <span>Create Invoice</span>
            </button>
          </div>
        </div>
      </h2>
    </div>
  );
};

export default LinksHeader;
