import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BottomBtn = ({ text, colorClass, icon, onBtnClik }) => (
  <button onClick={onBtnClik} type="button" className={`btn btn-block no-border ${colorClass}`}>
    <FontAwesomeIcon className='mr-2' size="lg" icon={icon} />
    {text}
  </button>
);

BottomBtn.propTypes = {
  text: PropTypes.string,
  colorClass: PropTypes.string,
  icon: PropTypes.element.isRequired,
  onBtnClik: PropTypes.func,
};

BottomBtn.defaultProps = {
  text: '新建',
};

export default BottomBtn;
