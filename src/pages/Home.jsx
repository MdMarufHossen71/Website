import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router-dom'
import { BlogSchema } from '../components/SchemaMarkup'

export default function Home() {
  const categories = [
    {
      slug: 'digital-marketing',
      name: 'Digital Marketing',
      description: 'Expert strategies and insights for successful digital marketing campaigns, SEO, social media, and online growth.',
      icon: '📱',
    },
    {
      slug: 'graphic-design',
      name: 'Graphic Design',
      description: 'Creative design tips, trends, and techniques for graphic designers and visual communicators.',
      icon: '🎨',
    },
    {
      slug: 'freelancing',
      name: 'Freelancing',
      description: 'Practical advice for freelancers on client management, pricing, productivity, and building a successful freelance career.',
      icon: '💼',
    },
  ]

  return (
    <>
      <Helmet>
        <title>MD Maruf Hossen - Digital Marketing, Design & Freelancing Blog</title>
        <meta
          name="description"
          content="Expert insights on digital marketing, graphic design, and freelancing. Learn proven strategies to grow your business and career."
        />
      </Helmet>
      <BlogSchema />

      <div className="hero">
        <div className="container">
          <h1 className="hero-title">Welcome to My Blog</h1>
          <p className="hero-subtitle">
            Expert insights on digital marketing, graphic design, and freelancing
          </p>
        </div>
      </div>

      <main className="container main-content">
        <section className="categories-grid">
          <h2 className="section-title">Explore Topics</h2>
          <div className="grid">
            {categories.map((category) => (
              <Link
                key={category.slug}
                to={`/blog/${category.slug}`}
                className="category-card"
              >
                <div className="category-icon">{category.icon}</div>
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <span className="read-more">View Articles →</span>
              </Link>
            ))}
          </div>
        </section>

        <section className="cta-section">
          <h2>Start Reading</h2>
          <p>Dive into articles that will help you grow your skills and business</p>
          <Link to="/blog" className="btn">
            View All Posts
          </Link>
        </section>
      </main>
    </>
  )
}
