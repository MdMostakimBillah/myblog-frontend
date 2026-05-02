import { useState } from "react";
import css from "../cssModule/Menu.module.css";
import { Link, NavLink } from "react-router-dom";
import { useSharedState } from "../context/SidebarContext";
import {
  RiHome5Line,
  RiSettings3Line,
  RiErrorWarningLine,
  RiFolderOpenLine,
  RiTodoLine,
  RiSpeakAiLine,
  RiBook2Line
} from "react-icons/ri";
import { HiOutlineUsers } from "react-icons/hi";
import { MdOutlineMosque, MdOutlineDashboard, MdManageSearch } from "react-icons/md";
import { BsLayoutSidebarInset } from "react-icons/bs";
import { CiPen } from "react-icons/ci";
import { useLoginAuth } from "../context/LoginChecking";
// useSharedState
export default function Menu () {

  //sidebar toggle actione
  const {active, toggle} = useSharedState();

  const {isLogin} = useLoginAuth();

  // topic toggle 
  const [isOpen, setIsOpen] = useState(false);

  const username = localStorage.getItem("username");
  // const { toggle }        = useSharedState();

  const toggleSubmenue = () => {
    setIsOpen(!isOpen);
  }

    return (
      <div className={`${css.aside} ${active ? css.hideAside : ""}`}>
        <div className={css.brandingLogo}>
          <Link to="/">
            <h1>আমার কথা</h1>
          </Link>

          <BsLayoutSidebarInset
            onClick={toggle}
            className={`${css.sidebarIcon}`}
          />
        </div>
        {/* Main Menu */}
        <nav className={css.menuList}>
          <ul>
            {
              isLogin &&
              <li className={css.parent}>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) => isActive ? css.activeIt : ""}
                >
                  <MdOutlineDashboard />
                  <span>ড্যাসবোর্ড</span>
                </NavLink>
              </li>
            }
            <li className={css.parent}>
              <NavLink 
                to="/"
                className={({isActive})=> isActive ? css.activeIt : ""}
                >
                <RiHome5Line /> 
                <span> {isLogin ? "সব ব্লগ এক নজরে " : "মূল পাতা"}</span>
              </NavLink>
            </li>
            <li className={css.submenuParent}>
                <div>
                  <RiFolderOpenLine />
                  <span onClick={toggleSubmenue} > বিষয়সমূহ </span>
                </div>
                <ul className={`${css.submenu} ${isOpen ? css.openSubMenu : ""}`}>
                  <li className={ `${isOpen ? css.openSubMenuMarginTop : ""} ${css.parent}`}>
                    <NavLink 
                      to="/islamic-thought" 
                      className={({isActive})=> isActive ? css.activeIt : ""}
                    >
                      <MdOutlineMosque />
                      <span>ইসলামি চিন্তা</span>
                    </NavLink>
                  </li>
                  <li className={css.parent}>
                    <NavLink 
                      to="/quran-hadish" 
                      className={({isActive})=> isActive ? css.activeIt : ""}
                    >
                      <RiBook2Line />
                      <span>কুরআন ও হাদিস</span>
                    </NavLink>
                  </li>
                  <li className={css.parent}>
                    <NavLink 
                      to="/self"
                      className={({isActive})=> isActive ? css.activeIt : ""}
                    >
                      <HiOutlineUsers />
                      <span>আত্মশুদ্ধি</span>
                    </NavLink>
                  </li>
                  <li className={css.parent}>
                    <NavLink 
                      to="/creative"
                      className={({isActive})=> isActive ? css.activeIt : ""}
                    >
                      <RiSpeakAiLine />
                      <span>সৃজনশীল লেখা</span>
                    </NavLink>
                  </li>
                  <li className={css.parent}>
                    <NavLink 
                      to="/learn-new"
                      className={({isActive})=> isActive ? css.activeIt : ""}
                    >
                      <RiTodoLine />
                      <span>নতুন যা শিখছি</span>
                    </NavLink>
                  </li>
                </ul>
            </li>

            {
              isLogin &&
              <li className={css.parent}>
                <NavLink
                  to="/managepost"
                  className={({ isActive }) => isActive ? css.activeIt : ""}
                >
                  <MdManageSearch />
                  <span>ম্যানেজ পোস্ট</span>
                </NavLink>
              </li>
            }

            {
              isLogin &&
              <li className={css.parent}>
                <NavLink
                  to="/writepost"
                  className={({ isActive }) => isActive ? css.activeIt : ""}
                >
                  <CiPen />
                  <span>পোস্ট লেখুন</span>
                </NavLink>
              </li>
            }

            <li className={css.parent}>
              {
                isLogin &&
                <NavLink 
                  to={`/about/${username}`}
                  className={({isActive})=> isActive ? css.activeIt : ""}
                >
                  <RiErrorWarningLine />
                  <span>আমার সম্পর্কে</span>
                </NavLink>
              }
              {
                !isLogin &&
                <NavLink 
                  to="/about"
                  className={({isActive})=> isActive ? css.activeIt : ""}
                >
                  <RiErrorWarningLine />
                  <span>আমার সম্পর্কে</span>
                </NavLink>
              }
            </li>
            <li className={css.parent}>
              <NavLink 
                to="/setting"
                className={({isActive})=> isActive ? css.activeIt : ""}
                >
                <RiSettings3Line />
                <span>সেটিংস</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    );
}