// import {createContext, useContext, useEffect, useState} from "react";

// const GridChangeContext = createContext();

// export const GridChangeFunction = ({children}) => {

//     const [isGrid, setIsGrid] = useState(false);
//     const GridHandler = () => setIsGrid(p => !p);

//     const [grid, setGrid] = useState(()=>{
//         return JSON.parse(localStorage.getItem('Layout')) || false;
//     });

//     const GridHandler = () => setGrid (prev => !prev);

//     useEffect(()=> {
//         localStorage.setItem('Layout', grid);
//     },[grid])

//     return (
//         <GridChangeContext.Provider value={{grid, GridHandler, isGrid}}>
//             {children}
//         </GridChangeContext.Provider>
//     )
// }

// export const useGridChange = () => useContext(GridChangeContext);


import { createContext, useContext, useEffect, useState } from "react";

const GridChangeContext = createContext();

export const GridChangeFunction = ({ children }) => {

  const [grid, setGrid] = useState(() => {
    return JSON.parse(localStorage.getItem("Layout")) || false;
  });

  const GridHandler = () => setGrid(prev => !prev);

  useEffect(() => {
    localStorage.setItem("Layout", JSON.stringify(grid));
  }, [grid]);

  return (
    <GridChangeContext.Provider value={{ grid, GridHandler }}>
      {children}
    </GridChangeContext.Provider>
  );
};

export const useGridChange = () => useContext(GridChangeContext);