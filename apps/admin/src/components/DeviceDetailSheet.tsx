import { useEffect, useState, type ReactNode } from 'react';
import { Plus, Trash2, Image as ImageIcon, FileText } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  Input,
  Textarea,
  Label,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Badge,
  Button,
  Separator,
  cn,
  toast,
} from '@dito/ui';
import {
  deviceCatalog,
  deviceGroups,
  deviceStates,
  deviceTypes,
  deviceTitle,
  type Device,
  type DeviceOwner,
} from '../data/devices';
import { products } from '../data/products';
import { useDevices } from '../stores/devices';

const warehouses = [...new Set(products.map((p) => p.warehouse))];

function blankDevice(): Device {
  return {
    id: '',
    uid: '',
    type: deviceTypes[0],
    group: '',
    brand: '',
    model: '',
    modification: '',
    color: '',
    state: deviceStates[0],
    description: '',
    owner: 'client',
    clientName: '',
    clientPhone: '',
    warehouse: warehouses[0],
    docs: [],
    status: 'active',
  };
}

function generateImei() {
  let code = '';
  for (let i = 0; i < 15; i++) code += Math.floor(Math.random() * 10);
  return code;
}

function Field({ label, required, children }: { label: string; required?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

function OwnerSwitch({ value, onChange }: { value: DeviceOwner; onChange: (v: DeviceOwner) => void }) {
  const options: { value: DeviceOwner; label: string }[] = [
    { value: 'company', label: 'Ми' },
    { value: 'client', label: 'Клієнт' },
  ];
  return (
    <div className="inline-flex rounded-lg border p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            'rounded-md px-4 py-1 text-sm transition-colors',
            value === o.value ? 'bg-muted font-medium' : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function DeviceDetailSheet({
  device,
  mode = 'edit',
  open,
  onOpenChange,
}: {
  device: Device | null;
  mode?: 'edit' | 'create';
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addDevice, updateDevice, removeDevice } = useDevices();
  const isCreate = mode === 'create';
  const [form, setForm] = useState<Device>(() => device ?? blankDevice());

  useEffect(() => {
    setForm(isCreate ? blankDevice() : (device ?? blankDevice()));
  }, [device?.id, isCreate, open]);

  if (!isCreate && !device) return null;

  const set = (patch: Partial<Device>) => setForm((f) => ({ ...f, ...patch }));

  const brands = form.group ? Object.keys(deviceCatalog[form.group] ?? {}) : [];
  const models = form.group && form.brand ? (deviceCatalog[form.group]?.[form.brand] ?? []) : [];

  function save() {
    if (!form.uid.trim()) {
      toast.error('Вкажіть IMEI або серійний номер');
      return;
    }
    if (!form.group || !form.brand || !form.model) {
      toast.error('Вкажіть групу, бренд і модель');
      return;
    }
    if (form.owner === 'client' && !form.clientName.trim()) {
      toast.error('Вкажіть клієнта');
      return;
    }

    const patch = { ...form, uid: form.uid.trim(), clientName: form.clientName.trim() };
    if (isCreate) {
      const { id: _id, ...rest } = patch;
      addDevice(rest);
      toast.success('Пристрій створено', { description: deviceTitle(patch) });
    } else {
      updateDevice(form.id, patch);
      toast.success('Зміни збережено', { description: deviceTitle(patch) });
    }
    onOpenChange(false);
  }

  function del() {
    removeDevice(form.id);
    toast('Пристрій видалено', { description: deviceTitle(form) });
    onOpenChange(false);
  }

  const title = deviceTitle(form) || (isCreate ? 'Новий пристрій' : '—');

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 p-0 sm:max-w-2xl">
        <SheetHeader className="border-b">
          <SheetTitle className="pr-6 text-lg">{title}</SheetTitle>
          <SheetDescription className="font-mono">{form.uid || '—'}</SheetDescription>
        </SheetHeader>

        <div className="min-h-0 flex-1 overflow-y-auto p-4">
          <div className="grid gap-6 sm:grid-cols-[160px_1fr]">
            <div className="space-y-3">
              <div className="flex aspect-square items-center justify-center rounded-xl border bg-muted/40">
                <ImageIcon className="size-9 text-muted-foreground/40" />
              </div>
              <button
                type="button"
                className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border border-dashed px-2 py-3 text-center text-muted-foreground transition-colors hover:bg-muted"
              >
                <Plus className="size-5" />
                <span className="text-[11px] leading-tight">Перетягніть файли або натисніть, щоб вибрати</span>
                <span className="text-[10px] text-muted-foreground/70">JPG, PNG до 25 МБ</span>
              </button>
            </div>

            <div className="space-y-4">
              <Field label="Власник" required>
                <OwnerSwitch
                  value={form.owner}
                  onChange={(v) => set({ owner: v, ...(v === 'company' ? { clientName: '', clientPhone: '' } : {}) })}
                />
              </Field>

              {form.owner === 'client' ? (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Клієнт" required>
                    <Input
                      value={form.clientName}
                      onChange={(e) => set({ clientName: e.target.value })}
                      placeholder="Ім’я, телефон або номер картки"
                    />
                  </Field>
                  <Field label="Телефон">
                    <Input
                      value={form.clientPhone}
                      onChange={(e) => set({ clientPhone: e.target.value })}
                      placeholder="+380 (__) ___ __ __"
                    />
                  </Field>
                </div>
              ) : (
                <Field label="Склад" required>
                  <Select value={form.warehouse} onValueChange={(v) => set({ warehouse: v })}>
                    <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {warehouses.map((w) => (
                        <SelectItem key={w} value={w}>
                          {w}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              )}

              <Field label="Тип" required>
                <Select value={form.type} onValueChange={(v) => set({ type: v })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {deviceTypes.map((tp) => (
                      <SelectItem key={tp} value={tp}>
                        {tp}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="IMEI / серійний номер" required>
                <div className="flex gap-2">
                  <Input value={form.uid} onChange={(e) => set({ uid: e.target.value })} className="font-mono" />
                  <Button type="button" variant="outline" className="shrink-0" onClick={() => set({ uid: generateImei() })}>
                    Згенерувати
                  </Button>
                </div>
              </Field>

              <Field label="Група" required>
                <Select value={form.group} onValueChange={(v) => set({ group: v, brand: '', model: '' })}>
                  <SelectTrigger className="w-full"><SelectValue placeholder="Не задано" /></SelectTrigger>
                  <SelectContent>
                    {deviceGroups.map((g) => (
                      <SelectItem key={g} value={g}>
                        {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Бренд" required>
                  <Select value={form.brand} onValueChange={(v) => set({ brand: v, model: '' })} disabled={!form.group}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Оберіть групу" /></SelectTrigger>
                    <SelectContent>
                      {brands.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
                <Field label="Модель" required>
                  <Select value={form.model} onValueChange={(v) => set({ model: v })} disabled={!form.brand}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="Оберіть бренд" /></SelectTrigger>
                    <SelectContent>
                      {models.map((m) => (
                        <SelectItem key={m} value={m}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Модифікація">
                  <Input value={form.modification} onChange={(e) => set({ modification: e.target.value })} />
                </Field>
                <Field label="Колір">
                  <Input value={form.color} onChange={(e) => set({ color: e.target.value })} />
                </Field>
              </div>

              <Field label="Стан">
                <Select value={form.state} onValueChange={(v) => set({ state: v })}>
                  <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {deviceStates.map((st) => (
                      <SelectItem key={st} value={st}>
                        {st}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field label="Опис">
                <Textarea rows={3} value={form.description} onChange={(e) => set({ description: e.target.value })} />
              </Field>

              {!isCreate && (
                <>
                  <Separator />
                  <div>
                    <div className="mb-2 text-sm font-semibold">Документи</div>
                    {form.docs.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {form.docs.map((d) => (
                          <Badge key={d} variant="secondary" className="gap-1">
                            <FileText className="size-3.5" />
                            {d}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Пов’язаних документів немає.</p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <SheetFooter className="flex-row items-center justify-between border-t">
          <Button onClick={save}>{isCreate ? 'Створити' : 'Зберегти'}</Button>
          {!isCreate && (
            <Button variant="destructive" size="icon" aria-label="Видалити" onClick={del}>
              <Trash2 className="size-4" />
            </Button>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
