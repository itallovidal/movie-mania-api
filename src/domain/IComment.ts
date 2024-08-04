export interface IComment {
  userID: number
  comment: string
  id: number
  createdAt: string
  movieID: number
  user: {
    name: string
    email: string
    password: string
    favoriteGenre1: number
    favoriteGenre2: number
    id: number
  }
}
