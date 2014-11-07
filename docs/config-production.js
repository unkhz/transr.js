var runtimeConfig = {
  baseUrl: '/',
  title:'Transr',
  enablePushState: true
};

var buildtimeConfig = {
  client: {
    debug: false,
    appModule: 'docs',
    stylesheets: [
      runtimeConfig.baseUrl + 'main.css',
      runtimeConfig.baseUrl + 'icons.css'
    ],
    scripts: [
      runtimeConfig.baseUrl + 'main.js'
    ],
    inlineScripts: [
      "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o), m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m) })(window,document,'script','//www.google-analytics.com/analytics.js','ga'); ga('create', 'UA-56332837-1', 'auto'); ga('send', 'pageview');"
    ],
    bootstraps: {
      runtimeConfig: runtimeConfig
    }
  },
  paths: {
    // ASS Sources
    mainModule: './main',
    mainHTML: './main/index.html',
    features: './features',
    // Domain Sources
    mainJS: '../../docs/index.js',
    assets: '../../docs/assets',
    pages: '../../docs',
    styles: '../../docs/styles',
    // Output
    dist: '../../dist/docs'
  },
  server: {
    baseUrl:runtimeConfig.baseUrl,
    enableLiveReload: false,
    liveReloadPort: 35729,
    port: 8080,
    enablePushState: runtimeConfig.enablePushState
  },
  styles: {
    enableMinify: true
  },
  markdown: {
    gfm: true,
    tables: true,
    highlight: function (code, lang) {
      return require('highlight.js').highlight(lang,code).value;
    }
  },
  browserify: {
    detectGlobals: true,
    insertGlobals: true,
    debug: false,
    enableUglify: false
  },
  tasks: {
    default: ['dist']
  }
};

module.exports = buildtimeConfig;