import './App.css';
import 'react-resizable/css/styles.css'; // Import resizable styles
import Layout from './Layout';
import img from './painting-mountain-lake-with-mountain-background_188544-9126.avif'
import axios from 'axios';
import { useEffect, useState } from 'react';




function App() {
  const image = img;

  const [data, setData] = useState([]);
  const [data2, setData2] = useState("");
  const [addCount, setAddCount] = useState(0);
  const [updateCount, setUpdateCount] = useState(0);

  const fetchCounts = () => {
    axios.get('http://localhost:5000/counts')
      .then(response => {
        setAddCount(response.data.addCount);
        setUpdateCount(response.data.updateCount);
      })
      .catch(error => {
        console.error('Error fetching counts:', error);
      });
  };
  useEffect(() => {
    fetchData2();
  }, []);

  useEffect(() => {
    fetchCounts();
  }, []);

  const fetchData2 = () => {
    axios.get('http://localhost:5000/data2')
      .then(response => {
        console.log("userdata2", response.data.data2);
        setData2(response.data.data2);
      })
      .catch(error => {
        console.error('Error fetching data2:', error);
      });
  };
  const updateData2 = (newData2) => {
    console.log("newData2: ", newData2);
    axios.put('http://localhost:5000/data2', { data2: newData2 })
      .then(() => {
        setData2(newData2);
        console.log("data2 : ", data2);

      })
      .catch(error => {
        console.error('Error updating data2:', error);
      });
    fetchCounts()
  };

  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array means this effect will run only once when the component mounts

  const fetchData = () => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  };

  // Function to update data
  const updateData = (newData) => {
    setData([...data, newData]);
    fetchData(); // Fetch data again after an update
    fetchCounts()
  };






  return (
    <>
      {/* <ExampleLayout /> */}
      <div className='flex_position'>
        <div className='counts'>
          <h2>Add Count: {addCount}</h2>
          <h2>Update Count: {updateCount}</h2>
        </div>
        <div className='top_components'>
          <Layout Data={data} updateData={updateData} />
          <Layout image={image} />
        </div>
        <div className="d-fle">
          <Layout data2={data2} updateData2={updateData2} />
        </div>
      </div>
    </>
  );
}

export default App;
