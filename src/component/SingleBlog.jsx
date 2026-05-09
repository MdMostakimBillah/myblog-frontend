// import css from "../cssModule/SingleBlog.module.css"
// import banner from "../assets/DayNight.jpg";
// // import blogData from "../DataBase/Database.json";
// import Masonry from "react-layout-masonry";
// import { useSharedState } from "../context/SidebarContext";
// import { useSearchValue } from "../context/SearchingContext";
// import { useLoginAuth } from "../context/LoginChecking";
// import { useGridChange } from "../context/BlogGridContex";
// import { FiEdit, FiTrash2 } from "react-icons/fi";
// import { useEffect, useState, useRef, useCallback } from "react";
// // import TiptapViewer from "./TipTapViewer";
// // import { extractPostParts } from "./TitleImageHeade";
// import {ScaleLoader} from "react-spinners";
// import { useNavigate } from "react-router-dom";
// import { formatDateToBanglaFull } from "./DateCustomize";

// export default function SingleBlog({ topic }) {
//   const navigate = useNavigate();

//   const { active } = useSharedState();
//   const { isLogin } = useLoginAuth();

//   // search context
//   const { searchValue } = useSearchValue();

//   //grid change
//   const { grid } = useGridChange();

//   // data store here from db
//   const [posts, setPosts] = useState([]);
//   const [page, setPage] = useState(1);
//   const [hasMore, setHasMore] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const observer = useRef();

//   const lastPostElementRef = useCallback(
//     (node) => {
//       if (loading) return;
//       if (observer.current) observer.current.disconnect();

//       observer.current = new IntersectionObserver((entries) => {
//         if (entries[0].isIntersecting && hasMore) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       });

//       if (node) observer.current.observe(node);
//     },
//     [loading, hasMore],
//   );

//   // data fetching from api
//   useEffect(() => {
//     setLoading(true);
//     fetch(`${import.meta.env.VITE_API_URL}/api/posts?page=${page}&limit=9`)
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error("Post loading Problem!");
//         }
//         return res.json();
//       })
//       .then((data) => {
//         if (data.success) {
//           setPosts((prev) =>
//             page === 1 ? data.posts : [...prev, ...data.posts],
//           );
//           setHasMore(data.hasMore || data.currentPage < data.totalPages);
//         } else {
//           setError(data.message);
//         }
//         setLoading(false);
//       })
//       .catch((err) => {
//         setError(err.message);
//         setLoading(false);
//       });
//   }, [page]);

//   const filteredBlog = posts.filter((post) => {
//     //filter by topic
//     const matchTopic = topic ? post.topic === topic : true;

//     // const extraced = extractPostParts(post.content);

//     // filter by search
//     const itemsFilter = `
//       ${post.title || ""}
//       ${post.date || ""}
//       ${post.topic || ""}
//       ${post.firstParagraph || ""}
//     `.toLowerCase();

//     const matchSearch = searchValue
//       ? itemsFilter.includes(searchValue.trim().toLowerCase())
//       : true;

//     return matchTopic && matchSearch;
//   });

//   if (loading) {
//     return (
//       <div className={css.loading}>
//         <ScaleLoader color="var(--primary-color)" />
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className={css.loading}>
//         <p>সমস্যা: {error}</p>
//       </div>
//     );
//   }
//   // return <div className={css.error}></div>;

//   if (filteredBlog.length === 0) {
//     return (
//       <div className={css.loading}>
//         <p>কোনো পোস্ট পাওয়া যায়নি!</p>
//       </div>
//     );
//   }

//   // console.log(filteredBlog)

//   const BlogItems = filteredBlog.map((post) => {
//     // console.log(post.content);
//     // const {
//     //   title,
//     //   featuredImage,
//     //   firstParagraphNode,
//     //   firstParagraphText,
//     // } = extractPostParts(post.content);
    
//     const isPublish = post.status = "publish";
//     return (
//       <>
//         {" "}
//         {post.status === "publish" ? (
//           <div
//             key={post.id || post._id}
//             className={css.singleBlog}
//             onClick={() => navigate(`/blog/${post._id}`)}
//             style={{ cursor: "pointer" }}
//           >
//             <div className={css.bannerBlog}>
//               {post?.banner ? (
//                 <img
//                   src={post.banner}
//                   alt={post.banner || post.topic || "ব্লগ ছবি"}
//                 />
//               ) : (
//                 <img src={banner} alt="default banner" />
//               )}
//             </div>
//             <div className={css.discriptionBox}>
//               <div className={css.DateAndTopic}>
//                 <span>
//                   {post.topic == "islamic"
//                     ? "ইসলামি চিন্তা"
//                     : post.topic == "quran-hadith"
//                       ? "কুরআন ও হাদিস"
//                       : post.topic == "self"
//                         ? "আত্মশুদ্ধি"
//                         : post.topic == "creative"
//                           ? "সৃজনশীল লেখা"
//                           : post.topic == "learning"
//                             ? "নতুন যা শিখছি"
//                             : "কোন টপিক নেই!"}
//                 </span>
//                 <span>{formatDateToBanglaFull(post.date)}</span>
//               </div>
//               <div className={css.descriptionBlog}>
//                 <h1 className={css.title}>{post.title || "শিরোনাম নেই"}</h1>
//                 <p>{post.firstParagraph || "বিস্তারিত পড়তে ক্লিক করুন..."}</p>
//               </div>
//             </div>
//           </div>
//         ) : (
//           ""
//         )}
//       </>
//     );
//   });

//   return (
//     <>
//       {grid ? (
//         <div className={css.normalGrid}>{BlogItems}</div>
//       ) : (
//         <Masonry
//           className={css.MasonryStyle}
//           columns={{ 640: 1, 768: 2, 1200: active ? 4 : 3 }}
//           gap={10}
//         >
//           {BlogItems}
//         </Masonry>
//       )}
//     </>
//   );
// }


import css from "../cssModule/SingleBlog.module.css"
import banner from "../assets/DayNight.jpg";
import Masonry from "react-layout-masonry";
import { useSharedState } from "../context/SidebarContext";
import { useSearchValue } from "../context/SearchingContext";
import { useLoginAuth } from "../context/LoginChecking";
import { useGridChange } from "../context/BlogGridContex";
import { useEffect, useState, useRef, useCallback } from "react";
import { ScaleLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
import { formatDateToBanglaFull } from "./DateCustomize";

export default function SingleBlog({ topic }) {
  const navigate = useNavigate();

  const { active } = useSharedState();
  const { isLogin } = useLoginAuth();

  // search context
  const { searchValue } = useSearchValue();

  // grid change
  const { grid } = useGridChange();

  // data store
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  // data fetching
  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.VITE_API_URL}/api/posts?page=${page}&limit=9`)
      .then((res) => {
        if (!res.ok) throw new Error("Post loading Problem!");
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setPosts((prev) =>
            page === 1 ? data.posts : [...prev, ...data.posts],
          );
          setHasMore(data.hasMore || data.currentPage < data.totalPages);
        } else {
          setError(data.message);
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [page]);

  // ফিল্টার লজিক: এখানে status === "publish" যোগ করা হয়েছে যাতে Masonry তে গ্যাপ না থাকে
  const filteredBlog = posts.filter((post) => {
    // ১. শুধুমাত্র পাবলিশড পোস্টগুলো নেয়া হচ্ছে
    const isPublished = post.status === "publish";

    // ২. টপিক ফিল্টার
    const matchTopic = topic ? post.topic === topic : true;

    // ৩. সার্চ ফিল্টার
    const itemsFilter = `
      ${post.title || ""}
      ${post.date || ""}
      ${post.topic || ""}
      ${post.firstParagraph || ""}
    `.toLowerCase();

    const matchSearch = searchValue
      ? itemsFilter.includes(searchValue.trim().toLowerCase())
      : true;

    return isPublished && matchTopic && matchSearch;
  });

  if (loading && page === 1) {
    return (
      <div className={css.loading}>
        <ScaleLoader color="var(--primary-color)" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={css.loading}>
        <p>সমস্যা: {error}</p>
      </div>
    );
  }

  if (filteredBlog.length === 0) {
    return (
      <div className={css.loading}>
        <p>কোনো পোস্ট পাওয়া যায়নি!</p>
      </div>
    );
  }

  // BlogItems: এখন আর ভেতরে কন্ডিশন দরকার নেই, কারণ উপরের filter সব ঠিক করে দিয়েছে
  const BlogItems = filteredBlog.map((post, index) => {
    const isLastElement = filteredBlog.length === index + 1;

    return (
      <div
        key={post._id || index}
        ref={isLastElement ? lastPostElementRef : null} // Infinite scroll ref এখানে দেয়া হলো
        className={css.singleBlog}
        onClick={() => navigate(`/blog/${post._id}`)}
        style={{ cursor: "pointer" }}
      >
        <div className={css.bannerBlog}>
          <img
            src={post.banner || banner}
            alt={post.topic || "ব্লগ ছবি"}
          />
        </div>
        <div className={css.discriptionBox}>
          <div className={css.DateAndTopic}>
            <span>
              {post.topic === "islamic"
                ? "ইসলামি চিন্তা"
                : post.topic === "quran-hadith"
                  ? "কুরআন ও হাদিস"
                  : post.topic === "self"
                    ? "আত্মশুদ্ধি"
                    : post.topic === "creative"
                      ? "সৃজনশীল লেখা"
                      : post.topic === "learning"
                        ? "নতুন যা শিখছি"
                        : "কোন টপিক নেই!"}
            </span>
            <span>{formatDateToBanglaFull(post.date)}</span>
          </div>
          <div className={css.descriptionBlog}>
            <h1 className={css.title}>{post.title || "শিরোনাম নেই"}</h1>
            <p>{post.firstParagraph || "বিস্তারিত পড়তে ক্লিক করুন..."}</p>
          </div>
        </div>
      </div>
    );
  });

  return (
    <>
      {grid ? (
        <div className={css.normalGrid}>{BlogItems}</div>
      ) : (
        <Masonry
          className={css.MasonryStyle}
          columns={{ 640: 1, 768: 2, 1200: active ? 4 : 3 }}
          gap={10}
        >
          {BlogItems}
        </Masonry>
      )}
      {/* স্ক্রল করার সময় নিচে লোডার দেখালে ভালো হয় */}
      {loading && page > 1 && (
         <div style={{ textAlign: 'center', padding: '20px' }}>
            <ScaleLoader color="var(--primary-color)" height={20} />
         </div>
      )}
    </>
  );
}