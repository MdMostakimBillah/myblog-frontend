import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast";

const LogingAuthenticationProvider = createContext();

export const LoginChecking = ({ children }) => {

    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // লগইন স্ট্যাটাস এবং ইউজার ডাটা লোকাল স্টোরেজ থেকে লোড করা
    const [isLogin, setIsLogin] = useState(() => {
        return JSON.parse(localStorage.getItem("isLogin")) || false;
    });

    const [user, setUser] = useState(() => {
        return JSON.parse(localStorage.getItem("user")) || null;
    });


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ identifier, password })
            });
            const data = await response.json();
            // console.log(data.user.id)

            if (response.ok) {
                // ================= এখানে ডাটা সেভ করবেন =================
                // ইউজারের ইউজারনেম এবং আইডি লোকাল স্টোরেজে রাখছি যাতে মেনু বার এটি পেতে পারে
                localStorage.setItem("username", data.user.username);
                localStorage.setItem("userId", data.user.id);
                localStorage.setItem("isLogin", "true");
                // =======================================================

                toast.success("লগইন সফল!");
                setIsLogin(true);

                // সরাসরি ইউজারনেম দিয়ে ডাইনামিক ইউআরএল-এ নিয়ে যাওয়া
                navigate(`/about/${data.user.username}`);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("সার্ভারে সমস্যা!");
        } finally {
            setLoading(false);
        }
    };
    const logOutFunction = () => {
        setIsLogin(false);
        setUser(null);
        localStorage.removeItem("isLogin");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        navigate("/", { replace: true });
    };

    // useEffect এর মাধ্যমে ডাটা সিঙ্ক করা (অপশনাল কিন্তু ভালো প্র্যাকটিস)
    useEffect(() => {
        localStorage.setItem("isLogin", JSON.stringify(isLogin));
        if (user) {
            localStorage.setItem("user", JSON.stringify(user));
        }
    }, [isLogin, user]);

    return (
        <LogingAuthenticationProvider.Provider value={{
            identifier, setIdentifier, 
            password, setPassword, 
            isLogin, user, // user ডাটা এখন এখান থেকে পাওয়া যাবে
            loading, setLoading, 
            setIsLogin, handleSubmit, 
            logOutFunction
        }}>
            {children}
        </LogingAuthenticationProvider.Provider>
    )
}

export const useLoginAuth = () => useContext(LogingAuthenticationProvider);