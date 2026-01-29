import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Breadcrumbs from '../components/Breadcrumbs'
import { BlogSchema } from '../components/SchemaMarkup'

export default function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const [postsResult, categoriesResult] = await Promise.all([
        supabase
          .from('blog_posts')
          .select('*, categories(slug, name)')
          .order('published_at', { ascending: false }),
        supabase
          .from('categories')
          .select('*')
          .order('name'),
      ])

      if (postsResult.data) setPosts(postsResult.data)
      if (categoriesResult.data) setCategories(categoriesResult.data)
      setLoading(false)
    }

    fetchData()
  }, [])

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog' },
  ]

  if (loading) {
    return <div className="container main-content">Loading...</div>
  }

  return (
    <>
      <Helmet>
        <title>Blog - MD Maruf Hossen</title>
        <meta
          name="description"
          content="All articles on digital marketing, graphic design, and freelancing. Expert insights to help you grow."
        />
      </Helmet>
      <BlogSchema />

      <div className="container main-content">
        <Breadcrumbs items={breadcrumbItems} />

        <h1 className="page-title">All Blog Posts</h1>

        <div className="category-filter">
          <Link to="/blog" className="filter-btn active">
            All Posts
          </Link>
          {categories.map((category) => (
            <Link
              key={category.slug}
              to={`/blog/${category.slug}`}
              className="filter-btn"
            >
              {category.name}
            </Link>
          ))}
        </div>

        <div className="posts-grid">
          {posts.map((post) => (
            <article key={post.id} className="post-card">
              <div className="post-meta">
                <Link
                  to={`/blog/${post.categories.slug}`}
                  className="post-category"
                >
                  {post.categories.name}
                </Link>
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </div>
              <h2 className="post-title">
                <Link to={`/blog/${post.categories.slug}/${post.slug}`}>
                  {post.title}
                </Link>
              </h2>
              <p className="post-excerpt">{post.excerpt}</p>
              <Link
                to={`/blog/${post.categories.slug}/${post.slug}`}
                className="read-more"
              >
                Read More →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </>
  )
}
