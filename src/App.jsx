import axios from 'axios'
import './App.css'
import { useState, useEffect } from 'react'
import Table from './Table/Table'
import Upload from './Upload/Upload'
import Squares from './Squares/Squares'
import { faFileImage, faTable, faTableList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function App() {

  const [files, setFiles] = useState([]);
  const [displayLook, setDisplayLook] = useState(
    localStorage.displayLook ? JSON.parse(localStorage.displayLook) : false);

  useEffect(() => {
    axios.get('http://localhost:2300')
      .then(res => setFiles(res.data))
  }, [])

  useEffect(() => {
    if (!displayLook) {
      axios.get('http://localhost:2300/images')
        .then(res => setFiles(res.data));
    } else {
      axios.get('http://localhost:2300')
        .then(res => setFiles(res.data));
    }
  }, [displayLook])

  const display = (boolean) => {
    setDisplayLook(boolean);
    localStorage.displayLook = boolean;
  };


  return (
    <div className='app'>
      <header>
        <span>
          <FontAwesomeIcon icon={faFileImage} style={{ color: "#ffdb6d" }} />&nbsp;העלאת קבצים
        </span>
        <div className="display">
          <button className="list" id={displayLook ? "active" : ""}
            onClick={() => display(true)}><FontAwesomeIcon icon={faTableList} /></button>
          <button className="nList" id={displayLook ? "" : "active"}
            onClick={() => display(false)}><FontAwesomeIcon icon={faTable} /></button>
        </div>
      </header>
      <main>
        <div className="tableHolder">
          {displayLook ?
            <Table files={files} setFiles={setFiles} displayLook={displayLook} /> :
            <Squares files={files} setFiles={setFiles} displayLook={displayLook} />}
        </div>
        <Upload setFiles={setFiles} displayLook={displayLook} />
      </main>
      <footer></footer>
    </div>
  )
}

export default App
