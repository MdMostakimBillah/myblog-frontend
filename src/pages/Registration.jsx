import { useState, useRef } from "react";
import css from "../cssModule/Register.module.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';
import axios from 'axios';

const SKILLS_LIST = [
  "প্রবন্ধ রচনা",
  "সৃজনশীল লেখা",
  "কবিতা লেখা",
  "গল্প লেখা",
  "ইসলামি লেখালেখি",
  "ব্লগ লেখা",
  "নিবন্ধ রচনা",
  "অনুবাদ",
  "সম্পাদনা ও প্রুফরিডিং",
  "কনটেন্ট রাইটিং",
  "কপিরাইটিং",
  "স্ক্রিপ্ট রাইটিং",
  "বই লেখা",
  "উপন্যাস লেখা",
  "খুদে গল্প লেখা",
  "ফিচার লেখা",
  "রিপোর্টিং",
  "সাংবাদিকতা",
  "শব্দচয়ন ও ভাষা ব্যবহার",
  "ইসলামিক গবেষণা",
  "কুরআন-হাদিস ভিত্তিক লেখা",
  "দর্শনমূলক লেখা",
  "সমাজ ও সংস্কৃতি লেখা",
  "ইতিহাস লেখা",
  "আত্মশুদ্ধি ও মোটিভেশনাল লেখা",
  "SEO ফ্রেন্ডলি কনটেন্ট",
  "ডিজিটাল কনটেন্ট রাইটিং",
  "সোশ্যাল মিডিয়া কনটেন্ট",
  "ইউটিউব স্ক্রিপ্ট লেখা",
  "পডকাস্ট স্ক্রিপ্ট",
  "গ্রাফিক ডিজাইন",
  "টাইপোগ্রাফি",
  "কভার ডিজাইন",
  "পোস্টার ডিজাইন",
];
const QUALIFICATIONS = [
  { value: "ssc", label: "এসএসসি / সমমান" },
  { value: "hsc", label: "এইচএসসি / সমমান" },
  { value: "diploma", label: "ডিপ্লোমা" },
  { value: "bsc", label: "স্নাতক (বিএ/বিএস/বিএসসি)" },
  { value: "msc", label: "স্নাতকোত্তর (এমএ/এমএস)" },
  { value: "phd", label: "পিএইচডি" },
];

export default function Registration() {
  const [step, setStep] = useState(1);
  const [profilePic, setProfilePic] = useState(null);
  const [form, setForm] = useState({
    firstName: "", lastName: "", username: "",
    qualification: "", email: "", password: "",
    confirmPassword: "", about: "",
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errors, setErrors] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const fileRef = useRef(null);
  const [profilePicFile, setProfilePicFile] = useState(null);
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const CLOUD_NAME = "dezasicak";
  const UPLOAD_PRESET = "BlogImage";     

  const navigate = useNavigate();

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const toggleSkill = (skill) => {
    setSelectedSkills(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handlePic = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error("ছবির সাইজ ২ MB এর কম হতে হবে");
      return;
    }

    setProfilePicFile(file);
    setProfilePicPreview(URL.createObjectURL(file));
    toast.success("ছবি সিলেক্ট হয়েছে");
  };

  const validateStep1 = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "প্রথম নাম দিন";
    if (!form.lastName.trim()) e.lastName = "শেষ নাম দিন";
    if (!form.username.trim()) e.username = "ইউজারনেম দিন";
    else if (form.username.length < 4) e.username = "কমপক্ষে ৪ অক্ষর";
    if (!form.qualification) e.qualification = "শিক্ষাগত যোগ্যতা বেছে নিন";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const validateStep2 = () => {
    const e = {};
    if (!form.email.trim()) e.email = "ইমেইল দিন";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "সঠিক ইমেইল দিন";
    if (!form.password) e.password = "পাসওয়ার্ড দিন";
    else if (form.password.length < 6) e.password = "কমপক্ষে ৬ অক্ষর";
    if (!form.confirmPassword) e.confirmPassword = "পাসওয়ার্ড নিশ্চিত করুন";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "পাসওয়ার্ড মিলছে না";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) setStep(2);
    else if (step === 2 && validateStep2()) setStep(3);
  };

  const handleSubmit = async () => {
    if (form.password !== form.confirmPassword) {
      toast.error("পাসওয়ার্ড মিলছে না!");
      return;
    }

    const toastId = toast.loading("অ্যাকাউন্ট তৈরি হচ্ছে...");

    try {
      let profilePicUrl = "";

      // ==================== Cloudinary Upload ====================
      if (profilePicFile) {
        try {
          const formData = new FormData();
          formData.append("file", profilePicFile);
          formData.append("upload_preset", UPLOAD_PRESET);

          console.log("🚀 Uploading to Cloudinary...");

          const res = await axios.post(
            `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
            formData
          );

          profilePicUrl = res.data.secure_url;
          console.log("✅ Cloudinary Success:", profilePicUrl);
          toast.success("ছবি সফলভাবে আপলোড হয়েছে!");

        } catch (uploadError) {
          console.error("❌ Cloudinary Upload Failed:", uploadError.response?.data || uploadError.message);
          toast.error("ছবি আপলোড করতে সমস্যা হয়েছে");
          profilePicUrl = "";   // ছবি ছাড়াই চালিয়ে যাবে
        }
      }

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        username: form.username.toLowerCase().trim(),
        email: form.email.toLowerCase().trim(),
        password: form.password,
        qualification: form.qualification,
        about: form.about,
        skills: selectedSkills,
        profilePic: profilePicUrl
      };

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে!", { id: toastId });
        setTimeout(() => navigate("/admin-login"), 2000);
      } else {
        toast.error(data.message || "রেজিস্ট্রেশন ব্যর্থ হয়েছে", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("সার্ভারে সমস্যা হয়েছে", { id: toastId });
    }
  };


  const EyeOpen = () => (
    <svg 
      width="16" 
      height="16" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EyeOff = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

  const STEPS = [
    { n: 1, label: "প্রোফাইল" },
    { n: 2, label: "নিরাপত্তা" },
    { n: 3, label: "দক্ষতা" },
  ];

  return (
    <div className={css.root}>
      <div className={css.card}>

        {/* ── Header ── */}
        <div className={css.top}>
          <div className={css.brand}>
            আমার ব্লগ
            <span className={css.brandDot} />
          </div>
          <p className={css.subtitle}>নতুন অ্যাকাউন্ট তৈরি করুন | আপনার অ্যাকাউন্টই আপনার পরিচিতি </p>

          <div className={css.steps}>
            {STEPS.map((s, i) => (
              <div
                key={s.n}
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  flex: i < STEPS.length - 1 ? 1 : "initial" }}
              >
                <div className={`${css.stepDot} ${step === s.n ? css.active : step > s.n ? css.done : ""}`}>
                  <div className={css.stepNum}>{step > s.n ? "✓" : s.n}</div>
                  {s.label}
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`${css.stepLine} ${step > s.n ? css.done : ""}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Body ── */}
        <div className={css.body}>

          {/* ════ STEP 1 ════ */}
          {step === 1 && (
            <>
              <p className={css.sectionTitle}>ব্যক্তিগত তথ্য</p>

              {/* <div className={css.picUpload}>
                <div className={css.picCircle} onClick={() => fileRef.current.click()}>
                  {profilePic
                    ? <img src={profilePic} alt="profile" />
                    : <span className={css.picIcon}>👤</span>
                  }
                </div>
                <input type="file" accept="image/*" ref={fileRef} hidden onChange={handlePic} />
                <div className={css.picInfo}>
                  <p>প্রোফাইল ছবি আপলোড করুন</p>
                  <p>JPG, PNG • সর্বোচ্চ ২ MB</p>
                  <span className={css.picBtn} onClick={() => fileRef.current.click()}>
                    ছবি বেছে নিন
                  </span>
                </div>
              </div> */}

              <div className={css.picUpload}>
                <div
                  className={css.picCircle}
                  onClick={() => fileRef.current.click()}
                >
                  {profilePicPreview ? (
                    <img src={profilePicPreview} alt="profile" />
                  ) : (
                    <span className={css.picIcon}>👤</span>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileRef}
                  hidden
                  onChange={handlePic}
                />

                <div className={css.picInfo}>
                  <p>প্রোফাইল ছবি আপলোড করুন</p>
                  <p>JPG, PNG • সর্বোচ্চ ২ MB</p>
                  <span className={css.picBtn} onClick={() => fileRef.current.click()}>
                    ছবি বেছে নিন
                  </span>
                </div>
              </div>

              <div className={css.row2}>
                <div className={`${css.field} ${errors.firstName ? css.error : ""}`}>
                  <label>প্রথম নাম <span>*</span></label>
                  <input name="firstName" value={form.firstName} onChange={handle} placeholder="আপনার প্রথম নাম" />
                  {errors.firstName && <p className={css.errMsg}>{errors.firstName}</p>}
                </div>
                <div className={`${css.field} ${errors.lastName ? css.error : ""}`}>
                  <label>শেষ নাম <span>*</span></label>
                  <input name="lastName" value={form.lastName} onChange={handle} placeholder="আপনার শেষ নাম" />
                  {errors.lastName && <p className={css.errMsg}>{errors.lastName}</p>}
                </div>
              </div>

              <div className={`${css.field} ${errors.username ? css.error : ""}`}>
                <label>ইউজারনেম <span>*</span></label>
                <input name="username" value={form.username} onChange={handle} placeholder="@username (অনন্য)" />
                {errors.username && <p className={css.errMsg}>{errors.username}</p>}
              </div>

              <div className={`${css.field} ${errors.qualification ? css.error : ""}`}>
                <label>শিক্ষাগত যোগ্যতা <span>*</span></label>
                <select name="qualification" value={form.qualification} onChange={handle}>
                  <option value="">বেছে নিন</option>
                  {QUALIFICATIONS.map(q => (
                    <option key={q.value} value={q.value}>{q.label}</option>
                  ))}
                </select>
                {errors.qualification && <p className={css.errMsg}>{errors.qualification}</p>}
              </div>

              <div className={css.btnRow}>
                <button className={css.btnNext} onClick={handleNext}>পরবর্তী ধাপ →</button>
              </div>
            </>
          )}

          {/* ════ STEP 2 ════ */}
          {step === 2 && (
            <>
              <p className={css.sectionTitle}>লগইন তথ্য</p>

              <div className={`${css.field} ${errors.email ? css.error : ""}`}>
                <label>Gmail / ইমেইল <span>*</span></label>
                <input type="email" name="email" value={form.email} onChange={handle} placeholder="example@gmail.com" />
                {errors.email && <p className={css.errMsg}>{errors.email}</p>}
              </div>

              <div className={`${css.field} ${errors.password ? css.error : ""}`}>
                <label>পাসওয়ার্ড <span>*</span></label>
                <div className={css.passWrap}>
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handle}
                    placeholder="কমপক্ষে ৬ অক্ষর"
                  />
                  <span className={css.passEye} onClick={() => setShowPass(!showPass)}>
                    {showPass ? <EyeOff /> : <EyeOpen />}
                  </span>
                </div>
                {errors.password && <p className={css.errMsg}>{errors.password}</p>}
              </div>

              <div className={`${css.field} ${errors.confirmPassword ? css.error : ""}`}>
                <label>পাসওয়ার্ড নিশ্চিত করুন <span>*</span></label>
                <div className={css.passWrap}>
                  <input
                    type={showConfirm ? "text" : "password"}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handle}
                    placeholder="পাসওয়ার্ড আবার লিখুন"
                  />
                  <span className={css.passEye} onClick={() => setShowConfirm(!showConfirm)}>
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </span>
                </div>
                {errors.confirmPassword && <p className={css.errMsg}>{errors.confirmPassword}</p>}
              </div>

              <div className={css.btnRow}>
                <button className={css.btnBack} onClick={() => setStep(1)}>← পিছনে</button>
                <button className={css.btnNext} onClick={handleNext}>পরবর্তী ধাপ →</button>
              </div>
            </>
          )}

          {/* ════ STEP 3 ════ */}
          {step === 3 && (
            <>
              <p className={css.sectionTitle}>দক্ষতা ও পরিচয়</p>

              <div className={css.field}>
                <label>আমার সম্পর্কে</label>
                <textarea
                  name="about"
                  value={form.about}
                  onChange={handle}
                  placeholder="নিজের সম্পর্কে কিছু লিখুন — আপনি কে, কী করেন, কী ভালোবাসেন..."
                  rows={4}
                />
              </div>

              <div className={css.field}>
                <label>দক্ষতা</label>
                <div className={css.skillsGrid}>
                  {SKILLS_LIST.map(skill => (
                    <span
                      key={skill}
                      className={`${css.skillTag} ${selectedSkills.includes(skill) ? css.selected : ""}`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
                {selectedSkills.length > 0 && (
                  <p className={css.skillCount}>{selectedSkills.length.toString().replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c])} টি দক্ষতা বেছে নেওয়া হয়েছে</p>
                )}
              </div>

              <div className={css.btnRow}>
                <button className={css.btnBack} onClick={() => setStep(2)}>← পিছনে</button>
                <button className={css.btnNext} onClick={handleSubmit}>অ্যাকাউন্ট তৈরি করুন </button>
              </div>
            </>
          )}

          <p className={css.loginLink}>
            আগে থেকেই অ্যাকাউন্ট আছে?
            <Link to="/admin-login">
              লগইন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}