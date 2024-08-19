import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import { getZoomAPIAccessToken } from './api/zoomAPI.js'
import zoomRoutes from './routes/zoomRoutes'
import puppeteer, { Page } from 'puppeteer'

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


const getPublicPath = fileName => {
  const path = require('path')
  const isDevBuild = process.env.NODE_ENV === 'development'

  if (isDevBuild) {
    return path.join(__dirname, '../../resources/public/client-view.js')
  } else {
    const { app } = require('electron')
    // check main or renderer process for app path
    const appPath = app.getAppPath()
    return path.resolve(appPath, `./resources/${fileName}`).replace('app.asar', 'app.asar.unpacked')
  }
}

const app = express()
dotenv.config()

const port = process.env.PORT || 30015

app.use(cors())
app.use(express.json())

app.use(express.static(path.join(__dirname, '../../resources/public')))

app.use((_req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

let page: Page
  ; (async () => {
    const browser = await puppeteer.launch({
      headless: false,
      args: ['--use-fake-ui-for-media-stream'],
      defaultViewport: {
        width: 1200,
        height: 800
      }
    })
    page = await browser.newPage()
  })()

app.post('/meeting', async (req, res) => {
  const url = req.body.meetingUrl
  console.log(url)

  const jsPath = getPublicPath('public/client-view.js')

  const file = fs
    .readFileSync(jsPath)
    .toString()
    .split(';')

  const oldUrl = file[0].split(' ')
  oldUrl[oldUrl.length - 1] = `'${url}'`
  const newLine = oldUrl.join(' ')

  file[0] = newLine
  const newFile = file.join(';')

  fs.writeFileSync(jsPath, newFile)

  await page.goto(`http://127.0.0.1:${process.env.PORT}/`, {
    waitUntil: 'load',
    timeout: 0
  })

  await page.click('button')

  const clickOnMutePolling = async () => {
    try {
      const muteBtn = await page.waitForSelector('button[title="Mute"][aria-label="mute my microphone"]', {
        timeout: 50
      })
      await muteBtn?.click()

    }
    catch (e) {
      console.log('LOOP');
      const cameraBtn = await page.$('button#preview-video-control-button[aria-label="Stop Video"]')
      await cameraBtn?.click()
      await clickOnMutePolling()
    }
  }

  await clickOnMutePolling(); 

  const partBtn = await page.waitForSelector('div[feature-type="participants"] > button')
  await partBtn?.click()

  await page.waitForSelector('div[aria-label="participants list"]')

  // const pattList = await page.$$eval('div.participants-item-position > div > div', (div) => div.map(x => x.ariaLabel));

  // let PARTICIPANTS = 0
  // let MUTED = 0
  // let VIDEO = 0

  // pattList.forEach(x => {
  //   PARTICIPANTS++;
  //   if(x?.includes('muted')) MUTED++;
  //   if(!x?.includes('video off')) VIDEO++;
  // })

  // console.log(PARTICIPANTS, MUTED, VIDEO)
  res.send('ok')
})

app.get('/meeting/part', async (_req, res) => {
  await page.waitForSelector('div[aria-label="participants list"]')

  const pattList = await page.$$eval('div.participants-item-position > div > div', (div) => div.map(x => x.ariaLabel));

  let PARTICIPANTS = 0
  let UNMUTED = 0
  let VIDEO = 0

  pattList.forEach(x => {
    PARTICIPANTS++;
    if (x?.includes('unmuted')) UNMUTED++;
    if (!x?.includes('video off')) VIDEO++;
  })

  console.log(PARTICIPANTS, UNMUTED, VIDEO)
  res.send({
    part: PARTICIPANTS,
    unmuted: UNMUTED,
    video: VIDEO
  })
})

app.use('/api/zoom', zoomRoutes)

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
