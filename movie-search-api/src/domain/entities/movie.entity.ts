export class Movie {
  constructor(
    public readonly imdbID: string,
    public readonly Title: string,
    public readonly Year: string,
    public readonly Poster: string,
  ) {}
}

export class Favorite {
  constructor(
    public readonly id: string,
    public readonly imdbID: string,
    public readonly Title: string,
    public readonly Year: string,
    public readonly Poster: string,
    public readonly addedAt: Date,
  ) {}
}
