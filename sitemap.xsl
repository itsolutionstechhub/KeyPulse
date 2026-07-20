<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:html="http://www.w3.org/1999/xhtml"
                xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>XML Sitemap - KeyPulse</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&amp;display=swap" rel="stylesheet" />
        <style type="text/css">
          body {
            font-family: 'Outfit', sans-serif;
            background-color: #0d0e15;
            color: rgba(255, 255, 255, 0.8);
            margin: 0;
            padding: 40px 20px;
          }
          .container {
            max-width: 1000px;
            margin: 0 auto;
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 16px;
            padding: 30px;
            box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
          }
          h1 {
            color: #fff;
            font-size: 28px;
            margin-top: 0;
            margin-bottom: 10px;
            font-weight: 700;
          }
          .tagline {
            color: #00f0ff;
            font-size: 14px;
            margin-bottom: 30px;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 600;
          }
          p.intro {
            font-size: 16px;
            color: rgba(255, 255, 255, 0.6);
            line-height: 1.6;
            margin-bottom: 24px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th {
            background-color: rgba(0, 240, 255, 0.08);
            color: #00f0ff;
            text-align: left;
            padding: 12px 16px;
            font-weight: 600;
            font-size: 14px;
            border-bottom: 2px solid rgba(0, 240, 255, 0.2);
          }
          td {
            padding: 14px 16px;
            font-size: 15px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          }
          tr:hover td {
            background-color: rgba(255, 255, 255, 0.02);
          }
          a {
            color: #00f0ff;
            text-decoration: none;
            transition: all 0.2s ease;
          }
          a:hover {
            text-decoration: underline;
            text-shadow: 0 0 8px rgba(0, 240, 255, 0.5);
          }
          .priority-badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 700;
            background: rgba(0, 240, 255, 0.15);
            color: #00f0ff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>XML Sitemap</h1>
          <div class="tagline">KeyPulse SEO Index</div>
          <p class="intro">
            This is an XML Sitemap generated for search engines (like Google, Bing, and Yahoo) to crawl the pages of KeyPulse. It contains <strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> indexable URLs.
          </p>
          
          <table>
            <thead>
              <tr>
                <th>URL Link</th>
                <th>Last Modified</th>
                <th>Change Freq</th>
                <th>Priority</th>
              </tr>
            </thead>
            <tbody>
              <xsl:for-each select="sitemap:urlset/sitemap:url">
                <tr>
                  <td>
                    <a href="{sitemap:loc}"><xsl:value-of select="sitemap:loc"/></a>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:lastmod"/>
                  </td>
                  <td>
                    <xsl:value-of select="sitemap:changefreq"/>
                  </td>
                  <td>
                    <span class="priority-badge">
                      <xsl:value-of select="sitemap:priority"/>
                    </span>
                  </td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </div>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
