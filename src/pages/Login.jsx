import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from 'react-hot-toast';
import css from "../cssModule/Login.module.css";
import { useLoginAuth } from "../context/LoginChecking";

export default function Login() {

    const {setIdentifier, identifier, password, setPassword, loading, handleSubmit} = useLoginAuth();

    return (
        <div className={css.Wraper}>
            <form onSubmit={handleSubmit} className={css.formWraper}>
                <h1>অ্যাকাউন্ট লগইন করুন</h1>

                <input 
                    type="text" 
                    placeholder="ইউজারনেম অথবা ইমেইল" 
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required 
                />    

                <input 
                    type="password" 
                    placeholder="পাসওয়ার্ড" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required 
                />  

                <input 
                    type="submit" 
                    value={loading ? "লগইন হচ্ছে..." : "লগইন করুন"} 
                    disabled={loading}
                />  

                <hr />

                <div className={css.registerMessage}>
                    <p>অ্যাকাউন্ট নেই?</p>
                    <Link to="/registration">
                        <span className={css.clickLInk}>এখানে ক্লিক করে রেজিস্টার করুন</span>
                    </Link>
                </div>
            </form> 
        </div>
    );
}