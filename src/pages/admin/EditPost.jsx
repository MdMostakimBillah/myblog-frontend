import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextEditor from "../../component/TextEditor";
import BubbleToolbar from "../../component/TipTapBubbleTollbar";
import css from "../../cssModule/WritePost.module.css";

import toast from 'react-hot-toast';
import axios from 'axios';
import { ScaleLoader } from "react-spinners";

const CLOUD_NAME = "dezasicak";
const UPLOAD_PRESET = "BlogImage";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [topic, setTopic] = useState("");
    const [status, setStatus] = useState("publish");
    const [content, setContent] = useState(null);

    const [banner, setBanner] = useState(null);
    const [bannerUrl, setBannerUrl] = useState("");
    const [title, setTitle] = useState("");
    const [firstParagraph, setFirstParagraph] = useState("");

    const fileInputRef = useRef(null);
    const editorRef = useRef(null);   // ← নতুন ref
    const [loading, setLoading] = useState(true);

    // পুরোনো পোস্ট লোড
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`);
                const data = await res.json();

                if (data.success) {
                    const p = data.post;
                    setTitle(p.title || "");
                    setFirstParagraph(p.firstParagraph || "");
                    setBannerUrl(p.banner || "");
                    setBanner(p.banner || null);
                    setTopic(p.topic || "");
                    setDate(p.date || "");
                    setStatus(p.status || "publish");
                    setContent(p.content || null);
                }
            } catch (err) {
                toast.error("পোস্ট লোড করতে সমস্যা হয়েছে");
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    // Banner Upload
    const handleBannerUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setBanner(URL.createObjectURL(file));

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", UPLOAD_PRESET);

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                formData
            );
            setBannerUrl(res.data.secure_url);
            toast.success("ছবি আপলোড হয়েছে");
        } catch (err) {
            toast.error("ছবি আপলোড করতে সমস্যা হয়েছে");
        }
    };

    const handleUpdate = async () => {
        if (!title || !firstParagraph) {
            toast.error("টাইটেল এবং প্রথম প্যারাগ্রাফ দিতে হবে");
            return;
        }

        const toastId = toast.loading("পোস্ট আপডেট হচ্ছে...");

        try {
            const response = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    firstParagraph,
                    banner: bannerUrl,
                    topic,
                    date,
                    status,
                    content
                }),
            });

            const data = await response.json();

            if (data.success) {
                toast.success("পোস্ট সফলভাবে আপডেট হয়েছে!", { id: toastId });
                setTimeout(() => navigate("/managepost"), 2500);
            } else {
                toast.error(data.message || "আপডেট করতে সমস্যা হয়েছে", { id: toastId });
            }
        } catch (err) {
            toast.error("সার্ভারে সমস্যা হয়েছে", { id: toastId });
        }
    };

    if (loading) {
        return (
            <div className={css.loading}>
                <ScaleLoader color="var(--primary-color)" />
            </div>
        );
    }

    return (
        <div className={css.Wraper}>
            <div className={css.contantWraper}>
                <div className={css.leftSide}>
                    <div className={css.topBlog}>
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                        />
                        <select
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                        >
                            <option value="">টপিক বাছাই করুন</option>
                            <option value="islamic">ইসলামি চিন্তা</option>
                            <option value="quran-hadith">কুরআন ও হাদিস</option>
                            <option value="self">আত্মশুদ্ধি</option>
                            <option value="creative">সৃজনশীল লেখা</option>
                            <option value="learning">নতুন যা শিখছি</option>
                        </select>
                        <select
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="unpublish">আনপাবলিশ</option>
                            <option value="publish">পাবলিশ</option>
                        </select>
                        <input
                            style={{ cursor: "pointer" }}
                            type="button"
                            value="পোস্ট আপডেট করুন"
                            onClick={handleUpdate}
                        />
                    </div>
                </div>

                {/* Banner + Title + First Paragraph */}
                <div className={`${css.titleCardElement}`}>
                    <div
                        className={`${css.bannerInputArea} ${banner ? css.fillImage : ""}`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleBannerUpload}
                            ref={fileInputRef}
                            hidden
                        />
                        {banner ?
                            <img src={banner} className={css.bannerImage} alt="preview" />
                            :
                            <p className={css.TellImageSize}>16:9</p>}
                    </div>

                    <input
                        type="text"
                        placeholder="বিষয়ের শিরনাম" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className={title ? css.isInputValueAdd : ""}
                    />

                    <textarea
                        placeholder="সম্পূর্ণ ব্লগের মুল কথা অল্প কথায়"
                        value={firstParagraph}
                        onChange={e => setFirstParagraph(e.target.value)}
                        className={firstParagraph ? css.isInputValueAddParagraph : ""}
                        rows={4}
                    />
                </div>

                {/* TextEditor + Bubble Toolbar */}
                <div className={css.editAreaEditor} style={{ position: "relative" }}>
                    <TextEditor
                        ref={editorRef}
                        onChange={setContent}
                        initialContent={content}
                    />
                    <BubbleToolbar editor={editorRef.current} />
                </div>
            </div>
        </div>
    );
}