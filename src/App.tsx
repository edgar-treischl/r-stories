import { useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { stories } from "./stories"

function App() {
  const location = useLocation()
  const navigate = useNavigate()

  const path = location.pathname.replace(/^\/|\/$/g, "")

  const story = stories.find(
    (item) =>
      path === item.id ||
      path.startsWith(`${item.id}/`),
  )

  const variantId = story
    ? path.slice(story.id.length + 1)
    : ""

  const variant = story
    ? story.variants.find(
        (item) => item.id === variantId,
      ) ?? story.variants[0]
    : undefined

  useEffect(() => {
    if (!story || !variant) {
      const firstStory = stories[0]

      if (firstStory) {
        navigate(
          `/${firstStory.id}/${firstStory.variants[0].id}`,
          { replace: true },
        )
      }

      return
    }

    const expectedPath = `/${story.id}/${variant.id}`

    if (location.pathname !== expectedPath) {
      navigate(expectedPath, { replace: true })
    }
  }, [story, variant, location.pathname, navigate])

  if (!story || !variant) {
    return null
  }

  const categories = [
    ...new Set(stories.map((item) => item.category)),
  ]

  function selectStory(id: string) {
    const nextStory = stories.find(
      (item) => item.id === id,
    )

    if (!nextStory) return

    navigate(
      `/${nextStory.id}/${nextStory.variants[0].id}`,
    )
  }

  function selectVariant(id: string) {
    navigate(`/${story.id}/${id}`)
  }

  function copyCode() {
    navigator.clipboard.writeText(variant.code)
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">R</div>

          <div>
            <strong>R Stories</strong>
            <span>Visualization examples</span>
          </div>
        </div>

        <nav>
          {categories.map((category) => (
            <div
              key={category}
              className="category"
            >
              <div className="category-title">
                {category}
              </div>

              {stories
                .filter(
                  (item) =>
                    item.category === category,
                )
                .map((item) => (
                  <button
                    key={item.id}
                    className={
                      item.id === story.id
                        ? "story active"
                        : "story"
                    }
                    onClick={() =>
                      selectStory(item.id)
                    }
                  >
                    {item.title}
                  </button>
                ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="content">
        <header>
          <div className="breadcrumb">
            {story.category} / {story.title}
          </div>

          <h1>{story.title}</h1>

          {story.description && (
            <p>{story.description}</p>
          )}
        </header>

        <div className="variants">
          {story.variants.map((item) => (
            <button
              key={item.id}
              className={
                item.id === variant.id
                  ? "variant active"
                  : "variant"
              }
              onClick={() =>
                selectVariant(item.id)
              }
            >
              {item.title}
            </button>
          ))}
        </div>

        {variant.description && (
          <p className="variant-description">
            {variant.description}
          </p>
        )}

        <section className="preview">
          <img
            src={variant.image}
            alt={variant.title}
          />
        </section>

        <section className="code-section">
          <div className="section-header">
            <h2>R</h2>

            <button onClick={copyCode}>
              Copy
            </button>
          </div>

          <pre>
            <code>{variant.code}</code>
          </pre>
        </section>
      </main>
    </div>
  )
}

export default App
