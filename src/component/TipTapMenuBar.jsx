import css from "../cssModule/TextEditor.module.css"
import {
    BsTypeH1,
    BsTypeH2,
    BsTypeH3,
    BsParagraph,
    BsTypeBold,
    BsTypeItalic,
    BsTypeStrikethrough,
    BsTextLeft,
    BsTextCenter,
    BsTextRight,
    BsJustify,
    BsListOl,
    BsListUl,
    BsCode,
    BsCodeSlash,
    BsImage
} from "react-icons/bs";


const MenuBar = ({ editor }) => {
    if (!editor) return null;

    const OPTIONS = [
        {
            icon: <BsTypeH1 />,
            action: e => e.chain().focus().toggleHeading({ level: 1 }).run(),
            isActive: e => e.isActive("heading", { level: 1 }),
        },
        {
            icon: <BsTypeH2 />,
            action: e => e.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: e => e.isActive("heading", { level: 2 }),
        },
        {
            icon: <BsTypeH3 />,
            action: e => e.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: e => e.isActive("heading", { level: 3 }),
        },
        {
            icon: <BsParagraph />,
            action: e => e.chain().focus().setParagraph().run(),
            isActive: e => e.isActive("paragraph"),
        },
        {
            icon: <BsTypeBold />,
            action: e => e.chain().focus().toggleBold().run(),
            isActive: e => e.isActive("bold"),
        },
        {
            icon: <BsTypeItalic />,
            action: e => e.chain().focus().toggleItalic().run(),
            isActive: e => e.isActive("italic"),
        },
        {
            icon: <BsTypeStrikethrough />,
            action: e => e.chain().focus().toggleStrike().run(),
            isActive: e => e.isActive("strike"),
        },
        {
            icon: <BsTextLeft />,
            action: e => e.chain().focus().setTextAlign("left").run(),
            isActive: e => e.isActive({ textAlign: "left" }),
        },
        {
            icon: <BsTextCenter />,
            action: e => e.chain().focus().setTextAlign("center").run(),
            isActive: e => e.isActive({ textAlign: "center" }),
        },
        {
            icon: <BsTextRight />,
            action: e => e.chain().focus().setTextAlign("right").run(),
            isActive: e => e.isActive({ textAlign: "right" }),
        },
        {
            icon: <BsJustify />,
            action: e => e.chain().focus().setTextAlign("justify").run(),
            isActive: e => e.isActive({ textAlign: "justify" }),
        },
        {
            icon: <BsListUl />,
            action: e => e.chain().focus().toggleBulletList().run(),
            isActive: e => e.isActive("bulletList"),
        },
        {
            icon: <BsListOl />,
            action: e => e.chain().focus().toggleOrderedList().run(),
            isActive: e => e.isActive("orderedList"),
        },
        {
            icon: <BsCode />,
            action: e => e.chain().focus().toggleCodeBlock().run(),
            isActive: e => e.isActive('codeBlock'),
        },
        {
            icon: <BsCodeSlash />,
            action: e => e.chain().focus().setCodeBlock().run(),
            isActive: e => e.isActive('codeBlock'),
        },
        {
            icon: <BsImage />,
            action: (editor) => {
                const input = document.createElement('input')
                input.type = 'file'
                input.accept = 'image/*'

                input.onchange = () => {
                    const file = input.files[0]
                    const reader = new FileReader()

                    reader.onload = () => {
                        editor.chain().focus().setImage({ src: reader.result }).run()
                    }

                    reader.readAsDataURL(file)
                }

                input.click()
            },
            isActive: () => false,
        }

    ];

    return (
        <div className={css.controlGroup}>
            <div className={css.buttonGroup}>
                {OPTIONS.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => item.action(editor)}
                        className={item.isActive(editor) ? css.active : ""}
                        type="button"
                    >
                        {item.icon}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default MenuBar