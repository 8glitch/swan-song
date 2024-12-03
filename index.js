const cheerio = require("cheerio");
const fs = require("fs/promises");
const INITIAL_URL = "https://swanboy.com/comic/swan-boy/";

async function scrapeComic(list = [INITIAL_URL], url = INITIAL_URL) {
  console.log(`loading ${url}...`);
  const res = await fetch(url);
  const body = await res.text();

  const $ = cheerio.load(body);

  const nextUrl = $("a.navi-next").attr("href");

  if (nextUrl) {
    console.log(`next comic at  ${nextUrl}`);
    return scrapeComic(list.concat(nextUrl), nextUrl);
  }

  return list;
}

function urlToListItem(url) {
  return `
    <li><a href="${url}">${url}</a></li>
  `;
}

async function main() {
  const list = await scrapeComic();
  const html = `
    <html>
      <head>
        <title>swan boy lofi index</title>
        <style>
          body {
            padding: 16px;
          }
          li {
            margin: 8px;
          }
        </style>
      </head>
      <body>
        <h1>swan boy lofi index</h1>
        <h2>I got tired of having to scroll through to find stuff</h2>

        <main>
          <p>donate to your local mutual aid orgs :)</p>
          <ol>
            ${list.map(urlToListItem).join("\n")}
          </ol>
        </main>
      </body>
    </html>
  `;
  await fs.writeFile("index.html", html);
  console.log("wrote 2 file");
}

main();
