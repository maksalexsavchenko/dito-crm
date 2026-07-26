import { useMemo, useRef, useState, type ReactNode } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Input, Popover, PopoverAnchor, PopoverContent, cn } from '@dito/ui';
import { categoryTree, type CategoryNode } from '../data/categoryTree';

interface FlatRow {
  name: string;
  depth: number;
  hasChildren: boolean;
}

function flatten(nodes: CategoryNode[], depth: number, expanded: Set<string>, out: FlatRow[]) {
  for (const node of nodes) {
    const hasChildren = !!node.children?.length;
    out.push({ name: node.name, depth, hasChildren });
    if (hasChildren && expanded.has(node.name)) {
      flatten(node.children!, depth + 1, expanded, out);
    }
  }
}

// Search: branches with at least one match stay expanded, the rest are hidden.
function flattenMatching(nodes: CategoryNode[], depth: number, query: string, out: FlatRow[]): boolean {
  let matchedAny = false;
  for (const node of nodes) {
    const selfMatch = node.name.toLowerCase().includes(query);
    const childOut: FlatRow[] = [];
    const childMatch = node.children?.length ? flattenMatching(node.children, depth + 1, query, childOut) : false;
    if (selfMatch || childMatch) {
      out.push({ name: node.name, depth, hasChildren: !!node.children?.length });
      out.push(...childOut);
      matchedAny = true;
    }
  }
  return matchedAny;
}

function collectAllNames(nodes: CategoryNode[], out: string[]) {
  for (const node of nodes) {
    if (node.children?.length) {
      out.push(node.name);
      collectAllNames(node.children, out);
    }
  }
}

function highlight(name: string, query: string): ReactNode {
  if (!query) return name;
  const idx = name.toLowerCase().indexOf(query);
  if (idx === -1) return name;
  return (
    <>
      {name.slice(0, idx)}
      <mark className="rounded-none bg-transparent font-semibold text-foreground">{name.slice(idx, idx + query.length)}</mark>
      {name.slice(idx + query.length)}
    </>
  );
}

export function CategoryTreeSelect({
  value,
  onChange,
  rootLabel,
}: {
  value: string;
  onChange: (name: string) => void;
  rootLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const inputRef = useRef<HTMLInputElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const rows = useMemo(() => {
    const out: FlatRow[] = [];
    if (q) flattenMatching(categoryTree, 1, q, out);
    else flatten(categoryTree, 1, expanded, out);
    return out;
  }, [expanded, q]);

  const allParentNames = useMemo(() => {
    const out: string[] = [];
    collectAllNames(categoryTree, out);
    return out;
  }, []);
  const allExpanded = allParentNames.length > 0 && allParentNames.every((n) => expanded.has(n));

  function toggle(name: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  }

  function select(name: string) {
    onChange(name);
    setQuery('');
    setOpen(false);
    inputRef.current?.blur();
  }

  function scheduleClose() {
    closeTimer.current = setTimeout(() => {
      setOpen(false);
      setQuery('');
    }, 120);
  }

  function cancelClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  return (
    <Popover open={open}>
      <PopoverAnchor asChild>
        <Input
          ref={inputRef}
          value={open ? query : value || rootLabel}
          onFocus={() => setOpen(true)}
          onChange={(e) => setQuery(e.target.value)}
          onBlur={scheduleClose}
          onKeyDown={(e) => e.key === 'Escape' && inputRef.current?.blur()}
          className="w-full cursor-pointer"
        />
      </PopoverAnchor>
      <PopoverContent
        align="start"
        className="flex w-80 flex-col gap-0 p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
        onMouseDownCapture={(e) => e.preventDefault()}
      >
        <div className="max-h-72 overflow-y-auto" onMouseEnter={cancelClose}>
          {!q && (
            <button
              type="button"
              onClick={() => select(rootLabel)}
              className={cn(
                'flex w-full items-center gap-1 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted',
                value === rootLabel && 'bg-muted font-medium',
              )}
            >
              <span className="size-4 shrink-0" />
              {rootLabel}
            </button>
          )}
          {rows.length === 0 && q && (
            <div className="px-2 py-4 text-center text-sm text-muted-foreground">Нічого не знайдено</div>
          )}
          {rows.map((row, i) => (
            <div key={`${row.name}-${i}`} className="flex items-center" style={{ paddingLeft: row.depth * 16 }}>
              {row.hasChildren ? (
                <button
                  type="button"
                  onClick={() => toggle(row.name)}
                  className="flex size-6 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
                  aria-label={expanded.has(row.name) ? 'Згорнути' : 'Розгорнути'}
                >
                  {q || expanded.has(row.name) ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
                </button>
              ) : (
                <span className="size-6 shrink-0" />
              )}
              <button
                type="button"
                onClick={() => select(row.name)}
                className={cn(
                  'flex-1 rounded-md px-1.5 py-1.5 text-left text-sm hover:bg-muted',
                  value === row.name && 'bg-muted font-medium',
                )}
              >
                {highlight(row.name, q)}
              </button>
            </div>
          ))}
        </div>
        {!q && (
          <div className="mt-1 flex shrink-0 justify-end border-t px-2 pt-1.5 text-xs">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() => setExpanded(allExpanded ? new Set() : new Set(allParentNames))}
            >
              {allExpanded ? 'Згорнути все' : 'Розгорнути все'}
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
