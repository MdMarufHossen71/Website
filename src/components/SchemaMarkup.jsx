import { Helmet } from 'react-helmet-async'

export function ArticleSchema({ post, category }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.meta_description || post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author || 'MD Maruf Hossen',
    },
    publisher: {
      '@type': 'Person',
      name: 'MD Maruf Hossen',
    },
    datePublished: post.published_at,
    dateModified: post.updated_at || post.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${window.location.origin}/blog/${category.slug}/${post.slug}`,
    },
    articleSection: category.name,
    keywords: post.meta_keywords,
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function CategorySchema({ category, posts }) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `${window.location.origin}/blog/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${window.location.origin}/blog/${category.slug}/${post.slug}`,
        name: post.title,
      })),
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}

export function BlogSchema() {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: 'MD Maruf Hossen Blog',
    description: 'Expert insights on digital marketing, graphic design, and freelancing',
    url: `${window.location.origin}/blog`,
    author: {
      '@type': 'Person',
      name: 'MD Maruf Hossen',
    },
  }

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  )
}
