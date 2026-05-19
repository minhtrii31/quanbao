"use client";

import { useCallback, useEffect, useMemo, useState, type MouseEvent, type ReactNode } from 'react';
import { type Editor } from '@tiptap/react';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code,
  Minus,
  Link,
  Link2Off,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo2,
  Redo2,
  Check,
  Loader2,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface EditorToolbarProps {
  editor: Editor | null;
  isImageUploading?: boolean;
  onImageUpload: () => void;
}

type ToolbarCommand = {
  id: string;
  label: string;
  icon: ReactNode;
  isBusy?: boolean;
  isDisabled?: boolean;
  isActive?: () => boolean;
  canRun?: () => boolean;
  run: () => void;
};

type ToolbarGroup = ToolbarCommand[];

type SavedSelection = {
  from: number;
  to: number;
};

function canRun(command: () => boolean) {
  try {
    return command();
  } catch {
    return false;
  }
}

function ToolbarButton({
  command,
}: {
  command: ToolbarCommand;
}) {
  const active = command.isActive?.() ?? false;
  const disabled = command.isDisabled || command.isBusy || !(command.canRun?.() ?? true);

  const handleMouseDown = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!disabled) {
      command.run();
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label={command.label}
          aria-pressed={active}
          aria-busy={command.isBusy || undefined}
          disabled={disabled}
          onMouseDown={handleMouseDown}
          onClick={handleClick}
          className={cn(
            'h-8 w-8 rounded-md border border-transparent text-muted-foreground hover:bg-muted hover:text-foreground disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-muted-foreground',
            active && 'border-primary/30 bg-primary/10 text-primary shadow-xs ring-1 ring-primary/15 hover:bg-primary/15 hover:text-primary'
          )}
        >
          {command.icon}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-xs">
        {command.label}
      </TooltipContent>
    </Tooltip>
  );
}

function ToolbarSeparator() {
  return <Separator orientation="vertical" className="mx-1 h-6" />;
}

export function EditorToolbar({ editor, isImageUploading = false, onImageUpload }: EditorToolbarProps) {
  const [, setToolbarVersion] = useState(0);
  const [linkInputOpen, setLinkInputOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [savedSelection, setSavedSelection] = useState<SavedSelection | null>(null);

  useEffect(() => {
    if (!editor) return;

    const rerender = () => setToolbarVersion((version) => version + 1);
    const events = ['selectionUpdate', 'transaction', 'update', 'focus', 'blur'] as const;

    events.forEach((event) => editor.on(event, rerender));

    return () => {
      events.forEach((event) => editor.off(event, rerender));
    };
  }, [editor]);

  useEffect(() => {
    if (!isImageUploading) return;

    setLinkInputOpen(false);
  }, [isImageUploading]);

  const restoreSelection = useCallback(() => {
    if (!editor || !savedSelection) return editor?.chain();

    const docSize = editor.state.doc.content.size;
    const from = Math.min(savedSelection.from, docSize);
    const to = Math.min(savedSelection.to, docSize);

    return editor.chain().setTextSelection({ from, to });
  }, [editor, savedSelection]);

  const openLinkInput = useCallback(() => {
    if (!editor) return;

    const { from, to } = editor.state.selection;
    setSavedSelection({ from, to });
    setLinkUrl(editor.getAttributes('link').href ?? '');
    setLinkInputOpen(true);
  }, [editor]);

  const applyLink = useCallback(() => {
    if (!editor) return;

    const url = linkUrl.trim();
    const chain = restoreSelection()?.focus().extendMarkRange('link');

    if (!chain) return;

    if (!url) {
      chain.unsetLink().run();
    } else {
      chain.setLink({ href: url }).run();
    }

    setLinkInputOpen(false);
  }, [editor, linkUrl, restoreSelection]);

  const clearLink = useCallback(() => {
    if (!editor) return;

    const chain = restoreSelection()?.focus().extendMarkRange('link');
    chain?.unsetLink().run();
    setLinkInputOpen(false);
  }, [editor, restoreSelection]);

  const closeLinkInput = useCallback(() => {
    setLinkInputOpen(false);
    editor?.chain().focus().run();
  }, [editor]);

  const toolbarGroups = useMemo<ToolbarGroup[]>(() => {
    if (!editor) return [];

    const isTextAlignTarget = () => editor.isActive('paragraph') || editor.isActive('heading');

    return [
      [
        {
          id: 'undo',
          label: 'Hoàn tác',
          icon: <Undo2 className="h-4 w-4" />,
          canRun: () => editor.can().undo(),
          run: () => editor.chain().focus().undo().run(),
        },
        {
          id: 'redo',
          label: 'Làm lại',
          icon: <Redo2 className="h-4 w-4" />,
          canRun: () => editor.can().redo(),
          run: () => editor.chain().focus().redo().run(),
        },
      ],
      [
        {
          id: 'paragraph',
          label: 'Đoạn văn',
          icon: <span className="text-xs font-semibold">P</span>,
          isActive: () => editor.isActive('paragraph'),
          canRun: () => canRun(() => editor.can().chain().focus().setParagraph().run()),
          run: () => editor.chain().focus().setParagraph().run(),
        },
        {
          id: 'heading-1',
          label: 'Tiêu đề 1',
          icon: <Heading1 className="h-4 w-4" />,
          isActive: () => editor.isActive('heading', { level: 1 }),
          canRun: () => canRun(() => editor.can().chain().focus().toggleHeading({ level: 1 }).run()),
          run: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
        },
        {
          id: 'heading-2',
          label: 'Tiêu đề 2',
          icon: <Heading2 className="h-4 w-4" />,
          isActive: () => editor.isActive('heading', { level: 2 }),
          canRun: () => canRun(() => editor.can().chain().focus().toggleHeading({ level: 2 }).run()),
          run: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
        },
        {
          id: 'heading-3',
          label: 'Tiêu đề 3',
          icon: <Heading3 className="h-4 w-4" />,
          isActive: () => editor.isActive('heading', { level: 3 }),
          canRun: () => canRun(() => editor.can().chain().focus().toggleHeading({ level: 3 }).run()),
          run: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
        },
      ],
      [
        {
          id: 'bold',
          label: 'In đậm',
          icon: <Bold className="h-4 w-4" />,
          isActive: () => editor.isActive('bold'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleBold().run()),
          run: () => editor.chain().focus().toggleBold().run(),
        },
        {
          id: 'italic',
          label: 'In nghiêng',
          icon: <Italic className="h-4 w-4" />,
          isActive: () => editor.isActive('italic'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleItalic().run()),
          run: () => editor.chain().focus().toggleItalic().run(),
        },
        {
          id: 'underline',
          label: 'Gạch chân',
          icon: <Underline className="h-4 w-4" />,
          isActive: () => editor.isActive('underline'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleUnderline().run()),
          run: () => editor.chain().focus().toggleUnderline().run(),
        },
        {
          id: 'strike',
          label: 'Gạch ngang',
          icon: <Strikethrough className="h-4 w-4" />,
          isActive: () => editor.isActive('strike'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleStrike().run()),
          run: () => editor.chain().focus().toggleStrike().run(),
        },
      ],
      [
        {
          id: 'bullet-list',
          label: 'Danh sách',
          icon: <List className="h-4 w-4" />,
          isActive: () => editor.isActive('bulletList'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleBulletList().run()),
          run: () => editor.chain().focus().toggleBulletList().run(),
        },
        {
          id: 'ordered-list',
          label: 'Danh sách số',
          icon: <ListOrdered className="h-4 w-4" />,
          isActive: () => editor.isActive('orderedList'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleOrderedList().run()),
          run: () => editor.chain().focus().toggleOrderedList().run(),
        },
        {
          id: 'blockquote',
          label: 'Trích dẫn',
          icon: <Quote className="h-4 w-4" />,
          isActive: () => editor.isActive('blockquote'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleBlockquote().run()),
          run: () => editor.chain().focus().toggleBlockquote().run(),
        },
        {
          id: 'code-block',
          label: 'Khối mã',
          icon: <Code className="h-4 w-4" />,
          isActive: () => editor.isActive('codeBlock'),
          canRun: () => canRun(() => editor.can().chain().focus().toggleCodeBlock().run()),
          run: () => editor.chain().focus().toggleCodeBlock().run(),
        },
        {
          id: 'horizontal-rule',
          label: 'Nét ngang',
          icon: <Minus className="h-4 w-4" />,
          canRun: () => canRun(() => editor.can().chain().focus().setHorizontalRule().run()),
          run: () => editor.chain().focus().setHorizontalRule().run(),
        },
      ],
      [
        {
          id: 'link',
          label: editor.isActive('link') ? 'Sửa liên kết' : 'Chèn liên kết',
          icon: <Link className="h-4 w-4" />,
          isActive: () => editor.isActive('link') || linkInputOpen,
          canRun: () => canRun(() => editor.can().chain().focus().setLink({ href: 'https://example.com' }).run()),
          run: openLinkInput,
        },
        {
          id: 'unlink',
          label: 'Xóa liên kết',
          icon: <Link2Off className="h-4 w-4" />,
          canRun: () => editor.isActive('link'),
          run: clearLink,
        },
        {
          id: 'image',
          label: isImageUploading ? 'Đang tải ảnh...' : 'Chèn ảnh',
          icon: isImageUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />,
          isBusy: isImageUploading,
          canRun: () => !isImageUploading && canRun(() => editor.can().chain().focus().setImage({ src: 'https://example.com/image.jpg' }).run()),
          run: onImageUpload,
        },
      ],
      [
        {
          id: 'align-left',
          label: 'Căn trái',
          icon: <AlignLeft className="h-4 w-4" />,
          isActive: () => isTextAlignTarget() && (editor.isActive({ textAlign: 'left' }) || (!editor.isActive({ textAlign: 'center' }) && !editor.isActive({ textAlign: 'right' }))),
          canRun: () => canRun(() => editor.can().chain().focus().setTextAlign('left').run()),
          run: () => editor.chain().focus().setTextAlign('left').run(),
        },
        {
          id: 'align-center',
          label: 'Căn giữa',
          icon: <AlignCenter className="h-4 w-4" />,
          isActive: () => editor.isActive({ textAlign: 'center' }),
          canRun: () => canRun(() => editor.can().chain().focus().setTextAlign('center').run()),
          run: () => editor.chain().focus().setTextAlign('center').run(),
        },
        {
          id: 'align-right',
          label: 'Căn phải',
          icon: <AlignRight className="h-4 w-4" />,
          isActive: () => editor.isActive({ textAlign: 'right' }),
          canRun: () => canRun(() => editor.can().chain().focus().setTextAlign('right').run()),
          run: () => editor.chain().focus().setTextAlign('right').run(),
        },
      ],
    ];
  }, [clearLink, editor, isImageUploading, linkInputOpen, onImageUpload, openLinkInput]);

  if (!editor) return null;

  const renderedToolbarGroups = toolbarGroups.map((group) =>
    group.map((command) => ({
      ...command,
      isDisabled: isImageUploading || command.isDisabled,
    }))
  );

  return (
    <TooltipProvider delayDuration={100}>
      <div className="sticky top-0 z-10 flex flex-wrap items-center gap-0.5 border-b border-border bg-muted/30 px-2 py-1.5">
        {renderedToolbarGroups.map((group, groupIndex) => (
          <div key={group.map((command) => command.id).join('-')} className="flex items-center gap-0.5">
            {groupIndex > 0 && <ToolbarSeparator />}
            {group.map((command) => (
              <ToolbarButton key={command.id} command={command} />
            ))}
          </div>
        ))}

        {linkInputOpen && (
          <div
            className="ml-2 flex min-w-[220px] flex-1 items-center gap-1 rounded-md border border-border bg-background px-1.5 py-1 shadow-sm sm:flex-none"
          >
            <Input
              value={linkUrl}
              onChange={(event) => setLinkUrl(event.target.value)}
              onKeyDown={(event) => {
                if (isImageUploading) return;

                if (event.key === 'Enter') {
                  event.preventDefault();
                  applyLink();
                }

                if (event.key === 'Escape') {
                  event.preventDefault();
                  closeLinkInput();
                }
              }}
              placeholder="https://example.com"
              aria-label="URL liên kết"
              className="h-7 min-w-0 border-0 bg-transparent px-1 text-xs shadow-none focus-visible:ring-0"
              disabled={isImageUploading}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Lưu liên kết"
              className="h-7 w-7"
              disabled={isImageUploading}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                applyLink();
              }}
            >
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Đóng"
              className="h-7 w-7"
              disabled={isImageUploading}
              onMouseDown={(event) => event.preventDefault()}
              onClick={(event) => {
                event.preventDefault();
                closeLinkInput();
              }}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
