import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import moment from 'moment';
import * as action from '../../../actions/SAJobMgmtAction';

class UserLicienceView extends React.Component {
    render() {
        const { userLicence } = this.props;
        return (
            <div id="licencesSlider" className="carousel slide" data-interval="false" data-ride="carousel">
                <div className="carousel-inner">
                    {userLicence && userLicence.file_path && userLicence.licences && userLicence.licences.length > 0 ? userLicence.licences.map((licence, index) => {
                        return <div className={index === 0 ? "carousel-item active" : "carousel-item"}>
                            {licence && licence.licence_type ? <p>Licience Name : {licence.licence_type}</p> : ''}
                            {licence && licence.number ? <p> Licience Number : {licence.number}</p> : ''}
                            {licence && licence.issued_by ? <p>
                                Licience Issued By : {licence.issued_by}</p> : ''}
                            {licence && licence.expiry_date ? <p>
                                Licience Expiry Date : {moment(licence.expiry_date).format('DD/MM/YYYY')}</p> : ''}
                        </div>
                    }) : <div className="px-5"> <p>User Licience Does Not Found</p></div>}

                </div>
                <div className="slider-nav">
                    <a className="carousel-control-prev" href="#licencesSlider" role="button" data-slide="prev">
                        <i className="material-icons" aria-hidden="true">keyboard_arrow_left</i>
                    </a>
                    <a className="carousel-control-next" href="#licencesSlider" role="button" data-slide="next">
                        <i className="material-icons" aria-hidden="true">keyboard_arrow_right</i>
                    </a>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        userLicence: state.sAJobMgmt.userLicence
    }
}


export default compose(
    connect(mapStateToProps, action),
)(UserLicienceView)



