import React from 'react';
import { byteConverter } from '../../Helpers/byteConverter';
import { ReactComponent as FileIcon } from '../../assets/svg/file-solid.svg';
import { ReactComponent as FileArchiveIcon } from '../../assets/svg/file/file-archive.svg';
import { ReactComponent as FileAudioIcon } from '../../assets/svg/file/file-audio.svg';
import { ReactComponent as FileCodeIcon } from '../../assets/svg/file/file-code.svg';
import { ReactComponent as FileImageIcon } from '../../assets/svg/file/file-image.svg';
import { ReactComponent as FileVideoIcon } from '../../assets/svg/file/file-video.svg';
import { ReactComponent as FileAltIcon } from '../../assets/svg/file/file-alt.svg';
import { ReactComponent as FilePdfIcon } from '../../assets/svg/file/file-pdf.svg';
import { ReactComponent as BanIcon } from '../../assets/svg/ban-solid.svg';
import { ReactComponent as CheckIcon } from '../../assets/svg/check-circle-solid.svg';
import { ReactComponent as TimesIcon } from '../../assets/svg/times-solid.svg';

import {
  AudioFormats,
  ArchiveFormats,
  DataFormats,
  ImageFormats,
  VideoFormats,
  CodeFormats
} from '../../Helpers/fileFormats';
import FILE_STATUS from '../../config/CONFIG_FILE_STATUS';
const { shell } = require('electron');

const HistoryListItem = ({ fileName, createdAt, fileSize, fileDir, fileType, progress, fileStatus }) => {
  const chooseIcon = () => {
    for (let i of AudioFormats) {
      if (i === fileType) {
        return <FileAudioIcon className='h-file-icon'></FileAudioIcon>;
      }
    }
    for (let i of ArchiveFormats) {
      if (i === fileType) {
        return <FileArchiveIcon className='h-file-icon'></FileArchiveIcon>;
      }
    }
    for (let i of DataFormats) {
      if (i === fileType) {
        return <FileAltIcon className='h-file-icon'></FileAltIcon>;
      }
    }
    for (let i of ImageFormats) {
      if (i === fileType) {
        return <FileImageIcon className='h-file-icon'></FileImageIcon>;
      }
    }
    for (let i of VideoFormats) {
      if (i === fileType) {
        return <FileVideoIcon className='h-file-icon'></FileVideoIcon>;
      }
    }
    for (let i of CodeFormats) {
      if (i === fileType) {
        return <FileCodeIcon className='h-file-icon'></FileCodeIcon>;
      }
    }
    if (fileType === 'pdf') {
      return <FilePdfIcon className='h-file-icon'></FilePdfIcon>;
    }
    return <FileIcon className='h-file-icon'></FileIcon>;
  };

  const openFileDirectory = () => {
    shell.showItemInFolder(fileDir);
  };
  const fileInformation = () => {
    if (fileStatus === FILE_STATUS.waiting) {
      return (
        <div className='history-btn-group'>
          <CheckIcon className='history-check-icon' onClick={() => null}></CheckIcon>
          <BanIcon className='history-ban-icon' onClick={() => null}></BanIcon>
        </div>
      );
    }
    if (fileStatus === FILE_STATUS.rejected) {
      return <TimesIcon className='times-icon disabled'></TimesIcon>;
    }
    if (fileStatus === FILE_STATUS.loading) {
      return (
        <div className='history-btn-group'>
          <span className='history-progress'>%{progress}</span>
          <TimesIcon className='history-ban-icon ' onClick={null}></TimesIcon>
        </div>
      );
    }
  };
  console.log(progress);
  return (
    <li
      className='history-list-item'
      onClick={openFileDirectory}
      style={{
        borderBottom:
          fileStatus === FILE_STATUS.loading
            ? `8px solid linear-gradient(90deg, #6ab8959c ${progress}%, #2f3136 1%)`
            : null
      }}>
      <div className='history-content'>
        {chooseIcon()}
        <div className='history-info'>
          <div className='history-fileName'>{fileName}</div>
          <span className='history-fileSize'>{byteConverter(fileSize)}</span>
        </div>
        {fileInformation()}
      </div>
    </li>
  );
};

export default HistoryListItem;
