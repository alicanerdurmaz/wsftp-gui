import React from 'react';
import { ReactComponent as FileIcon } from '../assets/svg/file-solid.svg';
import { ReactComponent as FileArchiveIcon } from '../assets/svg/file/file-archive.svg';
import { ReactComponent as FileAudioIcon } from '../assets/svg/file/file-audio.svg';
import { ReactComponent as FileCodeIcon } from '../assets/svg/file/file-code.svg';
import { ReactComponent as FileImageIcon } from '../assets/svg/file/file-image.svg';
import { ReactComponent as FileVideoIcon } from '../assets/svg/file/file-video.svg';
import { ReactComponent as FileAltIcon } from '../assets/svg/file/file-alt.svg';
import { ReactComponent as FilePdfIcon } from '../assets/svg/file/file-pdf.svg';
import { AudioFormats, ArchiveFormats, DataFormats, ImageFormats, VideoFormats, CodeFormats } from './fileFormats';

const ChooseIcon = (fileType, customClassName = 'h-file-icon') => {
	for (let i of AudioFormats) {
		if (i === fileType) {
			return <FileAudioIcon className={customClassName}></FileAudioIcon>;
		}
	}
	for (let i of ArchiveFormats) {
		if (i === fileType) {
			return <FileArchiveIcon className={customClassName}></FileArchiveIcon>;
		}
	}
	for (let i of DataFormats) {
		if (i === fileType) {
			return <FileAltIcon className={customClassName}></FileAltIcon>;
		}
	}
	for (let i of ImageFormats) {
		if (i === fileType) {
			return <FileImageIcon className={customClassName}></FileImageIcon>;
		}
	}
	for (let i of VideoFormats) {
		if (i === fileType) {
			return <FileVideoIcon className={customClassName}></FileVideoIcon>;
		}
	}
	for (let i of CodeFormats) {
		if (i === fileType) {
			return <FileCodeIcon className={customClassName}></FileCodeIcon>;
		}
	}
	if (fileType === 'pdf') {
		return <FilePdfIcon className={customClassName}></FilePdfIcon>;
	}
	return <FileIcon className={customClassName}></FileIcon>;
};

export default ChooseIcon;
