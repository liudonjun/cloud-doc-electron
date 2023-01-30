import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './TabList.less'

const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {files.map((file) => {
        const fClassName = classNames({
          'nav-link ': true,
          'active': file.id === activeId,
        });
        return (
          <li className="nav-item" key={file.id}>
            {/* active */}
            <a
              className={fClassName}
              href="javascript;"
              onClick={(e) => {
                e.preventDefault();
                onTabClick(file.id);
              }}
            >
              <span>{file.title}</span>
              <span className="ml-2">
                <FontAwesomeIcon title="搜索" icon={faTimes} />
              </span>
            </a>
          </li>
        );
      })}
    </ul>
  );
};

TabList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unsaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func,
};

TabList.defaultProps = {
  unsaveIds: [],
};

export default TabList;
