import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import css from "../../cssModule/Dashboard.module.css";
import { useLoginAuth } from "../../context/LoginChecking";

// ── helpers ──────────────────────────────────────
const toBn = (n) =>
  (n ?? 0).toString().replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c]);

const TOPIC_LABEL = {
  islamic:       "ইসলামি চিন্তা",
  "quran-hadith":"কুরআন ও হাদিস",
  self:          "আত্মশুদ্ধি",
  creative:      "সৃজনশীল লেখা",
  learning:      "নতুন যা শিখছি",
};

const toBanglaDate = (iso) => {
  if (!iso) return "";
  const months = [
    "জানু","ফেব্রু","মার্চ","এপ্রিল",
    "মে","জুন","জুলাই","আগস্ট",
    "সেপ্ট","অক্টো","নভে","ডিসে",
  ];
  const d = new Date(iso);
  return `${toBn(d.getDate())} ${months[d.getMonth()]}`;
};

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "শুভ সকাল";
  if (h < 17) return "শুভ দুপুর";
  if (h < 20) return "শুভ বিকাল";
  return "শুভ রাত্রি";
};

// ════════════════════════════════════════════════
export default function Dashboard() {
  const { isLogin } = useLoginAuth();

  const username = localStorage.getItem("username");
  const userId   = localStorage.getItem("userId");

  const [user,    setUser]    = useState(null);
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch user + posts ──
  useEffect(() => {
    if (!username) { setLoading(false); return; }
    setLoading(true);

    Promise.all([
      fetch(`${import.meta.env.VITE_API_URL}/api/auth/user-profile/${username}`)
        .then(r => r.json()),
      fetch(`${import.meta.env.VITE_API_URL}/api/my-posts/${username}`)
        .then(r => r.json()),
    ])
      .then(([profileData, postsData]) => {
        if (profileData.success) setUser(profileData.user);
        if (postsData.success)   setPosts(postsData.posts || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [username]);

  if (loading) return (
    <div className={css.loading}>
      <ScaleLoader color="var(--primary-color)" />
    </div>
  );

  // ── Derived stats ──
  const totalPosts     = posts.length;
  const publishedPosts = posts.filter(p => p.status === "publish").length;
  const draftPosts     = posts.filter(p => p.status !== "publish").length;
  const totalLikes     = posts.reduce((sum, p) => sum + (p.likes?.length || 0), 0);

  // topic breakdown
  const topicMap = posts.reduce((acc, p) => {
    const label = TOPIC_LABEL[p.topic] || p.topic;
    if (label) acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const topicEntries = Object.entries(topicMap).sort((a, b) => b[1] - a[1]);
  const maxTopicCount = topicEntries[0]?.[1] || 1;

  // most liked post
  const topPost = [...posts].sort(
    (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
  )[0];

  // recent 5 posts
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  const STATS = [
    { icon: "📝", label: "মোট লেখা",      num: toBn(totalPosts),     pct: 100,                              badge: "সব" },
    { icon: "✅", label: "প্রকাশিত",       num: toBn(publishedPosts), pct: totalPosts ? (publishedPosts / totalPosts) * 100 : 0, badge: "লাইভ" },
    { icon: "📁", label: "আনপাবলিশ",      num: toBn(draftPosts),     pct: totalPosts ? (draftPosts / totalPosts) * 100 : 0,     badge: "ড্রাফট" },
    { icon: "❤️", label: "মোট লাইক",      num: toBn(totalLikes),     pct: Math.min((totalLikes / 10) * 100, 100),               badge: "রিঅ্যাক্ট" },
  ];

  return (
    <div className={css.page}>

      {/* ── Header ── */}
      <div className={css.header}>
        <h1 className={css.greeting}>
          {getGreeting()}, {user?.firstName || username} 👋
        </h1>
        <p className={css.subGreeting}>
          আপনার ব্লগের সার্বিক অবস্থা এক নজরে দেখুন
        </p>
      </div>

      {/* ── Stats ── */}
      <div className={css.statsGrid}>
        {STATS.map(s => (
          <div key={s.label} className={css.statCard}>
            <div className={css.statTop}>
              <div className={css.statIcon}>{s.icon}</div>
              <span className={css.statBadge}>{s.badge}</span>
            </div>
            <div className={css.statNum}>{s.num}</div>
            <div className={css.statLabel}>{s.label}</div>
            <div className={css.statBar}>
              <div className={css.statBarFill} style={{ width: `${s.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Body ── */}
      <div className={css.body}>

        {/* ── Left ── */}
        <div className={css.left}>

          {/* সাম্প্রতিক লেখা */}
          <div className={css.section}>
            <div className={css.sectionHead}>
              <span className={css.sectionTitle}>সাম্প্রতিক লেখা</span>
              <Link to="/managepost" className={css.sectionLink}>সব দেখুন →</Link>
            </div>

            <div className={css.postList}>
              {recentPosts.length === 0 ? (
                <div className={css.emptyState}>এখনো কোনো লেখা নেই</div>
              ) : (
                recentPosts.map(post => (
                  <Link
                    key={post._id}
                    to={`/post/${post._id}`}
                    className={css.postItem}
                  >
                    <div className={css.postInfo}>
                      <p className={css.postTitle}>{post.title}</p>
                      <div className={css.postMeta}>
                        {post.topic && (
                          <span className={css.postTopic}>
                            {TOPIC_LABEL[post.topic] || post.topic}
                          </span>
                        )}
                        <span className={css.postDate}>
                          {toBanglaDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className={css.postRight}>
                      <span className={css.postLikes}>
                        ❤️ {toBn(post.likes?.length || 0)}
                      </span>
                      <span className={`${css.postStatus} ${
                        post.status === "publish"
                          ? css.statusPublish
                          : css.statusUnpublish
                      }`}>
                        {post.status === "publish" ? "লাইভ" : "ড্রাফট"}
                      </span>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

        </div>

        {/* ── Right ── */}
        <div className={css.right}>

          {/* Profile card */}
          <Link to={`/about/${username}`} className={css.profileCard}>
            {user?.profilePic ? (
              <img src={user.profilePic} alt="profile" className={css.profilePic} />
            ) : (
              <div className={css.profileAvatar}>
                {username?.[0]?.toUpperCase() || "?"}
              </div>
            )}
            <div>
              <p className={css.profileName}>
                {user ? `${user.firstName} ${user.lastName}` : username}
              </p>
              <p className={css.profileUsername}>@{username}</p>
            </div>
            <span className={css.profileArrow}>→</span>
          </Link>

          {/* দ্রুত কাজ */}
          <div className={css.card}>
            <p className={css.cardTitle}>দ্রুত কাজ</p>
            <div className={css.actionList}>
              {[
                { icon: "✍️", label: "নতুন লেখা লিখুন", to: "/writepost"          },
                { icon: "📋", label: "পোস্ট ম্যানেজ করুন", to: "/managepost"       },
                { icon: "👤", label: "প্রোফাইল সম্পাদনা", to: `/about/${username}` },
                { icon: "⚙️", label: "সেটিংস",            to: "/setting"          },
              ].map(a => (
                <Link key={a.label} to={a.to} className={css.actionBtn}>
                  <span className={css.actionIcon}>{a.icon}</span>
                  {a.label}
                  <span className={css.actionArrow}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* বিষয় বিশ্লেষণ */}
          {topicEntries.length > 0 && (
            <div className={css.card}>
              <p className={css.cardTitle}>বিষয় বিশ্লেষণ</p>
              <div className={css.topicList}>
                {topicEntries.map(([label, count]) => (
                  <div key={label} className={css.topicRow}>
                    <div className={css.topicMeta}>
                      <span className={css.topicName}>{label}</span>
                      <span className={css.topicCount}>{toBn(count)} টি</span>
                    </div>
                    <div className={css.topicBar}>
                      <div
                        className={css.topicFill}
                        style={{ width: `${(count / maxTopicCount) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* সেরা লেখা */}
          {topPost && (
            <div className={css.card}>
              <p className={css.cardTitle}>সবচেয়ে পছন্দের লেখা</p>
              <Link to={`/post/${topPost._id}`} className={css.topPost}>
                <p className={css.topPostTitle}>{topPost.title}</p>
                <div className={css.topPostMeta}>
                  <span className={css.topPostLikes}>
                    ❤️ {toBn(topPost.likes?.length || 0)} লাইক
                  </span>
                  {topPost.topic && (
                    <span className={css.postTopic}>
                      {TOPIC_LABEL[topPost.topic] || topPost.topic}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}