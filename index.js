import express from 'express';
import puppeteer from 'puppeteer-core';
import chromium from "@sparticuz/chromium";
import cors from 'cors';

const app = express();

const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.get('/test-adbutler', async (req, res) => {
    try {
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
                '--single-process',
                '--disable-gpu'
            ],
        });
        const page = await browser.newPage();

        await page.goto('https://dainty-figolla-7c1184.netlify.app/', {
            waitUntil: "networkidle0",
        });

        await page.setViewport({ width: 1080, height: 1024 });

        const content = await page.evaluate(() => {
            return document.querySelector('#__nuxt').innerHTML;
        });

        console.log({ content });

        await browser.close();
        res.status(200).send(content);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});

const port = 4000;
app.listen(port, () => console.log(`App listening on port ${port}`));

app.set('trust proxy', true);

