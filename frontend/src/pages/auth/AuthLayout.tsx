import { Outlet } from 'react-router-dom'

export const AuthLayout = () => (
  <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
    <div className="w-full max-w-sm rounded-lg border border-brown-300/40 bg-cream-50 p-8 shadow-sm">
      <Outlet />
    </div>
  </div>
)
