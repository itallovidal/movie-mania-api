export interface IGetGenresResponse {
  genres: {
    id: number
    name: string
  }[]
}

export interface IMovieResponse {
  adult: boolean
  backdrop_path: string | null
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: false
  vote_average: number
  vote_count: number
}

export interface IGetRandomMoviesResponse {
  page: number
  results: IMovieResponse[]
  total_pages: number
  total_results: number
}
