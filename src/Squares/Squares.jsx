import axios from 'axios';
import React from 'react'
import { Buffer } from 'buffer';
import { useState } from 'react'
import styles from './Squares.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faGripLinesVertical, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Table({ files, setFiles, displayLook }) {

  const [editingIndex, setEditingIndex] = useState(null);
  const [newNames, setNewNames] = useState();
  const [imageURL, setImageURL] = useState();


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
        .then(() => axios.get('http://localhost:2300/images')
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
      .then(() => axios.get('http://localhost:2300/images').then(res => setFiles(res.data)));
  };

  const showImg = async (filename) => {
    try {
      const response = await axios.get('http://localhost:2300/image/' + filename,
        { responseType: 'arraybuffer' });
      const imageBuffer = Buffer.from(response.data, 'binary').toString('base64');
      const dataUrl = `data:${response.headers['content-type']};base64,${imageBuffer}`;
      setImageURL(dataUrl);
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  };

  return (
    <ul className={styles.squares}>
      {imageURL &&
        <div className={styles.imgHolder} onClick={() => setImageURL()}>
          <img onClick={(e) => e.stopPropagation()} src={imageURL} alt="image" />
        </div>}
      {files.map((file, index) => {
        // המרת קוד הבאפר לקישור שתגית תמונה יכולה לקרוא
        const base64String = Buffer.from(file.previewImage?.data ? file.previewImage.data : "").toString('base64');
        const previewDataUrl = `data:image/jpeg;base64,${base64String}`;
        return <li key={index}>
          <img onClick={() => showImg(file.name)} src={previewDataUrl} alt={file.name} />
          <div>
            {editingIndex === index ?
              <form onSubmit={(e) => handleSubmit(e, index, file.name)}>
                <input
                  type="text"
                  maxLength={40}
                  value={newNames[index]}
                  onChange={(e) => handleCange(e, index)}
                  onBlur={(e) => handleSubmit(e, index, file.name)}
                  autoFocus
                  onFocus={(e) => e.target.select()}
                />
                <button type="submit" style={{ display: 'none' }}></button>
              </form>
              : <span className={styles.name} onDoubleClick={() => handleDoubleClick(index)}>{file.name}</span>}
          </div>
          <div className={styles.buttons}>
            <button title='הורדה' onClick={() => download(file.name)}>
              <FontAwesomeIcon icon={faDownload} /></button>
            <span className={styles.divider}>|</span>
            <button title='מחיקה' onClick={() => deleteFile(file.name)}>
              <FontAwesomeIcon icon={faTrash} /></button>
          </div>
        </li>
      })}
    </ul>
  )
}
