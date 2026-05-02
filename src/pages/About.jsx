import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import css from "../cssModule/About.module.css";
import profileImg from "../assets/IMG20241105084042~2.jpg";
import { useLoginAuth } from "../context/LoginChecking";
import { Link } from "react-router-dom";
import {
  FaEdit,
  FaCamera,
  FaGraduationCap,
  FaRegCalendar,
  FaIdCard,
  FaLinkedin,
  FaYoutube,
  FaFacebookSquare,
} from "react-icons/fa";
import toast from "react-hot-toast";
import { MdLocationOn } from "react-icons/md";
import { IoMail } from "react-icons/io5";
import { BsTwitterX } from "react-icons/bs";

// ── Static defaults ────────────────────────────
const PROFILE = {
  name: "মোঃ মোস্তাকিম বিল্লাহ",
  bio1: "আমি খুবই সাধারণ ও অতিনগণ্য একজন। ছোট-খাটো কিছু লেখার পাশাপাশি নতুন কিছু শেখার প্রতি আগ্রহ তাই এই প্রজেক্টে কাজ করছি।",
  location: "রংপুর, বাংলাদেশ",
  email: "mostakimbillahn210@gmail.com",
  education: "স্নাতকোত্তর",
  joined: "জানুয়ারি ২০২৬",
};

const QUAL_MAP = {
  ssc: "এসএসসি / সমমান",
  hsc: "এইচএসসি / সমমান",
  diploma: "ডিপ্লোমা",
  bsc: "স্নাতক",
  msc: "স্নাতকোত্তর",
  phd: "পিএইচডি",
};

const TOPIC_LABEL = {
  islamic: "ইসলামি চিন্তা",
  "quran-hadith": "কুরআন ও হাদিস",
  self: "আত্মশুদ্ধি",
  creative: "সৃজনশীল লেখা",
  learning: "নতুন যা শিখছি",
};

const TOPICS_DEFAULT = [
  "ইসলামি চিন্তা",
  "কুরআন ও হাদিস",
  "আত্মশুদ্ধি",
  "সৃজনশীল লেখা",
  "নতুন যা শিখছি",
  "দর্শন",
  "সমাজ",
  "ইতিহাস",
];

const SKILLS_DEFAULT = [
  { name: "প্রবন্ধ রচনা", pct: 95 },
  { name: "ইসলামিক গবেষণা", pct: 88 },
  { name: "সৃজনশীল লেখা", pct: 82 },
  { name: "কুরআন অধ্যয়ন", pct: 90 },
  { name: "অনুবাদ", pct: 74 },
];

const DEFAULT_TIMELINE = [
  {
    year: "২০২৬",
    title: "ব্লগ সূচনা",
    place: "স্বাধীন লেখক",
    desc: "ব্যক্তিগত ব্লগ চালু করে নিয়মিত লেখালেখি শুরু",
  },
  {
    year: "২০২৪",
    title: "সিনিয়র কন্টেন্ট রাইটার",
    place: "ইসলামিক ফাউন্ডেশন বাংলাদেশ",
    desc: "ইসলামি জ্ঞান ও গবেষণামূলক প্রবন্ধ রচনা",
  },
  {
    year: "২০২০",
    title: "স্নাতকোত্তর সম্পন্ন",
    place: "ঢাকা বিশ্ববিদ্যালয়",
    desc: "ইসলামিক স্টাডিজ বিভাগ থেকে এমএ ডিগ্রি",
  },
  {
    year: "২০১৮",
    title: "লেখালেখির শুরু",
    place: "অনলাইন পত্রিকা",
    desc: "বিভিন্ন অনলাইন প্ল্যাটফর্মে নিবন্ধ প্রকাশ",
  },
];

// ✅ SOCIAL_CONFIG সঠিকভাবে define করা হয়েছে
const SOCIAL_CONFIG = [
  { key: "twitter", icon: <BsTwitterX />, label: "Twitter / X" },
  { key: "linkedin", icon: <FaLinkedin />, label: "LinkedIn" },
  { key: "youtube", icon: <FaYoutube />, label: "YouTube" },
  { key: "facebook", icon: <FaFacebookSquare />, label: "Facebook" },
];

const toBanglaDate = (iso) => {
  if (!iso) return "অজানা";
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
  return `${months[d.getMonth()]} ${d
    .getFullYear()
    .toString()
    .replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c])}`;
};

const toBn = (n) => (n ?? 0).toString().replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c]);

// ════════════════════════════════════════════════
// Reusable Modal
// ════════════════════════════════════════════════
function Modal({ title, onClose, onSave, saving, children }) {
  return (
    <div className={css.modalOverlay} onClick={onClose}>
      <div className={css.modalBox} onClick={(e) => e.stopPropagation()}>
        <div className={css.modalHead}>
          <h3 className={css.modalTitle}>{title}</h3>
          <button className={css.modalCloseBtn} onClick={onClose}>
            ✕
          </button>
        </div>
        <div className={css.modalBody}>{children}</div>
        <div className={css.modalActions}>
          <button className={css.cancelBtn} onClick={onClose}>
            বাতিল
          </button>
          <button className={css.saveBtn} onClick={onSave} disabled={saving}>
            {saving ? "সেভ হচ্ছে..." : "সেভ করুন"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════
// Main About Component
// ════════════════════════════════════════════════
export default function About() {
  const { username } = useParams();
  const { isLogin } = useLoginAuth();

  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [timeline, setTimeline] = useState(DEFAULT_TIMELINE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ── Modal states ──
  const [editAbout, setEditAbout] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [editTimeline, setEditTimeline] = useState(false);
  const [editInfo, setEditInfo] = useState(false); // ✅ location + social

  // ── Draft states ──
  const [draftAbout, setDraftAbout] = useState("");
  const [draftProfile, setDraftProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    qualification: "",
  });
  const [draftTl, setDraftTl] = useState([]);
  const [draftInfo, setDraftInfo] = useState({
    location: "",
    socialLinks: { twitter: "", linkedin: "", youtube: "", facebook: "" },
  });

  const [editBio, setEditBio] = useState(false);
  const [draftBio, setDraftBio] = useState("");

  const handleBioSave = async () => {
    const ok = await saveField({ bio: draftBio });
    if (ok) setEditBio(false);
  };

  // ── Profile pic ──
  const picRef = useRef(null);
  const [picUploading, setPicUploading] = useState(false);
  const CLOUD = "dezasicak",
    PRESET = "BlogImage";

  const isOwnProfile =
    isLogin && user?.username === localStorage.getItem("username");

  // ── Fetch ──
  useEffect(() => {
    if (!username) {
      setLoading(false);
      return;
    }
    setLoading(true);

    fetch(`${import.meta.env.VITE_API_URL}/api/auth/user-profile/${username}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setUser(data.user);
          setTimeline(
            data.user.timeline?.length ? data.user.timeline : DEFAULT_TIMELINE,
          );
          return fetch(`${import.meta.env.VITE_API_URL}/api/my-posts/${username}`);
        }
        throw new Error("প্রোফাইল পাওয়া যায়নি");
      })
      .then((r) => r.json())
      .then((pd) => {
        if (pd.success) setUserPosts(pd.posts || []);
      })
      .catch((err) => toast.error(err.message || "সার্ভারে সমস্যা"))
      .finally(() => setLoading(false));
  }, [username]);

  // ── Generic save ──
  const saveField = async (payload) => {
    setSaving(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/update-profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, ...payload }),
      });
      const data = await res.json();
      if (data.success) {
        setUser((prev) => ({ ...prev, ...payload }));
        toast.success("আপডেট সফল হয়েছে!");
        return true;
      }
      toast.error(data.message || "আপডেট করতে সমস্যা হয়েছে");
      return false;
    } catch {
      toast.error("সার্ভারে সমস্যা হয়েছে");
      return false;
    } finally {
      setSaving(false);
    }
  };

  // ── Save handlers ──
  const handleAboutSave = async () => {
    const ok = await saveField({ about: draftAbout });
    if (ok) setEditAbout(false);
  };

  const handleProfileSave = async () => {
    const ok = await saveField({
      firstName: draftProfile.firstName,
      lastName: draftProfile.lastName,
      email: draftProfile.email,
      qualification: draftProfile.qualification,
      location: draftInfo.location,
    });
    if (ok) setEditProfile(false);
  };

  const handleTimelineSave = async () => {
    const ok = await saveField({ timeline: draftTl });
    if (ok) {
      setTimeline(draftTl);
      setEditTimeline(false);
    }
  };

  // ✅ Info (location + social) save
  const handleInfoSave = async () => {
    const ok = await saveField({
      socialLinks: draftInfo.socialLinks,
    });
    if (ok) setEditInfo(false);
  };

  // ✅ Info modal খোলার helper
  const openInfoModal = () => {
    setDraftInfo({
      // location: user?.location || "",
      socialLinks: {
        twitter: user?.socialLinks?.twitter || "",
        linkedin: user?.socialLinks?.linkedin || "",
        youtube: user?.socialLinks?.youtube || "",
        facebook: user?.socialLinks?.facebook || "",
      },
    });
    setEditInfo(true);
  };

  const updateTlItem = (i, field, val) =>
    setDraftTl((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, [field]: val } : t)),
    );

  // ── Profile pic upload ──
  const handlePicChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPicUploading(true);
    setUser((prev) => ({ ...prev, profilePic: URL.createObjectURL(file) }));
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("upload_preset", PRESET);
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD}/image/upload`,
        { method: "POST", body: fd },
      );
      const data = await res.json();
      if (data.secure_url) await saveField({ profilePic: data.secure_url });
    } catch {
      toast.error("ছবি আপলোড করতে সমস্যা হয়েছে");
    }
    setPicUploading(false);
  };

  // ── Loading ──
  if (loading)
    return (
      <div className={css.loading}>
        <ScaleLoader color="var(--primary-color)" />
      </div>
    );

  // ── Derived values ──
  const topicCounts = userPosts.reduce((acc, p) => {
    const label = TOPIC_LABEL[p.topic] || p.topic;
    if (label) acc[label] = (acc[label] || 0) + 1;
    return acc;
  }, {});
  const activeTopicsWithCount = Object.entries(topicCounts);
  const uniqueTopicCount = activeTopicsWithCount.length;

  const DYNAMIC_STATS = [
    { num: `${toBn(userPosts.length)} টি`, label: "প্রকাশিত লেখা" },
    { num: `${toBn(uniqueTopicCount)} টি`, label: "বিষয়ে লিখি" },
    { num: "৩ +", label: "বছরের অভিজ্ঞতা" },
    // { num: "১ টি", label: "মাসিক পাঠক" },
  ];

  // ── Personal info rows ──
  const INFO_ROWS = [
    {
      icon: <MdLocationOn />,
      label: "অবস্থান",
      val: isLogin ? user?.location || PROFILE.location : PROFILE.location,
    },
    {
      icon: <IoMail />,
      label: "ইমেইল",
      val: isLogin ? user.email : PROFILE.email,
    },

    {
      icon: <FaGraduationCap />,
      label: "শিক্ষা",
      val: isLogin
        ? QUAL_MAP[user.qualification] ||
          user.qualification ||
          PROFILE.education
        : PROFILE.education,
    },
    {
      icon: <FaRegCalendar />,
      label: "যোগ দিয়েছেন",
      val: isLogin ? toBanglaDate(user.createdAt) : PROFILE.joined,
    },

    {
      icon: <FaIdCard />,
      label: "ইউজারনেম",
      val: isLogin ? `@${user.username}` : "—",
    },
  ];

  return (
    <div className={css.page}>
      {/* ════ Hero ════ */}
      <div className={css.hero}>
        <div className={css.heroBg} />
        <div className={css.heroInner}>
          <div className={css.heroText}>
            <p className={css.eyebrow}>
              <span className={css.eyebrowLine} />
              আমার পরিচয়
            </p>

            {/* নাম + edit */}
            <div className={css.nameRow}>
              <h1 className={css.heroName}>
                {isLogin ? `${user.firstName} ${user.lastName}` : PROFILE.name}
              </h1>
              {isOwnProfile && (
                <button
                  className={css.iconBtn}
                  title="নাম ও তথ্য পরিবর্তন করুন"
                  onClick={() => {
                    setDraftProfile({
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      email: user.email || "",
                      qualification: user.qualification || "",
                      
                    });
                    setEditProfile(true);
                  }}
                >
                  <FaEdit />
                </button>
              )}
            </div>

            <p className={css.heroRole}>
              অনন্য নাম
              <span className={css.roleDot} />
              {isLogin ? `@${user.username}` : "দ্বীনের খাদেম"}
            </p>

            {/* ✅ Bio + edit button */}

            <div style={{ position: "relative", width: "100%" }}>
              <p className={css.heroBio}>{user?.bio || PROFILE.bio1}</p>
              {isOwnProfile && (
                <button
                  className={css.iconBtn}
                  style={{ position: "absolute", top: 0, right: 0 }}
                  title="সংক্ষিপ্ত পরিচয় পরিবর্তন করুন"
                  onClick={() => {
                    setDraftBio(user?.bio || "");
                    setEditBio(true);
                  }}
                >
                  <FaEdit />
                </button>
              )}
            </div>

            <div className={css.heroActions}>
              <a href="/contact" className={css.btnPrimary}>
                যোগাযোগ করুন
              </a>
              <Link to={`/posts/${username}`} className={css.btnOutline}>
                লেখাগুলো পড়ুন →
              </Link>
            </div>
          </div>

          {/* ── Profile pic ── */}
          <div className={css.picWrap}>
            <div className={css.picFrame}>
              {picUploading && (
                <div className={css.picLoader}>
                  <ScaleLoader color="#fff" height={14} />
                </div>
              )}
              <img
                className={css.picImg}
                src={isLogin ? user.profilePic : profileImg}
                alt="profile"
              />
              <span className={css.picBadge}>✦ লেখক</span>

              {isOwnProfile && (
                <>
                  <button
                    className={css.picEditBtn}
                    onClick={() => picRef.current.click()}
                    title="ছবি পরিবর্তন করুন"
                  >
                    <FaCamera size={12} />
                  </button>
                  <input
                    type="file"
                    accept="image/*"
                    ref={picRef}
                    hidden
                    onChange={handlePicChange}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ════ Stats ════ */}
      <div className={css.statsRow}>
        {DYNAMIC_STATS.map((s) => (
          <div key={s.label} className={css.statItem}>
            <div className={css.statNum}>{s.num}</div>
            <div className={css.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* ════ Body ════ */}
      <div className={css.body}>
        {/* ── Left ── */}
        <div className={css.left}>
          {/* আমার সম্পর্কে */}
          <div className={css.section}>
            <div className={css.sectionHead}>
              <span className={css.sectionTitle}>আমার সম্পর্কে</span>
              <div className={css.sectionLine} />
              {isOwnProfile && (
                <button
                  className={css.editIconBtn}
                  title="সম্পাদনা করুন"
                  onClick={() => {
                    setDraftAbout(user?.about || PROFILE.bio1);
                    setEditAbout(true);
                  }}
                >
                  <FaEdit size={13} />
                </button>
              )}
            </div>
            <p className={css.bodyText}>{user?.about || PROFILE.bio1}</p>
          </div>

          {/* যাত্রার ইতিহাস */}
          <div className={css.section}>
            <div className={css.sectionHead}>
              <span className={css.sectionTitle}>যাত্রার ইতিহাস</span>
              <div className={css.sectionLine} />
              {isOwnProfile && (
                <button
                  className={css.editIconBtn}
                  title="সম্পাদনা করুন"
                  onClick={() => {
                    setDraftTl(JSON.parse(JSON.stringify(timeline)));
                    setEditTimeline(true);
                  }}
                >
                  <FaEdit size={13} />
                </button>
              )}
            </div>
            <div className={css.timeline}>
              {timeline.map((t, i) => (
                <div key={i} className={css.timelineItem}>
                  <div className={css.timelineYear}>{t.year}</div>
                  <div className={css.timelineContent}>
                    <p className={css.timelineTitle}>{t.title}</p>
                    <p className={css.timelinePlace}>{t.place}</p>
                    <p className={css.timelineDesc}>{t.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* দক্ষতা */}
          <div className={css.section}>
            <div className={css.sectionHead}>
              <span className={css.sectionTitle}>দক্ষতা</span>
              <div className={css.sectionLine} />
            </div>
            <div className={css.skillsBlock}>
              {(isLogin && user?.skills?.length
                ? user.skills.map((s) => ({ name: s, pct: null }))
                : SKILLS_DEFAULT
              ).map((s) => (
                <div key={s.name} className={css.skillRow}>
                  <div className={css.skillMeta}>
                    <span className={css.skillName}>{s.name}</span>
                    {s.pct && <span className={css.skillPct}>{s.pct}%</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right ── */}
        <div className={css.right}>
          {/* ✅ ব্যক্তিগত তথ্য card — location সহ */}
          <div className={css.card}>
            <div className={css.cardHeadRow}>
              <p className={css.cardTitle}>ব্যক্তিগত তথ্য</p>
              {isOwnProfile && (
                <button
                  className={css.editIconBtn}
                  title="তথ্য পরিবর্তন করুন"
                  onClick={() => {
                    setDraftProfile({
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      email: user.email || "",
                      qualification: user.qualification || "",
                    });
                    setEditProfile(true);
                  }}
                >
                  <FaEdit size={12} />
                </button>
              )}
            </div>
            <div className={css.infoList}>
              {INFO_ROWS.map((r) => (
                <div key={r.label} className={css.infoRow}>
                  <div className={css.infoIcon}>{r.icon}</div>
                  <div className={css.infoMeta}>
                    <p className={css.infoLabel}>{r.label}</p>
                    <p className={css.infoVal}>{r.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* যে বিষয়ে লিখি */}
          <div className={css.card}>
            <p className={css.cardTitle}>যে বিষয়ে লিখি</p>
            <div className={css.tagCloud}>
              {activeTopicsWithCount.length > 0
                ? activeTopicsWithCount.map(([label, count]) => (
                    <span key={label} className={css.tag}>
                      {label}
                      <span className={css.topicCount}>{toBn(count)}</span>
                    </span>
                  ))
                : TOPICS_DEFAULT.map((t) => (
                    <span key={t} className={css.tag}>
                      {t}
                    </span>
                  ))}
            </div>
          </div>

          {/* ✅ Social links card — dynamic + edit */}
          <div className={css.card}>
            <div className={css.cardHeadRow}>
              <p className={css.cardTitle}>খুঁজে পাবেন</p>
              {isOwnProfile && (
                <button
                  className={css.editIconBtn}
                  title="সামাজিক মাধ্যম পরিবর্তন করুন"
                  onClick={openInfoModal}
                >
                  <FaEdit size={12} />
                </button>
              )}
            </div>
            <div className={css.socialList}>
              {SOCIAL_CONFIG.map((s) => {
                const href = user?.socialLinks?.[s.key];
                // visitor দের কাছে ফাঁকা লিংক লুকানো
                if (!isOwnProfile && !href) return null;
                return (
                  <a
                    key={s.key}
                    href={href || "#"}
                    className={css.socialLink}
                    target={href ? "_blank" : undefined}
                    rel="noreferrer"
                  >
                    <span className={css.socialIcon}>{s.icon}</span>
                    {s.label}
                    {!href && isOwnProfile ? (
                      <span
                        style={{
                          fontSize: "11px",
                          opacity: 0.4,
                          marginLeft: "auto",
                        }}
                      >
                        যোগ করুন
                      </span>
                    ) : (
                      <span className={css.socialArrow}>→</span>
                    )}
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ════ MODALS ════ */}

      {/* About Edit */}
      {editAbout && (
        <Modal
          title="আমার সম্পর্কে পরিবর্তন করুন"
          onClose={() => setEditAbout(false)}
          onSave={handleAboutSave}
          saving={saving}
        >
          <textarea
            className={css.modalTextarea}
            rows={6}
            value={draftAbout}
            onChange={(e) => setDraftAbout(e.target.value)}
            placeholder="নিজের সম্পর্কে লিখুন..."
          />
        </Modal>
      )}

      {/* ── Hero Bio Edit Modal ── */}
      {editBio && (
        <Modal
          title="সংক্ষিপ্ত পরিচয় পরিবর্তন করুন"
          onClose={() => setEditBio(false)}
          onSave={handleBioSave}
          saving={saving}
        >
          <div className={css.modalField}>
            <label className={css.modalLabel}>
              সংক্ষিপ্ত পরিচয় (hero section এ দেখাবে)
            </label>
            <textarea
              className={css.modalTextarea}
              rows={3}
              maxLength={200}
              value={draftBio}
              onChange={(e) => setDraftBio(e.target.value)}
              placeholder="নিজের সম্পর্কে সংক্ষিপ্তভাবে লিখুন... (সর্বোচ্চ ২০০ অক্ষর)"
            />
            <span
              style={{
                fontSize: "11px",
                color: "var(--gray-color)",
                opacity: 0.5,
              }}
            >
              {draftBio.length} / ২০০ অক্ষর
            </span>
          </div>
        </Modal>
      )}

      {/* Profile Info Edit (নাম, email, শিক্ষা) */}
      {editProfile && (
        <Modal
          title="ব্যক্তিগত তথ্য পরিবর্তন করুন"
          onClose={() => setEditProfile(false)}
          onSave={handleProfileSave}
          saving={saving}
        >
          <div className={css.modalGrid}>
            <div className={css.modalField}>
              <label className={css.modalLabel}>প্রথম নাম</label>
              <input
                className={css.modalInput}
                value={draftProfile.firstName}
                onChange={(e) =>
                  setDraftProfile((p) => ({ ...p, firstName: e.target.value }))
                }
                placeholder="প্রথম নাম"
              />
            </div>
            <div className={css.modalField}>
              <label className={css.modalLabel}>শেষ নাম</label>
              <input
                className={css.modalInput}
                value={draftProfile.lastName}
                onChange={(e) =>
                  setDraftProfile((p) => ({ ...p, lastName: e.target.value }))
                }
                placeholder="শেষ নাম"
              />
            </div>
            {/* Location */}
            <div className={css.modalField} style={{ gridColumn: "1 / -1" }}>
              <label className={css.modalLabel}>অবস্থান</label>
              <input
                className={css.modalInput}
                value={draftInfo.location}
                onChange={(e) =>
                  setDraftInfo((p) => ({ ...p, location: e.target.value }))
                }
                placeholder="রংপুর, বাংলাদেশ"
              />
            </div>
            <div className={css.modalField} style={{ gridColumn: "1 / -1" }}>
              <label className={css.modalLabel}>ইমেইল</label>
              <input
                type="email"
                className={css.modalInput}
                value={draftProfile.email}
                onChange={(e) =>
                  setDraftProfile((p) => ({ ...p, email: e.target.value }))
                }
                placeholder="email@example.com"
              />
            </div>
            <div className={css.modalField} style={{ gridColumn: "1 / -1" }}>
              <label className={css.modalLabel}>শিক্ষাগত যোগ্যতা</label>
              <select
                className={css.modalSelect}
                value={draftProfile.qualification}
                onChange={(e) =>
                  setDraftProfile((p) => ({
                    ...p,
                    qualification: e.target.value,
                  }))
                }
              >
                <option value="">বেছে নিন</option>
                <option value="ssc">এসএসসি / সমমান</option>
                <option value="hsc">এইচএসসি / সমমান</option>
                <option value="diploma">ডিপ্লোমা</option>
                <option value="bsc">স্নাতক</option>
                <option value="msc">স্নাতকোত্তর</option>
                <option value="phd">পিএইচডি</option>
              </select>
            </div>
          </div>
        </Modal>
      )}

      {/* Timeline Edit */}
      {editTimeline && (
        <Modal
          title="যাত্রার ইতিহাস পরিবর্তন করুন"
          onClose={() => setEditTimeline(false)}
          onSave={handleTimelineSave}
          saving={saving}
        >
          <div className={css.tlEditList}>
            {draftTl.map((t, i) => (
              <div key={i} className={css.tlEditItem}>
                <div className={css.tlItemTop}>
                  <span className={css.tlItemNum}>{toBn(i + 1)}</span>
                  <button
                    className={css.tlRemoveBtn}
                    onClick={() =>
                      setDraftTl((p) => p.filter((_, idx) => idx !== i))
                    }
                  >
                    ✕
                  </button>
                </div>
                <div className={css.tlFields}>
                  <div className={css.modalField}>
                    <label className={css.modalLabel}>সাল</label>
                    <input
                      className={css.modalInput}
                      value={t.year}
                      onChange={(e) => updateTlItem(i, "year", e.target.value)}
                      placeholder="২০২৪"
                    />
                  </div>
                  <div className={css.modalField}>
                    <label className={css.modalLabel}>শিরোনাম</label>
                    <input
                      className={css.modalInput}
                      value={t.title}
                      onChange={(e) => updateTlItem(i, "title", e.target.value)}
                      placeholder="পদ / কাজের নাম"
                    />
                  </div>
                  <div className={css.modalField}>
                    <label className={css.modalLabel}>প্রতিষ্ঠান</label>
                    <input
                      className={css.modalInput}
                      value={t.place}
                      onChange={(e) => updateTlItem(i, "place", e.target.value)}
                      placeholder="প্রতিষ্ঠানের নাম"
                    />
                  </div>
                  <div className={css.modalField}>
                    <label className={css.modalLabel}>বিবরণ</label>
                    <input
                      className={css.modalInput}
                      value={t.desc}
                      onChange={(e) => updateTlItem(i, "desc", e.target.value)}
                      placeholder="সংক্ষিপ্ত বিবরণ"
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              className={css.tlAddBtn}
              onClick={() =>
                setDraftTl((p) => [
                  ...p,
                  { year: "", title: "", place: "", desc: "" },
                ])
              }
            >
              + নতুন যোগ করুন
            </button>
          </div>
        </Modal>
      )}

      {/* ✅ Social Links Edit Modal */}
      {editInfo && (
        <Modal
          title="সামাজিক মাধ্যম পরিবর্তন করুন"
          onClose={() => setEditInfo(false)}
          onSave={handleInfoSave}
          saving={saving}
        >
          <div className={css.modalGrid}>
            {/* Social links */}
            {SOCIAL_CONFIG.map((s) => (
              <div key={s.key} className={css.modalField}>
                <label className={css.modalLabel}>{s.label} লিংক</label>
                <input
                  className={css.modalInput}
                  value={draftInfo.socialLinks[s.key]}
                  onChange={(e) =>
                    setDraftInfo((p) => ({
                      ...p,
                      socialLinks: {
                        ...p.socialLinks,
                        [s.key]: e.target.value,
                      },
                    }))
                  }
                  placeholder={`https://...`}
                />
              </div>
            ))}
          </div>
        </Modal>
      )}
    </div>
  );
}
