import React, { createContext, useState } from 'react';

export const SelectUserContext = createContext();

const SelectUserContextProvider = props => {
  const [selectedUser, setSelectedUser] = useState(null);

  return (
    <SelectUserContext.Provider value={{ selectedUser, setSelectedUser }}>{props.children}</SelectUserContext.Provider>
  );
};

export default SelectUserContextProvider;
