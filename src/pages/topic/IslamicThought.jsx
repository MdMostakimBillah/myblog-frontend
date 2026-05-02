import SingleBlog from "../../component/SingleBlog";
import css from "../../cssModule/Homepage.module.css";

export default function IslamicThought() {
    return (
        <>
            {/* <h1>ইসলামিক চিন্তা</h1> */}
            <div className={css.ParentWraper}>
                <SingleBlog topic = "islamic"/>
            </div>
        </>
    )
}