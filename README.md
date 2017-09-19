# list-crawler

## install

```bash
yarn add list-crawler
```

## usage

```typescript
import {crawler} from 'list-crawler'
const src = {
  'sba': {
    url: 'https://www.sba.seoul.kr/kr/sbac01l1',
    selector: 'table'
  },
  'k-startup': {
    url: 'https://www.k-startup.go.kr/common/announcement/announcementList.do?mid=30004&bid=701',
    selector: '.listwrap ul',
    noHeader: true
  }
}
const result = await Promise.all(crawler(target))
console.log(JSON.stringify(result, null, 2))
```

## license

MIT
