import {createContext, useContext, useState} from "react";

const SharedStateContext = createContext();

export const SharedProvide = ({children}) => {
    
    const [active, setActive] = useState(false);
    const toggle = () => setActive(prev => !prev);

    return (
        <SharedStateContext.Provider value={{active, toggle}}>
            {children}
        </SharedStateContext.Provider>
    )
}

export const useSharedState = () => useContext(SharedStateContext);