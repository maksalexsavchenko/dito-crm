import type { ReactNode } from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  Badge,
  Button,
  Separator,
  cn,
  toast,
} from '@dito/ui';
import { docHasItems, mockDocItems, statusColor, type WSection, type WRow } from '../data/warehouse';

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="space-y-0.5">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm font-medium">{value || '—'}</div>
    </div>
  );
}

export function DocumentDetailSheet({
  id,
  section,
  row,
  open,
  onOpenChange,
}: {
  id: string;
  section: WSection;
  row: WRow | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!row) return null;

  const numberCol = section.cols[0];
  const title = `${numberCol.header} ${row[numberCol.key] ?? ''}`.trim();

  // Інфо-поля: всі колонки крім номера, суми та фото.
  const infoCols = section.cols.filter(
    (c) => c.key !== numberCol.key && c.kind !== 'sum' && c.kind !== 'image',
  );

  const hasItems = docHasItems.has(id);
  const itemsTotal = row.sum || '21 565';

  function printDoc() {
    const w = window.open('', '_blank', 'width=760,height=900');
    if (!w) {
      toast.error('Дозвольте спливаючі вікна для друку');
      return;
    }
    const info = infoCols.map((c) => `<div><span>${c.header}</span><b>${row![c.key] ?? '—'}</b></div>`).join('');
    const itemRows = hasItems
      ? mockDocItems
          .map(
            (it) =>
              `<tr><td>${it.name}${it.sn ? `<div class="sn">${it.sn}</div>` : ''}</td><td>${it.cell}</td><td class="r">${it.price}</td><td class="r">${it.qty} шт</td><td class="r">${it.sum} грн</td></tr>`,
          )
          .join('')
      : '';
    w.document.write(
      `<!doctype html><html lang="uk"><head><meta charset="utf-8"><title>${title}</title><style>` +
        '*{font-family:system-ui,-apple-system,sans-serif;box-sizing:border-box}body{margin:32px;color:#0f172a}h1{font-size:20px;margin:0 0 16px}.info{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-bottom:20px}.info span{display:block;font-size:11px;color:#64748b}.info b{font-size:13px;font-weight:600}table{width:100%;border-collapse:collapse;font-size:13px}th,td{text-align:left;padding:8px;border-bottom:1px solid #e2e8f0}th{background:#f1f5f9}.r{text-align:right}.sn{font-size:11px;color:#64748b;font-family:monospace}.totals{margin-top:16px;text-align:right;font-size:14px}.totals b{font-size:16px}' +
        `</style></head><body><h1>${title}</h1><div class="info">${info}</div>` +
        (hasItems
          ? `<table><thead><tr><th>Найменування</th><th>Комірка</th><th class="r">Ціна</th><th class="r">К-сть</th><th class="r">Сума</th></tr></thead><tbody>${itemRows}</tbody></table><div class="totals">Разом: <b>${itemsTotal} грн</b></div>`
          : '') +
        '</body></html>',
    );
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 250);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b">
          <SheetTitle className="pr-6 text-lg">{title}</SheetTitle>
        </SheetHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-4">
          {/* Інфо-поля документа */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {infoCols.map((c) =>
              c.kind === 'status' ? (
                <Field
                  key={c.key}
                  label={c.header}
                  value={
                    <Badge
                      variant="outline"
                      className={cn('border-transparent', statusColor[row[c.key]] ?? 'bg-muted text-muted-foreground')}
                    >
                      {row[c.key]}
                    </Badge>
                  }
                />
              ) : (
                <Field key={c.key} label={c.header} value={row[c.key]} />
              ),
            )}
          </div>

          {hasItems && (
            <>
              <Separator />
              <div>
                <div className="mb-2 text-sm font-semibold">Список товарів</div>
                <div className="overflow-hidden rounded-xl border">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40">
                        <TableHead>Найменування</TableHead>
                        <TableHead>Комірка</TableHead>
                        <TableHead className="text-right">Ціна</TableHead>
                        <TableHead className="text-right">К-сть</TableHead>
                        <TableHead className="text-right">Сума</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockDocItems.map((it) => (
                        <TableRow key={it.name}>
                          <TableCell>
                            <div className="font-medium">{it.name}</div>
                            {it.sn && <div className="font-mono text-xs text-muted-foreground">{it.sn}</div>}
                          </TableCell>
                          <TableCell className="text-muted-foreground">{it.cell}</TableCell>
                          <TableCell className="text-right tabular-nums">{it.price}</TableCell>
                          <TableCell className="text-right tabular-nums">{it.qty} шт</TableCell>
                          <TableCell className="text-right font-medium tabular-nums">{it.sum} грн</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="mt-3 flex justify-end">
                  <div className="w-56 space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Проміжний підсумок</span>
                      <span className="tabular-nums">{itemsTotal} грн</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Разом</span>
                      <span className="tabular-nums">{itemsTotal} грн</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Всього позицій</span>
                      <span className="tabular-nums">{mockDocItems.length}</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          <Separator />
          <Field label="Коментар" value={'—'} />
        </div>

        <SheetFooter className="flex-row items-center justify-end gap-2 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрити
          </Button>
          <Button onClick={printDoc}>Друк</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
