import { Editor } from '@tiptap/react';

export function serializeContent(editor: Editor | null): string {
  if (!editor) return '';
  return JSON.stringify(editor.getJSON());
}

export function deserializeContent(json: string): object {
  try {
    return JSON.parse(json);
  } catch {
    return {};
  }
}

export function isTiptapJSON(content: string | object): boolean {
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

export function getContentFromTiptap(content: string | object): string {
  if (typeof content === 'string') {
    if (isTiptapJSON(content)) {
      return content;
    }
    return content;
  }
  return JSON.stringify(content);
}
