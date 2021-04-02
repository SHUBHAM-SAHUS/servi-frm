import React from 'react';
import { Strings } from '../../../dataProvider/localize';
import { Icon, Menu, Dropdown, Modal, Upload } from 'antd';
import { currencyFormat } from '../../../utils/common';


export const subscriptCard = (selectedSubscription) =>
    <div className="sf-card mt-4">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h4 className="sf-sm-hd sf-pg-heading">{Strings.sub_card}</h4>
        </div>

        <div className="sf-card-body">
            <div>
                <div className="view-text-value">
                    <label className="sf-badge">{Strings.sub_type}
                        <span className="badge">Active</span></label>
                    <span>{selectedSubscription && selectedSubscription.name}</span>
                    <strong className="price-pm">{selectedSubscription && Number(currencyFormat(selectedSubscription.amount))}/Month</strong>
                </div>
                <div className="view-text-value mt-3">
                    <label>{Strings.sub_date}</label>
                    <span>29th Jan 2019</span>
                </div>
            </div>
        </div>
    </div>


export const connectedOrgCard = (organization) =>
    <div className="sf-card con-ord-mh">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h4 className="sf-sm-hd sf-pg-heading">{Strings.connected_org_txt}</h4>
        </div>
        <div className="sf-card-body">
            <div className="con-org-list">
                {organization ? organization.conncted_orgs.map(org => <div>
                    <span>{org.name}</span><br /></div>) : null}

            </div>
        </div>
    </div>



export const industryCard = (organization, industries, services, categories, subCategories) =>
    <div className="sf-card sf-mcard my-4">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">{Strings.service_inductries_txt}</h2>
            <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled>
                    <i className="material-icons">more_vert</i>
                </Dropdown>
            </div>
        </div>

        <div className="sf-card-body">
            {organization && organization.org_industries ?
                organization.org_industries
                    .map((industry) => <div>
                        {Strings.instry_header_text + ' : ' + (industries.find(ind => ind.id === industry.industry_id)
                            && industries.find(ind => ind.id === industry.industry_id).industry_name ?
                            industries.find(ind => ind.id === industry.industry_id).industry_name : null)}
                        {industry.services && industry.services.map(service =>
                            <div>
                                {services.find(ser => ser.id === service.service_id) ?
                                    services.find(ser => ser.id === service.service_id).service_name :
                                    null}
                                {service.categories && service.categories.map(category =>
                                    <div>
                                        {categories.find(cat => cat.id === category.category_id) ?
                                            categories.find(cat => cat.id === category.category_id).category_name
                                            : null}
                                        {category.subcategory && category.subcategory.map(subCategory =>
                                            <div>
                                                {subCategories.find(sub => sub.id === subCategory.sub_category_id) ?
                                                    subCategories.find(sub => sub.id === subCategory.sub_category_id).sub_category_name
                                                    : null}
                                            </div>)}
                                    </div>)}
                            </div>)}
                    </div>)
                : null}
        </div>
    </div>

export const iconView = (organization) =>
    <div className="col-md-2">
        <div className="view-logo">
            <img src={organization && organization.logo ? organization.logo : "/images/sf-list-img.png"} />
        </div>
    </div>
