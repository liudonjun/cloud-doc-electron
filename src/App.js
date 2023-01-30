import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { faPlus, faFileImport } from '@fortawesome/free-solid-svg-icons';
import FileSearch from './components/FileSearch';
import FileList from './components/FileList';
import BottomBtn from './components/BottomBtn';
import deafultFiles from './utils/defaultFiles';

function App() {
  return (
    <div className="App container-fluid px-0">
      <div className="row no-gutters">
        <div className="col-6 left-panel">
          <FileSearch
            onFileSearch={(value) => {
              console.log(value);
            }}
          />
          <FileList
            files={deafultFiles}
            onFileClick={(value) => {
              console.log(value);
            }}
            onSaveEdit={(editItem, value) => {
              console.log(editItem, value);
            }}
            onFileDelete={(value) => {
              console.log(value);
            }}
          />
          <div className="row no-gutters">
            <div className="col">
              <BottomBtn icon={faPlus} text="新建" colorClass="btn-primary" />
            </div>
            <div className="col">
              <BottomBtn icon={faFileImport} text="导入" colorClass="btn-success" />
            </div>
          </div>
        </div>
        <div className="col-6 right-panel"></div>
      </div>
    </div>
  );
}

export default App;
