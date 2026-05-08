export const pub = (path: string) =>
  import.meta.env.BASE_URL + path.replace(/^\//, '');
