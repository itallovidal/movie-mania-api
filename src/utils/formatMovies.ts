import {
  IGetGenresResponse,
  IGetMoviesResponse,
} from '../domain/tmdb-responses'

export function formatMovies(
  genres: IGetGenresResponse['genres'],
  movies: IGetMoviesResponse,
): IMovieDTO[] {
  const formattedMovies = movies.results.map((movie) => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars, camelcase */
      genre_ids,
      vote_count,
      vote_average,
      popularity,
      video,
      original_title,
      adult,
      original_language,
      release_date,
      backdrop_path,
      ...rest
    } = movie

    return {
      lists: [],
      backdrop_path: backdrop_path || '',
      rating: {
        average: vote_average,
        ratingsCount: vote_count,
      },
      ...rest,
      release_date: release_date.split('-').reverse().join('/'),
      genres: genres.filter((gen) => movie.genre_ids.includes(gen.id)),
    }
  })

  return formattedMovies
}
