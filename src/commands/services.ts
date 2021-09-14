import _ from 'lodash'
import Parser from 'rss-parser'
import axios from 'axios'
import scrapeIt from 'scrape-it'

import * as tswrap from '../utils/tswrap'

import { logger, rssParser, SourceType, ParserItem, MediaType, NewsType } from '../utils/configs'

export async function getNewsRSS(sourceDetail: SourceType): Promise<NewsType[]> {
  const newsResult: NewsType[] = new Array()

  const feedResult = await tswrap.wrapPromise<Parser.Output<{[key: string]: any}>>(rssParser.parseURL(sourceDetail.link))
  if (tswrap.isError(feedResult)) {
    logger.error(`error fetching news from ${sourceDetail.link} : ${feedResult.message}`)
    logger.error(JSON.stringify(feedResult))
    return []
  }

  for (const value of feedResult.items!) {
    const pubDate = new Date(value.pubDate!.replace('BST', 'GMT+0100'))

    let mediaUrl = value.media !== undefined ? value.media.$.url.replace('g/1500w/', 'g') : ''

    if (mediaUrl === '' && sourceDetail.parser) {
      mediaUrl = await getNewsImage(value.link!, mediaUrl, sourceDetail.parser)
    }

    const news: NewsType =  {
      clubName: sourceDetail.clubName,
      sourceName: sourceDetail.source,
      sourceShort: sourceDetail.sourceShort,
      title: value.title!,
      pubDate: pubDate.toISOString(),
      pubDateTime: new Date(pubDate).getTime(),
      link: value.link ?? value.guid! ,
      content: value.content!,
      sourceLogo: sourceDetail.logo,
      sourceLanguage: sourceDetail.lang,
      mediaUrl: mediaUrl,
    }
    newsResult.push(news)
  }

  var sorted = newsResult.sort(function (a, b) {
    const dateA = new Date(a.pubDate)
    const dateB = new Date(b.pubDate)
    return dateB.getTime() - dateA.getTime()
  })

  return sorted
}

export async function getNewsImage(url: string, mediaUrl: string, parser?: ParserItem): Promise<String> {
  if (!parser) return mediaUrl

  const axiosResult = await tswrap.wrapAxios<string>(axios.get(url))
  if (tswrap.isAxiosError(axiosResult)) {
    return mediaUrl
  } else {
    const scrapeResult = scrapeIt.scrapeHTML<MediaType>(axiosResult.data, {
      mediaUrl: parser,
    })
    return scrapeResult.mediaUrl
  }
}
