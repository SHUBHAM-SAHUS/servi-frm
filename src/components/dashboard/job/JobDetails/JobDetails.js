import React from "react";
import moment from 'moment';

const JobDetils = ({ jobDetails }) => {
  return (
    <div class="sf-card-inn-bg scop-inn-bg mt-4">
      <div class="data-v-row">
        <div class="data-v-col">
          <div class="view-text-value">
            <label>Job Name: {jobDetails.job_name}</label>
          </div>
        </div>
        <div class="data-v-col">
          <div class="view-text-value">
            <label>Job label: {jobDetails.job_label}</label>
          </div>
        </div>
        <div class="data-v-col">
          {
            jobDetails.job_start_date && (
              <div class="view-text-value">
                <label>Start date: {moment(jobDetails.job_start_date).format('DD-MM-YYYY')}</label>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default JobDetils;
