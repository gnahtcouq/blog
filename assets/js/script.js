const title  = 'Nomi-san';
const author = 'Nomi';
const ga_key = 'UA-119524229-1';

const navs = [
    {'home'  : '/'},
    {'about' : '/about'},
    {'/me'   : 'https://github.com/nomi-san/'},
    {'@me'   : 'mailto:admin@nomisan.dev'}
];

const posts = {
[2017]: [{
        date:  '04 thg 05',
        title: 'The First post',
        link:  'the-first-post'
    }, {
        date:  '11 thg 11',
        title: 'Hộp thoại Rust',
        link:  'rust-messagebox'
    }],
[2018]: [{
        date:  '01 thg 07',
        title: '\'Chơi\' Lua trong 30 phút!',
        link:  'lua-in-30min'
    }],
[2020]: [{
        date:  '23 thg 02',
        title: 'Pick-lock tướng <br>tốc độ bàn thờ!',
        link:  'super-fast-pick-lock'
    }]
};

document.addEventListener('DOMContentLoaded', function() {

    const header  = document.querySelector('header');
    const footer  = document.querySelector('footer');
    const section = document.querySelector('section');

    var snav = '';
    navs.forEach(function(v) {
        var text = Object.keys(v)[0];
        var url = v[text];
        var target = (url.charAt(0) === '/') ? '' : `target="_blank"`;
        snav +=`<p class="view"><a href="${url}" ${target}>${text}</a></p>`;
    });

    header.innerHTML += `<h1>${title}</h1><nav>` + snav + '</nav>';
    footer.innerHTML += `<p>&#169; ${(new Date).getFullYear()} ${author} &#124; ` +
        `<a href="https://github.com/nomi-san/blog/" target="_blank">source</a></p>` +
        `<p><a href="https://ko-fi.com/nomisan" target="_blank">` +
        `<img src='https://www.ko-fi.com/img/githubbutton_sm.svg' height='24px'></a></p>`;

    const lp = window.location.pathname;
    if (lp == '/' || lp == '/index.html') {
        const h1 = createElm('h1', '', 'posts');
        const list = createElm('div', 'list-post');

        Object.keys(posts).reverse().forEach(function(year) {
            var inner = '';
            list.innerHTML += genElm('h2', null, year);
            posts[year].reverse().forEach(function(details) {
                const {date, title, link} = details;
                inner += `<p><a href="/posts/${link}">${title}</a><i>${date}</i></p>`;
            });
            list.innerHTML += genElm('ul', null, inner);
        });

        section.appendChild(h1);
        section.appendChild(list);
    }
    else if (lp.indexOf('/posts/') !== -1) {
        const path = lp.replace('/posts/', '')
            .replace('/index.html', '').replace('/', '');
        const post = getPost(posts, path);
        header.innerHTML += `<h2 class="post-title">${post.title}</h2>` +
            `<p class="post-date">${post.date}</p>`;
        
        showdown.extension('code.hl', function() {
            var unencode = function(text) {
                return text.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>');
            };
            return [{
                type: 'output',
                filter: function(text, converter, options) {
                    var left  = '<pre><code\\b[^>]*>',
                        right = '</code></pre>',
                        flags = 'g',
                        replacement = function(wholeMatch, match, left, right) {
                            match = unencode(match);
                            var g = parseCode(match);
                            var code = '', isNew = (g.before || g.after);
                            var lang = left.match(/<pre><code class="(\w+)/);
                            
                            lang = lang ? lang[1] : 'plaintext';
                            
                            if (g.before) {
                                code += genElm('pre', 'insert-before', g.before);
                            }           
                            
                            if (g.comment) {
                                g.comment = simpleBold(g.comment);
                            }
                            
                            if (g.file) {
                                g.file = genElm('em', null, g.file);
                                code += genElm('div', 'source-file',
                                    g.file + (g.comment ? '<br>' + g.comment : ''));
                            }
                            
                            code += genElm('pre',
                                isNew ? 'insert' : 'fully', hljs.highlight(lang, g.code).value);
                            
                            if (g.after) {
                                code += genElm('pre', 'insert-after', g.after);
                            }
                            
                            return genElm('div', 'codehilite', code) +
                                (g.file ? genElm('div', 'source-file-narrow',
                                    g.file + (g.comment ? ', ' + g.comment : '')) : '');
                        };
                    return showdown.helper
                        .replaceRecursiveRegExp(text, replacement, left, right, flags);
                }
            }];
        });

        const toc = createElm('div', 'post-toc');

        showdown.extension('t.o.c', function() {
            return [{
                type: 'output',
                filter: function(text, converter, options) {
                    var left  = '<(h1|h2)\\s*id=(\"|\')',
                        right = '(\"|\')\\s*>',
                        flags = 'g',
                        replacement = function(wholeMatch, match, left, right) {
                            toc.innerHTML += `<p><a href="#${match}">#${match}</a></p>`;
                            return wholeMatch;
                        };
                    return showdown.helper
                        .replaceRecursiveRegExp(text, replacement, left, right, flags);
                }
            }];
        });

        header.appendChild(toc);
        
        showdown.setFlavor('github');
        var converter = new showdown
            .Converter({ openLinksInNewWindow: true, extensions: ['code.hl', 't.o.c']});       
        var content = readFile((window.location.pathname)
            .replace('/index.html', '') + '/content.md');
        section.className = 'post-content';
        section.innerHTML = converter.makeHtml(content);

        setTimeout(function() {
            var href = window.location.href;
            var permapos = href.indexOf('#');
            if (permapos !== -1) {
                var id = document.getElementById(decodeURI(href.substr(permapos + 1)));
                if (id !== null) id.scrollIntoView({behavior: 'smooth'});
            }
        }, 500);

        var s2t = createElm('button', 'scroll-top', arrowSvg());
        
        s2t.onclick = function() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        };

        window.onscroll = function() {
            if (document.body.scrollTop > 100 ||
                document.documentElement.scrollTop > 100) {
                s2t.style.display = "block";
            } else {
                s2t.style.display = "none";
            }
        };

        section.appendChild(s2t);
    }
    
    fixScale(document);
    
    // GA track
    (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
    (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
    m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
    })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
    ga('create', ga_key, 'auto');
    ga('send', 'pageview');
});

function createElm(tag = '', klass = '', inner = '') {
    const elm = document.createElement(tag);
    elm.className = klass;
    elm.innerHTML = inner;
    return elm;
}

function genElm(tag, klass, inner) {
    return `<${tag} ${klass ?
        `class="${klass}"` : ''}>${inner}</${tag}>`;
}

function simpleBold(s) {
    return s.replace(/{/g, '<em>')
        .replace(/}/g, '</em>');
}

function getPost(posts, path) {
    for (var k in posts) {
        var l = posts[k];
        for (var i = 0; i < l.length; i++)
            if (l[i].link === path)
                return l[i];
    }
}

function readFile(file) {
    var allText = '', rawFile = new XMLHttpRequest();
    rawFile.open('GET', file, false);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4)
            if (rawFile.status === 200 || rawFile.status == 0)
                allText = rawFile.responseText;
    }
    rawFile.send(null);
    return allText;
}

function parseCode(s) {
    var s = s.trim().split('\n');
    var file, comment = '', before = '',
        after = '', code = '';

    s.forEach(function(i) {
        if (i.indexOf('>') === 0)
            file = i.substr(1).trim();
        else if (i.indexOf('<') === 0)
            comment += i.substr(1) + '\n';
        else if (i.indexOf('[') === 0)
            before += i.substr(1) + '\n';
        else if (i.indexOf(']') === 0)
            after += i.substr(1) + '\n';
        else
            code += i + '\n';
    });

    return {
        file: file,
        comment: comment,
        before: before != '' ? before : null,
        after: after != '' ? after : null,
        code: code
    };
}

function arrowSvg() {
    return `<svg fill="#8590a6"
        viewBox="0 0 24 24" width="24" height="24">
        <path d="M16.036 19.59a1 1 0 0 1-.997.995H9.032a.996.996
        0 0 1-.997-.996v-7.005H5.03c-1.1 0-1.36-.633-.578-1.416L11.33
        4.29a1.003 1.003 0 0 1 1.412 0l6.878 6.88c.782.78.523 1.415-.58
        1.415h-3.004v7.005z"/></svg>`;
}

function fixScale(document) {
    var metas = document.getElementsByTagName('meta'),
        changeViewportContent = function(content) {
            for (var i = 0; i < metas.length; i++) {
                if (metas[i].name == 'viewport') {
                    metas[i].content = content;
                }
            }
        },
        initialize = function() {
            changeViewportContent('width=device-width, minimum-scale=1.0, maximum-scale=1.0');
        },
        gestureStart = function() {
            changeViewportContent('width=device-width, minimum-scale=0.25, maximum-scale=1.6');
        },
        gestureEnd = function() {
            initialize();
        };
    if (navigator.userAgent.match(/iPhone/i)) {
        initialize();
        document.addEventListener('touchstart', gestureStart, false);
        document.addEventListener('touchend', gestureEnd, false);
    }
}
