import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface FamilyVersionSelectProps {
  versions: { version: number }[];
  currentVersion: number;
  value: number;
  onChange: (version: number) => void;
}

export function FamilyVersionSelect({
  versions,
  currentVersion,
  value,
  onChange,
}: FamilyVersionSelectProps) {
  const sorted = [...versions].sort((a, b) => b.version - a.version);

  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {sorted.map((v) => (
          <SelectItem key={v.version} value={String(v.version)}>
            Versão {v.version}
            {v.version === currentVersion ? ' (atual)' : ''}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
