import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import useKeyPress from '../hooks/useKeyPress';
import useIpcRenderer from '../hooks/useIpcRenderer';

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState('');
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  const node = useRef(null);

  const closeSearch = () => {
    setInputActive(false);
    setValue('');
    onFileSearch('');
  };

  const startSearch = () => {
    setInputActive(true)
  }

  useIpcRenderer({
    'search-file': startSearch
  })

  useEffect(() => {
    if (enterPressed && inputActive) {
      onFileSearch(value);
    }
    if (escPressed && inputActive) {
      closeSearch();
    }
  });

  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive]);

  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
      {!inputActive && (
        <>
          <span className="fileTitle">{title}</span>
          <button
            onClick={() => {
              setInputActive(true);
            }}
            type="button"
            className="icon-button"
          >
            <FontAwesomeIcon title="搜索" size="lg" icon={faSearch} />
          </button>
        </>
      )}
      {inputActive && (
        <>
          <input
            className="form-control FileSearchInput"
            value={value}
            ref={node}
            onChange={(e) => {
              setValue(e.target.value);
            }}
          />
          <button onClick={closeSearch} type="button" className="icon-button">
            <FontAwesomeIcon title="关闭" size="lg" icon={faTimes} />
          </button>
        </>
      )}
    </div>
  );
};

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired,
};

FileSearch.defaultProps = {
  title: '我的云文档',
};

export default FileSearch;
