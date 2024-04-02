import React, { useState } from 'react';
import { Resizable } from 'react-resizable';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { TextField } from '@mui/material';
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ExampleLayout = ({ image, Data, updateData, data2, updateData2 }) => {
  const [width, setWidth] = useState(200);
  const [height, setHeight] = useState(200);
  const [open, setOpen] = React.useState(false);
  const [box2, set2box2] = React.useState(false);
  const [modalText, setModalText] = useState('');
  const [selectedDataIndex, setSelectedDataIndex] = useState(null); // Index of data being edited

  const handleOpen = (index) => {
    setSelectedDataIndex(index); // Set the index of the data being edited
    setModalText(Data[selectedDataIndex]?.name);
    setOpen(true);

  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDataIndex(null); // Reset selected data index when modal is closed
    setModalText('');
  };

  const onEditIconClick = (index) => {
    handleOpen(index);
  };

  const onDeleteIconClick = async (index) => {
    try {
      const dataId = Data[index]._id;
      await axios.delete(`http://localhost:5000/data/${dataId}`);
      const updatedData = [...Data.slice(0, index), ...Data.slice(index + 1)];
      updateData(updatedData); // Update the data in the parent component
    } catch (error) {
      console.error('Error deleting text:', error);
    }
  };

  const onResetClick = () => {
    setWidth(200);
    setHeight(200);
  };

  const onFirstBoxResize = (event, { size }) => {
    setWidth(size.width);
    setHeight(size.height);
  };

  const handleModalTextChange = (event) => {
    setModalText(event.target.value);
  };



  const addOrUpdateText = async () => {
    try {
      let response;
      if (selectedDataIndex !== null) { // If index is not null, update existing data
        const dataId = Data[selectedDataIndex]._id;
        response = await axios.put(`http://localhost:5000/data/${dataId}`, { name: modalText });
        const updatedData = [...Data];
        updatedData[selectedDataIndex].name = modalText; // Update the name of existing data
        updateData(updatedData); // Update the data in the parent component
      } else { // If index is null, add new data
        response = await axios.post('http://localhost:5000/data', { name: modalText });
        const newData = response.data;
        updateData([newData, ...Data]); // Add the new data to the beginning of the array
      }

      if (response) {
        handleClose();
      }
    } catch (error) {
      console.error('Error adding/editing text:', error);
    }
  };

  const makeValuetruData2 = () => {
    setOpen(true);
    set2box2(true);
  }
  const handleUpdateData2 = () => {
    console.log("modalText: ", modalText);
    updateData2(modalText);
    handleClose();
  };



  return (
    <Resizable
      className="box"
      height={height}
      width={width}
      onResize={onFirstBoxResize}
      resizeHandles={['sw', 'se', 'nw', 'ne', 'w', 'e', 'n', 's']}
    >
      <div style={{ width: width + 'px', height: height + 'px' }}>
        {image && <img src={image} alt="Image" />}
        {data2 && <span className="text">{data2}</span>}
        <div className="data">
          {Data?.map((data, index) => (
            <p key={index}>
              {console.log(data)}
              {data.name}{' '}
              <EditIcon
                onClick={() => onEditIconClick(index)}
                style={{ fontSize: 'small', cursor: 'pointer' }}
              />
              <DeleteIcon
                onClick={() => onDeleteIconClick(index)}
                style={{ fontSize: 'small', cursor: 'pointer', marginLeft: '5px' }}
              />
            </p>
          ))}
        </div>
        <button onClick={onResetClick} style={{ marginTop: '10px' }}>Size Reset</button>
        <Button onClick={() => { setSelectedDataIndex(null); setOpen(true); }}>{(Data?.length > 0) ? "Add text" : "Add text"}</Button>
        {data2 && <Button variant="contained" onClick={makeValuetruData2}>
          {(data2 && data2.length > 0) ? "Add" : "Update"}
        </Button>}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <center>{selectedDataIndex !== null ? 'Edit Your Text Here!' : 'Add Your Text Here!'}</center>
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <center><TextField id="outlined-basic" label="Add Name" value={modalText} onChange={handleModalTextChange} variant="outlined" width={'100%'} /></center>
            </Typography>
            <center style={{ margin: '10px' }}>
              <Button variant="contained" onClick={box2 ? handleUpdateData2 : addOrUpdateText}>
                {selectedDataIndex !== null ? 'Update' : 'Add'}
              </Button>
            </center>
          </Box>
        </Modal>
      </div>
    </Resizable>
  );
};

export default ExampleLayout;
