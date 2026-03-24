import { useRef, useCallback, useState, useEffect } from "react";

interface CodeEditorProps {
  content: string;
  language?: string;
  fileName?: string;
  onChange?: (content: string) => void;
  onCursorChange?: (line: number, col: number) => void;
  onSave?: () => void;
}

export function CodeEditor({ content, fileName, onChange, onCursorChange, onSave }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const [lineCount, setLineCount] = useState(1);

  useEffect(() => {
    setLineCount(content.split("\n").length);
  }, [content]);

  const handleScroll = useCallback(() => {
    if (textareaRef.current && lineNumbersRef.current) {
      lineNumbersRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange?.(e.target.value);
    },
    [onChange]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const ta = e.currentTarget;
      // Ctrl/Cmd+S save
      if ((e.ctrlKey || e.metaKey) && e.key === "s") {
        e.preventDefault();
        onSave?.();
        return;
      }
      // Tab support
      if (e.key === "Tab") {
        e.preventDefault();
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        const value = ta.value;
        const newValue = value.substring(0, start) + "    " + value.substring(end);
        onChange?.(newValue);
        requestAnimationFrame(() => {
          ta.selectionStart = ta.selectionEnd = start + 4;
        });
      }
    },
    [onChange, onSave]
  );

  const handleSelect = useCallback(() => {
    if (!textareaRef.current || !onCursorChange) return;
    const ta = textareaRef.current;
    const pos = ta.selectionStart;
    const textBefore = ta.value.substring(0, pos);
    const line = textBefore.split("\n").length;
    const col = pos - textBefore.lastIndexOf("\n");
    onCursorChange(line, col);
  }, [onCursorChange]);

  return (
    <div className="h-full bg-editor-bg flex flex-col overflow-hidden">
      {fileName && (
        <div className="shrink-0 bg-editor-bg border-b border-border px-4 py-1 text-xs text-muted-foreground font-mono">
          {fileName}
        </div>
      )}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Line numbers */}
        <div
          ref={lineNumbersRef}
          className="w-10 md:w-12 shrink-0 bg-editor-gutter overflow-hidden select-none"
          style={{ paddingTop: 8, paddingBottom: 8 }}
          aria-hidden
        >
          {Array.from({ length: lineCount }, (_, i) => (
            <div
              key={i}
              className="text-right pr-2 md:pr-3 text-muted-foreground/50 font-mono"
              style={{ height: 20, lineHeight: '20px', fontSize: 13 }}
            >
              {i + 1}
            </div>
          ))}
        </div>
        {/* Editable textarea */}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleChange}
          onScroll={handleScroll}
          onKeyDown={handleKeyDown}
          onSelect={handleSelect}
          onClick={handleSelect}
          spellCheck={false}
          autoCapitalize="off"
          autoCorrect="off"
          className="flex-1 bg-transparent text-foreground font-mono resize-none outline-none overflow-auto whitespace-pre caret-primary selection:bg-editor-selection"
          style={{ tabSize: 4, padding: 8, paddingLeft: 12, fontSize: 13, lineHeight: '20px' }}
        />
      </div>
    </div>
  );
}
