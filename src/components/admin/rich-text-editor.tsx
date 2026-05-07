import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, Link as LinkIcon, List, ListOrdered } from 'lucide-react'

export function RichTextEditor({ 
  value, 
  onChange,
  placeholder = "Write something..."
}: { 
  value: string
  onChange: (value: string) => void 
  placeholder?: string
}) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'prose prose-stone min-h-[150px] max-w-none focus:outline-none p-4',
      },
    },
  })

  if (!editor) return null

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    // cancelled
    if (url === null) return

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  return (
    <div className="border border-stone-200 bg-white">
      <div className="flex flex-wrap items-center gap-1 border-b border-stone-200 bg-stone-50 p-2">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('bold') ? 'bg-stone-200 text-stone-900' : 'text-stone-600'}`}
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('italic') ? 'bg-stone-200 text-stone-900' : 'text-stone-600'}`}
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={setLink}
          className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('link') ? 'bg-stone-200 text-stone-900' : 'text-stone-600'}`}
        >
          <LinkIcon className="w-4 h-4" />
        </button>
        <div className="w-px h-6 bg-stone-300 mx-1" />
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('bulletList') ? 'bg-stone-200 text-stone-900' : 'text-stone-600'}`}
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-2 rounded hover:bg-stone-200 ${editor.isActive('orderedList') ? 'bg-stone-200 text-stone-900' : 'text-stone-600'}`}
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
