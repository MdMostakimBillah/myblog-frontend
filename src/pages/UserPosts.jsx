import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import { useLoginAuth } from "../context/LoginChecking";
import toast from "react-hot-toast";

const TOPIC_LABEL = {
  islamic: "ইসলামি চিন্তা",
  "quran-hadith": "কুরআন ও হাদিস",
  self: "আত্মশুদ্ধি",
  creative: "সৃজনশীল লেখা",
  learning: "নতুন যা শিখছি",
};

const toBn = (n) => (n ?? 0).toString().replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c]);

const toBanglaDate = (iso) => {
  if (!iso) return "";
  const months = [
    "জানুয়ারি",
    "ফেব্রুয়ারি",
    "মার্চ",
    "এপ্রিল",
    "মে",
    "জুন",
    "জুলাই",
    "আগস্ট",
    "সেপ্টেম্বর",
    "অক্টোবর",
    "নভেম্বর",
    "ডিসেম্বর",
  ];
  const d = new Date(iso);
  return `${toBn(d.getDate())} ${months[d.getMonth()]}, ${d
    .getFullYear()
    .toString()
    .replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c])}`;
};

export default function UserPosts() {
  const { username } = useParams();
  const { isLogin } = useLoginAuth();

  const [posts, setPosts] = useState([]);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(true);

  const loggedInUserId = localStorage.getItem("userId");

  useEffect(() => {
    if (!username) return;
    setLoading(true);

    // লেখকের তথ্য ও পোস্ট একসাথে আনা
    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/auth/user-profile/${username}`).then(
        (r) => r.json(),
      ),
      fetch(`${import.meta.env.VITE_API_URL}/api/my-posts/${username}`).then((r) =>
        r.json(),
      ),
    ])
      .then(([profileData, postsData]) => {
        if (profileData.success) setAuthor(profileData.user);
        if (postsData.success) setPosts(postsData.posts || []);
      })
      .catch(() => toast.error("তথ্য আনতে সমস্যা হয়েছে"))
      .finally(() => setLoading(false));
  }, [username]);

  // ── Like toggle ──
  const handleLike = async (postId) => {
    if (!isLogin) {
      toast.error("লাইক করতে লগইন করুন");
      return;
    }

    // Optimistic UI update
    setPosts((prev) =>
      prev.map((p) => {
        if (p._id !== postId) return p;
        const alreadyLiked = p.likes?.includes(loggedInUserId);
        return {
          ...p,
          likes: alreadyLiked
            ? p.likes.filter((id) => id !== loggedInUserId)
            : [...(p.likes || []), loggedInUserId],
        };
      }),
    );

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${postId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: loggedInUserId }),
      });
    } catch {
      toast.error("লাইক করতে সমস্যা হয়েছে");
      // rollback
      setPosts((prev) =>
        prev.map((p) => {
          if (p._id !== postId) return p;
          const wasLiked = p.likes?.includes(loggedInUserId);
          return {
            ...p,
            likes: wasLiked
              ? p.likes.filter((id) => id !== loggedInUserId)
              : [...(p.likes || []), loggedInUserId],
          };
        }),
      );
    }
  };

  if (loading)
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <ScaleLoader color="var(--primary-color)" />
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--body-bg-color)",
        fontFamily: "var(--regular-font), serif",
        color: "var(--primary-color)",
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "48px 40px 32px",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        {/* লেখকের ছোট তথ্য */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "14px",
            marginBottom: "20px",
          }}
        >
          {author?.profilePic && (
            <img
              src={author.profilePic}
              alt={author.firstName}
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                objectFit: "cover",
                border: "1px solid var(--border-color)",
              }}
            />
          )}
          <div>
            <p
              style={{
                fontFamily: "var(--Purno-Bold),serif",
                fontSize: "20px",
                marginBottom: "2px",
              }}
            >
              {author ? `${author.firstName} ${author.lastName}` : username}
            </p>
            <p
              style={{
                fontSize: "14px",
                color: "var(--gray-color)",
                opacity: 0.6,
              }}
            >
              @{username}
            </p>
          </div>
          <Link
            to={`/about/${username}`}
            style={{
              marginLeft: "auto",
              padding: "8px 16px",
              border: "1px solid var(--border-color)",
              borderRadius: "8px",
              fontSize: "13px",
              fontFamily: "var(--Purno-Semibold),serif",
              color: "var(--primary-color)",
              textDecoration: "none",
              background: "var(--body-bg-color)",
              transition: "all .18s",
            }}
          >
            প্রোফাইল দেখুন
          </Link>
        </div>

        <h1
          style={{
            fontFamily: "var(--Purno-Bold),serif",
            fontSize: "clamp(22px,3.5vw,32px)",
            letterSpacing: "-0.5px",
            marginBottom: "6px",
          }}
        >
          সকল লেখা
        </h1>
        <p
          style={{ color: "var(--gray-color)", opacity: 0.6, fontSize: "15px" }}
        >
          মোট {toBn(posts.length)} টি লেখা পাওয়া গেছে
        </p>
      </div>

      {/* ── Posts list ── */}
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "32px 40px 80px",
        }}
      >
        {posts.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              color: "var(--gray-color)",
              opacity: 0.4,
              fontSize: "16px",
            }}
          >
            এখনো কোনো লেখা প্রকাশিত হয়নি
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              border: "1px solid var(--border-color)",
              borderRadius: "14px",
              overflow: "hidden",
            }}
          >
            {posts.map((post, idx) => {
              const liked = post.likes?.includes(loggedInUserId);
              return (
                <div
                  key={post._id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: post.banner ? "1fr 110px" : "1fr",
                    gap: "16px",
                    padding: "20px 24px",
                    background: "var(--white-color)",
                    borderBottom:
                      idx < posts.length - 1
                        ? "1px solid var(--border-color)"
                        : "none",
                    transition: "background .15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--hover-submenu-color)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "var(--white-color)")
                  }
                >
                  {/* বাম — তথ্য */}
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    {/* Topic badge */}
                    {post.topic && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignSelf: "flex-start",
                          padding: "3px 10px",
                          background: "var(--hover-color)",
                          border: "1px solid var(--border-color)",
                          borderRadius: "100px",
                          fontSize: "11px",
                          color: "var(--gray-color)",
                          fontFamily: "var(--Purno-Semibold),serif",
                        }}
                      >
                        {TOPIC_LABEL[post.topic] || post.topic}
                      </span>
                    )}

                    {/* Title */}
                    <Link
                      to={`/post/${post._id}`}
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      <h2
                        style={{
                          fontFamily: "var(--Purno-Bold),serif",
                          fontSize: "clamp(15px,2vw,18px)",
                          lineHeight: "1.4",
                          color: "var(--primary-color)",
                          margin: 0,
                        }}
                      >
                        {post.title}
                      </h2>
                    </Link>

                    {/* First paragraph preview */}
                    {post.firstParagraph && (
                      <p
                        style={{
                          fontSize: "14px",
                          lineHeight: "1.7",
                          color: "var(--primary-color)",
                          opacity: 0.6,
                          margin: 0,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {post.firstParagraph}
                      </p>
                    )}

                    {/* Meta row — date + likes */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "16px",
                        marginTop: "4px",
                      }}
                    >
                      {/* তারিখ */}
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--gray-color)",
                          opacity: 0.5,
                        }}
                      >
                        📅 {toBanglaDate(post.createdAt)}
                      </span>

                      {/* লেখক */}
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--gray-color)",
                          opacity: 0.5,
                        }}
                      >
                        ✍️ {post.authorName || username}
                      </span>

                      {/* Like button */}
                      <button
                        onClick={() => handleLike(post._id)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "4px 12px",
                          border: `1px solid ${liked ? "#e05050" : "var(--border-color)"}`,
                          borderRadius: "100px",
                          background: liked ? "#fee2e2" : "transparent",
                          color: liked ? "#e05050" : "var(--gray-color)",
                          fontSize: "12px",
                          fontFamily: "var(--Purno-Semibold),serif",
                          cursor: isLogin ? "pointer" : "default",
                          transition: "all .18s",
                        }}
                      >
                        {liked ? "❤️" : "🤍"} {toBn(post.likes?.length || 0)}
                      </button>

                      {/* পড়ুন link */}
                      <Link
                        to={`/blog/${post._id}`}
                        style={{
                          marginLeft: "auto",
                          fontSize: "13px",
                          color: "var(--gray-color)",
                          opacity: 0.5,
                          textDecoration: "none",
                          fontFamily: "var(--Purno-Semibold),serif",
                        }}
                      >
                        পড়ুন →
                      </Link>
                    </div>
                  </div>

                  {/* ডান — banner ছবি */}
                  {post.banner && (
                    <Link to={`/blog/${post._id}`}>
                      <img
                        src={post.banner}
                        alt={post.title}
                        style={{
                          width: "100%",
                          height: "80px",
                          objectFit: "cover",
                          borderRadius: "8px",
                          border: "1px solid var(--border-color)",
                        }}
                      />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
