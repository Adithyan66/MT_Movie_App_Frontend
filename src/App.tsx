import MovieHeader from './components/MovieHeader'
import MovieContainer from './components/MovieContainer'
import { useApp } from './hooks/useApp'

function App() {
  const {
    movies,
    pagination,
    isSearching,
    hasSearched,
    error,
    searchMovies,
    fetchFavorites,
    handleFavorite,
    handlePageChange,
  } = useApp()

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-start bg-gradient-to-b from-black to-zinc-900 px-4 py-10">
      <MovieHeader onSearch={searchMovies} isSearching={isSearching} onShowFavorites={fetchFavorites} />
      <MovieContainer
        movies={movies}
        isLoading={isSearching}
        hasSearched={hasSearched}
        error={error}
        onFavorite={handleFavorite}
        pagination={pagination}
        onPageChange={handlePageChange}
      />
    </div>
  )
}

export default App