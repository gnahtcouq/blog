const title = 'Nomi-san';
const author = 'Nomi';

const navs = [
    {'home': '/'},
    {'about':'/about'},
    {'/me': 'https://github.com/nomi-san/'},
    {'@me': 'mailto:wuuyi123@gmail.com'}
];

const posts = {
    2017: [{
            date:  '4 thg 5',
            title: 'The First post',
            link:  'the-first-post'
        }, {
            date:  '11 thg 11',
            title: 'Rust MessageBox',
            link:  'rust-messagebox'
        }],
    2018: [{
            date:  '1 thg 7',
            title: '\'Chơi\' Lua trong 30 phút!',
            link:  'lua-in-30min'
        }],
    2020: [{
            date:  '23 thg 2',
            title: 'Pick-lock tướng <br>tốc độ bàn thờ',
            link:  'super-fast-pick-lock'
        }]
};

document.addEventListener('DOMContentLoaded', function()
{
    var snav = '';
    navs.forEach(function(v) {
        var text = Object.keys(v)[0];
        var url = v[text];
        var target = (url.charAt(0) === '/') ? '' : `target="_blank"`;
        snav +=`<p class="view"><a href="${url}" ${target}>${text}</a></p>\n`;
    });

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');
    const section = document.querySelector('section');

    header.innerHTML += `<h1>${title}</h1><nav>` + snav + '</nav>';
    footer.innerHTML += `<p>&#169; ${(new Date).getFullYear()} ${author} &#124; ` +
        `<a href="https://github.com/nomi-san/blog/" target="_blank">source</a></p>` +
        `<p><a href="https://ko-fi.com/nomisan" target="_blank">` +
        `<img src='https://www.ko-fi.com/img/githubbutton_sm.svg' height='24px'></a></p>`;

    const lp = window.location.pathname;
    if (lp == '/' || lp == '/index.html')
    {
        const h1 = create_elm('h1', '', 'posts');
        const list = create_elm('div', 'list-post');

        Object.keys(posts).reverse().forEach(function(year) {
            var inner = '';
            list.innerHTML += gen_elm('h2', null, year);
            posts[year].reverse().forEach(function(details) {
                const {date, title, link} = details;
                inner += `<p><a href="/posts/${link}">${title}</a><i>${date}</i></p>`;
            });
            list.innerHTML += gen_elm('ul', null, inner);
        });

        section.appendChild(h1);
        section.appendChild(list);
    }
    else if (lp.indexOf('/posts/') != -1)
    {
        const path = lp.replace('/posts/', '')
            .replace('/index.html', '').replace('/', '');
        const post = get_post(posts, path);
        header.innerHTML += `<h2 id="post-title">${post.title}</h2>` +
            `<p id="post-date">${post.date}</p>`;
        
        showdown.extension('my_codehl', function() {
            var unencode = function(text) {
                return text.replace(/&amp;/g, '&')
                    .replace(/&lt;/g, '<')
                    .replace(/&gt;/g, '>');
            }
            return [{
                type: 'output',
                filter: function(text, converter, options) {
                    var left  = '<pre><code\\b[^>]*>',
                        right = '</code></pre>',
                        flags = 'g',
                        replacement = function(wholeMatch, match, left, right) {
                            match = unencode(match);
                            var g = parse_code(match);
                            var code = '', isNew = (g.before || g.after);
                            var lang = left.match(/<pre><code class="(\w+)/);
                            
                            lang = lang ? lang[1] : 'plaintext';
                            
                            if (g.before) {
                                code += gen_elm('pre', 'insert-before', g.before);
                            }           
                            
                            if (g.comment) {
                                g.comment = simple_bold(g.comment);
                            }
                            
                            if (g.file) {
                                g.file = gen_elm('em', null, g.file);
                                code += gen_elm('div', 'source-file',
                                    g.file + (g.comment ? '<br>' + g.comment : ''));
                            }
                            
                            code += gen_elm('pre',
                                isNew ? 'insert' : 'fully', hljs.highlight(lang, g.code).value);
                            
                            if (g.after) {
                                code += gen_elm('pre', 'insert-after', g.after);
                            }
                            
                            return gen_elm('div', 'codehilite', code) +
                                (g.file ? gen_elm('div', 'source-file-narrow',
                                    g.file + (g.comment ? ', ' + g.comment : '')) : '');
                        };
                    return showdown.helper
                        .replaceRecursiveRegExp(text, replacement, left, right, flags);
                }
            }];
        });
        
        showdown.setFlavor('github');
        var converter = new showdown
            .Converter({ openLinksInNewWindow: true, extensions: ['my_codehl']});
        
        var html = read_file((window.location.href)
            .replace('/index.html', '') + '/index.html');
        var content = get_content(html);
        section.className = 'post-content';
        section.innerHTML = converter.makeHtml(content);
    }
    
    fix_scale(document);
});

function create_elm(tag = '', klass = '', inner = '') {
    const elm = document.createElement(tag);
    elm.className = klass;
    elm.innerHTML = inner;
    return elm;
}

function gen_elm(tag, klass, inner) {
    return `<${tag} ${klass ?
        `class="${klass}"` : ''}>${inner}</${tag}>`;
}

function simple_bold(s) {
    return s.replace(/{/g, '<em>')
        .replace(/}/g, '</em>');
}

function get_post(posts, path) {
    for (var k in posts) {
        var l = posts[k];
        for (var i = 0; i < l.length; i++)
            if (l[i].link === path)
                return l[i];
    }
}

function get_content(s) {
    return s.split('<!--content>').pop()
        .split('</content-->').shift();
}

function read_file(file) {
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

function parse_code(s) {
    var s = s.trim().split('\n');
    var file, comment = '', before = '',
        after = '', code = '';

    s.forEach((i) => {
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

function fix_scale(document) {
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
