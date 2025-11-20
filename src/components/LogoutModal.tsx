import { createPortal } from 'react-dom'
import { type AuthUser } from '../redux/slices/authSlice'
import { useAppDispatch } from '../redux/hooks'
import { logout } from '../redux/slices/authSlice'

interface LogoutModalProps {
  user: AuthUser
  isOpen: boolean
  onClose: () => void
}

const LogoutModal = ({ user, isOpen, onClose }: LogoutModalProps) => {
  const dispatch = useAppDispatch()

  const handleLogout = () => {
    dispatch(logout())
    onClose()
  }

  if (!isOpen) return null

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 px-4 pt-24 sm:px-8 sm:pt-28"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xs rounded-2xl border border-white/30 bg-gradient-to-b from-black to-zinc-900 p-5 shadow-[0_30px_100px_rgba(0,0,0,0.8)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-col items-center gap-3">
          <img
            src={user.profilePic}
            alt={user.username}
            className="h-16 w-16 rounded-full object-cover"
          />
          <h3 className="text-lg font-semibold text-white">{user.username}</h3>
          <p className="text-sm text-white/60">{user.email}</p>
          <button
            onClick={handleLogout}
            className="mt-2 w-full rounded-lg bg-red-600 px-4 py-2 text-white transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}

export default LogoutModal

