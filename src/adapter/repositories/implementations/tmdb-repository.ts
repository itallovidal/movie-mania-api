import { Injectable } from '@nestjs/common'
import { IMoviesRepository } from '../IMoviesRepository'
import { IGetGenresResponse } from '../../../domain/tmdb-responses'
import axios from 'axios'

@Injectable()
export class TMDBRepository implements IMoviesRepository {
  private movieDB = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0YzBiZTk2NDBhNDQ1ZDhjNDViMjUzZGEwZTEwODVkYyIsInN1YiI6IjY0ZmYwZDQzZmZjOWRlMGVlMTc2NDJlMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.JHIJ8OGscYlTUh4I3EF8j2ADR2lLr3TUcdD7ffqt67E',
    },
  })

  async getAllGenres(): Promise<IGetGenresResponse> {
    const { data } = await this.movieDB.get('/genre/movie/list', {
      params: {
        language: 'pt-BR',
      },
    })

    return data as IGetGenresResponse
  }
}
