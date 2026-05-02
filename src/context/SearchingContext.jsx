import {createContext, useContext, useState} from 'react';

const SearchingContex = createContext();

export const SearchingValue = ({children}) => {
    const [searchValue, setSearhValue] = useState("");
    return (
        <SearchingContex.Provider value={{searchValue, setSearhValue}}>
            {children}
        </SearchingContex.Provider>
    )
}

export const useSearchValue = () => useContext(SearchingContex);