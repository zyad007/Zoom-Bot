import puppeteer from "puppeteer";
import fs from "fs/promises";
import cron from "node-cron";
import { execSync } from "child_process";
import fss from "fs";
import path from "path";

async function clickJoinMeetingButton() {
  const browser = await puppeteer.launch({
    headless: false,
    args: ["--use-fake-ui-for-media-stream"],
  });
  const page = await browser.newPage();

  await page.goto(`http://127.0.0.1:${process.env.PORT}/`, {
    waitUntil: "load",
    timeout: 0,
  });

  await page.click("button");

  setInterval( async () => {
    const noEl = await page.waitForSelector('.footer-button__number-counter span');

    const t = await noEl?.evaluate(t => t.innerText);

    console.log(t);
  }, 1000)

}

function removeChromiumAlert() {
  try {
    const chromiumPath = "/chrome-mac/Chromium.app";
    const macPath = path.join(
      path.dirname(require.resolve("puppeteer")),
      "/.local-chromium/"
    );
    const [generatedDir] = fss
      .readdirSync(macPath, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);
    const chromiumAppPath = path.join(macPath, generatedDir, chromiumPath);
    const mode = `0${(
      fss.statSync(chromiumAppPath).mode & parseInt("777", 8)
    ).toString(8)}`;

    if (mode !== "0777") {
      execSync(`sudo chmod 777 ${chromiumAppPath}`);
      execSync(`sudo codesign --force --deep --sign - ${chromiumAppPath}`);
    }
  } catch (err) {
    console.warn(
      "unable to sign Chromium, u may see the annoying message when the browser start"
    );
    console.warn(err);
  }
}

module.exports = { clickJoinMeetingButton };

/**
 *  How to schdule a Job
 * 1. use setInterval function
 * 2. use node-cron
 * 3. use linux cron to schedule a job at a specific time.
 *    Just need to run the script at OS level. OS will call
 *    and run the script - robust and reliable to run a task.
 */
