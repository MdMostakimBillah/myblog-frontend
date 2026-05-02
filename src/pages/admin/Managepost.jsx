import { useState, useEffect } from "react";
import banner from "../../assets/DayNight.jpg";
import styleCss from "../../cssModule/ManagePost.module.css";
import css from "../../cssModule/SingleBlog.module.css";
import { useSearchValue } from "../../context/SearchingContext";
import { useNavigate } from "react-router-dom";
import { ScaleLoader } from "react-spinners";
import toast from "react-hot-toast";
import { FaRegEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import { formatDateToBanglaFull } from "../../component/DateCustomize";

export default function Managepost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedTopic, setSelectedTopic] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const { searchValue } = useSearchValue();
  const navigate = useNavigate();

  // Fetch all posts (প্রথমবার)
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);

      // localStorage
      const loggedInUsername = localStorage.getItem("username");
      const loggedInUserId = localStorage.getItem("userId");

      if (!loggedInUsername || !loggedInUserId) {
        setError("দয়া করে আগে লগইন করুন");
        setLoading(false);
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/my-posts/${loggedInUsername}`,
      );
      const data = await res.json();

      if (data.success) {
        const myVerifiedPosts = data.posts.filter((post) => {
          return post.authorId === loggedInUserId;
        });

        setPosts(myVerifiedPosts);
        setFilteredPosts(myVerifiedPosts);

        if (data.posts.length > 0 && myVerifiedPosts.length === 0) {
          console.warn("Security Alert: User ID mismatch detected!");
        }

        // setPosts(data.posts);
        // setFilteredPosts(data.posts);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("ডাটা লোড করতে সমস্যা হয়েছে");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...posts];

    // Topic Filter
    if (selectedTopic !== "all") {
      result = result.filter((post) => post.topic === selectedTopic);
    }

    // Status Filter
    if (selectedStatus !== "all") {
      result = result.filter((post) => post.status === selectedStatus);
    }

    // Search Filter (title + topic)
    if (searchValue) {
      const searchTerm = searchValue.trim().toLowerCase();
      result = result.filter(
        (post) =>
          (post.title && post.title.toLowerCase().includes(searchTerm)) ||
          (post.topic && post.topic.toLowerCase().includes(searchTerm)),
      );
    }

    setFilteredPosts(result);
  }, [selectedTopic, selectedStatus, searchValue, posts]);

 

  const handleDelete = (id) => {
    toast(
      (t) => (
        <div className={styleCss.alertParent}>
          <p className={styleCss.alertMessage}>
            আপনি কি এই পোস্টটি ডিলিট করতে চান?
          </p>

          <p className={styleCss.alertWarningMessage}>
            এটি একবার ডিলিট করলে আর ফিরিয়ে আনা যাবে না।
          </p>

          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
            <button
              onClick={() => toast.dismiss(t.id)}
              className={styleCss.alertConfirmButton}
            >
              না
            </button>

            <button
              onClick={() => {
                toast.dismiss(t.id);
                deletePostNow(id); // আসল ডিলিট ফাংশন
              }}
              className={styleCss.alertConfirmButton}
              style={{ background: "#ef4444" }}
            >
              হ্যাঁ
            </button>
          </div>
        </div>
      ),
      {
        duration: Infinity,
        position: "center",
        style: {
          // ← এটা parent toast container-এর styling
          background: "transparent",
          boxShadow: "none",
          padding: 0,
        },
      },
    );
  };

  // আসল ডিলিট ফাংশন
  const deletePostNow = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (data.success) {
        toast.success("পোস্ট সফলভাবে ডিলিট হয়েছে");
        setPosts((prev) => prev.filter((p) => p._id !== id));
        setFilteredPosts((prev) => prev.filter((p) => p._id !== id));
      } else {
        toast.error(data.message || "ডিলিট করতে সমস্যা হয়েছে");
      }
    } catch (err) {
      toast.error("সার্ভারে সমস্যা হয়েছে");
      console.error(err);
    }
  };

  const handleEdit = (post) => {
    navigate(`/edit-post/${post._id}`, {
      state: { post },
    });
  };

  // const handlePreview = (post) => {
  //     navigate(`/blog/${post._id}`);
  //   };

  if (loading) {
    return (
      <div className={css.loading}>
        <ScaleLoader color="var(--primary-color)" />
      </div>
    );
  }

  if (error) {
    return <div className={css.error}>সমস্যা: {error}</div>;
  }

  return (
    <>
      {/* Filter Section */}
      <div className={styleCss.FilterArea}>
        <div className={styleCss.topicFilter}>
          <select
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
          >
            <option value="all">সব টপিক</option>
            <option value="islamic">ইসলামি চিন্তা</option>
            <option value="quran-hadith">কুরআন ও হাদিস</option>
            <option value="self">আত্মশুদ্ধি</option>
            <option value="creative">সৃজনশীল লেখা</option>
            <option value="learning">নতুন যা শিখছি</option>
          </select>
        </div>

        <div className={styleCss.statusFilter}>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option value="all">সকল পোস্ট</option>
            <option value="publish">পাবলিশ</option>
            <option value="unpublish">আনপাবলিশ</option>
          </select>
        </div>

        <div>
          <button
            className={styleCss.resetBtn}
            onClick={() => {
              setSelectedTopic("all");
              setSelectedStatus("all");
            }}
          >
            ফিল্টার রিসেট
          </button>
        </div>
      </div>

      {/* Table */}
      <table className={styleCss.tableParent}>
        <thead>
          <tr>
            <th>ক্রম</th>
            <th>ব্যানার</th>
            <th>টপিক</th>
            <th>তারিখ</th>
            <th>টাইটেল</th>
            <th>লাইক</th>
            <th>স্ট্যাটাস</th>
            <th>এডিট</th>
            <th>ডিলিট</th>
          </tr>
        </thead>
        <tbody>
          {filteredPosts.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center", padding: "20px" }}>
                কোনো পোস্ট পাওয়া যায়নি!
              </td>
            </tr>
          ) : (
            filteredPosts.map((post, index) => (
              <tr key={post._id} style={{ cursor: "pointer" }}>
                <td data-level="ক্রম">
                  {(index + 1)
                    .toString()
                    .replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c])}
                </td>
                <td data-level="ব্যানার" className={styleCss.bannerShow}>
                  {post.banner ? (
                    <img
                      src={post.banner}
                      alt="banner"
                      className={styleCss.bannerImage}
                    />
                  ) : (
                    <img src={banner} alt="default" />
                  )}
                </td>
                <td data-level="টপিক" className={styleCss.topicStyle}>
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
                </td>
                <td data-level="তারিখ">{formatDateToBanglaFull(post.date)}</td>
                <td data-level="টাইটেল" onClick={() => navigate(`/blog/${post._id}`)}>
                  {post.title || "শিরোনাম নেই"}
                </td>
                <td data-level="লাইক">
                  {post.likes
                    ? post.likes.length
                        .toString()
                        .replace(/\d/g, (c) => "০১২৩৪৫৬৭৮৯"[c])
                    : 0}
                </td>
                <td data-level="স্ট্যাটাস">
                  <span
                    style={{
                      color: post.status === "publish" ? "green" : "orange",
                      fontWeight: "bold",
                    }}
                  >
                    {post.status === "publish" ? "পাবলিশড" : "আনপাবলিশড"}
                  </span>
                </td>
                <td data-level="এডিট" onClick={() => handleEdit(post)}>
                  <FaRegEdit style={{ cursor: "pointer", color: "#3182ce" }} />
                </td>
                <td className={styleCss.deleteLasttd} data-level="ডিলিট" onClick={() => handleDelete(post._id)}>
                  <AiFillDelete
                    style={{ cursor: "pointer", color: "#ef4444" }}
                  />
                </td>
                <td className={styleCss.emptytd}></td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </>
  );
}
