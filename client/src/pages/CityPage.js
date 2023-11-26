import React, {useState} from 'react'
import LineChart from '../components/LineChart'
import Map from '../components/Map'

const data = [
    {
      id: 1,
      year: 2016,
      userGain: 80000,
      userLost: 823,
    },
    {
      id: 2,
      year: 2017,
      userGain: 45677,
      userLost: 345,
    },
    {
      id: 3,
      year: 2018,
      userGain: 78888,
      userLost: 555,
    },
    {
      id: 4,
      year: 2019,
      userGain: 90000,
      userLost: 4555,
    },
    {
      id: 5,
      year: 2020,
      userGain: 4300,
      userLost: 234,
    },
  ];

export function CityPage(UserData) {
    const [userData, setUserData] = useState({
        labels: data.map((d)=> d.year),
        datasets: [{
            label: "Users Gained",
            data: data.map((d)=> d.userGain)
        }]
    })

  return (
    <>
      <h2 style={{ textAlign: 'center' }}>San Francisco, California</h2>
      <div className="container" style={{ display:'flex', justifyContent:'space-between' }}>
        <div style={{ width: '600px', marginBottom: '20px' }}>
          <LineChart chartData={userData} />
        </div>
        <div style={{ width: '600px', paddingTop:'9px', marginLeft:'20px'}}>
          <Map latitude='40.6943' longitude='-74.699' />
        </div>
      </div>
    </>
  );

}
// return (
//   <>
//     <h2 className="text-center">San Francisco, California</h2>
//     <div className="container flex justify-between flex-wrap sm:flex-no-wrap">
//       <div className="w-full sm:w-3/4 lg:w-2/3 mb-4 sm:mb-0">
//         <LineChart chartData={userData} />
//       </div>
//       <div className="w-full sm:w-1/2 lg:w-1/3 sm:pl-4">
//         <Map latitude='40.6943' longitude='-74.699' />
//       </div>
//     </div>
//   </>
// );
// }

export default CityPage