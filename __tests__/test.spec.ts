import {crawler} from '../src/index'

it('test', async (done) => {
  const target = {
    '창업가': {
      url: 'http://www.seoulstartuphub.com/sub/news/notice/list.do',
      tag: 'table'
    },
    'sba': {
      url: 'https://www.sba.seoul.kr/kr/sbac01l1',
      tag: 'table'
    },
    'k-startup': {
      url: 'https://www.k-startup.go.kr/common/announcement/announcementList.do?mid=30004&bid=701',
      tag: '.listwrap ul'
    }
  }
  const result = await Promise.all(crawler(target))
  const changupga = result.find(data => data.name === 'k-startup')
  console.log(JSON.stringify(changupga, null, 2))
  expect(Array.isArray(changupga.tables[0])).toEqual(true)
  done()
})
