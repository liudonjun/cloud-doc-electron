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

  const closeSearch = (editItem) => {
    setEditStatus(false);
    setValue('');
    console.log(editItem);
    // if we are editing isNew
    if (editItem.isNew) {
      onFileDelete(editItem.id);
    }
  };

  useEffect(() => {
    const editItem = files.find((item) => item.id === editStatus);
    if (enterPressed && editStatus && value.trim() !== '') {
      onSaveEdit(editItem.id, value, editItem.isNew);
      setEditStatus(false);
      setValue('');
    }
    if (escPressed && editStatus) {
      closeSearch(editItem);
    }
  });

  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    if (newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);

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
          {file.id !== editStatus && !file.isNew && (
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
          {(file.id === editStatus || file.isNew) && (
            <>
              <input
                className="form-control FileSearchInput col-10"
                value={value}
                ref={node}
                placeholder="请输入文件名称"
                onChange={(e) => {
                  setValue(e.target.value);
                }}
              />
              <button
                onClick={() => {
                  closeSearch(file);
                }}
                type="button"
                className="icon-button col-2"
              >
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
