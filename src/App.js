import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'easymde/dist/easymde.min.css';
import React, { useState } from 'react';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { flattenArr, objToArr } from './utils/helper';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/BottomBtn';
import TabList from './components/TabList';
import SimpleMDE from 'react-simplemde-editor';
import deafultFiles from './utils/defaultFiles';
import uuidv4 from 'uuid/v4';

function App() {
  // 初始文件
  const [files, setFiles] = useState(flattenArr(deafultFiles));
  console.log(files);
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
  console.log(filesArr);
  // 选中的file对象
  const activeFile = files[activeFileID];
  // 区分搜索列表
  const fileListArr = searchedFiles.length > 0 ? searchedFiles : filesArr;

  // 文件列表点击事件处理
  const fileClick = (fileID) => {
    // set current active file
    setActiveFileID(fileID);
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
    const newFile = { ...files[id], body: value };
    setFiles({ ...files, [id]: newFile });
    if (!unsavedFileIDs.includes(id)) {
      setUnsavedFileIDs([...unsavedFileIDs, id]);
    }
  };

  // 删除文件事件
  const deleteFile = (id) => {
    // filter out the current file id
    delete files[id];
    setFiles(files);
    tabClose(id);
  };

  // 修改文件名称
  const updateFileName = (id, title) => {
    const modifiedFile = { ...files[id], title, isNew: false };
    setFiles({ ...files, [id]: modifiedFile });
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
              <BottomBtn icon={faFileImport} text="导入" colorClass="btn-success" />
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
