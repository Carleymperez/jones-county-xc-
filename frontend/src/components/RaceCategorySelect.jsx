import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const CATEGORIES = [
  { value: 'varsity-boys',  label: 'Varsity Boys' },
  { value: 'varsity-girls', label: 'Varsity Girls' },
  { value: 'jv-boys',       label: 'JV Boys' },
  { value: 'jv-girls',      label: 'JV Girls' },
  { value: '5k',            label: '5K Open' },
]

function RaceCategorySelect({ value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-600 whitespace-nowrap">
        Race Category
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48 bg-white border border-gray-300 text-gray-900">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent>
          {CATEGORIES.map(cat => (
            <SelectItem key={cat.value} value={cat.value}>
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default RaceCategorySelect
