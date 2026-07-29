import { useState } from 'react'
import type { ChangeEvent } from 'react'

const PRESET_AMOUNTS = [5, 10, 20]

interface DeductPointsFormProps {
  onSubmit: (amount: number) => Promise<void>
  onCancel: () => void
}

export const DeductPointsForm = ({ onSubmit, onCancel }: DeductPointsFormProps) => {
  const [amount, setAmount] = useState('')
  const [pending, setPending] = useState(false)
  const parsedAmount = Number(amount)
  const isValid = amount !== '' && Number.isInteger(parsedAmount) && parsedAmount > 0

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setAmount(event.target.value)
  }

  const handleConfirm = async () => {
    if (!isValid) {
      return
    }
    setPending(true)
    try {
      await onSubmit(parsedAmount)
    } finally {
      setPending(false)
    }
  }

  return (
    <div className="space-y-4 text-left">
      <h2 className="text-lg">Deduct points</h2>

      <div className="flex gap-2">
        {PRESET_AMOUNTS.map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => setAmount(String(preset))}
            className="rounded-md border border-brown-300/60 px-3 py-1 text-sm font-medium text-brown-700 transition-colors hover:bg-cream-200"
          >
            {preset}
          </button>
        ))}
      </div>

      <input
        type="number"
        min={1}
        step={1}
        value={amount}
        onChange={handleChange}
        placeholder="Amount"
        className="w-full rounded-md border border-brown-300/60 bg-cream-50 px-3 py-2 text-brown-900 outline-none transition-colors placeholder:text-brown-300 focus:border-brown-500"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-md border border-brown-300 px-4 py-2 font-medium text-brown-700 transition-colors hover:bg-cream-200"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!isValid || pending}
          onClick={handleConfirm}
          className="rounded-md bg-maroon-600 px-4 py-2 font-medium text-cream-50 shadow-sm transition-colors hover:bg-maroon-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {pending ? 'Deducting…' : 'Confirm'}
        </button>
      </div>
    </div>
  )
}
