export interface PostAttributes {
  date: string; // ISO8601
  author: string;
  title: string;
  tags: string[];
  type?: "blog" | "static";
}

export interface Post extends PostAttributes {
  body: string;
  slug: string;
}
