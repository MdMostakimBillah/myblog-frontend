import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SharedStateContext = createContext();

export const SharedProvide = ({ children }) => {
  
  // ✅ screen ছোট হলে default hide
  const [active, setActive] = useState(() => window.innerWidth <= 850);

  const location = useLocation();

  // ✅ route change হলে auto hide (mobile এ)
  useEffect(() => {
    if (window.innerWidth <= 850) {
      setActive(true);
    }
  }, [location]);

  // ✅ screen resize এ auto hide/show
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 850) {
        setActive(true);
      } else {
        setActive(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggle = () => setActive(p => !p);

  return (
    <SharedStateContext.Provider value={{ active, toggle }}>
      {children}
    </SharedStateContext.Provider>
  );
};

export const useSharedState = () => useContext(SharedStateContext);