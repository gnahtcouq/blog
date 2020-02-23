const title = 'Nomi-san';
const author = 'Nomi';

const navs = [
    {'home': '/'},
    {'about':'/about'},
    {'/me': 'https://github.com/nomi-san/'},
    {'@me': 'mailto:wuuyi123@gmail.com'}
];

const posts = [
    [2017, [
        ['04 thg 05', 'The First post', 'the-first-post'],
        ['11 thg 11', 'Rust MessageBox', 'rust-messagebox']
    ]],
    [2018, [
        ['01 thg 07', '\'Chơi\' Lua trong 30 phút!',
            'lua-in-30min']
    ]],
    [2020, [
        ['23 thg 02', 'Pick-lock tướng tốc độ bàn thờ',
            'super-fast-pick-lock']
    ]]
];

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

    header.innerHTML += `<h1>${title}</h1><nav>` + snav + '</nav>';
    footer.innerHTML += `<p>&#169; ${(new Date).getFullYear()} ${author} &#124; ` +
        `<a href="https://github.com/nomi-san/blog/" target="_blank">source</a></p>` +
        `<p><a href="https://ko-fi.com/nomisan" target="_blank">` +
        `<img src='https://www.ko-fi.com/img/githubbutton_sm.svg' height='24px'></a></p>`;

    const lp = window.location.pathname;
    if (lp == '/' || lp == '/index.html')
    {
        const list = document.getElementById('list-post');
        posts.reverse();
        posts.forEach(function(a) {
            var s = '';
            list.innerHTML += gen_elm('h2', null, a[0]);
            a[1].reverse();
            a[1].forEach(function(b) {   
                s += `<p><i>${b[0]}</i><a href="/posts/${b[2]}">${b[1]}</a></p>`;
            });
            list.innerHTML += gen_elm('ul', null, s);
        });
    }
    else if (lp.indexOf('/posts/') != -1)
    {
        const path = lp.replace('/posts/', '')
            .replace('/index.html', '').replace('/', '');
        header.innerHTML += `<h2 id="post-title">${get_title(path)}</h2>` +
            `<p id="post-date">${get_date(path)}</p>`;
        
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
                            
                            return gen_elm('div', 'codehilite', code)
                                + (g.file ? gen_elm('div', 'source-file-narrow',
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
        document.getElementById('post-content')
            .innerHTML = converter.makeHtml(content);
    }
    
    fix_scale(document);
});

function gen_elm(tag, klass, inner) {
    return `<${tag} ${klass ?
        `class="${klass}"` : ''}>${inner}</${tag}>`;
}

function simple_bold(s) {
    return s
        .replace('{', '<em>')
        .replace('}', '</em>');
}

function get_title(path) {
    var ret = '';
    posts.forEach(function(a) {
        a[1].forEach(function(b) {
           if (b[2] == path)
               ret = b[1];
        });
    });
    return ret;
}

function get_date(path) {
    var ret = '';
    posts.forEach(function(a) {
        a[1].forEach(function(b) {
           if (b[2] == path)
               ret = b[0] + ' ' + a[0];
        });
    });
    return ret;
}

function get_content(str) {
    return str.split('<!--content>').pop()
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
