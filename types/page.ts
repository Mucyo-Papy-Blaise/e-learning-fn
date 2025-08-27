export type Page = {
  id: string;
  title: string;
  content: string;
  resources?: { name: string; url: string }[];
  assignments?: { title: string }[];
};

export type Chapter = {
  id: string;
  title: string;
  pages: Page[];
  status: "completed" | "current" | "locked";
  prerequisites?: string[];
};