import {
  IGetGenresResponse,
  IGetRandomMoviesResponse,
} from '../domain/tmdb-responses'

export function formatMovies(
  genres: IGetGenresResponse['genres'],
  movies: IGetRandomMoviesResponse,
) {
  const formattedMovies = movies.results.map((movie) => {
    const {
      /* eslint-disable @typescript-eslint/no-unused-vars, camelcase */
      genre_ids,
      vote_count,
      popularity,
      video,
      original_title,
      adult,
      original_language,
      release_date,
      ...rest
    } = movie

    return {
      ...rest,
      release_date: release_date.split('-').reverse().join('/'),
      genres: genres.filter((gen) => movie.genre_ids.includes(gen.id)),
    }
  })

  return formattedMovies
}
