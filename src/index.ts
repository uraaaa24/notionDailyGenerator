import { Client } from '@notionhq/client'
import dayjs from 'dayjs'
import en from 'dayjs/locale/ja'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.locale(en)

const DATABASE_ID = process.env.NOTION_DATABASE_ID || ''
const notion = new Client({ auth: process.env.NOTION_API_KEY })
const now = dayjs().tz('Asia/Tokyo')
const YYYYMMDD = now.format('DD-MM-YYYY')
const YYYYMMDDdd = now.format('DD-MM-YYYY (ddd)')

const dailyPageExists = async () => {
  const res = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'date',
      title: {
        equals: YYYYMMDDdd
      }
    }
  })
  return res.results.length > 0
}

const createDailyPage = async () => {
  if (dailyPageExists()) {
    console.log('Already exist')
    return
  }

  try {
    await notion.pages.create({
      parent: {
        database_id: DATABASE_ID
      },
      properties: {
        date: {
          title: [
            {
              text: {
                content: YYYYMMDDdd
              }
            }
          ]
        },
        created_at: {
          type: 'date',
          date: {
            start: YYYYMMDD
          }
        },
        last_edited_at: {
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
