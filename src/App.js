import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
import React, { useState, useEffect } from 'react';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { flattenArr, objToArr } from './utils/helper';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/BottomBtn';
import TabList from './components/TabList';
import SimpleMDE from 'react-simplemde-editor';
import uuidv4 from 'uuid/v4';
import fileHelper from './utils/fileHelper';

// require nodejs modules
const { join, basename, extname, dirname } = window.require('path');
const { remote, ipcRenderer } = window.require('electron');
const Store = window.require('electron-store');

// 实例化
const fileStore = new Store({ 'name': 'files Data' });

// 数据持久化
const saveFilesToStore = (files) => {
  // 不需要把所有的信息都存储在store里面
  const filesStoreObj = objToArr(files).reduce((result, file) => {
    const { id, path, title, createAt } = file;
    result[id] = {
      id,
      path,
      title,
      createAt,
    };
    return result;
  }, {});
  fileStore.set('files', filesStoreObj);
};

// store 数据存储位置
// console.log(remote.app.getPath ('userData'))

function App() {
  // 初始文件
  const [files, setFiles] = useState(fileStore.get('files') || {});
  // 当前被激活的文件
  const [activeFileID, setActiveFileID] = useState(null);
  // 当前打开的文件列表
  const [openedFileIDs, setOpenedFileIDs] = useState([]);
  // 当前未保存的文件列表
  const [unsavedFileIDs, setUnsavedFileIDs] = useState([]);
  // 提供搜索使用不影响右边tab
  const [searchedFiles, setSearchedFiles] = useState([]);
  // 打开的文件集合对象
  const openedFiles = openedFileIDs.map((openID) => files[openID]);
  // map 转原始数据集合
  const filesArr = objToArr(files);
  // 文档保存地址
  const savedLocation = remote.app.getPath('documents');
  // 选中的file对象
  const activeFile = files[activeFileID];
  // 区分搜索列表
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;

  // 文件列表点击事件处理
  const fileClick = (fileID) => {
    // set current active file
    setActiveFileID(fileID);
    const currentFile = files[fileID];
    console.log(currentFile);
    if (!currentFile.isLoaded) {
      fileHelper.readFile(currentFile.path).then((value) => {
        const newFile = { ...files[fileID], body: value, isLoaded: true };
        setFiles({ ...files, [fileID]: newFile });
      });
    }
    // if openedfiles dont't have current id
    // then add new fileID to opened
    if (!openedFileIDs.includes(fileID)) {
      setOpenedFileIDs([...openedFileIDs, fileID]);
    }
  };

  // tab列表点击事件处理
  const tabClick = (fileID) => {
    console.log(fileID);
    // set current active file
    setActiveFileID(fileID);
  };

  // tab关闭点击事件
  const tabClose = (id) => {
    //remove current id from openedFileIDs
    const tabsWithout = openedFileIDs.filter((fileID) => fileID !== id);
    setOpenedFileIDs(tabsWithout);
    if (tabsWithout.length > 0) {
      if (activeFileID === id) {
        // set the active to the first opened tab if still tabs left
        setActiveFileID(tabsWithout[0]);
      }
    } else {
      setActiveFileID('');
    }
  };

  // md编辑器change事件
  const fileChange = (id, value) => {
    if (value !== files[id].body) {
      const newFile = { ...files[id], body: value };
      setFiles({ ...files, [id]: newFile });
      // update unsavedIDs
      if (!unsavedFileIDs.includes(id)) {
        setUnsavedFileIDs([...unsavedFileIDs, id]);
      }
    }
  };

  // 删除文件事件
  const deleteFile = (id) => {
    if (files[id].isNew) {
      // warn
      const { [id]: value, ...afterDelete } = files;
      setFiles(afterDelete);
    } else {
      fileHelper.deleteFile(files[id].path).then(() => {
        const { [id]: value, ...afterDelete } = files;
        setFiles(afterDelete);
        saveFilesToStore(afterDelete);
        tabClose(id);
      });
    }
  };

  // 修改文件名称
  const updateFileName = (id, title, isNew) => {
    const newPath = isNew
      ? join(savedLocation, `${title}.md`)
      : join(dirname(files[id].path), `${title}.md`);
    const modifiedFile = { ...files[id], title, isNew: false, path: newPath };
    const newFiles = { ...files, [id]: modifiedFile };
    if (isNew) {
      fileHelper.writeFile(newPath, files[id].body).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    } else {
      const oldPath = files[id].path;
      fileHelper.renameFile(oldPath, newPath).then(() => {
        setFiles(newFiles);
        saveFilesToStore(newFiles);
      });
    }
  };

  // 搜索
  const fileSearch = (keyword) => {
    const newFiles = filesArr.filter((file) => file.title.includes(keyword));
    setSearchedFiles(newFiles);
  };

  // 新建文件
  const createNewFile = () => {
    const newID = uuidv4();
    const newFile = {
      id: newID,
      title: '',
      body: '## create MaskDown 文档',
      createdAt: new Date().getTime(),
      isNew: true,
    };

    setFiles({ ...files, [newID]: newFile });
  };

  // 保存文件
  const saveCurrentFile = () => {
    fileHelper
      .writeFile(join(savedLocation, `${activeFile.title}.md`), activeFile.body)
      .then(() => {
        setUnsavedFileIDs(unsavedFileIDs.filter((id) => id !== activeFile.id));
      });
  };

  // 导入文件
  const importFiles = () => {
    remote.dialog.showOpenDialog(
      {
        title: '选择导入的 MarkDown 文件',
        properties: ['openFile', 'multiSelections'],
        filters: [{ name: 'Markdown files', extensions: ['md'] }],
      },
      (paths) => {
        if (Array.isArray(paths)) {
          // filter out the path we already have in electron store
          const filteredPaths = paths.filter((path) => {
            const alreadyAdded = Object.values(files).find((file) => {
              return file.path === path;
            });
            return !alreadyAdded;
          });
          // extend the path array to an array contains files info
          const importFilesArr = filteredPaths.map((path) => {
            return {
              id: uuidv4(),
              title: basename(path, extname(path)),
              path,
            };
          });
          // get the new files object in flattenArr
          const newFiles = { ...files, ...flattenArr(importFilesArr) };
          setFiles(newFiles);
          saveFilesToStore(newFiles);
          if (importFilesArr.length > 0) {
            remote.dialog.showMessageBox({
              type: 'info',
              title: `成功导入了${importFilesArr.length}个文件`,
              message: `成功导入了${importFilesArr.length}个文件`,
            });
          }
        }
      }
    );
  };

  useEffect(() => {
    const callBack = () => {
      console.log('hello form menu');
    };

    ipcRenderer.on('create-new-file', callBack);
  });

  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-3 left-panel">
          <FileSearch onFileSearch={fileSearch} />
          <FileList
            files={fileListArr}
            onFileClick={(fileID) => {
              fileClick(fileID);
            }}
            onSaveEdit={updateFileName}
            onFileDelete={deleteFile}
          />
          <div className="row no-gutters button-group">
            <div className="col">
              <BottomBtn
                icon={faPlus}
                text="新建"
                onBtnClik={createNewFile}
                colorClass="btn-primary"
              />
            </div>
            <div className="col">
              <BottomBtn
                icon={faFileImport}
                text="导入"
                onBtnClik={importFiles}
                colorClass="btn-success"
              />
            </div>
          </div>
        </div>
        <div className="col-9 right-panel">
          {!activeFile && <div className="satrt-page">选择或者创建新的 MarkDown 文档</div>}
          {activeFile && (
            <>
              <TabList
                activeId={activeFileID}
                unsaveIds={unsavedFileIDs}
                files={openedFiles}
                onTabClick={tabClick}
                onCloseTab={tabClose}
              />
              <SimpleMDE
                id="SimpleMDE"
                key={activeFile && activeFile.id}
                value={activeFile && activeFile.body}
                onChange={(value) => {
                  fileChange(activeFile.id, value);
                }}
                options={{
                  minHeight: '600px',
                  spellChecker: false,
                }}
              />
              <BottomBtn
                icon={faPlus}
                text="保存"
                onBtnClik={saveCurrentFile}
                colorClass="btn-primary"
              />
              {/* { activeFile.isSynced && 
                <span className="sync-status">已同步，上次同步{timestampToString(activeFile.updatedAt)}</span>
              } */}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
