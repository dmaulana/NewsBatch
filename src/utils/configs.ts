import * as iots from 'io-ts'
import Parser from 'rss-parser'
import { createLogger, format, transports } from 'winston'

export const parserItem = iots.type({
  selector: iots.string,
  attr: iots.string,
})

export type ParserItem = iots.TypeOf<typeof parserItem>

export const parser = iots.partial({
  parser: parserItem,
})

export const sourceInterface = iots.interface({
  source: iots.string,
  sourceShort: iots.string,
  link: iots.string,
  lang: iots.string,
  logo: iots.string,
  clubName: iots.string,
})

const intersectionSource = iots.intersection([sourceInterface, parser])

export type SourceType = iots.TypeOf<typeof intersectionSource>


export const mediaType = iots.type({
  mediaUrl: iots.string
})

export type MediaType = iots.TypeOf<typeof mediaType>

export const news = iots.interface({
  clubName: iots.string,
  sourceName: iots.string,
  sourceShort: iots.string,
  title: iots.string,
  pubDate: iots.string,
  pubDateTime: iots.number,
  link: iots.string,
  content: iots.string,
  sourceLogo: iots.string,
  sourceLanguage: iots.string,
  mediaUrl: iots.string,
})

export type NewsType = iots.TypeOf<typeof news>

export const rssParser = new Parser({
  customFields: {
    item: [
      ['author', 'creator'],
      ['content:encoded', 'contentEncoded'],
      ['media:content', 'media'],
      ['enclosure', 'media'],
      ['media:thumbnail', 'media'],
    ],
  },
})

export const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'Football-RSS' },
  transports: [
    new transports.Console(),
    // new transports.File({ filename: 'error.log', level: 'error' }),
    // new transports.File({ filename: 'combined.log' }),
  ],
})
