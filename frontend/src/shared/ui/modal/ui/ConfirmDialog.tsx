interface ConfirmDialogProps {
  title: string
  description?: string
  confirmLabel: string
  cancelLabel: string
  variant: 'default' | 'danger'
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmDialog = ({
  title,
  description,
  confirmLabel,
  cancelLabel,
  variant,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <div className="space-y-4 text-left">
    <h2 className="text-lg">{title}</h2>
    {description && <p className="text-sm text-brown-600">{description}</p>}
    <div className="flex justify-end gap-2">
      <button
        type="button"
        onClick={onCancel}
        className="rounded-md border border-brown-300 px-4 py-2 font-medium text-brown-700 transition-colors hover:bg-cream-200"
      >
        {cancelLabel}
      </button>
      <button
        type="button"
        onClick={onConfirm}
        className={`rounded-md px-4 py-2 font-medium text-cream-50 shadow-sm transition-colors ${
          variant === 'danger'
            ? 'bg-maroon-600 hover:bg-maroon-500'
            : 'bg-brown-600 hover:bg-brown-700'
        }`}
      >
        {confirmLabel}
      </button>
    </div>
  </div>
)
