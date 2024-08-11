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
  listID: number
  movieID: number
}

interface IComment {
  userID: number
  comment: string
  id: number
  createdAt: Date
  movieID: number
}
