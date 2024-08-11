interface IGenreDTO {
  name: string
  id: number
}

interface IMovieDTO {
  release_date: string
  poster_path: string
  id: number
  title: string
  overview: string
  genres: {
    id: number
    name: string
  }[]
  backdrop_path: string
  rating: {
    average: number
    ratingsCount: number
  }
  lists: {
    id: number
  }[]
}

interface IListSummaryDTO {
  name: string
  id: number
}

interface ICommentDTO {
  id: number
  created_at: string
  comment: string
  user: {
    rating: number | null
    name: string
  }
}

interface IRatingDTO {
  id: number
  movieId: number
  rating: number | null
}

interface IProfileDTO {
  name: string
  favoriteGenres: string[]
}

interface IUserDTO {
  id: number
  email: string
}
