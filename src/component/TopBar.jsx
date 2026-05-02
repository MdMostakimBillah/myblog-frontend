// import css from "../cssModule/Topbar.module.css";
// import { FiSearch } from "react-icons/fi";
// import { BsGrid1X2, BsLayoutSidebarInset } from "react-icons/bs";
// import { useSharedState } from "../context/SidebarContext";
// import { useSearchValue } from "../context/SearchingContext";
// import { useGridChange } from "../context/BlogGridContex";

// export default function TopBar () {

//     const {toggle} = useSharedState();

//     //search value context
//     const {setSearhValue} = useSearchValue();

//     //form submit reload control
//     const fontHandler = (e) => {
//         e.preventDefault();
//     }

//     //grid change 
//     const { GridHandler } = useGridChange();

//     return (
//         <div className={css.Wraper}>
//              <div className={css.container}>
//             <div>
//                 <BsLayoutSidebarInset 
//                     onClick={toggle} 
//                     className={`${css.icon} ${css.sidebar}`} 
//                 />
//             </div>
//             {/* search  */}
//             <form onSubmit={fontHandler} action="">
//                 <input 
//                     onChange={(e)=> setSearhValue(e.target.value)} 
//                     type="text" 
//                     placeholder="কাঙ্ক্ষিত ব্লগ খুঁজুন..." 
//                     required
//                 />
//                 <FiSearch />
//             </form>
//             {/* Grid layout  */}
//             <div>
//                 <BsGrid1X2 
//                     onClick={GridHandler} 
//                     className={css.icon} 
//                 />
//             </div>
//        </div>
//         </div>
//     )
// }

import css from "../cssModule/Topbar.module.css";
import { FiSearch } from "react-icons/fi";
import { BsLayoutSidebarInset, BsGrid1X2, BsList } from "react-icons/bs";
import { useSharedState } from "../context/SidebarContext";
import { useSearchValue } from "../context/SearchingContext";
import { useGridChange } from "../context/BlogGridContex";
import { useLoginAuth } from "../context/LoginChecking";
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function TopBar() {
  const { toggle }        = useSharedState();
  const { setSearhValue } = useSearchValue();
  const { GridHandler, grid } = useGridChange();
  const { isLogin }       = useLoginAuth();

  const [dropOpen,    setDropOpen]    = useState(false);
  const [profilePic,  setProfilePic]  = useState("");
  const dropRef  = useRef(null);

  const username = localStorage.getItem("username");

  // ── ডাটাবেজ থেকে profile pic আনা ──
  useEffect(() => {
    if (!isLogin || !username) return;

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/user-profile/${username}`)
      .then(r => r.json())
      .then(data => {
        if (data.success && data.user?.profilePic) {
          setProfilePic(data.user.profilePic);
        }
      })
      .catch(() => {});
  }, [isLogin, username]);

  // বাইরে click → dropdown বন্ধ
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target))
        setDropOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className={css.Wraper}>
      <div className={css.container}>

        {/* Sidebar toggle */}
        <BsLayoutSidebarInset
          onClick={toggle}
          className={`${css.icon} ${css.sidebar}`}
        />

        {/* Search */}
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            onChange={(e) => setSearhValue(e.target.value)}
            type="text"
            placeholder="কাঙ্ক্ষিত ব্লগ খুঁজুন..."
          />
          <FiSearch />
        </form>

        {/* Profile button + dropdown */}
        <div className={css.profileWrap} ref={dropRef}>
          <button
            className={css.profileBtn}
            onClick={() => setDropOpen(p => !p)}
            title="প্রোফাইল"
          >
            {profilePic ? (
              <img src={profilePic} alt="profile" className={css.profilePic} />
            ) : (
              <span className={css.profileAvatar}>
                {isLogin && username ? username[0].toUpperCase() : "👤"}
              </span>
            )}
          </button>

          {dropOpen && (
            <div className={css.dropdown}>
              {isLogin ? (
                <Link
                  to={`/about/${username}`}
                  className={css.dropItem}
                  onClick={() => setDropOpen(false)}
                >
                  👤 আমার প্রোফাইল
                </Link>
              ) : (
                <Link
                  to="/login"
                  className={css.dropItem}
                  onClick={() => setDropOpen(false)}
                >
                  🔑 লগইন করুন
                </Link>
              )}

              <div className={css.dropDivider} />

              <button
                className={css.dropItem}
                onClick={() => { GridHandler(); setDropOpen(false); }}
              >
                {grid
                  ? <><BsList size={16} /> লিস্ট ভিউ</>
                  : <><BsGrid1X2 size={16} /> গ্রিড ভিউ</>
                }
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}