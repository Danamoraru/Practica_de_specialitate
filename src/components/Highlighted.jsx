import React from 'react';
import PropTypes from 'prop-types';
export default function Highlighted({ text, query = '' }) {
 if (!query) return text;
 const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig'));
 return parts.map((part, index) => part.toLocaleLowerCase('ro') === query.toLocaleLowerCase('ro') ? <mark key={`${index}-${part}`}>{part}</mark> : part);
}
Highlighted.propTypes = { text: PropTypes.string.isRequired, query: PropTypes.string };
