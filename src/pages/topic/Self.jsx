import SingleBlog from "../../component/SingleBlog";
import css from "../../cssModule/Homepage.module.css";
export default function Self() {
    return (
        <>
            {/* <h1>আত্মসুদ্ধি</h1> */}
            <div className={css.ParentWraper}>
                <SingleBlog topic="self" />
            </div>
        </>
    )
}