import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium"

const app = express();

const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test-adbutler', async (req, res) => {

    console.log("test-adbutler", await chromium.executablePath());
    const browser = await puppeteer.launch({
        executablePath: await chromium.executablePath(),
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-zygote',
            '--single-process', // Recommended for Render
            '--disable-gpu'
        ],
    });
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://dainty-figolla-7c1184.netlify.app/', {
        waitUntil: "networkidle0",
    });

    // Set screen size.
    await page.setViewport({ width: 1080, height: 1024 });

    // Get the contents inside the div with #__nuxt id
    const content = await page.evaluate(() => {
        return document.querySelector('#__nuxt').innerHTML;
    });

    console.log({ content });

    await browser.close();
    // Return the content
    res.status(200).send(content);

});

app.listen(port, () => console.log(`App listening on port ${port}`));

app.set('trust proxy', true)

