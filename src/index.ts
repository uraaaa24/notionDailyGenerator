import { Client } from '@notionhq/client'
import dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(ja)

const DATABASE_ID = process.env.NOTION_DATABASE_ID || ''

const notion = new Client({ auth: process.env.NOTION_API_KEY })

const now = dayjs().tz('Asia/Tokyo')
const YYYYMMDD = now.format('YYYY-MM-DD')
const YYYYMMDDdd = now.format('YYYY-MM-DD (ddd)')

const createDailyPage = async () => {
  const alreadyExist = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: '日付',
      title: {
        equals: YYYYMMDD
      }
    }
  })

  if (alreadyExist.results.length > 0) {
    console.log('Already exist')
    return
  }

  try {
    await notion.pages.create({
      parent: {
        database_id: DATABASE_ID
      },
      properties: {
        日付: {
          title: [
            {
              text: {
                content: YYYYMMDDdd
              }
            }
          ]
        },
        最終更新日時: {
          type: 'date',
          date: {
            start: YYYYMMDD
          }
        }
      }
    })
    console.log('Created')
  } catch (error) {
    console.error(error)
  }
}

createDailyPage()
