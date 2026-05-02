import { Link } from "react-router-dom";
import { useThemeContext } from "../context/ThemeContex";
import css from "../cssModule/Setting.module.css";
import { useLoginAuth } from "../context/LoginChecking";

export default function Setting () {
    // theme 
    const {theme, setTheme} = useThemeContext();

    // login auth
    const {isLogin, logOutFunction} = useLoginAuth();
    
    return (
        <div className={css.wraper}>
            <h1>সেটিং পেইজ </h1>
            
            <div className={css.basicSettings}>
                <div className={css.theme}>
                    <span> থিম পরিবর্তন করুন </span>
                    <select 
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                    >
                        <option value="light">লাইট থিম</option>
                        <option value="dark">ডার্ক থিম</option>
                    </select>
                </div>
            </div>

            <div className={css.basicSettings}>
                <div className={css.theme}>
                    <span> পেজে প্রবেশ করুন </span>
                    <Link to="/admin-login">
                        {  
                           isLogin
                            ? <button onClick={logOutFunction}> লগ আউট করুন </button> 
                            : <button> লগইন করুন </button> 
                        }
                    </Link>
                </div>
            </div>
        </div>
    )
}