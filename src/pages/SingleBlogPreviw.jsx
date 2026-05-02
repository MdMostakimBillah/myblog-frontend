import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TiptapViewer from '../component/TipTapViewer';
import {ScaleLoader} from "react-spinners";
import css from "../cssModule/SingleBlog.module.css";
import styleCss from "../cssModule/SingleBlogPreview.module.css";
import { formatDateToBanglaFull } from '../component/DateCustomize';
import { Link } from "react-router-dom";
import { FaRegCopy, FaHeart, FaRegHeart } from "react-icons/fa";
import toast from "react-hot-toast";

export default function SingleBlogPreviw () {
    const { id } = useParams();           // (/blog/:id)
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loggedInUserId = localStorage.getItem("userId");
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`)
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setPost(data.post);
            } else {
                setError("পোস্ট পাওয়া যায়নি");
            }

            setLoading(false);
        })
        .catch(err => {
            setError("সার্ভারে সমস্যা হয়েছে");
            setLoading(false);
            console.log(err);
        });
    }, [id]);

    useEffect(() => {
        // পোস্ট ফেচ করার পর লাইক চেক করা
        if (post) {
            setLikesCount(post.likes?.length || 0);
            setIsLiked(post.likes?.includes(loggedInUserId));
        }
    }, [post, loggedInUserId]);

    // console.log(post);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(window.location.href);
        toast.success("লিঙ্ক কপি করা হয়েছে!");
    };

    const handleLike = async () => {
        if (!loggedInUserId) return toast.error("লাইক দিতে আগে লগইন করুন");

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${post._id}/like`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: loggedInUserId })
            });
            const data = await res.json();
            if (data.success) {
                setIsLiked(!isLiked);
                setLikesCount(data.likesCount);
            }
        } catch (err) { console.log(err); }
    };

    if (loading) {
        return (
            <div className={css.loading}>
                <ScaleLoader color="var(--primary-color)" />
            </div>)
    }
    if (error) {
        return (
            <div className={css.loading}>
                <p>সমস্যা: {error}</p>
            </div>)
    }
    // return <div className={css.error}></div>;

    if (!post) {
        return <div className={css.loading} ><p>কোনো পোস্ট পাওয়া যায়নি!</p></div>
    };

    return (
        <div className={styleCss.wraper}>
            <div className={styleCss.singlePostContainer}>
                {/* বড় ব্যানার ছবি */}
                {post.banner && (
                    <div className={css.banner}>
                        <img src={post.banner} alt={post.title} />
                    </div>
                )}

                <div className={css.contentWrapper}>
                    <div className={`${css.meta} ${styleCss.topicStyle}`}>
                        <span className={`${css.topic} ${styleCss.topic}`}>
                            {post.topic == 'islamic' ? "ইসলামি চিন্তা" :
                                post.topic == "quran-hadith" ? "কুরআন ও হাদিস" :
                                    post.topic == "self" ? "আত্মশুদ্ধি" :
                                        post.topic == "creative" ? "সৃজনশীল লেখা" :
                                            post.topic == "learning" ? "নতুন যা শিখছি" : "কোন টপিক নেই!"}
                        </span>
                        <span className={css.date}>{formatDateToBanglaFull(post.date)}</span>
                        <Link to={`/about/${post.authorName}`}>
                            <span className={`${css.topic} ${styleCss.topic}`}>
                                {/* {post.authorName} */}
                                {post.authorId
                                    ? `${post.authorId.firstName} ${post.authorId.lastName}`
                                    : post.authorName
                                }
                            </span>
                        </Link>
                        
                    </div>

                    <h1 className={`${styleCss.title} ${css.title}`}>{post.title}</h1>
                    <p className={styleCss.FirstParagraph}>
                        {post.firstParagraph}
                    </p>

                    {/* পুরো ব্লগ কনটেন্ট */}
                    <div className={css.blogBody}>
                        <TiptapViewer content={post.content} />
                    </div>

                    <div className={styleCss.ResponceUser}>
                        <Link to={`/about/${post.authorName}`}>
                            <div className={styleCss.writerImage}>
                                {
                                    post.authorId?.profilePic && (
                                        <img   
                                            src={post.authorId.profilePic} 
                                            alt="Author" 
                                            className={css.authorImg}
                                        />
                                    )
                                }
                            </div>
                            <div>
                                
                                    <p className={styleCss.writherName}>
                                        {/* {post.authorName} */}
                                        {post.authorId
                                            ? `${post.authorId.firstName} ${post.authorId.lastName}`
                                            : post.authorName
                                        }
                                    </p>
                                
                            </div>
                        </Link>

                        <div className={styleCss.interactionBar}>
                            <div className={styleCss.likeSection} onClick={handleLike}>
                                {isLiked ? <FaHeart color="#ef4444" /> : <FaRegHeart />}
                                <span>{likesCount.toString().replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c])}</span>
                            </div>

                            <div className={styleCss.copySection} onClick={copyToClipboard} title="কপি লিঙ্ক">
                                <FaRegCopy />
                                <span>কপি লিঙ্ক</span>
                            </div>
                        </div>

                    </div>

                    

                </div>
            </div>
        </div>
    )
}