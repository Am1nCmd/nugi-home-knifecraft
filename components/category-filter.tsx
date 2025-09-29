"use client"

type Props = {
  categories: string[]
  value: string
  onChange: (val: string) => void
}

export function CategoryFilter({ categories, value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="kategori" className="text-sm text-muted-foreground">
        Kategori
      </label>
      <select
        id="kategori"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="inline-flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring"
        aria-label="Filter kategori produk"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>
    </div>
  )
}
