import { forwardRef, useImperativeHandle } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import CodeBlock from '@tiptap/extension-code-block';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import BubbleMenu from '@tiptap/extension-bubble-menu';

import css from "../cssModule/TextEditor.module.css";
// import styleCss from "../cssModule/TextEditorResponsive.module.css"

const TextEditor = forwardRef(({ onChange, initialContent = null }, ref) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: { HTMLAttributes: { class: css.bulletList } },
                orderedList: { HTMLAttributes: { class: css.listItem } },
            }),
            CodeBlock.configure({
                HTMLAttributes: { class: css.codeBlockArea },
            }),
            Image.configure({
                inline: false,
                allowBase64: true,
                HTMLAttributes: { class: css.editorImage },
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                linkOnPaste: true,
                HTMLAttributes: { class: css.link },
            }),
            BubbleMenu,
        ],
        content: initialContent || '',
        onUpdate({ editor }) {
            onChange(editor.getJSON());
        },
        editorProps: {
            attributes: {
                class: css.textArea,
            }
        }
    });

    // editor কে বাইরে expose করা
    useImperativeHandle(ref, () => editor, [editor]);

    return <EditorContent editor={editor} />;
});

export default TextEditor;