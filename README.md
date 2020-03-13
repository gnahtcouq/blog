## blog

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L6W74V)

### about
- For building personal blog/documentation
- Fast and lightweight
- Static, fully frontend
- Markdown supported
- No **jQuery**

### deps
- [showdown.js](http://showdownjs.com/) - building markdown contents
- [highlight.js](https://highlightjs.org/) - code highlighting

### dev

Clone this repo:
```bash
$ git clone https://github.com/nomi-san/blog.git
```

Serve the repo directory:
```repo
$ npm i live-server
$ cd blog
$ live-server --port=3000
```

### dir
```
./blog/
    |____assets/                    # static assets
    .    |____css/
    .    .    |____style.css        # main style sheet
    .    |____img/...
    .    |____js/
    .    .    |____script.js        # main script
    |____posts/                     # post list
    .    |____post-path/            # path
    .    .    |____index.html       # index
    .    .    |____content.md       # content
    |____about/index.html           # about
    |____index.html                 # home
    ...
```

### script

```js
const posts = {
    2017: [{
            date:  '04 thg 05',
            title: 'The First post',
            link:  'the-first-post'
        }, ...
    ]
};
```

### post

- **index.html**
```html
<html>
    <tags ...
    <media-tag ...
    ...
</html>
```

- **content.md**
```md
### your content here
- have a great time
```
