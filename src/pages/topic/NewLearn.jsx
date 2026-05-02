import SingleBlog from "../../component/SingleBlog";
import css from "../../cssModule/Homepage.module.css";
export default function NewLearn() {
    return (
        <>
            {/* <h1>নতুন কিছু শেখা</h1> */}
            <div className={css.ParentWraper}>
                <SingleBlog topic="learning" />
            </div>
        </>
    )
}