import axios from 'axios';
import React, { useRef, useState } from 'react'
import styles from './Upload.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCirclePlus, faUpload } from '@fortawesome/free-solid-svg-icons';

export default function Upload({ setFiles, displayLook }) {

  const [imageNames, setImageNames] = useState([])

  const handleChange = (e) => {
    console.log(e.target.files[0].name);
    const inputFiles = e.target.files;
    // זה כמו לכתוב 3 נקודות אבל נתמך יותר במקרה הזה
    const fileNames = Array.from(inputFiles).map((file) => file.name);
    setImageNames(fileNames);
  };

  const formRef = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    // console.log([...fd]);
    try {
      await axios.post('http://localhost:2300', fd)

      formRef.current.reset();
      setImageNames([]);

      if (displayLook) {
        const response = await axios.get('http://localhost:2300');
        setFiles(response.data);
      } else {
        const response = await axios.get('http://localhost:2300/images');
        setFiles(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.upload}>
      <span>כאן אפשר להעלות:</span>
      <label>
        <FontAwesomeIcon className={styles.choose} icon={faCirclePlus} />
        <input className={styles.ugly}
          type="file"
          name='file'
          multiple
          accept='image/*'
          onChange={handleChange}
        />
      </label>
      <ul className={styles.fileNames}>
        {imageNames.map((name, i) => <li key={i}>{name}</li>)}
      </ul>
      <button className={styles.send} type="submit">העלה <FontAwesomeIcon icon={faUpload} /></button>
    </form>
  )
}
