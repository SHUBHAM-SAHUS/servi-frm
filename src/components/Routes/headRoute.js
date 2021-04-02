import React from 'react';
import { BrowserRouter, Route, withRouter, Redirect, Switch } from 'react-router-dom';
import SignUp from '../auth/signup';
import SignIn from '../auth/signin';
import verifyAttributes from '../auth/verifyAttributes';
import Forgotpass from '../auth/forgotpass';
import Reseturpass from '../auth/reseturpass';
import Forgotusername from '../auth/forgotusername';
import Dashboard from '../dashboard/dashboard';
import SignInCode from '../auth/login-sms-code-form';
import Preview from '../dashboard/job/JobEmail/Preview';
import JobReportPreviewClient from '../dashboard/serviceAgentJobMgmt/jobReport/JobReportPreviewClient';
import ClientPreviewSwmsSign from '../dashboard/serviceAgentJobMgmt/signSWMS/ClientPreviewSwmsSign';
import ClientPreviewSignoff from '../dashboard/serviceAgentJobMgmt/signOffSheet/ClientPreviewSignoff';
import { createBrowserHistory } from 'history';
import ClientPreviewJobDoc from '../dashboard/job/ClientPreviewJobDoc';
import ClientPreviewTaskImage from '../dashboard/scope-doc/clientPreviewTaskImage';

import JobDocuments from '../job-documents';
import AddTasks from '../job-documents/add-tasks';
import AddStaff from '../job-documents/add-staff';
import Document from '../job-documents/document';
import StaffList from '../job-documents/staff-list';
import StaffLicences from '../job-documents/staff-licences';
import AddNotes from '../job-documents/add-notes';
import JobDocumentsPreview from '../dashboard/job-documents/job-doc-preview';


export const browserHistory = createBrowserHistory();
class HeadRoute extends React.Component {
	constructor(props) {
		super(props);
		this.signOut = this.signOut.bind(this);
	}

	signOut() {
		this.props.signOut();
		withRouter(({ history }) => {
			history.push('/signin');
		});
	}

	render() {
		return (

			<BrowserRouter history={browserHistory}>
				<Switch>
					<Route path='/dashboard' component={Dashboard} />
					<Route exact path='/' component={() => <Redirect to="/signin" />} />
					<Route exact path='/verify-account' component={verifyAttributes} />
					<Route exact path='/signup' component={SignUp} />
					<Route exact path='/signin' component={SignIn} />
					<Route exact path='/forgotpass' component={Forgotpass} />
					<Route exact path='/reseturpass' component={Reseturpass} />
					<Route exact path='/forgotusername' component={Forgotusername} />
					<Route exact path='/signin_code' component={SignInCode} />
					<Route exact path='/job_docs_preview' component={ClientPreviewJobDoc} />
					<Route exact path='/job_report_preview' component={JobReportPreviewClient} />
					<Route exact path='/sign_swms_preview' component={ClientPreviewSwmsSign} />
					<Route exact path='/job_sign_off_preview' component={ClientPreviewSignoff} />
					<Route exact path='/task_image_preview' component={ClientPreviewTaskImage} />

					<Route path='/job-documents' component={JobDocuments} />
					<Route path='/add-tasks' component={AddTasks} />
					<Route path='/add-staff' component={AddStaff} />
					<Route path='/document' component={Document} />
					<Route path='/staff-list' component={StaffList} />
					<Route path='/staff-licences' component={StaffLicences} />
					<Route path='/add-notes' component={AddNotes} />
					<Route path='/client/job-doc-preview/:jobid' component={JobDocumentsPreview} />

				</Switch>
			</BrowserRouter>
		)
	}
}



export default HeadRoute;