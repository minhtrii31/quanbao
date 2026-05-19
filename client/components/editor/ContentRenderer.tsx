"use client";

import { EditorContent, useEditor } from '@tiptap/react';
import { getEditorExtensions } from './EditorExtensions';

interface ContentRendererProps {
  content: string | object;
  className?: string;
}

export function ContentRenderer({ content, className }: ContentRendererProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: false,
    extensions: getEditorExtensions(),
    content: isTiptapContent(content) && typeof content === 'string'
      ? JSON.parse(content)
      : content || '',
    editorProps: {
      attributes: {
        class: 'tiptap prose prose-sm sm:prose max-w-none',
      },
    },
  }, [content]);

  if (typeof content === 'string' && !isTiptapContent(content)) {
    return (
      <div className={className}>
        <p className="whitespace-pre-wrap break-words">{content}</p>
      </div>
    );
  }

  if (!editor) return null;

  return (
    <div className={className}>
      <EditorContent editor={editor} />
    </div>
  );
}

// Helper to check if content is Tiptap JSON
export function isTiptapContent(content: string | object): boolean {
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content);
      return parsed && typeof parsed.type === 'string';
    } catch {
      return false;
    }
  }
  return typeof content === 'object' && content !== null && 'type' in content;
}
