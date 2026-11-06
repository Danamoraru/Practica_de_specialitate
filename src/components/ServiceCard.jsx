import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Highlighted from './Highlighted.jsx';

export default function ServiceCard({ service, query = '' }) {
  const content = <><span className="service-icon"><i className={`fa-solid ${service.icon}`}/></span><h3><Highlighted text={service.title} query={query}/></h3><p><Highlighted text={service.description} query={query}/></p><span className="card-link">{service.action || 'Deschide serviciul'} <i className="fa-solid fa-arrow-right"/></span></>;
  return <Link to={service.url || '/servicii'} className="service-card reveal">{content}</Link>;
}
ServiceCard.propTypes = { query: PropTypes.string, service: PropTypes.shape({ url: PropTypes.string, icon: PropTypes.string, title: PropTypes.string, description: PropTypes.string, action: PropTypes.string }).isRequired };
