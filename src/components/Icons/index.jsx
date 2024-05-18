import React from 'react';
import Austria from './icons/Austria.png';
import Belgium from './icons/Belgium.png';
import Croatia from './icons/Croatia.png';
import Czech_Republic from './icons/Czech_Republic.png';
// import Denmark from "./icons/Denmark.png";
import Denmark from './icons/Skanska.png';
import England from './icons/England.png';
import North_Macedonia from './icons/North_Macedonia.png';
import Finland from './icons/Finland.png';
import France from './icons/France.png';
import Germany from './icons/Germany.png';
import Hungary from './icons/Hungary.png';
import Italy from './icons/Italy.png';
import Netherlands from './icons/Netherlands.png';
import Poland from './icons/Poland.png';
import Portugal from './icons/Portugal.png';
// import Russia from "./icons/Russia.png";
import Russia from './icons/Pride.png';
import Scotland from './icons/Scotland.png';
import Slovakia from './icons/Slovakia.png';
import Spain from './icons/Spain.png';
import Sweden from './icons/Sweden.png';
import Switzerland from './icons/Switzerland.png';
import Turkey from './icons/Turkey.png';
import Ukraine from './icons/Ukraine.png';
import Wales from './icons/Wales.png';
import Georgia from './icons/Georgia.png';
import Serbia from './icons/Serbia.png';
import Romania from './icons/Romania.png'
import Albania from './icons/Albania.png'
import Slovenia from './icons/Slovenia.png'

const countryFlags = {
  Austria,
  Belgium,
  Croatia,
  Czech_Republic,
  Denmark,
  England,
  North_Macedonia,
  Finland,
  France,
  Germany,
  Hungary,
  Italy,
  Netherlands,
  Poland,
  Portugal,
  Russia,
  Scotland,
  Slovakia,
  Spain,
  Sweden,
  Switzerland,
  Turkey,
  Ukraine,
  Wales,
  Georgia,
  Serbia,
  Romania,
  Albania,
  Slovenia
};
const FlagIcon = ({ country, small }) => {
  const Country = countryFlags[country];
  const showBorder = ['Russia', 'Poland', 'Czech_Republic'].includes(country);
  let height = small ? '10px' : '25px'
  // if(country === 'Georgia'){
  //   height = small ? '17px' : '40px'
  // }
  return (
    <img
      src={Country}
      alt={`${country}`}
      style={{
        height,
        paddingTop: '2px',
        maxWidth: '40px',
        // ...(showBorder ? { border: "1px solid #80808036" } : {}),
      }}
    />
  );
};
export default FlagIcon;
