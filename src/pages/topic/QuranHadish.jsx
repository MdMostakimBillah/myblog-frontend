import SingleBlog from "../../component/SingleBlog";
import css from "../../cssModule/Homepage.module.css";
// import { RiBook2Line } from "react-icons/ri";
export default function QuranHadish() {
    return (
        <>
            <div className={css.ParentWraper}>
                <SingleBlog topic="quran-hadith" />
            </div>
        </>
    )
}