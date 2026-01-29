import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Breadcrumbs from '../components/Breadcrumbs'
import { CategorySchema } from '../components/SchemaMarkup'

export default function CategoryPage() {
  const { category: categorySlug } = useParams()
  const [posts, setPosts] = useState([])
  const [category, setCategory] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      const categoryResult = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug)
        .maybeSingle()

      if (categoryResult.data) {
        setCategory(categoryResult.data)

        const postsResult = await supabase
          .from('blog_posts')
          .select('*')
          .eq('category_id', categoryResult.data.id)
          .order('published_at', { ascending: false })

        if (postsResult.data) setPosts(postsResult.data)
      }

      setLoading(false)
    }

    fetchData()
  }, [categorySlug])

  if (loading) {
    return <div className="container main-content">Loading...</div>
  }

  if (!category) {
    return (
      <div className="container main-content">
        <h1>Category not found</h1>
        <Link to="/blog">Back to Blog</Link>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: category.name },
  ]

  return (
    <>
      <Helmet>
        <title>{category.name} - MD Maruf Hossen Blog</title>
        <meta name="description" content={category.description} />
      </Helmet>
      <CategorySchema category={category} posts={posts} />

      <div className="container main-content">
        <Breadcrumbs items={breadcrumbItems} />

        <div className="category-header">
          <h1 className="page-title">{category.name}</h1>
          <p className="category-description">{category.description}</p>
        </div>

        {posts.length === 0 ? (
          <p>No posts in this category yet.</p>
        ) : (
          <div className="posts-grid">
            {posts.map((post) => (
              <article key={post.id} className="post-card">
                <div className="post-meta">
                  <span className="post-category">{category.name}</span>
                  <time dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>
                <h2 className="post-title">
                  <Link to={`/blog/${categorySlug}/${post.slug}`}>
                    {post.title}
                  </Link>
                </h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <Link
                  to={`/blog/${categorySlug}/${post.slug}`}
                  className="read-more"
                >
                  Read More →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
