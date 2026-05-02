import {createContext, useContext, useEffect, useState} from 'react';

const ThemeContext = createContext();

export const ThemeContextChanger = ({children}) => {

    const [theme, setTheme] = useState( () => {
        return localStorage.getItem("theme") || "light";
    });

    useEffect(()=>{
        
        document.body.classList.remove('light', 'dark');
        document.body.classList.add(theme);

        localStorage.setItem('theme', theme)
    }, [theme]);

    return(
        <ThemeContext.Provider value={{theme, setTheme}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useThemeContext = () => useContext(ThemeContext);