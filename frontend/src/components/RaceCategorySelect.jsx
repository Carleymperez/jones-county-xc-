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
      <label className="text-sm font-medium text-blue-200 whitespace-nowrap">
        Race Category
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-48 bg-blue-900 border-blue-700 text-white">
          <SelectValue placeholder="Select a category" />
        </SelectTrigger>
        <SelectContent className="bg-blue-900 border-blue-700 text-white">
          {CATEGORIES.map(cat => (
            <SelectItem key={cat.value} value={cat.value} className="text-white focus:bg-blue-700 focus:text-white">
              {cat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default RaceCategorySelect
