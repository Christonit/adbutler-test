import express from 'express';
import puppeteer from 'puppeteer';

const app = express();

const port = 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/test-adbutler', async (req, res) => {

    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Navigate the page to a URL.
    await page.goto('https://dainty-figolla-7c1184.netlify.app/', {
        waitUntil: "networkidle0"
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

