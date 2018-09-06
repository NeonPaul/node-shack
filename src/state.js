import React from 'react';

export default React.createContext(() => {
  console.log('State setter was called without a provider present');
});
