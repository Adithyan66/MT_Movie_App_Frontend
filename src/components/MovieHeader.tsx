import { type FormEvent, useState } from 'react'
import { FaHeart } from 'react-icons/fa'

const MovieHeader = () => {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!searchQuery.trim()) {
      return
    }
    // Placeholder for upcoming search integration
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
        </form>
      </div>
    </header>
  )
}

export default MovieHeader

