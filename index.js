const puppeteer = require("puppeteer");
const fs = require("fs");
const imgDownload = require("image-downloader");
const dir = "./download";

function getLinkAndDownload(link) {
  imgDownload
    .image({
      url: link,
      dest: dir,
    })
    .then(({ filename }) => {
      console.log("Saved to", filename);
    })
    .catch((err) => console.error(err));

  console.log("Done");
}

async function goToPageAndDownload(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, {
    waitUntil: "load",
    timeout: 0,
  });

  const imgLink = await page.evaluate(() => {
    let items = document.querySelectorAll("img");
    let links = [];
    items.forEach((item) => {
      links.push(item.getAttribute("src"));
    });
    return links;
  });

  imgLink.forEach((item) => {
    getLinkAndDownload(item.split(" ")[0]);
  });
  await browser.close();
}

function main() {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  goToPageAndDownload(
    "https://www.pinterest.com/search/pins/?q=asian%20girl&rs=typed&term_meta[]=asian%7Ctyped&term_meta[]=girl%7Ctyped"
  );
}

main();
