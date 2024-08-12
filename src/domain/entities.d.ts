interface IUser {
  name: string
  email: string
  password: string
  favoriteGenre1: number
  favoriteGenre2: number
  id: number
}

interface IList {
  id: number
  name: string
  userId: number
}

interface IUserList {
  id: number
  userId: number
  listId: number
  movieId: number
  list: IList
}

interface IComment {
  userID: number
  comment: string
  id: number
  createdAt: Date
  movieID: number
  user: {
    name: string
    favoriteGenre1: number
    favoriteGenre2: number
    id: number
  }
}
