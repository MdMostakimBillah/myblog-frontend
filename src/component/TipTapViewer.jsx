import { useMemo } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import css from "../cssModule/TipTapViewer.module.css";

const TiptapViewer = ({ content }) => {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3],
                },
            }),
            Image.configure({
                inline: true,
                allowBase64: true, // ← খুব জরুরি! তোমার ইমেজ base64 আছে
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content || { type: 'doc', content: [] },
        editable: false, // ← শুধু দেখার জন্য
        editorProps: {
            attributes: {
                class: css.tiptapViewer,
            },
        },
    });

//     const editor = useEditor({
//     extensions: [
//       StarterKit,
//       TextAlign.configure({
//         types: ['heading', 'paragraph'],
//       }),
//     ],
//     content: content || '<p>কোনো কনটেন্ট নেই</p>',
//     editable: false,           // viewer mode
//     editorProps: {
//       attributes: {
//         class: css.tiptapViewer,   // আমাদের custom CSS ক্লাস
//       },
//     },
//   });

    // content চেঞ্জ হলে আপডেট করবে
    useMemo(() => {
        if (editor && content) {
            editor.commands.setContent(content, false);
        }
    }, [content, editor]);

    if (!editor) return null;

    return (
        <div className="tiptap-viewer">
            <EditorContent editor={editor} />
        </div>
    );
};

export default TiptapViewer;