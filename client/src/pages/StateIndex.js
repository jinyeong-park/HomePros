import React, { useEffect, useState, useRef } from 'react';
import { Container, Box, Typography } from '@mui/material';
import LocationCard from '../components/LocationCard';
import DropDownSelector from '../components/DropDownSelector';
import { NavLink } from 'react-router-dom';

const config = require('../config.json');

export default function StateIndex() {
  const [stateData, setStateData] = useState([]);
  const [selectedValue, setSelectedValue] = useState('');
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);
  const containerRef = useRef(null);

  const handleSelect = (value) => {
    setSelectedValue(value);
    // Reset page size and number when a new option is selected
    setStateData([])
    setHasMorePages(true);
    setPageSize(10);
    setPageNumber(1);
    fetchData(value, 10, 1);
  };

  const fetchData = (option, size, number) => {
    setLoading(true);
    // Update the API endpoint based on the selected option, page size, and page number
    let endpoint;
    switch (option) {
      case 'Alphabetical':
        endpoint = `http://${config.server_host}:${config.server_port}/namerank_states?page_size=${size}&page=${number}`;
        break;
      case 'Score':
        endpoint = `http://${config.server_host}:${config.server_port}/top_states?page_size=${size}&page=${number}`;
        break;
      case 'Tax Burden':
        endpoint = `http://${config.server_host}:${config.server_port}/taxrank_states?page_size=${size}&page=${number}`;
        break;
      case 'Crime':
        endpoint = `http://${config.server_host}:${config.server_port}/safest_states?page_size=${size}&page=${number}`;
        break;
      default:
        endpoint = '';
    }

    if (endpoint) {
      fetch(endpoint)
        .then((res) => res.json())
        .then((resJson) => {

        if (resJson.length > 0){
            setStateData((prevData) => [...prevData, ...resJson]);
            setLoading(false);
        }
        else {
            setHasMorePages(false);
            setLoading(false);
        }
        })
        .catch((error) => {
          console.error('Error fetching data:', error);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      const handleScroll = () => {
        const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
        if (scrollHeight - scrollTop === clientHeight && !loading && hasMorePages) {
          // Load more data when the user scrolls to the bottom
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      };

      containerRef.current.addEventListener('scroll', handleScroll);

      return () => {
        containerRef.current.removeEventListener('scroll', handleScroll);
      };
    }
  }, [loading]);

  useEffect(() => {
    // Fetch data when the page number changes
    fetchData(selectedValue, pageSize, pageNumber);
  }, [pageNumber]);

  const dropDownOptions = ['Alphabetical', 'Score', 'Tax Burden', 'Crime'];

  return (
    <Container maxWidth="xl" disableGutters>
      <Typography variant="h2">States</Typography>
      <DropDownSelector options={dropDownOptions} onSelect={handleSelect} defaultValue={dropDownOptions[0]} />
      <div ref={containerRef} style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-around', maxHeight: '1200px', overflowY: 'auto' }}>
      {stateData.map((state, index) => (
        <LocationCard key={index} title={state.state} content={`None`}/>
      ))}
      {loading && <p>Loading...</p>}
      </div>
    </Container>
  );
}




// import React, { useEffect, useState, useRef } from 'react';
// import { Container, Box, Typography } from '@mui/material';
// import LocationCard from '../components/LocationCard';
// import DropDownSelector from '../components/DropDownSelector';
// import { NavLink } from 'react-router-dom';

// const config = require('../config.json');

// export default function StateIndex() {
//     const [stateData, setStateData] = useState([]);
//     const [selectedValue, setSelectedValue] = useState('');
//     const[pageSize, setPageSize] = useState(10);
//     const [pageNumber, setPageNumber] = useState(1);
//     const [loading, setLoading] = useState(false);
//     const containerRef = useRef(null);

//     const handleSelect = (value) => {
//         setSelectedValue(value);
//         // Reset page size and number when a new option is selected
//         setStateData([]);
//         setPageSize(5);
//         setPageNumber(1);
//         fetchData(value, 5, 1);
//       };
    
//     const fetchData = async (option, size, number) => {
//     setLoading(true);
//     // Update the API endpoint based on the selected option, page size, and page number
//     let endpoint;
//     switch (option) {
//         case 'Alphabetical':
//         endpoint = `http://${config.server_host}:${config.server_port}/namerank_states?page_size=${size}&page=${number}`;
//         break;
//         case 'Score':
//         endpoint = `http://${config.server_host}:${config.server_port}/top_states?page_size=${size}&page=${number}`;
//         break;
//         case 'Tax Burden':
//         endpoint = `http://${config.server_host}:${config.server_port}/taxrank_states?page_size=${size}&page=${number}`;
//         break;
//         case 'Crime':
//         endpoint = `http://${config.server_host}:${config.server_port}/safest_states?page_size=${size}&page=${number}`;
//         break;
//         default:
//         endpoint = '';
//     }

//     if (endpoint) {
//         try {
//           const res = await fetch(endpoint);
//           const resJson = await res.json();
//           setStateData((prevData) => [...prevData, ...resJson]);
//         } catch (error) {
//           console.error('Error fetching data:', error);
//         } finally {
//           setLoading(false);
//         }
//       }
//     };
    
//     const chunkArray = (arr, chunkSize) => {
//         const result = [];
//         for (let i = 0; i < arr.length; i += chunkSize) {
//         result.push(arr.slice(i, i + chunkSize));
//         }
//         return result;
//     };

//     useEffect(() => {
//         if (containerRef.current) {
//             const handleScroll = () => {
//                 const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
//                 if (scrollHeight - scrollTop <= clientHeight + 10 && !loading) {
//                   // Load more data when the user is close to the bottom, with a little buffer (10 pixels)
//                   setPageNumber((prevPageNumber) => prevPageNumber + 1);
//                 }
//               };
              
    
//           containerRef.current.addEventListener('scroll', handleScroll);
    
//           return () => {
//             containerRef.current.removeEventListener('scroll', handleScroll);
//           };
//         }
//       }, [loading]);
    
//       useEffect(() => {
//         // Fetch data when the page number changes
//         fetchData(selectedValue, pageSize, pageNumber);
//       }, [pageNumber]);

//       useEffect(()=> {
//         const chunks = chunkArray(stateData, 5);
//         setChunkedStateData(chunks);
//       }, [stateData]);
    

//     const [chunkedStateData, setChunkedStateData] = useState(chunkArray(stateData, 5));

//     const dropDownOptions = ['Alphabetical', 'Score', 'Tax Burden', 'Crime']

//     return (
//         <Container>
//         <Typography variant="h2">States</Typography>
//         <DropDownSelector options={dropDownOptions} onSelect={handleSelect} defaultValue={dropDownOptions[0]}/>
//         {chunkedStateData.map((row, rowIndex) => (
//             <Box key={rowIndex} display="flex" justifyContent="space-between" mb={2}>
//             {row.map((state, cardIndex) => (
//                 <LocationCard key={`${rowIndex}-${cardIndex}`} title={state.state} content={`None`} />
//             ))}
//             </Box>
//         ))}
//         {loading && <p>Loading...</p>}
//         </Container>
//     );
// }


