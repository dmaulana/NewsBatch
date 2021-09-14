import { ApiResponse, Client } from "@elastic/elasticsearch"

import * as tswrap from '../utils/tswrap'
import { logger, NewsType } from '../utils/configs'

const client = new Client({ node: 'http://elasticsearch:9200' })

export const insertDatabase = async (array: NewsType[]): Promise<ApiResponse | NodeJS.ErrnoException> => {
  const news: any[] = new Array()

  for (var i = 0; i < array.length; i++) { 
    news.push({ "index":{"_index": "news","_id": array[i].link} })    
    news.push(array[i])     
  }  

  const insertResponse = await tswrap.wrapPromise<ApiResponse>(client.bulk({body: news}))
  if (tswrap.isError(insertResponse)) {
    logger.error(`error inserting to database : ${insertResponse.message}`)
    return insertResponse
  }

  return insertResponse
} 