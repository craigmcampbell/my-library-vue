export default interface GetSeriesDto {
  author: Author;
  authorId: string;
  id: string;
  name: string;
  numberOfBooks: number;
}

export interface Author {
  id: string;
  firstName: string;
  lastName: string;
}
