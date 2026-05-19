"use client";

import { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { Loader2, Image as ImageIcon } from 'lucide-react';
import { getEditorExtensions } from './EditorExtensions';
import { EditorToolbar } from './EditorToolbar';
import { cn } from '@/lib/utils';
import { uploadImage } from '@/lib/api/upload';
import { getApiErrorMessage } from '@/lib/api';
import { toast } from 'sonner';

const getEditorContent = (content?: string | object) => {
  if (!content) return '';
  if (typeof content !== 'string') return content;

  try {
    const parsed = JSON.parse(content);
    return parsed && typeof parsed === 'object' && 'type' in parsed ? parsed : content;
  } catch {
    return content;
  }
};

const serializeEditorContent = (content?: string | object) => {
  const editorContent = getEditorContent(content);

  if (typeof editorContent === 'string') {
    return editorContent;
  }

  return JSON.stringify(editorContent);
};

interface TiptapEditorProps {
  content?: string | object;
  onChange?: (content: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
}

type SavedSelection = {
  from: number;
  to: number;
};

type ImageUploadState = {
  selection: SavedSelection;
  message: string;
};

export function TiptapEditor({
  content,
  onChange,
  placeholder = 'Bắt đầu viết nội dung...',
  ariaLabel = placeholder,
  className,
}: TiptapEditorProps) {
  const [imageUploadState, setImageUploadState] = useState<ImageUploadState | null>(null);
  const isImageUploading = Boolean(imageUploadState);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: getEditorExtensions(placeholder),
    content: getEditorContent(content),
    editorProps: {
      attributes: {
        'aria-label': ariaLabel,
        role: 'textbox',
        class: 'tiptap prose prose-sm sm:prose max-w-none focus:outline-none min-h-[300px] px-4 py-3',
      },
    },
    onUpdate: ({ editor: ed }) => {
      if (onChange) {
        onChange(JSON.stringify(ed.getJSON()));
      }
    },
  });

  useEffect(() => {
    if (!editor) return;

    const nextContent = getEditorContent(content);
    const nextSerialized = serializeEditorContent(content);
    const currentSerialized = JSON.stringify(editor.getJSON());

    if (nextSerialized === currentSerialized) return;
    if (editor.isFocused) return;

    editor.commands.setContent(nextContent, { emitUpdate: false });
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;

    editor.setEditable(!isImageUploading);

    return () => {
      editor.setEditable(true);
    };
  }, [editor, isImageUploading]);

  if (!editor) return null;

  return (
    <div className={cn('border border-border rounded-none bg-card', className)}>
      <EditorToolbar
        editor={editor}
        isImageUploading={isImageUploading}
        onImageUpload={() => {
          if (isImageUploading) return;

          const input = document.createElement('input');
          input.type = 'file';
          input.accept = 'image/*';
          input.onchange = async (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (!file) return;

            const { from, to } = editor.state.selection;
            const savedSelection = { from, to };

            setImageUploadState({
              selection: savedSelection,
              message: 'Đang tải ảnh lên...',
            });
            editor.setEditable(false);

            try {
              const result = await uploadImage(file);
              if (!result.url) {
                throw new Error('Không nhận được URL ảnh sau khi tải lên');
              }

              editor.setEditable(true);

              const docSize = editor.state.doc.content.size;
              editor
                .chain()
                .setTextSelection({
                  from: Math.min(savedSelection.from, docSize),
                  to: Math.min(savedSelection.to, docSize),
                })
                .focus()
                .setImage({ src: result.url })
                .run();
            } catch (error) {
              toast.error(getApiErrorMessage(error, 'Tải ảnh thất bại. Vui lòng thử lại.'));
            } finally {
              editor.setEditable(true);
              setImageUploadState(null);
            }
          };
          input.click();
        }}
      />
      <div className="relative">
        <EditorContent editor={editor} />
        {imageUploadState && (
          <div
            className="absolute inset-0 z-10 flex items-end bg-background/45 px-4 py-4 backdrop-blur-[1px]"
            aria-live="polite"
            aria-busy="true"
          >
            <div className="w-full max-w-xl rounded-md border border-dashed border-primary/40 bg-card/95 p-3 shadow-sm">
              <div className="relative aspect-video overflow-hidden rounded-md border border-border bg-muted">
                <div className="absolute inset-0 animate-pulse bg-muted" />
                <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.4s_infinite] bg-gradient-to-r from-transparent via-background/70 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                  <div className="flex size-10 items-center justify-center rounded-md bg-background shadow-sm">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-2 text-sm font-medium text-foreground">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span>{imageUploadState.message}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
