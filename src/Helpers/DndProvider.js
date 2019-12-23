// import React, { useState, useEffect, Fragment } from 'react';

// const DndProvider = props => {
//   const [showDndInfo, setShowDndInfo] = useState('');

//   const onDragEnterHandler = event => {
//     event.stopPropagation();
//     event.preventDefault();
//     // setShowDndInfo('showDndInfo');
//     ('enter');
//   };
//   const onDragLeaveHandler = event => {
//     event.stopPropagation();
//     event.preventDefault();
//     // setShowDndInfo('');
//     ('leave');
//   };

//   const onDragOverHandler = event => {
//     event.stopPropagation();
//     event.preventDefault();
//   };
//   const onFileDropHandler = async event => {
//     event.stopPropagation();
//     event.preventDefault();
//     // setShowDndInfo('');
//     const data = await event.dataTransfer.files;
//     for (let i = 0; i < data.length; i++) {
//       (data[i]);
//     }
//   };

//   return (
//     <div
//       className={`dnd-provider ${showDndInfo}`}
//       onDragEnter={event => onDragEnterHandler(event)}
//       onDragLeave={event => onDragLeaveHandler(event)}
//       onDragOver={event => onDragOverHandler(event)}
//       onDrop={event => onFileDropHandler(event)}>
//       {props.children}
//     </div>
//   );
// };

// export default DndProvider;
