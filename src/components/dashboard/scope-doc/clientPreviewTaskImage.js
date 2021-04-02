import React from 'react';
import { Icon, Collapse, Table } from 'antd';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { abbrivationStr } from '../../../utils/common'
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';

// slider content

const { Panel } = Collapse;


// images view in table


class ClientPreviewTaskImage extends React.Component {
    query = new URLSearchParams(this.props.location.search);
    render() {
        return (
            <div className="sf-jobdoc-preview">
                <div className="sf-card-wrap">
                    
                    {/* inner header */}
                    <div className="jdp-big-cntr-head">
                        <h1>Task Images</h1>
                        
                    </div>
                    {/* body */}
                    <div className="sf-card">
                        <div className="sf-card-body p-0">
                            <div className="view-img-slider">
                                <Collapse bordered={false} defaultActiveKey={['1']} accordion expandIconPosition="right"
                                    expandIcon={({ isActive }) => <Icon type="down" rotate={isActive ? 180 : 0} />}>
                                    <Panel header={(<div class="jdp-c-exp-date co-details-prv">
                                        <p>Quote number: {this.query.get('num')}</p>
                                        <p>Job Name: {this.query.get('job')}</p>
                                        <p>Task Name: {this.query.get('task')}</p>
                                    </div>)} key="1">
                                        <div id="carouselExampleControls" data-interval="false" className="carousel slide">
                                            {/* data-ride="carousel" */}
                                            <div className="carousel-inner">
                                                {this.query.get("imgs") && JSON.parse(this.query.get("imgs")).map((url, index) => {
                                                    if (index % 2 == 0) {
                                                        return <div className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                                            <div className="ab-image-slide">
                                                                <div className="after-image sld-pic">
                                                                    <img src={url} />
                                                                </div>
                                                                {JSON.parse(this.query.get("imgs"))[index + 1] ? <div className="before-image sld-pic">
                                                                    <img src={JSON.parse(this.query.get("imgs"))[index + 1]} />
                                                                </div> : null}
                                                            </div>
                                                        </div>
                                                    }
                                                }
                                                )}

                                            </div>
                                            <div className="slider-navigation">
                                                <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                                                    <span className="fa fa-angle-left" aria-hidden="true"></span>
                                                </a>
                                                <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                                                    <span className="fa fa-angle-right" aria-hidden="true"></span>
                                                </a>
                                            </div>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>
                        </div>
                    </div>

                    
                </div>

                {/* save and preview button */}
                < div className="jdp-footer" >
                    <div className="all-btn d-flex justify-content-end mt-5 sc-doc-bnt">
                      
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToprops = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(ClientPreviewTaskImage);