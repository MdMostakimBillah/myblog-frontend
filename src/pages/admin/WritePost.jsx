import { useState, useRef } from "react";
import TextEditor from "../../component/TextEditor";
import css from "../../cssModule/WritePost.module.css";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import BubbleToolbar from "../../component/TipTapBubbleTollbar"; 
import axios from 'axios';

export default function WritePost() {

    const navigate = useNavigate();

    const [date, setDate] = useState("");
    const [topic, setTopic] = useState("");
    const [status, setStatus] = useState("publish");
    const [content, setContent] = useState(null); //tiptap data 

    const [banner, setBanner] = useState(null);
    const [bannerUrl, setBannerUrl] = useState("");
    const [title, setTitle] = useState("");
    const [firstParagraph, setFirstParagraph] = useState("");
    const fileInputRef = useRef(null);

    const editorRef = useRef(null);     // ← এটা নতুন যোগ করো


    const CLOUD_NAME = "dezasicak";
    const UPLOAD_PRESET = "BlogImage";


    const handlePublish = () => {

        if (!content) {
            toast.error("কোন লেখা নেই!");
            return;
        }

        if (date == '') {
            toast.error("তারিখ নির্ধারণ করুন!");
            return;
        }

        if (topic == '') {
            toast.error("টপিক নির্বাচন করুন!");
            return;
        }

        if (banner == '') {
            toast.error("ব্যানার দেওয়া হয়নি!");
            return;
        }

        if (title == '') {
            toast.error("টাইটেল দিতে ভুলে গেছেন!");
            return;
        }

        if (firstParagraph == '') {
            toast.error("প্রথম প্যারাগ্রাফ টি দিতে ভুলে গেছেন!");
            return;
        }

        // localStorage থেকে ইউজারের তথ্য সংগ্রহ
        const username = localStorage.getItem("username");
        const userId = localStorage.getItem("userId");

        if (!username || !userId) {
            toast.error("পোস্ট করার আগে দয়া করে লগইন করুন!");
            return;
        }


        const post = {
            id: crypto.randomUUID(),
            date,
            topic,
            status,
            banner: bannerUrl,
            title,
            firstParagraph,
            content,
            authorName: username,  // লেখকের ইউজারনেম ডাটাবেজে পাঠানো হচ্ছে
            authorId: userId,      // লেখকের আইডি পাঠানো হচ্ছে (নিরাপত্তার জন্য ভালো)
            createdAt: new Date().toISOString(),
        }

        console.log("এই ডাটাটা backend-এ পাঠাবো:", post);
        const toastId = toast.loading("পোস্ট প্রকাশ হচ্ছে...");

        // form sending to Backend
        fetch(`${import.meta.env.VITE_API_URL}/api/posts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(post)
        })

            .then((response) => {
                console.log("Response status:", response.status);

                if (!response.ok) {
                    const text = response.text();
                    throw new Error(`Backend এরর: ${response.status} - ${text}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("From Backed: ", data);
                toast.success("পোস্ট সফলভাবে প্রকাশিত হয়েছে!", {
                    id: toastId,
                });

                setTimeout(() => {
                    navigate("/managepost");
                }, 3000);
            })
            .catch((error) => {
                console.error("The problem is ", error);
                toast.error("পোস্ট প্রকাশ করা যায়নি", {
                    id: toastId,
                    description: error.message || "আবার চেষ্টা করুন",
                });
            })
    }


    return (
        <div className={css.Wraper}>
            <div className={css.contantWraper}>
                <div className={css.leftSide}>
                    <div className={css.topBlog}>
                        <input
                            type="date"
                            value={date}
                            required
                            onChange={e => setDate(e.target.value)}
                        />

                        <select
                            name=""
                            id=""
                            onChange={e => setTopic(e.target.value)}
                            required
                        >
                            <option value="">টপিক বাছাই করুন</option>
                            <option value="islamic">ইসলামি চিন্তা</option>
                            <option value="quran-hadith">কুরআন ও হাদিস</option>
                            <option value="self">আত্মশুদ্ধি</option>
                            <option value="creative">সৃজনশীল লেখা</option>
                            <option value="learning">নতুন যা শিখছি</option>
                        </select>

                        <select name="" id="" onChange={e => setStatus(e.target.value)}>
                            <option value="">স্ট্যাটাস সিলেক্ট করুন</option>
                            <option value="unpublish">আনপাবলিশ</option>
                            <option value="publish">পাবলিশ</option>
                        </select>

                        <input type="submit" value="পোস্ট করুন" onClick={handlePublish} />
                    </div>
                </div>

                <div className={`${css.titleCardElement}`}>
                    <div
                        className={`${css.bannerInputArea} ${banner ? css.fillImage : ""}`}
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            onChange={async ({ target: { files } }) => {
                                if (!files || !files[0]) return;

                                const file = files[0];

                                // Preview দেখানো
                                setBanner(URL.createObjectURL(file));

                                // Cloudinary তে আপলোড
                                const formData = new FormData();
                                formData.append("file", file);
                                formData.append("upload_preset", UPLOAD_PRESET);

                                try {
                                    const res = await axios.post(
                                        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                                        formData
                                    );

                                    const imageUrl = res.data.secure_url;
                                    setBannerUrl(imageUrl);

                                    console.log("✅ Cloudinary URL:", imageUrl);
                                    toast.success("ছবি সফলভাবে আপলোড হয়েছে!");

                                } catch (err) {
                                    console.error("Upload failed:", err);
                                    toast.error("ছবি আপলোড করতে সমস্যা হয়েছে");
                                }
                            }}
                            ref={fileInputRef}
                            required
                            hidden
                        />

                        {
                            banner ?
                                <img src={banner} className={css.bannerImage} />
                                : <p className={css.TellImageSize}>16:9</p>
                        }
                    </div>
                    <input
                        style={{width: "100%"}}
                        type="text"
                        placeholder="বিষয়ের শিরনাম"
                        required
                        onChange={e => setTitle(e.target.value)}
                        className={title ? css.isInputValueAdd : ""}
                    />
                    <textarea
                        type="text"
                        rows="4"
                        placeholder="সম্পূর্ণ ব্লগের মুল কথা অল্প কথায় এখানে লিখুন এবং বিস্তারিত নিচের বক্সে লিখুন..."
                        required
                        onChange={e => setFirstParagraph(e.target.value)}
                        className={firstParagraph ? css.isInputValueAddParagraph : ""}
                    />
                </div>



                {/* TextEditor + BubbleToolbar সঠিকভাবে */}
                <div style={{ position: "relative", padding: "0 10px" }}>
                    <TextEditor
                        ref={editorRef}
                        onChange={setContent}
                    />
                    <BubbleToolbar editor={editorRef.current} />
                </div>
            </div>
        </div>
    );
}

