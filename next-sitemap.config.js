/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://07prajwal2000.github.io",
  generateRobotsTxt: true, // optional: generates robots.txt automatically
  sitemapSize: 5000, // split if large
  outDir: "./out", // because we are using static export
};
