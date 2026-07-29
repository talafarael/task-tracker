import { useUserStore } from '@/entities/user'
import { AuthStatus } from '@/widgets/auth-status'
import { GuestGate } from '@/widgets/guest-gate'
import { TaskBoard } from '@/widgets/task-board'

export const HomePage = () => {
  const status = useUserStore((state) => state.status)

  if (status === 'idle' || status === 'loading') {
    return null
  }

  if (status === 'guest') {
    return <GuestGate />
  }

  return (
    <>
      <AuthStatus />
      <TaskBoard />
    </>
  )
}
