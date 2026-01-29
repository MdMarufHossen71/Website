import { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Breadcrumbs from '../components/Breadcrumbs'
import { ArticleSchema } from '../components/SchemaMarkup'

export default function BlogPost() {
  const { category: categorySlug, slug: postSlug } = useParams()
  const [post, setPost] = useState(null)
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

        const postResult = await supabase
          .from('blog_posts')
          .select('*')
          .eq('slug', postSlug)
          .eq('category_id', categoryResult.data.id)
          .maybeSingle()

        if (postResult.data) setPost(postResult.data)
      }

      setLoading(false)
    }

    fetchData()
  }, [categorySlug, postSlug])

  if (loading) {
    return <div className="container main-content">Loading...</div>
  }

  if (!post || !category) {
    return (
      <div className="container main-content">
        <h1>Post not found</h1>
        <Link to="/blog">Back to Blog</Link>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Blog', href: '/blog' },
    { label: category.name, href: `/blog/${categorySlug}` },
    { label: post.title },
  ]

  return (
    <>
      <Helmet>
        <title>{post.title} - MD Maruf Hossen</title>
        <meta
          name="description"
          content={post.meta_description || post.excerpt}
        />
        {post.meta_keywords && (
          <meta name="keywords" content={post.meta_keywords} />
        )}
      </Helmet>
      <ArticleSchema post={post} category={category} />

      <article className="container main-content">
        <Breadcrumbs items={breadcrumbItems} />

        <header className="post-header">
          <Link to={`/blog/${categorySlug}`} className="post-category-link">
            {category.name}
          </Link>
          <h1 className="post-title-main">{post.title}</h1>
          <div className="post-meta-main">
            <span className="author">By {post.author}</span>
            <time dateTime={post.published_at}>
              {new Date(post.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
          </div>
        </header>

        <div className="post-content">
          {post.content.split('\n').map((paragraph, index) => {
            if (paragraph.startsWith('# ')) {
              return <h1 key={index}>{paragraph.substring(2)}</h1>
            } else if (paragraph.startsWith('## ')) {
              return <h2 key={index}>{paragraph.substring(3)}</h2>
            } else if (paragraph.startsWith('### ')) {
              return <h3 key={index}>{paragraph.substring(4)}</h3>
            } else if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
              return <p key={index}><strong>{paragraph.slice(2, -2)}</strong></p>
            } else if (paragraph.trim() === '') {
              return <br key={index} />
            } else {
              return <p key={index}>{paragraph}</p>
            }
          })}
        </div>

        <footer className="post-footer">
          <Link to={`/blog/${categorySlug}`} className="btn">
            ← Back to {category.name}
          </Link>
        </footer>
      </article>
    </>
  )
}
