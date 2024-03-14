import axios from 'axios';
import React from 'react'
import { useState } from 'react'
import styles from './Table.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faGripLinesVertical, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Table({ files, setFiles, displayLook }) {

  const [editingIndex, setEditingIndex] = useState(null);
  const [newNames, setNewNames] = useState();


  const handleDoubleClick = (index) => {
    displayLook ? setNewNames(files.map(file => file[0])) : setNewNames(files.map(file => file.name));
    setEditingIndex(index);
  }

  const handleCange = (e, index) => {
    let newNamesCopy = [...newNames];
    newNamesCopy[index] = e.target.value;
    setNewNames(newNamesCopy);
  };

  const handleSubmit = (e, index, oldName) => {
    e.preventDefault();
    setEditingIndex(null);

    if (newNames[index].trim() !== oldName) {
      updateName(oldName, newNames[index].trim());
    }
  };

  const updateName = (oldName, newName) => {
    try {
      axios.put('http://localhost:2300/rename/' + oldName, { newName })
        .then(() => axios.get('http://localhost:2300')
          .then(res => {
            setFiles(res.data),
              setNewNames(res.data.map(file => file[0]))
          })
        );
    } catch (error) {
      console.error(error);
    }
  };

  const download = (filename) => {
    window.location.href = 'http://localhost:2300/download/' + filename;
  };

  const deleteFile = (filename) => {
    axios.delete('http://localhost:2300/' + filename)
      .then(() => axios.get('http://localhost:2300').then(res => setFiles(res.data)));
  };

  return (
    <div className={styles.allTable}>
        <table>
          <thead>
            <tr>
              <th>שם</th>
              <th>גודל</th>
              <th>פרטים</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file, index) => {
              return <tr key={index}>
                <td>
                  {editingIndex === index ?
                    <form onSubmit={(e) => handleSubmit(e, index, file[0])}>
                      <input
                        type="text"
                        maxLength={40}
                        value={newNames[index]}
                        onChange={(e) => handleCange(e, index)}
                        onBlur={(e) => handleSubmit(e, index, file[0])}
                        autoFocus
                        onFocus={(e) => e.target.select()}
                      />
                      <button type="submit" style={{ display: 'none' }}></button>
                    </form>
                    : <span onDoubleClick={() => handleDoubleClick(index)}>{file[0]}</span>}
                </td>
                <td>{file[1]}</td>
                <td>{file[2]?.height + "x" + file[2]?.width}</td>
                <td>
                  <button title='הורדה' onClick={() => download(file[0])}>
                    <FontAwesomeIcon icon={faDownload} /></button>
                  <span className={styles.divider}>|</span>
                  <button title='מחיקה' onClick={() => deleteFile(file[0])}>
                    <FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            })}
          </tbody>
        </table>
    </div>
  )
}
