import {crawler} from '../src/index'

it('test', async (done) => {
  const target = {
    '창업가': 'http://www.seoulstartuphub.com/sub/news/notice/list.do',
    'sba': 'https://www.sba.seoul.kr/kr/sbac01l1'
  }
  const result = await Promise.all(crawler(target))
  const changupga = result.find(data => data.name === '창업가')
  expect(Array.isArray(changupga.tables[0])).toEqual(true)
  done()
})
