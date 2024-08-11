interface IGetGenreListResponse {
  genreList: IGenreDTO[]
}

interface IGetMoviesByGenreResponse {
  movies: IMovieDTO[]
}

interface IGetUserMovieListsResponse {
  userLists: IListSummaryDTO[]
}

interface IGetCustomMovieListResponse {
  movies: IMovieDTO[]
  name: string
  id: number
}

interface IGetMovieCommentsResponse {
  comments: ICommentDTO[]
}

interface IPostCommentResponse {
  commentCreated: ICommentDTO
}

interface IRateMovieResponse {
  created: {
    id: number
    rating: number
    movieId: number
  }
}

interface IGetUserRatingByMovieIdResponse {
  rating: IRatingDTO
}

interface IGetUserProfileResponse {
  profile: IProfileDTO
}

interface ISignInResponse {
  token: string
}

interface IAddMovieToListResponse {
  listAdded: IListSummaryDTO
  movieAdded: number
}

interface IRemoveMovieFromListResponse {
  selectedList: IListSummaryDTO
  movieRemoved: number
}
