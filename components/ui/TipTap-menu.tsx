// components/MenuBar.jsx

interface editorProps{
  editor: any
}

export default function MenuBar({ editor }:editorProps) {
  if (!editor) return null;
  return (
    <div>
      {['bold','italic','underline','strike'].map(cmd => (
        <button
          key={cmd}
          onClick={() => editor.chain().focus()[`toggle${cmd.charAt(0).toUpperCase() + cmd.slice(1)}`]().run()}
          className={editor.isActive(cmd) ? 'active' : ''}
        >{cmd}</button>
      ))}
      <button onClick={() => editor.chain().focus().toggleBulletList().run()}>• List</button>
      <button onClick={() => editor.chain().focus().toggleOrderedList().run()}>1. List</button>
      <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
      <button onClick={() => editor.chain().focus().toggleHighlight().run()}>Highlight</button>
      <button onClick={() => editor.chain().focus().setTextAlign('center').run()}>Center</button>
      <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
      <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
    </div>
  );
}
