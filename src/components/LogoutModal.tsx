import { useEffect, useRef } from 'react'
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
  const modalRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    dispatch(logout())
    onClose()
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={modalRef}
      className="absolute right-0 top-full z-50 mt-2 w-64 rounded-lg border border-white/30 bg-gradient-to-b from-black to-zinc-900  p-4 shadow-xl"
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
  )
}

export default LogoutModal

