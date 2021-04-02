import React from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon } from 'antd';
import * as actions from '../../../actions/organizationUserAction';
import { Strings } from '../../../dataProvider/localize';
import PerfectScrollbar from 'react-perfect-scrollbar'

class ServiceAgentUserList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { activeId: null, displayPermiComp: false };
  }

  handleUserClick = userId => {
    this.props.handleUserDetails(userId);
  };

  render() {
    return (
      <div className="sf-card-body">
        <PerfectScrollbar className="sf-ps-scroll" onScrollX>
          <div className="sf-ps-scroll-content">
            <table className="add-user-table table">
              <tr>
                <th>{Strings.user_table_name}</th>
                <th>{Strings.user_table_email}</th>
                <th>{Strings.user_table_phone}</th>
                <th>{Strings.user_table_role}</th>
                <th style={{ width: '80px' }}></th>
              </tr>
              {this.props.orgUsers.map((user) =>
                <tr
                  key={user.id}
                  className={
                    this.state.activeId != null
                      ? this.state.activeId === user.id
                        ? "active"
                        : "disable-lists"
                      : ""
                  }
                >
                  <td>{user.name + " " + (user.last_name ? user.last_name : "")}</td>
                  <td>{user.email_address}</td>
                  <td>{`${user.country_code}${user.phone_number}`}</td>
                  <td>{user.role.name}</td>
                  <td>
                    <button className='delete-bnt' onClick={() => this.handleUserClick(user.id)}><Icon type='edit' /></button>&nbsp;&nbsp;
                  <button className='delete-bnt' userId={user.id}><Icon type='delete' /></button>
                  </td>
                </tr>
              )}
            </table>
          </div>
        </PerfectScrollbar>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    users: state.organizationUsers.users
  }
}

const mapDispatchToprops = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch),
  };
};

export default connect(mapStateToProps, mapDispatchToprops)(ServiceAgentUserList);