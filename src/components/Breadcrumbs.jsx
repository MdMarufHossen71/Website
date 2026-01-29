import { Link } from 'react-router-dom'

export default function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <ol itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li
            key={index}
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {item.href ? (
              <>
                <Link to={item.href} itemProp="item">
                  <span itemProp="name">{item.label}</span>
                </Link>
                <meta itemProp="position" content={index + 1} />
              </>
            ) : (
              <>
                <span itemProp="name" aria-current="page">{item.label}</span>
                <meta itemProp="position" content={index + 1} />
              </>
            )}
            {index < items.length - 1 && <span className="separator"> / </span>}
          </li>
        ))}
      </ol>
    </nav>
  )
}
