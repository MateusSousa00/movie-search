export function pluralize(count: number, singular: string, plural?: string): string {
  if (count === 1) {
    return singular;
  }
  return plural || `${singular}s`;
}

export function formatFavoriteCount(count: number): string {
  if (count === 0) {
    return 'No favorites yet';
  }
  return `You have ${count} favorite ${pluralize(count, 'movie')}`;
}
