// import _ from 'lodash'
import { flatten } from 'lodash'
import { ApiResponse } from '@elastic/elasticsearch'
import type { Arguments, CommandBuilder } from 'yargs'

import { SourceType, logger, NewsType } from '../utils/configs'
import * as tswrap from '../utils/tswrap'

import { SOURCES } from '../sources'
import { insertDatabase } from './repository'
import { getNewsRSS } from './services'

export const command: string = 'generate'
export const desc: string = 'generate news feed'
export const builder: CommandBuilder = (yargs) => yargs

export const handler = async (argv: Arguments): Promise<void> => {
  const sourceMap = SOURCES.map((source: SourceType) => getNewsRSS(source));
  const newsResult: NewsType[] = new Array()
  newsResult.push(...flatten(await Promise.all(sourceMap)))
  logger.info(`total news generated : ${newsResult.length}`)

  await tswrap.wrapPromise<ApiResponse | NodeJS.ErrnoException>(insertDatabase(newsResult))
}
