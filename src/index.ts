import * as jsdom from 'jsdom'
import fetch from 'node-fetch'

const list = Array.from

export interface CrawlerResult {
  name: string
  url: string
  tables: Table[]
}
export interface Table extends Array<Row> {}
export interface Row {
  제목: string
}

export interface CrawlerArgs {
  [name: string]: {
    url: string
    selector: string
    noHeader?: boolean
  }
}

export function crawler(target: CrawlerArgs): Promise<CrawlerResult>[] {
  return Object.entries(target)
    .map(async ([name, {url, selector, noHeader}]) => {
      const response = await fetch(url)
      const text     = await response.text()
      const dom      = new jsdom.JSDOM(text)
      const tables   = list(dom.window.document.body.querySelectorAll(selector))
        .map(table =>
          list(table.getElementsByTagName(getSubTag(selector)))
            .map(tr => list(tr.children)
              .map(flatMapContent)
            )
            .filter(column => column.length > 0)
            .map((columns, index, array) => {
              return noHeader
                ? {
                  '제목': columns[0]
                }
                : array[0]
                  .reduce((ret, header, index) => {
                    ret[header] = columns[index]
                    return ret
                  }, {} as Row)
            })
            .slice(noHeader ? 0 : 1)
        )
        .filter(columns => columns.length > 0)
        .filter((_, index) => !noHeader || index > 0)

      return {
        name,
        url,
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
