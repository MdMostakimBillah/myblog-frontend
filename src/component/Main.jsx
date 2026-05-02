import {Routes, Route} from "react-router-dom"
import css from "../cssModule/Main.module.css";
import About from "../pages/AboutAuth";
import Home from "../pages/Home";
import NotFound from "../pages/NotFound";
import Setting from "../pages/Setting";
import IslamicThought from "../pages/topic/IslamicThought"
import QuranHadish from "../pages/topic/QuranHadish"
import NewLearn from "../pages/topic/NewLearn";
import Creative from "../pages/topic/Creative";
import Self from "../pages/topic/Self";
import TopBar from "./TopBar";
import Login from "../pages/Login"
import { useSharedState } from "../context/SidebarContext";
import Dashborad from "../pages/admin/Dashboard";
import { useLoginAuth } from "../context/LoginChecking";
import Managepost from "../pages/admin/Managepost";
import WritePost from "../pages/admin/WritePost";
import SingleBlogPreviw from "../pages/SingleBlogPreviw";
import EditPost from "../pages/admin/EditPost";
import Registration from "../pages/Registration";
import AboutMe from "../pages/About";
import UserPosts from "../pages/UserPosts";

// import About from "../pages/About";
export default function Main () {
    
    const {active} = useSharedState();
    
    // is user login 
    const {isLogin} = useLoginAuth()

    return (
        <>
            <div className={`${css.Wraper} ${active ? css.fullWidth : " "}`}>
                <TopBar />
                <Routes>
                    <Route 
                        path="/" 
                        element = {<Home />} 
                    />
                    <Route 
                        path="/islamic-thought"
                        element = {<IslamicThought />}
                    />
                    <Route 
                        path="/quran-hadish"
                        element = {<QuranHadish />}
                    />
                    <Route 
                        path="/learn-new"
                        element = {<NewLearn />}
                    />
                    <Route 
                        path="/creative"
                        element = {<Creative />}
                    />
                    <Route 
                        path="/self"
                        element = {<Self />}
                    />
                    {
                        !isLogin &&
                        <Route 
                            path="/about" 
                            element = {<About />} 
                        />
                    }
                    
                    {
                        isLogin && 
                        <Route
                            path="/about/:username"
                            element = {<AboutMe/>}
                        />
                    }
                    <Route 
                        path="/setting" 
                        element = {<Setting />} 
                    />
                    <Route 
                        path="*" 
                        element = {<NotFound />} 
                    />
                    {
                        !isLogin && 
                        <Route 
                            path="/admin-login" 
                            element = {<Login />} 
                        />
                    }
                    
                    {
                        !isLogin &&
                        <Route 
                            path="/registration" 
                            element = {<Registration />} 
                        />
                    }
                    <Route path="/blog/:id" element = {<SingleBlogPreviw/>} />
                    {
                        isLogin && 
                        <Route
                            path="/dashboard"
                            element={<Dashborad />}
                        />
                    }
                    {
                        isLogin && 
                        <Route
                            path="/edit-post/:id"
                            element={<EditPost />}
                        />
                    }
                    {
                        isLogin && 
                        <Route
                            path="/managepost"
                            element={<Managepost />}
                        />
                    }

                    {
                        isLogin &&
                        <Route
                            path="/writepost"
                            element={<WritePost />}
                        />
                    }
                    {
                        isLogin && <Route path="/posts/:username" element={<UserPosts />} />
                    }
                </Routes>
            </div>
        </>
        
    )
}