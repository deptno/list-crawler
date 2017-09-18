import {crawler} from '../src/index'

it('test', async (done) => {
  const target = {
    '창업가': {
      url: 'http://www.seoulstartuphub.com/sub/news/notice/list.do',
      selector: 'table'
    },
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
  expect(Array.isArray(result[0].tables[0])).toEqual(true)
  done()
})
