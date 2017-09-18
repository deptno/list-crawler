import * as jsdom from 'jsdom'
import fetch from 'node-fetch'

const list = Array.from

interface CrawlerResult {
  name: string
  tables: Table[]
}
type Table = any[]
interface CrawlerArgs {
  [name: string]: {
    url: string
    tag: string
  }
}

export function crawler(target: CrawlerArgs): Promise<CrawlerResult>[] {
  return Object.entries(target)
    .map(async ([name, {url, tag}]) => {
      const response = await fetch(url)
      const text     = await response.text()
      const dom      = new jsdom.JSDOM(text)
      const tables   = list(dom.window.document.body.querySelectorAll(tag))
        .map(table =>
          list(table.getElementsByTagName(getSubTag(tag)))
            .map(tr => list(tr.children)
              .map(flatMapContent)
            )
        )

      return {
        name,
        tables
      }
    })
}

function getSubTag(query: string): string {
  const selectors = query.split(' ')
  const selector = selectors[selectors.length - 1]
  switch(selector) {
    case 'table':
      return 'tr'
    case 'ul':
    case 'ol':
      return 'li'
    default:
      throw new Error('unsupported type')
  }
}
function flatMapContent(element): string {
  if (element.childNodes.length > 0) {
    return list(element.childNodes)
      .map(flatMapContent)
      .filter(Boolean)
      .join(', ')
  }
  return extractText(element)
}
function extractText(element): string {
  if (element.nodeName === 'IMG') {
    return element.title || element.alt
  }
  return element.textContent.trim()
}