import { type FormEvent, useState } from 'react'
import { FaHeart, FaUser } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import { useAppSelector, useAppDispatch } from '../redux/hooks'
import { googleLogin, logout } from '../redux/slices/authSlice'

const MovieHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const user = useAppSelector((state) => state.auth.user)
  const dispatch = useAppDispatch()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!searchQuery.trim()) {
      return
    }
  }

  const googleLoginHandler = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        await dispatch(googleLogin(response.access_token)).unwrap()
      } catch (error) {
        console.error('Login failed:', error)
      }
    },
  })

  const handleGoogleLogin = () => {
    googleLoginHandler()
  }

  const handleLogout = () => {
    dispatch(logout())
    setShowModal(false)
  }

  return (
    <header className="w-full px-4 text-white">
      <div className="mx-auto flex w-full flex-col items-center gap-6  p-8 text-center ">
        <h1 className="text-4xl font-semibold tracking-tight">Movie Mania</h1>

        <form
          className="flex w-full max-w-2xl items-center justify-center gap-3"
          onSubmit={handleSubmit}
          noValidate
        >
          <input
            type="search"
            placeholder="Search for a movie"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            required
            className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 text-base text-white placeholder:text-white/60 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/30"
          />

          <button
            type="button"
            aria-label="Favourites"
            className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:border-white/60 hover:bg-white/20"
          >
            <FaHeart className="text-2xl text-pink-400" />
          </button>

          {user ? (
            <button
              type="button"
              aria-label="User Profile"
              onClick={() => setShowModal(true)}
              className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-white/30 bg-white/10 transition hover:border-white/60 hover:bg-white/20"
            >
              <img
                src={user.profilePic}
                alt={user.username}
                className="h-full w-full object-cover"
              />
            </button>
          ) : (
            <button
              type="button"
              aria-label="Login"
              onClick={handleGoogleLogin}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-white/10 transition hover:border-white/60 hover:bg-white/20"
            >
              <FaUser className="text-2xl text-white" />
            </button>
          )}
        </form>
      </div>

      {showModal && user && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="relative rounded-lg border border-white/30 bg-gray-900 p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-white/60 hover:text-white"
              aria-label="Close"
            >
              ×
            </button>
            <div className="flex flex-col items-center gap-4">
              <img
                src={user.profilePic}
                alt={user.username}
                className="h-20 w-20 rounded-full object-cover"
              />
              <h3 className="text-xl font-semibold text-white">{user.username}</h3>
              <p className="text-white/60">{user.email}</p>
              <button
                onClick={handleLogout}
                className="mt-4 rounded-lg bg-red-600 px-6 py-2 text-white transition hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default MovieHeader

