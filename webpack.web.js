const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
      },
      meta: {
        'description': { name: 'description', content: 'WWAゲームについて、マップ画像を出力するツール'},
        'keyword': { name: 'keywords', content: 'WWA,マップ画像出力'},
        'og:title': { property: 'og:title', content: 'WWAゲーム マップ画像出力ツール' },
        'og:description': { property: 'og:description', content: 'WWAゲームについて、マップ画像を出力するツール' },
        'og:type': { property: 'og:type', content: 'website' },
        'og:url': { property: 'og:url', content: 'https://niccari.net/wwamap/' },
        'og:image': { property: 'og:image', content: 'https://niccari.net/wwamap/ogp.png' },
        'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
        'twitter:title': { name: 'twitter:title', content: 'WWAゲーム マップ画像出力ツール' },
        'twitter:description': { name: 'twitter:description', content: 'WWAゲームについて、マップ画像を出力するツール' },
        'twitter:image': { name: 'twitter:image', content: 'https://niccari.net/wwamap/ogp.jpg' },
        'twitter:site': { name: 'twitter:site', content: 'niccari1' }
      }
    })
  ]
};

