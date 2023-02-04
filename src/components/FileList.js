import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faTimes } from '@fortawesome/free-solid-svg-icons';
import { faMarkdown } from '@fortawesome/free-brands-svg-icons';
import useKeyPress from '../hooks/useKeyPress';
import useContextMenu from '../hooks/useContextMenu';
import { getParentNode } from '../utils/helper';

// load nodejs modules
const { remote } = window.require('electron');
const { Menu, MenuItem } = remote;

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

  const clickedItem = useContextMenu(
    [
      {
        label: '打开',
        click: () => {
          const parentElement = getParentNode(clickedItem.current, 'file-item');
          if (parentElement) {
            onFileClick(parentElement.dataset.id);
          }
        },
      },
      {
        label: '重命名',
        click: () => {
          const parentElement = getParentNode(clickedItem.current, 'file-item');
          if (parentElement) {
            setEditStatus(parentElement.dataset.id);
            setValue(parentElement.dataset.title);
          }
        },
      },
      {
        label: '删除',
        click: () => {
          const parentElement = getParentNode(clickedItem.current, 'file-item');
          if (parentElement) {
            onFileDelete(parentElement.dataset.id);
          }
        },
      },
    ],
    '.file-list',
    [files]
  );

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
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => (
        <li
          className="list-group-item bg-light justify-content-between d-flex row align-items-center file-item flex-nowrap no-gutters"
          key={file.id}
          data-id={file.id}
          data-title={file.title}
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
