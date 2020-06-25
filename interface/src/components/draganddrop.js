import React, {useMemo} from 'react';
import {useDropzone} from 'react-dropzone';

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 5,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#555',
  outline: 'none',
  transition: 'border .24s ease-in-out'
};

const activeStyle = {
  borderColor: '#2196f3'
};

const acceptStyle = {
  borderColor: '#3295a8'
};

const rejectStyle = {
  borderColor: '#ff1744'
};

 const Dropzone =({ fileUpload, data })=> {
   
  const onDrop=(acceptedFiles)=>{
    fileUpload(acceptedFiles[0],data);
}

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    open,
    isDragReject,
    acceptedFiles
  } = useDropzone({
      onDrop,
      accept: "",
      noClick: true,
      noKeyboard: true
    });

  const style = useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {borderColor: '#969899'}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {})
  }), [
    isDragActive,
    isDragReject,
    isDragAccept
  ]);

  const files = acceptedFiles.map(file => ( <li key={file.path}>{file.path} - {file.size} bytes </li> ));

  return (
    <div className="container">
      <div {...getRootProps({className: 'dropzone',style})}>
        <input {...getInputProps()} />
        <div className="browse">
          <button className="ripple" onClick={open}>BROWSE</button>
          <span>or drop files here</span>
        </div>
        <aside>
          <ul>{files}</ul>
      </aside>
      </div>
    </div>
  );
}
export default Dropzone