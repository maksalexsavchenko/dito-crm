import { useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { Plus, Image as ImageIcon, Archive } from 'lucide-react';
import { DataTable, SortableHeader, Checkbox, Badge, Button, cn, toast } from '@dito/ui';
import {
  deviceLocation,
  deviceTitle,
  deviceTypes,
  type Device,
} from '../data/devices';
import { products } from '../data/products';
import { useDevices } from '../stores/devices';
import { FilterSelect } from './FilterSelect';
import { DeviceDetailSheet } from './DeviceDetailSheet';

const warehouses = [...new Set(products.map((p) => p.warehouse))];

export function DevicesSection() {
  const devices = useDevices((s) => s.devices);
  const writeOff = useDevices((s) => s.writeOff);

  const [selected, setSelected] = useState<Device | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [createMode, setCreateMode] = useState(false);

  const [owner, setOwner] = useState('all');
  const [wh, setWh] = useState('all');
  const [type, setType] = useState('all');
  // RoApp за замовчуванням показує лише активні пристрої.
  const [availability, setAvailability] = useState('active');

  const openDetail = (d: Device) => {
    setSelected(d);
    setCreateMode(false);
    setDetailOpen(true);
  };
  const openCreate = () => {
    setSelected(null);
    setCreateMode(true);
    setDetailOpen(true);
  };

  const filtered = useMemo(
    () =>
      devices.filter(
        (d) =>
          (owner === 'all' || d.owner === owner) &&
          (wh === 'all' || d.warehouse === wh) &&
          (type === 'all' || d.type === type) &&
          (availability === 'all' || d.status === availability),
      ),
    [devices, owner, wh, type, availability],
  );

  const columns: ColumnDef<Device>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'uid',
      header: () => 'IMEI',
      cell: ({ row }) => <span className="font-mono text-xs text-muted-foreground">{row.original.uid}</span>,
    },
    {
      id: 'image',
      header: () => 'Фото',
      enableSorting: false,
      cell: () => (
        <div className="flex size-9 items-center justify-center rounded-md border bg-muted/40">
          <ImageIcon className="size-4 text-muted-foreground/40" />
        </div>
      ),
    },
    {
      id: 'name',
      accessorFn: (d) => `${deviceTitle(d)} ${d.uid} ${d.clientName}`,
      header: ({ column }) => <SortableHeader column={column}>Найменування</SortableHeader>,
      cell: ({ row }) => (
        <div className="min-w-[180px]">
          <div className="font-medium">{deviceTitle(row.original)}</div>
          {row.original.modification && (
            <div className="text-xs text-muted-foreground">{row.original.modification}</div>
          )}
        </div>
      ),
    },
    {
      id: 'owner',
      header: () => 'Власник',
      cell: ({ row }) =>
        row.original.owner === 'client' ? (
          <div>
            <div className="text-primary">{row.original.clientName}</div>
            <div className="text-xs text-muted-foreground">{row.original.clientPhone}</div>
          </div>
        ) : (
          <span className="text-muted-foreground">Компанія</span>
        ),
    },
    {
      id: 'warehouse',
      header: () => 'Склад',
      cell: ({ row }) => <span className="text-muted-foreground">{deviceLocation(row.original)}</span>,
    },
    {
      id: 'docs',
      header: () => 'Документи',
      enableSorting: false,
      cell: ({ row }) =>
        row.original.docs.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {row.original.docs.map((d) => (
              <Badge key={d} variant="outline" className="font-mono text-[11px]">
                {d}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      accessorKey: 'status',
      header: () => 'Статус',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn(
            'border-transparent',
            row.original.status === 'active' ? 'bg-success/15 text-success' : 'bg-muted text-muted-foreground',
          )}
        >
          {row.original.status === 'active' ? 'Активний' : 'Списаний'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <p className="max-w-2xl text-sm text-muted-foreground">
          Створюйте вироби, що належать вашим клієнтам або компанії, щоб відстежувати їх рух, обслуговування та
          місцезнаходження.
        </p>
        <Button className="shrink-0" onClick={openCreate}>
          <Plus className="size-4" />
          Пристрій
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        onRowClick={openDetail}
        searchColumn="name"
        searchPlaceholder="Пошук за назвою або IMEI…"
        toolbar={
          <>
            <FilterSelect
              label="Власник"
              value={owner}
              onValueChange={setOwner}
              options={[
                { value: 'all', label: 'Всі' },
                { value: 'company', label: 'Ми' },
                { value: 'client', label: 'Клієнти' },
              ]}
            />
            <FilterSelect
              label="Склад"
              value={wh}
              onValueChange={setWh}
              options={[{ value: 'all', label: 'Всі' }, ...warehouses.map((w) => ({ value: w, label: w }))]}
            />
            <FilterSelect
              label="Тип"
              value={type}
              onValueChange={setType}
              options={[{ value: 'all', label: 'Всі' }, ...deviceTypes.map((tp) => ({ value: tp, label: tp }))]}
            />
            <FilterSelect
              label="Доступність"
              value={availability}
              onValueChange={setAvailability}
              options={[
                { value: 'all', label: 'Всі' },
                { value: 'active', label: 'Активні' },
                { value: 'written_off', label: 'Списані' },
              ]}
            />
          </>
        }
        labels={{ columns: 'Колонки', empty: 'Нічого не знайдено', selected: 'Вибрано', page: 'Стор.', of: 'з' }}
        bulkActions={(rows) => (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              writeOff(rows.map((r) => r.id));
              toast.success('Пристрої списано', { description: `${rows.length} шт.` });
            }}
          >
            <Archive className="size-4" />
            Списати
          </Button>
        )}
      />

      <div className="flex justify-end text-sm text-muted-foreground">Всього — {filtered.length}</div>

      <DeviceDetailSheet
        device={selected}
        mode={createMode ? 'create' : 'edit'}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </div>
  );
}
