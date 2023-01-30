import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import useKeyPress from '../hooks/useKeyPress';

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState('');
  const enterPressed = useKeyPress(13);
  const escPressed = useKeyPress(27);
  const node = useRef(null);

  const closeSearch = () => {
    setEditStatus(false);
    setValue('');
  };

  // TODO
  useEffect(() => {
    if (enterPressed && editStatus) {
      const editItem = files.find((item) => item.id === editStatus);
      onSaveEdit(editItem, value);
      setEditStatus(false);
      setValue('');
    }
    if (escPressed && editStatus) {
      closeSearch();
    }
  }, [editStatus, enterPressed, escPressed, files, onSaveEdit, value]);

  useEffect(() => {
    if (editStatus) {
      node.current.focus();
    }
  }, [editStatus]);

  return (
    <ul className="list-group list-group-flush">
      {files.map((file) => (
        <li
          className="list-group-item bg-light justify-content-between d-flex row align-items-center file-item flex-nowrap no-gutters"
          key={file.id}
        >
          {file.id !== editStatus && (
            <>
              <span className="col-2">
                <FontAwesomeIcon size="lg" icon={faMarkdown} />
              </span>
              <span
                onClick={() => {
                  onFileClick(file.id);
                }}
                className="col-7 c-link fileTitle"
              >
                {file.title}
              </span>
              <button type="button" className="icon-button col-1">
                <FontAwesomeIcon
                  onClick={() => {
                    setEditStatus(file.id);
                    setValue(file.title);
                  }}
                  title="编辑"
                  size="lg"
                  icon={faEdit}
                />
              </button>
              <button
                type="button"
                onClick={() => {
                  onFileDelete(file.id);
                }}
                title="删除"
                className="icon-button col-1"
              >
                <FontAwesomeIcon size="lg" icon={faTrash} />
              </button>
            </>
          )}
          {file.id === editStatus && (
            <>
              <input
                className="form-control FileSearchInput col-10"
                value={value}
                ref={node}
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
              <button onClick={closeSearch} type="button" className="icon-button col-2">
                <FontAwesomeIcon title="关闭" size="lg" icon={faTimes} />
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onSaveEdit: PropTypes.func,
  onFileDelete: PropTypes.func,
};

export default FileList;
