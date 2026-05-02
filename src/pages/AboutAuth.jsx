import css from "../cssModule/About.module.css";
import profileImg from "../assets/IMG20241105084042~2.jpg";

// ─── Sample Data (আপনার নিজের তথ্য দিয়ে পরিবর্তন করুন) ───

const PROFILE = {
  name: "মোঃ মোস্তাকিম বিল্লাহ",
  role: "লেখক",
  roleExtra: "দ্বীনের খাদেম",
  bio1: "আমি খুবই সাধারণ ও অতিনগণ্য একজন। ছোট-খাটো কিছু লেখার পাশাপাশি নতুন কিছু শেখার প্রতি আগ্রহ তাই এই প্রজেক্টে কাজ করছি।",
  bio2: "এই ব্লগে আমি আমার চিন্তা, অভিজ্ঞতা এবং জ্ঞানের ছোট ছোট টুকরো ভাগ করে নিই — যেন পাঠকের হৃদয়ে কিছুটা আলো জ্বলে ওঠে।",
  location: "রংপুর, বাংলাদেশ",
  email: "mostakimbillahn210@gmail.com",
  education: "স্নাতকোত্তর",
  joined: "জানুয়ারি ২০২৬",
};

const STATS = [
  { num: "০ +", label: "প্রকাশিত লেখা" },
  { num: "১ টি", label: "মাসিক পাঠক" },
  { num: "৩+", label: "বছরের অভিজ্ঞতা" },
  { num: "৫টি", label: "বিষয়ে লিখি" },
];

const TIMELINE = [
  {
    year: "২০২৪",
    title: "সিনিয়র কন্টেন্ট রাইটার",
    place: "ইসলামিক ফাউন্ডেশন বাংলাদেশ",
    desc: "ইসলামি জ্ঞান ও গবেষণামূলক প্রবন্ধ রচনা",
  },

  {
    year: "২০২২",
    title: "ব্লগ সূচনা",
    place: "স্বাধীন লেখক",
    desc: "ব্যক্তিগত ব্লগ চালু করে নিয়মিত লেখালেখি শুরু",
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

const SKILLS = [
  { name: "প্রবন্ধ রচনা", pct: 95 },
  { name: "ইসলামিক গবেষণা", pct: 88 },
  { name: "সৃজনশীল লেখা", pct: 82 },
  { name: "কুরআন অধ্যয়ন", pct: 90 },
  { name: "অনুবাদ", pct: 74 },
];

const TOPICS = [
  "ইসলামি চিন্তা",
  "কুরআন ও হাদিস",
  "আত্মশুদ্ধি",
  "সৃজনশীল লেখা",
  "নতুন যা শিখছি",
  "দর্শন",
  "সমাজ",
  "ইতিহাস",
];

const SOCIALS = [
  { icon: "𝕏", label: "Twitter / X", href: "#" },
  { icon: "in", label: "LinkedIn", href: "#" },
  { icon: "▶", label: "YouTube", href: "#" },
  { icon: "📘", label: "Facebook", href: "#" },
];

// ─── Component ───

export default function About() {
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

            <h1 className={css.heroName}>{PROFILE.name}</h1>

            <p className={css.heroRole}>
              {PROFILE.role}

              <span className={css.roleDot} />

              {PROFILE.roleExtra}
            </p>

            <p className={css.heroBio}>{PROFILE.bio1}</p>

            <div className={css.heroActions}>
              <a href="/contact" className={css.btnPrimary}>
                যোগাযোগ করুন
              </a>

              <a href="/blog" className={css.btnOutline}>
                লেখাগুলো পড়ুন →
              </a>
            </div>
          </div>

          <div className={css.picWrap}>
            <div className={css.picFrame}>
              {/* নিজের ছবির URL দিন: <img src="your-photo.jpg" alt="profile" /> */}

              <div className={css.picPlaceholder}>
                <img src={profileImg} alt="profile" />
              </div>

              <span className={css.picBadge}>✦ লেখক</span>
            </div>
          </div>
        </div>
      </div>

      {/* ════ Stats ════ */}

      <div className={css.statsRow}>
        {STATS.map((s) => (
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
          {/* About */}

          <div className={css.section}>
            <div className={css.sectionHead}>
              <span className={css.sectionTitle}>আমার সম্পর্কে</span>

              <div className={css.sectionLine} />
            </div>

            <p className={css.bodyText}>{PROFILE.bio1}</p>

            <p className={css.bodyText} style={{ marginTop: 14 }}>
              {PROFILE.bio2}
            </p>
          </div>

          {/* Timeline */}

          <div className={css.section}>
            <div className={css.sectionHead}>
              <span className={css.sectionTitle}>যাত্রার ইতিহাস</span>

              <div className={css.sectionLine} />
            </div>

            <div className={css.timeline}>
              {TIMELINE.map((t) => (
                <div key={t.year} className={css.timelineItem}>
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

          {/* Skills */}

          <div className={css.section}>
            <div className={css.sectionHead}>
              <span className={css.sectionTitle}>দক্ষতা</span>

              <div className={css.sectionLine} />
            </div>

            <div className={css.skillsBlock}>
              {SKILLS.map((s) => (
                <div key={s.name} className={css.skillRow}>
                  <div className={css.skillMeta}>
                    <span className={css.skillName}>{s.name}</span>

                    <span className={css.skillPct}>{s.pct}%</span>
                  </div>

                  <div className={css.skillBar}>
                    <div
                      className={css.skillFill}
                      style={{ width: `${s.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Right ── */}

        <div className={css.right}>
          {/* Personal Info */}

          <div className={css.card}>
            <p className={css.cardTitle}>ব্যক্তিগত তথ্য</p>

            <div className={css.infoList}>
              {[
                { icon: "📍", label: "অবস্থান", val: PROFILE.location },

                { icon: "✉️", label: "ইমেইল", val: PROFILE.email },

                { icon: "🎓", label: "শিক্ষা", val: PROFILE.education },

                { icon: "📅", label: "যোগ দিয়েছেন", val: PROFILE.joined },
              ].map((r) => (
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

          {/* Topics */}

          <div className={css.card}>
            <p className={css.cardTitle}>যে বিষয়ে লিখি</p>

            <div className={css.tagCloud}>
              {TOPICS.map((t) => (
                <span key={t} className={css.tag}>
                  {t}
                </span>
              ))}
            </div>
          </div>

          {/* Social */}

          <div className={css.card}>
            <p className={css.cardTitle}>খুঁজে পাবেন</p>

            <div className={css.socialList}>
              {SOCIALS.map((s) => (
                <a key={s.label} href={s.href} className={css.socialLink}>
                  <span className={css.socialIcon}>{s.icon}</span>

                  {s.label}

                  <span className={css.socialArrow}>→</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
