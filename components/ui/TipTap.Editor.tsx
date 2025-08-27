"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import TextAlign from "@tiptap/extension-text-align"
import Highlight from "@tiptap/extension-highlight"
import Typography from "@tiptap/extension-typography"
import Placeholder from "@tiptap/extension-placeholder"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import TableRow from "@tiptap/extension-table-row"
import TableHeader from "@tiptap/extension-table-header"
import TableCell from "@tiptap/extension-table-cell"
import Color from "@tiptap/extension-color"
import { Table } from "@tiptap/extension-table"
import { TextStyle } from "@tiptap/extension-text-style"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { CommandProps, Editor } from '@tiptap/core'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  LinkIcon,
  ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Palette,
  TableIcon,
  Minus,
  CheckSquare,
  RemoveFormatting,
  Video,
  Upload,
} from "lucide-react"
import { useState, useCallback,useEffect } from "react"
import { Node, mergeAttributes } from "@tiptap/core"
import VideoUpload from "@/components/ui/video-upload"

const VideoExtension = Node.create({
  name: "video",

  group: "block",

  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
      controls: {
        default: true,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "auto",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "video",
      },
      {
        tag: 'iframe[src*="youtube.com"]',
      },
      {
        tag: 'iframe[src*="vimeo.com"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { src } = HTMLAttributes

    // Check if it's a YouTube or Vimeo URL
    if (src?.includes("youtube.com") || src?.includes("youtu.be")) {
      const videoId = src.includes("youtu.be") ? src.split("/").pop()?.split("?")[0] : src.split("v=")[1]?.split("&")[0]

      return [
        "div",
        { class: "video-wrapper" },
        [
          "iframe",
          mergeAttributes(HTMLAttributes, {
            src: `https://www.youtube.com/embed/${videoId}`,
            frameborder: "0",
            allowfullscreen: "true",
            class: "video-embed",
          }),
        ],
      ]
    }

    if (src?.includes("vimeo.com")) {
      const videoId = src.split("/").pop()?.split("?")[0]

      return [
        "div",
        { class: "video-wrapper" },
        [
          "iframe",
          mergeAttributes(HTMLAttributes, {
            src: `https://player.vimeo.com/video/${videoId}`,
            frameborder: "0",
            allowfullscreen: "true",
            class: "video-embed",
          }),
        ],
      ]
    }

    // For direct video files
    return [
      "video",
      mergeAttributes(HTMLAttributes, {
        controls: "true",
        class: "video-player",
      }),
    ]
  },
//@ts-expect-error error
  addCommands(): Record<string, (options: { src: string }) => Command> {
  return {
    setVideo:
      (options: { src: string }) =>
      ({ commands }: CommandProps) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
  }
},
})

interface TiptapEditorProps {
  name:string,
  content?: string
  onChange?: (content: string) => void
  placeholder?: string
  className?: string
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [linkUrl, setLinkUrl] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [showVideoUpload, setShowVideoUpload] = useState(false)

  const addLink = useCallback(() => {
    if (linkUrl) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: linkUrl }).run()
      setLinkUrl("")
    }
  }, [editor, linkUrl])

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run()
      setImageUrl("")
    }
  }, [editor, imageUrl])

  const addTable = useCallback(() => {
    editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
  }, [editor])

  const addVideo = useCallback(() => {
    if (videoUrl) {
      editor.chain().focus().setVideo({ src: videoUrl }).run()
      setVideoUrl("")
    }
  }, [editor, videoUrl])

  const getVideoEmbedUrl = (url: string) => {
    // YouTube
    if (url.includes("youtube.com") || url.includes("youtu.be")) {
      const videoId = url.includes("youtu.be") ? url.split("/").pop()?.split("?")[0] : url.split("v=")[1]?.split("&")[0]
      return `https://www.youtube.com/embed/${videoId}`
    }

    // Vimeo
    if (url.includes("vimeo.com")) {
      const videoId = url.split("/").pop()?.split("?")[0]
      return `https://player.vimeo.com/video/${videoId}`
    }

    // Direct video file
    return url
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-1 bg-background/50 backdrop-blur-sm sticky top-0 z-10">
      {/* Text Formatting */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive("bold") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("italic") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("underline") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="h-8 w-8 p-0"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("strike") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className="h-8 w-8 p-0"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("code") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleCode().run()}
          className="h-8 w-8 p-0"
        >
          <Code className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Headings */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive("heading", { level: 1 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className="h-8 w-8 p-0"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 2 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className="h-8 w-8 p-0"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("heading", { level: 3 }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className="h-8 w-8 p-0"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Lists */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive("bulletList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("orderedList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="h-8 w-8 p-0"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive("taskList") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          className="h-8 w-8 p-0"
        >
          <CheckSquare className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Alignment */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive({ textAlign: "left" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "center" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "right" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>
        <Button
          variant={editor.isActive({ textAlign: "justify" }) ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          className="h-8 w-8 p-0"
        >
          <AlignJustify className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Colors and Highlight */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Palette className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="grid grid-cols-6 gap-2">
              {["#000000", "#ef4444", "#f97316", "#eab308", "#22c55e", "#3b82f6", "#8b5cf6", "#ec4899"].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded border-2 border-border hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Button
          variant={editor.isActive("highlight") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          className="h-8 w-8 p-0"
        >
          <Highlighter className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Insert Elements */}
      <div className="flex items-center gap-1">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex gap-2">
              <Input
                placeholder="Enter URL"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addLink()}
              />
              <Button onClick={addLink} size="sm">
                Add
              </Button>
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Enter image URL"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addImage()}
              />
              <Button onClick={addImage} size="sm">
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs text-muted-foreground">Or upload from your device</label>
              <Input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  // For now, use a data URL. Replace with upload logic as needed.
                  const reader = new FileReader();
                  reader.onload = (event) => {
                    const src = event.target?.result as string;
                    if (src) {
                      editor.chain().focus().setImage({ src }).run();
                    }
                  };
                  reader.readAsDataURL(file);
                  // Reset file input so the same file can be selected again
                  e.target.value = "";
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
        <Button variant="ghost" size="sm" onClick={addTable} className="h-8 w-8 p-0">
          <TableIcon className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Video className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            {showVideoUpload ? (
              <VideoUpload
                onVideoUploaded={(url) => {
                  editor.chain().focus().setVideo({ src: url }).run()
                  setShowVideoUpload(false)
                }}
                onClose={() => setShowVideoUpload(false)}
              />
            ) : (
              <div className="space-y-3">
                <div className="text-sm font-medium">Add Video</div>

                <div className="space-y-2">
                  <div className="text-xs text-muted-foreground">Embed from URL (YouTube, Vimeo, or direct link)</div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter video URL"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addVideo()}
                    />
                    <Button onClick={addVideo} size="sm">
                      Add
                    </Button>
                  </div>
                </div>

                <div className="flex flex-col gap-2 mt-2">
                  <label className="text-xs text-muted-foreground">Or upload from your device</label>
                  <Input
                    type="file"
                    accept="video/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      // For now, use a data URL. Replace with upload logic as needed.
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        const src = event.target?.result as string;
                        if (src) {
                          editor.chain().focus().setVideo({ src }).run();
                        }
                      };
                      reader.readAsDataURL(file);
                      // Reset file input so the same file can be selected again
                      e.target.value = "";
                    }}
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>

                <Button onClick={() => setShowVideoUpload(true)} variant="outline" className="w-full">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Video File
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Other Actions */}
      <div className="flex items-center gap-1">
        <Button
          variant={editor.isActive("blockquote") ? "default" : "ghost"}
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className="h-8 w-8 p-0"
        >
          <Quote className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          className="h-8 w-8 p-0"
        >
          <Minus className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          className="h-8 w-8 p-0"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-8" />

      {/* Undo/Redo */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          className="h-8 w-8 p-0"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          className="h-8 w-8 p-0"
        >
          <Redo className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default function TiptapEditor({
  content = "",
  onChange,
  placeholder = "Start writing...",
  className = "",
}: TiptapEditorProps) {
  const [editor, setEditor] = useState<Editor | null>(null);

  // Initialize editor
  useEffect(() => {
    const instance = new Editor({
      extensions: [
        StarterKit.configure({
          bulletList: { keepMarks: true, keepAttributes: false },
          orderedList: { keepMarks: true, keepAttributes: false },
        }),
        Underline,
        Link.configure({
          openOnClick: false,
          HTMLAttributes: {
            class:
              "text-primary underline underline-offset-2 hover:text-primary/80 cursor-pointer",
          },
        }),
        Image.configure({
          HTMLAttributes: {
            class: "rounded-lg border border-border max-w-full h-auto",
          },
        }),
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
        Highlight.configure({ multicolor: true }),
        Typography,
        Placeholder.configure({ placeholder }),
        TaskList,
        TaskItem.configure({ nested: true }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        TextStyle,
        Color,
        VideoExtension,
      ],
      content,
      onUpdate({ editor }) {
        onChange?.(editor.getHTML()); // 🔁 Send changes to form
      },
      editorProps: {
        attributes: {
          class:
            "prose prose-sm sm:prose-base lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 " +
            className,
        },
      },
    });

    setEditor(instance);

    return () => instance.destroy();
  }, []);

  // Keep form value in sync when reset/defaultValue changes
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  if (!editor) return null;

  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
