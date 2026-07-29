import { ApiError } from '@/shared/api/http-client'
import { useModal } from '@/shared/ui/modal'
import { useToast } from '@/shared/ui/toast'
import { useUserStore, userApi } from '@/entities/user'
import { DeductPointsForm } from './DeductPointsForm'

export const DeductPointsButton = () => {
  const { open, close } = useModal()
  const { notify } = useToast()
  const setUser = useUserStore((state) => state.setUser)

  const handleSubmit = async (amount: number) => {
    try {
      const user = await userApi.deductPoints({ amount })
      setUser(user)
      close()
      notify({ variant: 'success', message: `Deducted ${amount} pts` })
    } catch (err) {
      notify({
        variant: 'error',
        message: err instanceof ApiError ? err.message : 'Failed to deduct points',
      })
    }
  }

  const handleOpen = () => {
    open(<DeductPointsForm onSubmit={handleSubmit} onCancel={close} />)
  }

  return (
    <button
      type="button"
      onClick={handleOpen}
      aria-label="Deduct points"
      className="rounded-md border border-cream-100/40 px-2 py-1 text-xs font-medium text-cream-100 transition-colors hover:bg-brown-700"
    >
      −
    </button>
  )
}
