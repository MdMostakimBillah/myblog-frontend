import css from "../cssModule/Homepage.module.css";
import SingleBlog from "../component/SingleBlog";

export default function Home () {
    return (
        <div className={css.ParentWraper}>
            <SingleBlog />
        </div>
    )
}