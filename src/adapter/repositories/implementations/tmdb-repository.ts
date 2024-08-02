import { Injectable } from '@nestjs/common'
import { IMoviesRepository } from '../IMoviesRepository'
import {
  IGetGenresResponse,
  IGetMoviesResponse,
} from '../../../domain/tmdb-responses'
import axios from 'axios'
import { undefined } from 'zod'

@Injectable()
export class TMDBRepository implements IMoviesRepository {
  private movieDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzBiZTk2NDBhNDQ1ZDhjNDViMjUzZGEwZTEwODVkYyIsInN1YiI6IjY0ZmYwZDQzZmZjOWRlMGVlMTc2NDJlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JHIJ8OGscYlTUh4I3EF8j2ADR2lLr3TUcdD7ffqt67E',
    },
    params: {
      language: 'pt-BR',
    },
  })

  async getAllGenres(): Promise<IGetGenresResponse> {
    const { data } = await this.movieDB.get('/genre/movie/list')

    return data as IGetGenresResponse
  }

  async getRandomMovies(): Promise<IGetMoviesResponse> {
    const { data } = await this.movieDB.get('/discover/movie', {
      params: {
        page: 1,
        sort_by: 'popularity.desc',
        'vote_average.gte': 7,
        with_original_language: 'pt|en',
      },
    })

    return data as IGetMoviesResponse
  }

  async getRandomMoviesByGenre(id: number): Promise<IGetMoviesResponse> {
    const { data } = await this.movieDB.get('/discover/movie', {
      params: {
        page: 1,
        sort_by: 'popularity.desc',
        'vote_average.gte': 7,
        with_original_language: 'pt|en',
        with_genres: id,
      },
    })

    return data as IGetMoviesResponse
  }

  async searchMovie(title: string): Promise<IGetMoviesResponse> {
    const { data } = await this.movieDB.get('/search/movie', {
      params: {
        page: 1,
        sort_by: 'popularity.desc',
        with_original_language: 'pt|en',
        query: title,
      },
    })

    return data as IGetMoviesResponse
  }
}
