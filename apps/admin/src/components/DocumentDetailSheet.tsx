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
          <Button onClick={() => toast('Друк документа — скоро', { description: title })}>Друк</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
