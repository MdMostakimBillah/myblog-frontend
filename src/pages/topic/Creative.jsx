import SingleBlog from "../../component/SingleBlog";
import css from "../../cssModule/Homepage.module.css";
export default function Creative() {
    return (
        <>
            {/* <h1>সৃজনশীল চিন্তা </h1> */}
            <div className={css.ParentWraper}>
                <SingleBlog topic="creative" />
            </div>
        </>
    )
}