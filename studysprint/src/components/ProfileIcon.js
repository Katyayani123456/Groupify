import React from 'react';

const ProfileIcon = ({ userName }) => {
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  const style = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#C739F3',
    color: '#0D0D0D',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    border: '2px solid #E0E0E0',
  };

  return <div style={style}>{initial}</div>;
};

export default ProfileIcon;