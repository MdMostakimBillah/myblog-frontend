import { GridChangeFunction } from "./BlogGridContex";
import { LoginChecking } from "./LoginChecking";
import { SearchingValue } from "./SearchingContext";
import { SharedProvide } from "./SidebarContext";
import { ThemeContextChanger } from "./ThemeContex";

export default function AppProviders({ children }) {
  return (
    <GridChangeFunction>
      <LoginChecking>
        <ThemeContextChanger>
          <SearchingValue>
            <SharedProvide>
              {children}
            </SharedProvide>
          </SearchingValue>
        </ThemeContextChanger>
      </LoginChecking>
    </GridChangeFunction>
  );
}
