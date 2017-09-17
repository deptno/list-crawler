import * as jsdom from 'jsdom'
import fetch from 'node-fetch'

const list = Array.from

interface CrawlerResult {
  name: string
  tables: Table[]
}
type Table = any[]

export function crawler(target: object): Promise<CrawlerResult>[] {
  return Object.entries(target)
    .map(async ([name, url]) => {
      const response = await fetch(url)
      const text     = await response.text()
      const dom      = new jsdom.JSDOM(text)
      const tables   = list(dom.window.document.body.getElementsByTagName('table'))
        .map(table =>
          list(table.getElementsByTagName('tr'))
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