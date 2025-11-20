import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import type { PaginationInfo } from '../types/movie'

interface PaginationProps {
	pagination: PaginationInfo
	onPageChange: (page: number) => void
	isLoading?: boolean
}

const Pagination = ({ pagination, onPageChange, isLoading = false }: PaginationProps) => {
	const { page, totalPages } = pagination
	const isFirstPage = page === 1
	const isLastPage = page === totalPages

	const handlePrevious = () => {
		if (!isFirstPage && !isLoading) {
			onPageChange(page - 1)
		}
	}

	const handleNext = () => {
		if (!isLastPage && !isLoading) {
			onPageChange(page + 1)
		}
	}

	const handlePageClick = (targetPage: number) => {
		if (targetPage !== page && !isLoading) {
			onPageChange(targetPage)
		}
	}

	const getVisiblePages = () => {
		const delta = 2
		const range: number[] = []
		const rangeWithDots: (number | string)[] = []

		for (let i = Math.max(2, page - delta); i <= Math.min(totalPages - 1, page + delta); i++) {
			range.push(i)
		}

		if (page - delta > 2) {
			rangeWithDots.push(1, '...')
		} else {
			rangeWithDots.push(1)
		}

		rangeWithDots.push(...range)

		if (page + delta < totalPages - 1) {
			rangeWithDots.push('...', totalPages)
		} else if (totalPages > 1) {
			rangeWithDots.push(totalPages)
		}

		return rangeWithDots
	}

	if (totalPages <= 1) {
		return null
	}

	return (
		<div className="mt-6 flex w-full flex-wrap items-center justify-center gap-2 text-white sm:mt-8">
			<button
				type="button"
				onClick={handlePrevious}
				disabled={isFirstPage || isLoading}
				aria-label="Previous page"
				className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/20 disabled:hover:bg-white/5 sm:h-10 sm:w-10"
			>
				<FaChevronLeft className="text-xs sm:text-sm" />
			</button>

			<div className="flex flex-wrap items-center justify-center gap-1">
				{getVisiblePages().map((pageNum, index) => {
					if (pageNum === '...') {
						return (
							<span key={`ellipsis-${index}`} className="px-2 text-xs text-white/60 sm:text-sm">
								...
							</span>
						)
					}

					const pageNumber = pageNum as number
					const isActive = pageNumber === page

					return (
						<button
							key={pageNumber}
							type="button"
							onClick={() => handlePageClick(pageNumber)}
							disabled={isLoading}
							aria-label={`Go to page ${pageNumber}`}
							aria-current={isActive ? 'page' : undefined}
								className={`min-w-[36px] rounded-lg border px-2.5 py-1.5 text-xs font-medium transition sm:min-w-[40px] sm:px-3 sm:py-2 sm:text-sm ${
								isActive
									? 'border-white/60 bg-white/20 text-white'
									: 'border-white/20 bg-white/5 text-white/80 hover:border-white/40 hover:bg-white/10'
							} disabled:cursor-not-allowed disabled:opacity-50`}
						>
							{pageNumber}
						</button>
					)
				})}
			</div>

			<button
				type="button"
				onClick={handleNext}
				disabled={isLastPage || isLoading}
				aria-label="Next page"
				className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 bg-white/5 transition hover:border-white/40 hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/20 disabled:hover:bg-white/5 sm:h-10 sm:w-10"
			>
				<FaChevronRight className="text-xs sm:text-sm" />
			</button>
		</div>
	)
}

export default Pagination

