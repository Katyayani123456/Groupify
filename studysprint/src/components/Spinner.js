import React from 'react';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = () => {
  return (
    <div className="loading-screen">
      <ClipLoader color={"#C739F3"} size={50} />
    </div>
  );
};

export default Spinner;