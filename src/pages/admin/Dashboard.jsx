import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
// import css from "../cssModule/Dashboard.module.css";
// import { useLoginAuth } from "../context/LoginChecking";
import css from "../../cssModule/Dashboard.module.css";
import { useLoginAuth } from "../../context/LoginChecking";
import {
  RiQuillPenLine,
  RiCheckboxCircleLine,
  RiFolderLine,
  RiHeartLine,
  RiHeartFill,
  RiArrowRightLine,
  RiEditLine,
  RiLayoutMasonryLine,
  RiUserLine,
  RiSettings3Line,
  RiFireLine,
  RiCalendarLine,
  RiBarChartLine,
  RiBookOpenLine,
} from "react-icons/ri";

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
    { icon: <RiQuillPenLine />,        label: "মোট লেখা",  num: toBn(totalPosts),     pct: 100,                                                              badge: "সব",       cls: css.cardBlue  },
    { icon: <RiCheckboxCircleLine />,  label: "প্রকাশিত",  num: toBn(publishedPosts), pct: totalPosts ? (publishedPosts / totalPosts) * 100 : 0,             badge: "লাইভ",     cls: css.cardGreen },
    { icon: <RiFolderLine />,          label: "আনপাবলিশ", num: toBn(draftPosts),     pct: totalPosts ? (draftPosts / totalPosts) * 100 : 0,                 badge: "ড্রাফট",   cls: css.cardAmber },
    { icon: <RiHeartLine />,           label: "মোট লাইক", num: toBn(totalLikes),     pct: Math.min((totalLikes / Math.max(totalPosts * 2, 1)) * 100, 100),  badge: "রিঅ্যাক্ট", cls: css.cardRose  },
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
        {STATS.map((s, i) => (
          <div key={s.label} className={`${css.statCard} ${s.cls}`}
            style={{ animationDelay: `${i * 0.07}s` }}>
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
              <div className={css.sectionTitleWrap}>
                <RiCalendarLine className={css.sectionIcon} />
                <span className={css.sectionTitle}>সাম্প্রতিক লেখা</span>
              </div>
              <Link to="/managepost" className={css.sectionLink}>
                সব দেখুন <RiArrowRightLine />
              </Link>
            </div>

            <div className={css.postList}>
              {recentPosts.length === 0 ? (
                <div className={css.emptyState}>
                  <RiBookOpenLine className={css.emptyIcon} />
                  <p>এখনো কোনো লেখা নেই</p>
                  <Link to="/writepost" className={css.emptyLink}>প্রথম লেখাটি লিখুন →</Link>
                </div>
              ) : (
                recentPosts.map((post, idx) => (
                  <Link key={post._id} to={`/post/${post._id}`}
                    className={css.postItem}
                    style={{ animationDelay: `${0.15 + idx * 0.06}s` }}>

                    <span className={css.postIndex}>{toBn(idx + 1)}</span>

                    <div className={css.postInfo}>
                      <p className={css.postTitle}>{post.title}</p>
                      <div className={css.postMeta}>
                        {post.topic && (
                          <span className={css.postTopic}>
                            {TOPIC_LABEL[post.topic] || post.topic}
                          </span>
                        )}
                        <span className={css.postDate}>
                          <RiCalendarLine />
                          {toBanglaDate(post.createdAt)}
                        </span>
                      </div>
                    </div>

                    <div className={css.postRight}>
                      <span className={css.postLikes}>
                        <RiHeartLine /> {toBn(post.likes?.length || 0)}
                      </span>
                      <span className={`${css.postStatus} ${
                        post.status === "publish" ? css.statusPublish : css.statusUnpublish
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
            <div className={css.profilePicWrap}>
              {user?.profilePic ? (
                <img src={user.profilePic} alt="profile" className={css.profilePic} />
              ) : (
                <div className={css.profileAvatar}>
                  {username?.[0]?.toUpperCase() || "?"}
                </div>
              )}
              <span className={css.profileOnline} />
            </div>
            <div className={css.profileInfo}>
              <p className={css.profileName}>
                {user ? `${user.firstName} ${user.lastName}` : username}
              </p>
              <p className={css.profileUsername}>@{username}</p>
            </div>
            <RiArrowRightLine className={css.profileArrow} />
          </Link>

          {/* দ্রুত কাজ */}
          <div className={css.card}>
            <div className={css.cardTitleRow}>
              <RiLayoutMasonryLine className={css.cardTitleIcon} />
              <p className={css.cardTitle}>দ্রুত কাজ</p>
            </div>
            <div className={css.actionList}>
              {[
                { icon: <RiEditLine />,          label: "নতুন লেখা লিখুন",    to: "/writepost"          },
                { icon: <RiLayoutMasonryLine />, label: "পোস্ট ম্যানেজ করুন", to: "/managepost"         },
                { icon: <RiUserLine />,          label: "প্রোফাইল সম্পাদনা",  to: `/about/${username}`  },
                { icon: <RiSettings3Line />,     label: "সেটিংস",              to: "/setting"            },
              ].map((a, i) => (
                <Link key={a.label} to={a.to} className={css.actionBtn}
                  style={{ animationDelay: `${0.2 + i * 0.05}s` }}>
                  <span className={css.actionIcon}>{a.icon}</span>
                  <span>{a.label}</span>
                  <RiArrowRightLine className={css.actionArrow} />
                </Link>
              ))}
            </div>
          </div>

          {/* বিষয় বিশ্লেষণ */}
          {topicEntries.length > 0 && (
            <div className={css.card}>
              <div className={css.cardTitleRow}>
                <RiBarChartLine className={css.cardTitleIcon} />
                <p className={css.cardTitle}>বিষয় বিশ্লেষণ</p>
              </div>
              <div className={css.topicList}>
                {topicEntries.map(([label, count]) => (
                  <div key={label} className={css.topicRow}>
                    <div className={css.topicMeta}>
                      <span className={css.topicName}>{label}</span>
                      <span className={css.topicCount}>{toBn(count)} টি</span>
                    </div>
                    <div className={css.topicBar}>
                      <div className={css.topicFill}
                        style={{ width: `${(count / maxTopicCount) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* সেরা লেখা */}
          {topPost && (
            <div className={css.card}>
              <div className={css.cardTitleRow}>
                <RiFireLine className={css.cardTitleIcon} />
                <p className={css.cardTitle}>সবচেয়ে পছন্দের লেখা</p>
              </div>
              <Link to={`/post/${topPost._id}`} className={css.topPost}>
                {topPost.banner && (
                  <img src={topPost.banner} alt={topPost.title}
                    className={css.topPostBanner} />
                )}
                <p className={css.topPostTitle}>{topPost.title}</p>
                <div className={css.topPostMeta}>
                  <span className={css.topPostLikes}>
                    <RiHeartFill /> {toBn(topPost.likes?.length || 0)} লাইক
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