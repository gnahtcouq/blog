## blog

[![ko-fi](https://www.ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/L3L6W74V)

### features
- For personal blog or documentation
- Static, fully frontend
- Fast and lightweight
- Markdown supported

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

### directory
```
./blog/
    |____assets/                    # static assets
    .    |____css/
    .    .    |____style.css        # main style sheet
    .    |____img/...
    .    |____js/
    .    .    |____script.js        # main script
    .    ...
    |____posts/                     # list posts
    .    |____post-1/index.html     # post-1
    .    |____post-2/index.html     # post-2
    .    ...
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

```html
<html>
    <tags ...
    <media-tag ...
    ...
</html>

<!--content>
...
your markdown code
...
</content-->
```
