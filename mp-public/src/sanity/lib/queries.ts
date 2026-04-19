export const newsQuery = `*[_type == "news"] | order(date desc) [0...3] {
  title,
  "slug": slug.current,
  date,
  category,
  image {
    asset->{
      url
    }
  },
  content
}`;

export const galleryQuery = `*[_type == "gallery"] | order(_createdAt desc) {
  title,
  category,
  image {
    asset->{
      url
    }
  }
}`;

export const facultyQuery = `*[_type == "faculty"] | order(order asc) {
  name,
  role,
  qualification,
  image {
    asset->{
      url
    }
  }
}`;
