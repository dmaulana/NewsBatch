import nock from 'nock'
import { expect } from 'chai'
import { NewsType, ParserItem, SourceType } from '../src/utils/configs'
import { getNewsRSS, getNewsImage } from '../src/commands/services'

describe('Service Testing', () => {
  it('should able to get RSS content', async () => {
    const localhost: SourceType = {
      source: 'localhost',
      sourceShort: 'local',
      link: 'https://localhost.com/url/',
      lang: 'english',
      logo: 'https://i.ibb.co/KXdybGG/localhost.jpg',
      clubName: 'inter',
      parser: {
        selector: 'div.image img',
        attr: 'src',
      },
    }

    const responseMain = nock('https://localhost.com')
      .get('/url/')
      .replyWithFile(200, __dirname + '/resources/localhost.rss')
    const response = nock('https://localhost.com')
      .get('/2021/09/11/ex-nerazzurri-goalkeeper-paolo-orlandoni-simone-inzaghi-is-perfect-for-inter/')
      .replyWithFile(200, __dirname + '/resources/localhost.html')

    const news: NewsType[] = await getNewsRSS(localhost)
    expect(news.length).to.equal(1)
    expect(news[0].clubName).to.equal('inter')
    expect(news[0].sourceName).to.equal('localhost')
    expect(news[0].sourceShort).to.equal('local')
    expect(news[0].sourceLanguage).to.equal('english')
    expect(news[0].sourceLogo).to.equal('https://i.ibb.co/KXdybGG/localhost.jpg')
    expect(news[0].mediaUrl).to.equal('localhost_files/Simone-Inzaghi-3-scaled-e1629572915660.jpg')
    expect(news[0].link).to.equal(
      'https://localhost.com/2021/09/11/ex-nerazzurri-goalkeeper-paolo-orlandoni-simone-inzaghi-is-perfect-for-inter/',
    )
    expect(news[0].title).to.equal('Ex-Nerazzurri Goalkeeper Paolo Orlandoni: “Simone Inzaghi Is Perfect For Inter”')
    expect(news[0].pubDate).to.equal('2021-09-11T16:30:39.000Z')
    expect(news[0].pubDateTime).to.equal(1631377839000)
  })

  it('should able to return empty array when url is not accessible', async () => {
    const localhost: SourceType = {
      source: 'localhost',
      sourceShort: 'local',
      link: 'https://localhost.com/url/',
      lang: 'english',
      logo: 'https://i.ibb.co/KXdybGG/localhost.jpg',
      clubName: 'inter',
      parser: {
        selector: 'div.image img',
        attr: 'src',
      },
    }

    const responseMain = nock('https://localhost.com')
      .get('/url/')
      .reply(404)

    const news: NewsType[] = await getNewsRSS(localhost)
    expect(news.length).to.equal(0)
  })

  it('should able to get image', async () => {
    const response = nock('http://localhost')
      .get('/localhost')
      .replyWithFile(200, __dirname + '/resources/localhost.html')
    const parser: ParserItem = {
      selector: 'div.image img',
      attr: 'src',
    }

    const imageUrl: String = await getNewsImage('http://localhost/localhost', '', parser)
    expect(imageUrl).to.equal('localhost_files/Simone-Inzaghi-3-scaled-e1629572915660.jpg')
  })


  it('should able to get default image if url is wrong', async () => {
    const response = nock('http://localhost')
      .get('/localhost')
      .reply(404)
    const parser: ParserItem = {
      selector: 'div.image img',
      attr: 'src',
    }

    const imageUrl: String = await getNewsImage('http://localhost/localhost', 'xxxx', parser)
    expect(imageUrl).to.equal('xxxx')
  })
})
