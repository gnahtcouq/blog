Thấy trên giang hồ dạo này xuất hiện khá nhiều yêu cầu về tool hỗ trợ pick tướng nhanh, nên tại hạ đây cũng bỏ tí thời gian ra để nghiên cứu. Tuy không phải là một game thủ **Liên Minh Huyền Thoại**, nhưng tại hạ cũng đã từng chơi qua nó. Sau khi hoàn tất bài viết này, tại hạ lại càng thích nó hơn, không phải là game hay, mà là công nghệ tạo ra nó.

<p align='center'>
<img src='https://i.ytimg.com/vi/GHnoNzH3g2M/maxresdefault.jpg' height='280px'>
</p>

Bài toán của chúng ta không đơn thuần như tiêu đề, mà là: **tự động chấp nhận trận đấu và pick-lock tướng siêu nhanh chỉ bằng trình duyệt web**! Trên thực tế, bài viết này nhằm mục đích giúp các vị tìm hiểu về League Client và cách sử dụng API.

Nhìn scrollbar đi, nếu các vị đây không muốn dài dòng hay thậm chí là chỉ muốn đạt được như tiêu đề thì có thể nhảy thẳng đến phần [**THỰC HIỆN**](#thực-hiện) ngay và luôn nhé.

## NGÂM CỨU
Trong quyển **Binh Pháp** của **Tôn Tử** có câu:
<p align='center'>
<img src='https://www.elleman.vn/wp-content/uploads/2019/08/06/binhphaptontu-ELLEMan-Feature.jpg' height='300px'>
<br>
<em>"Biết người biết ta, trăm trận trăm thắng"</em>
</p>

Đúng vậy, muốn làm được thì phải hiểu rõ về **League Client**, một khi đã thông được nó thì mọi chuyện dễ như trở bàn tay 😆

### League Client truyện

Khoảng giữa năm 2016 thì **Riot** bắt đầu tung ra bản alpha của client mới, mang đến một giao diện hoàn toàn mới được gọi là **Hextech UI**. Từ Hextech đã xuất hiện trước đó khá lâu, trong một số skin, báu vật và cả cốt truyện game... và gần như là độc quyền của **Riot**.

Đây là 2 bài viết mà Riot cố tình tiết lộ về các công nghệ được sử dụng trong client mới:
- [The Architecture of the League Client Update](https://technology.riotgames.com/news/architecture-league-client-update)
- [Under the hood of the League Client’s Hextech UI](https://technology.riotgames.com/news/under-hood-league-client%E2%80%99s-hextech-ui)

Client mới được gọi là **LCU** (tức League Client Update, thường được sử dụng trong giới dev). Vậy chắc cũng có từ **LCO** nhỉ? Không đâu, nhưng mình sẽ dùng từ này trong bài viết để chỉ **client cũ**.

Đi ngược về quá khứ, khoảng hơn mười năm về trước - lúc mà Riot vẫn còn đang phát triển LMHT. 

Bấy giờ, **LCO** được viết bằng **C++**, còn UI sử dụng nền tảng [**Adobe AIR**](https://en.wikipedia.org/wiki/Adobe_AIR) (được phát triển từ **Flash**). Về kết nối và truyền tải dữ liệu giữa client, game và tương tác với API core, Riot sử dụng giao thức [**RTMP**](https://en.wikipedia.org/wiki/Real-Time_Messaging_Protocol). AIR như là một hệ khép kín, và RTMP là cổng chính để truyền tải dữ liệu, giao tiếp với bên ngoài.

Sau đấy Riot nhận thấy rằng **AIR** đã dần lỗi thời và **LCO** hiện tại đã khá cũ. Trong lúc nền tảng web đang làm mưa làm gió, không cầm lòng trước các trang web màu mè cùng hiệu ứng chuyển động lung linh, thế là họ quyết định xây dựng một diện mạo mới cho client bằng **HTML** và **JavaScript** (sau khi **HTML5** xuất hiện 1 năm).

<p align="center">
    <img src="https://technology.riotgames.com/sites/default/files/lcu_htmljs_in.png" height="300px"/>
</p>

Lúc đó, **JavaScript** như là một ông trùm và đứng sau là **node.js**. Nhưng Riot không muốn phụ thuộc vào **node.js** mà là xây dựng nền tảng riêng tương tự, thế là họ đưa ra lựa chọn dị theo concept cũ: vẫn sử dụng **RTMP** kèm bộ xử lý responses bất đồng bộ, thay vào đó là xây dựng UI bằng **CEF**.

<p align="center">
    <img src="https://technology.riotgames.com/sites/default/files/lcu_architecture_1.png" height="300px"/>
</p>

[**CEF**](https://en.wikipedia.org/wiki/Chromium_Embedded_Framework) là viết tắt của **Chromium Embedded Framework**, một C++ framework hỗ trợ nhúng bộ vi xử lý của trình duyệt **Chromium** vào ứng dụng desktop. Project này được viết từ source của nhân Chromium và gần như tận dụng mọi thứ từ nó.

> Riot chê node.js chậm và không muốn viết mọi thứ bằng JavaScript.

#### Microservices

Đây là nơi chứa các tài nguyên của client, và là nơi phản hồi các request từ UI. RTMP sẽ đảm nhiệm làm cổng trung gian truyền tải dữ liệu.

<p align="center">
    <img src="https://technology.riotgames.com/sites/default/files/lcu_architecture_2.png" height="300px"/>
</p>

Chẳng hạn, khi bạn click vào xem tướng (Bộ sưu tập > Tướng), UI sẽ gửi một request đến **microservices**. Trong lúc chờ phản hồi, UI sẽ hiển thị một loader thay thế. Nếu respone thành công, server trả về dữ liệu dạng JSON chứa thông tin tướng đã sở hữu, tướng miễn phí, giá cả... và UI chỉ cần xử lý liệu đó để kết xuất thành giao diện rồi hiển thị cho bạn xem.

Được biết, **CEF** có hỗ trợ API của **V8 core** (Javascript engine) để tương tác hai chiều với **DOM** trong UI bằng **C++**. Nếu như họ sử dụng trực tiếp theo phương pháp này thì có thể sẽ nhanh hơn được phần nào, vừa khép kín, vừa an toàn. Có lẽ do phải giữ concept cũ để kết nối một mạch với game core.

#### Swagger docs

Trong bài giới thiệu về kiến trúc **LCU**, họ có tiết lộ về xây dựng tài liệu cho API bằng Swagger UI.
<p align='center'>
<img src='https://technology.riotgames.com/sites/default/files/lcu_swagger.jpg' height='400px'>
</p>

> Điều này giúp ta dễ dàng sử dụng API hơn, cho dù là end-users.

### Tìm cổng kết nối đến LCU

RTMP mà Riot sử dụng là RTMPT (Tunneled - đường hầm), các gói tin được trao đổi thông qua HTTP. Khoảng 2018 thì Riot bắt đầu cập nhật bảo mật cho RTMP, thêm **TSL**/**SSL** và sử dụng **HTTPS** cho cổng kết nối.

> Vậy ta chỉ cần biết được cổng kết nối và phương thức xác thực là có thể truy cập vào hệ thống.

Đầu tiên, bạn hãy mở **League Client** lên, và để đó.

Tiếp theo là truy cập vào thư mục chứa **LCU**, trên **Windows** có thể click phải vào process **LeagueClient.exe** và chọn "Open file location" (trong Task Manager).
```js
> mẫu đường dẫn
..?/..?/LeagueClient/               ; Garena
..?/Riot Games/League of Legends/   ; Riot
```

Tại đây, bạn sẽ thấy có một file tên là **lockfile**, mở nó sẽ thấy nội dung có dạng như sau:
```
> lockfile
LeagueClient:01234:56789:abcdef123456ABCDEF123456:https
```
- Xem dấu hai chấm như là điểm ngăn cách, ta sẽ được 5 phần (từ trái qua).
- Phần thứ ba chính là **port** (cổng của kết nối).
- Phần thứ tư là remoting auth, mình sẽ gọi là **pass** (mật khẩu xác thực).
- Về giao thức kết nối thì mặc định là **HTTPS** luôn.

#### Nếu việc tìm thư mục quá rắc rối đối với bạn, hãy thử dùng lệnh.
Trên **Windows**, mở **cmd** dưới quyền admin và nhập:
```bash
WMIC PROCESS WHERE name='LeagueClientUx.exe' GET commandline
```
Còn đối với **OSX** thì nhập vào terminal:
```bash
ps x -o args | grep 'LeagueClientUx'
```

Kết quả nhận được sẽ là các tham số truyền vào khi **LeagueClientUx** được thực thi, đoạn sau chính là pass và port cần tìm:
```
"--remoting-auth-token=abcdef123456ABCDEF123456" "--app-port=56789"
```
Tại sao có thể dùng cách này?
> À, LeagueClientUx là tệp thực thi độc lập, không có cách nào khác để truyền **dữ liệu động** vào nó ngoài việc truyền qua tham số khi thực thi.

> Process **LeagueClient** là phần chính của client (chỉ chạy nền), nó sinh ra auth; còn **LeagueClientUx** mới là giao diện, thằng này nạp auth thông qua tham số để xác thực.

Vậy theo ví dụ trên, ta có đường dẫn sau: `https://127.0.0.1:56789`

> Nên nhớ, mỗi lần mở League Client thì pass và port sẽ thay đổi.

### Trình duyệt web để làm gì?

Chắc ai cũng thắc mắc về trình duyệt web trong phần đầu của bài viết nhỉ. Tận dụng được là quất thoy 😁
- Nhà nhà đều có nó, mọi người đều có thể làm được.
- Trình duyệt hỗ trợ console built-in khá mạnh, có thể gửi request dễ dàng nên không cần sử dụng công cụ nào khác.

Trong bài này mình khuyên nên sử dụng  trình duyệt nhân **Chromium** hoặc **FireFox** có hỗ trợ **ES6**.

### Tìm API

Tại đây có 2 lựa chọn cho bạn, nhưng mình khuyến khích nên dùng cách thứ hai.

#### Cách 1 - dùng đồ làm sẵn
[Rift Explorer](https://github.com/Pupix/rift-explorer) là một công cụ dựa trên **nodejs** + **electronjs**, giúp khám phá **LCU API**, đối với máy chủ của **Garena** thì không hiệu nghệm đâu. 

Ngoài ra, bạn có thể truy cập trang [lcu.vivide.re](http://lcu.vivide.re/) để xem **API** được trích xuất sẵn (tuy là từ **v8.24** nhưng vẫn còn dùng được).

#### Cách 2 - tốn cơm nhưng hiệu quả
Tắt client đang chạy, truy cập thư mục chứa **LCU**, mở file có tên **system.yaml** và thêm dòng sau:
```yaml
> system.yaml
< thêm dòng này vào cuối file
[        voice_url: https://...
enable_swagger: true
```
> Chỗ này thực sự khó hiểu, đến tận tay game thủ mà vẫn giữ option đó 🤣

Khởi động League Client lên. Sau đó là khởi động trình duyệt trong chế độ **insecure** (không an toàn), đối với trình duyệt nhân **Chromium** có thể chạy với các flag (cờ) sau:
```bash
> terminal
< Trên {Windows} thì dùng {cmd} dưới quyền admin.
chrome --ignore-certificate-errors --disable-web-security --user-data-dir="./"
```
- Mục đích của việc này là tránh bị dính [Cross-Origin Read Blocking](https://stackoverflow.com/questions/50873764/cross-origin-read-blocking-corb) khi request vào trang _không chính chủ_.
- Phải tắt hết các tab của trình duyệt trước, nếu điều này làm phiền bạn thì có thể tải bản build sẵn của trình duyệt Chromium [tại đây](https://download-chromium.appspot.com/).

Tiếp tục truy cập vào trang [petstore.swagger.io](https://petstore.swagger.io/) để sử dụng **Swagger UI** (live demo). Đây là v3 nên khá là lag, bạn có thể tải source v2 [tại đây](https://github.com/swagger-api/swagger-ui/releases/tag/v2.2.8), sau khi giải nén sẽ thấy bên trong có thư mục **dist**, kéo file **index.html** bên trong rồi thả vào trình duyệt.

Trong **Swagger UI**, bạn nhập đường dẫn sau và nhấn nút **Explore**:
```
https://127.0.0.1:PORT/swagger/v2/swagger.json
```
- Chỗ PORT thay bằng port của bạn.

Sau đấy sẽ có một hộp thoại đăng nhập hiện ra, phần tên người dùng để là **riot**, còn mật khẩu thì nhập pass lúc nãy. Chờ một tí cho nó tải xong rồi tận hưởng!

### Xây dựng thuật toán

Tìm mãi trong các **API**, cuối cùng thì mình cũng chọn ra được 6 thằng này:
```
1. GET   /lol-champions/v1/owned-champions-minimal
2. GET   /lol-matchmaking/v1/ready-check
3. POST  /lol-matchmaking/v1/ready-check/accept
4. GET   /lol-champ-select/v1/session
5. PATCH /lol-champ-select/v1/session/actions/{id}
6. POST  /lol-champ-select/v1/session/actions/{id}/complete
```
**#1** để xem tất cả các tướng có thể chơi được (bao gồm tướng đã sở hữu và miễn phí). Còn **#2** dùng để kiểm tra xem có phải đang tìm trận hay không, và **#3** để chấp nhận trận đấu.

Đi ngược từ **#6** xuống, cái này để lock tướng đang chọn, nhưng muốn lock được thì phải pick tướng trước. Vậy là phải dùng **#5** để chọn ra một tướng. Cả hai thằng đều có `id` là số cần tìm, và theo mình tìm hiểu được, thì đây là vị trí của bạn trong trận.
> Trong đấu tùy chọn hoặc phòng tập, số này mặc định là **thứ tự gia nhập của bạn** + **số lượng BOT** (nhân vật máy).

```json
> đoạn JSON mẫu
actions: [[
    {actorCellId: 1, id: 2},
    {actorCellId: 2, id: 3},
    {actorCellId: 3, id: 1}
 ]],
localPlayerCellId: 3
[
```

Để có được `id` một cách tự động, thì ta lấy `localPlayerCellId` - thứ tự chọn tướng của bạn (thường gọi là s1, s2, s3...) rồi tìm trong `actions` sẽ có `actorCellId` mang giá trị tương tự, từ đó suy ra `id`. Vậy trong đoạn mẫu trên thì `id` sẽ là 1.

## THỰC HIỆN

> Nếu bạn bỏ qua phần Ngâm cứu thì nên quay lại mục [Tìm cổng kết nối đến LCU](#tìm-cổng-kết-nối-đến-lcu) ở trên để xem cách lấy **port** và **pass**.

### Truy cập và lấy ID tướng

Mở trình duyệt web và nhập dòng sau vào thanh địa chỉ rồi nhấn enter:
```
https://127.0.0.1:PORT/lol-champions/v1/owned-champions-minimal
```
- Chỗ **PORT** thay bằng port của bạn.

Sau đó, có một hộp thoại yêu cầu đăng nhập hiện ra:
<p align="center">
    <img src="./login.png">
</p>

Phần tên người dùng cứ để là **riot**, còn mật khẩu thì nhập đoạn pass lúc nãy vào. Nếu đăng nhập thành công, trình duyệt sẽ hiện ra một đoạn JSON dài sòng sọc như sau:
```json
[{
    "active": true,
    "alias": "Annie",
    "banVoPath": "/lol-game-data/assets/v1/champion-ban-vo/1.ogg",
    ...
```

Đây chính là dữ liệu về tất cả tướng mà bạn có thể chơi được (bao gồm tướng đã mua và miễn phí). Hãy mở thanh tìm kiếm trong trang (nhấn **Ctrl**+**F**) và nhập `"name":"tên_tướng`. Thay `tên_tướng` bằng tướng bạn muốn tìm, `yasuo` chẳng hạn.
```
..."id":157,"name":"Yasuo","ownership"...
```

Nếu tìm kiếm trùng khớp, ta sẽ thấy trước đoạn tô đậm sẽ là ID của tướng, ghi lại ID của một vài tướng mà bạn muốn chọn.

### Viết code

Mở console ngay tại tab lúc nãy để nhập code, nếu bạn sử dụng **Chrome** hay **CocCoc** trên Windows thì có thể nhấn tổ hợp phím **Ctrl**+**Shift**+**J**.

Tạo hàm request đơn giản với  `fetch`, nhập code sau vào console và nhấn enter:
```js
var request = async (method, url, body = undefined) => {
    const data = await fetch(url, {
        method: method,
        body: body,
        headers: {'Content-type': 'application/json; charset=UTF-8'}
    }).then(res => res.text())
      .then(txt => JSON.parse(txt.length ? txt : '{}'));
    return data;
};
```
- Có thể bỏ qua tham số `body` (cho phương thức **GET**).
- Dùng với `await` để đồng bộ.

Hàm kiểm tra có phải đang chờ chấp nhận trận đấu:
```js
> console
< Khi tìm thấy trận, thuộc tính {state} sẽ mang giá trị là {InProgress}.
[
var isInProgress = async () => (await request(
    'GET', '/lol-matchmaking/v1/ready-check')).state === 'InProgress';
```

Hàm chấp nhận trận đấu:
```js
> console
[
var acceptMatch = async () => await request(
    'POST', '/lol-matchmaking/v1/ready-check/accept');
```

Hàm lấy action ID:
```js
> console
< Trả về -1 nếu không phải đang chọn tướng. Dùng {filter} để lọc ra {id} của chính mình.
[
var getActionId = async () => {
    var {localPlayerCellId, actions} =
        await request('GET', '/lol-champ-select/v1/session');
    if (!actions) return -1;
    return actions[0].filter(v =>
        v.actorCellId === localPlayerCellId)[0].id;
};
```

Hàm `pick` và hàm `lock`:
```js
> console
[
var pick = async (id, championId) => Object.keys(await request(
    'PATCH', `/lol-champ-select/v1/session/actions/${id}`,
    JSON.stringify({championId}))).length === 0;

var lock = async (id) => await request(
    'POST', `/lol-champ-select/v1/session/actions/${id}/complete`);
```
- Tham số `id` lấy từ hàm `getActionId`.
- Khi chọn tướng thành công thì ta được đoạn JSON rỗng.

Và cuối cùng là hàm auto chấp nhận trận dấu và pick-lock:
```js
> console
< Khi khóa tướng xong sẽ dừng auto.
[
var start = (championIds = [157]) => {
    var inv = setInterval(async () => {
        var id;
        if (await isInProgress()) {
            await acceptMatch();
        } else if ((id = await getActionId()) > -1) {
            for (var i=0; i<championIds.length; i++)
                if (await pick(id, championIds[i])) break;
            await lock(id);
            clearInterval(inv);
        }
    }, 250);
};
```
- Tham số `championIds` là mảng ID tướng, phòng trường hợp có người chọn tướng đó trước bạn, mặc định là **Yasuo**.
- Dùng `setInterval` để check liên tục, vì ta không có event nào cả.

### Test

Chỉ cần gọi hàm `start` và truyền vào một mảng ID của tướng:
```js
> console
[
start([157, 10, 1]);
```
- **Yasuo**, **Kayle** và **Annie**, hãy đảm bảo rằng bạn có thể chọn được ít nhất 1 trong 3 tướng này.
- Hoặc thay bằng ID của các tướng khác.

Vậy là đã xong hết mọi thứ, hãy tạo một trận **phòng tập** hoặc **đấu thường** rồi bắt đầu và **buông chuột**.

<p align='center'>
<img src='https://gamek.mediacdn.vn/2018/5/9/ys-15258553135441465937409.gif'>
</p>

## Bonus

Bạn có thể theo dõi và cập nhật code tại repo này
- [https://github.com/nomi-san/yasuo](https://github.com/nomi-san/yasuo)

Cũng trong repo này, có thêm vài thứ có thể giúp ích cho bạn
- **yasuoit** - viết bằng **AutoIt**, có chức năng tương tự như trong bài viết.
- **yasharp** - viết bằng **C#**, chức năng tương tự luôn, nhưng mà tương tác qua **khung chat** đấy, sử dụng websocket để bắt sự kiện từ LCU.

<p align='center'>
    <img src='./yasharp-demo.jpg'>
    <br>
    Demo gõ <strong>/?</strong> vào khung chat.
</p>

Trong **node.js**:
- Gửi request (nên dùng **request-promise**), có 2 cách:
    - Nạp credentials trực tiếp vào uri:<br>`https://riot:PASS@127.0.0.1:PORT/...`
    - Hoặc nạp thông qua header:<br>`{'Authorization': 'Basic ' + btoa('riot:' + PASS)}`
- Nếu bạn muốn bắt sự kiện LCU, hãy xem qua [gist này](https://gist.github.com/Pupix/eb662b1b784bb704a1390643738a8c15) (chỗ comment của mình ngắn hơn).
    ```js
    > index.js
    const WebSocket = require('ws');
    // Vô hiệu hóa xác thực TLS.
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

    // Kết nối vào websocket ngầm của LCU, protocol là WAMP.
    const ws = new WebSocket('wss://riot:PASS@127.0.0.1:PORT/', 'wamp');

    // Đăng ký topic OnJsonApiEvent.
    ws.on('open', () => {
        ws.send('[5, "OnJsonApiEvent"]');
    });

    // Nhận message chỉ khi League Client (UI) gửi request.
    ws.on('message', (msg) => {
        console.log(msg); // gồm JSON, uri và event name.
    });
    ```

Ngoài ra còn vài thứ khác:
- [Mimic](https://github.com/molenzwiebel/Mimic) - một app giúp điều khiển **League Client** qua LAN, dùng **C#** để viết cổng truyền tải dữ liệu bằng **websocket**, giao diện thì viết bằng **Vuejs**.
- [Deceive](https://github.com/molenzwiebel/Deceive) - giúp bạn offline (ẩn đi) sau khi đăng nhập.

## FAQ

### # Về việc pick-lock tướng

#### Tỉ lệ thành công là bao nhiêu?
> 100%, nếu mất kết nối thì là 0%.

#### Có bị khóa tài khoản không?
> **Không**, đây đơn thuần chỉ là _"mượn tay mượn chân"_ của client thôi (do ta dùng API một cách hợp pháp).

> Nhưng trong tương lai khác nhé! Bạn có nghe về một số tool modskin chứ? Không gây hại ai, nhưng do bị lạm dụng quá mức nên bị **Garena** cho vào danh sách đen (phần mềm thứ ba can thiệp vào game) với tội danh mà ai cũng cho là vô lý - "**cướp miếng cơn manh áo**". Và tool pick-lock trong bài này cũng có thể đi theo vết xe đỗ của modskin.

#### Tại sao một số tool ở cuối bài không hoạt động trên Windows 7?
> Chắc bạn dùng Windows 7 quá cũ rồi, thử cài thêm [cái này](http://www.catalog.update.microsoft.com/search.aspx?q=kb3140245) và [cái này nữa](http://download.microsoft.com/download/0/6/5/0658B1A7-6D2E-474F-BC2C-D69E5B9E9A68/MicrosoftEasyFix51044.msi).

#### Đồng đội cùng sử dụng pick-lock này thì sẽ như thế nào?
> Do sử dụng API thông qua request đến LCU server nên sẽ phục thuộc vào đường truyền mạng.

> Trong phần hướng dẫn trên, mình đặt độ trễ là 250ms, bạn có thể thay đổi. Đối với 2 tool đã nói ở trên, thì **yasharp** sẽ có độ trễ nhỏ hơn **yasuoit** do sử dụng callback (từ LCU websocket) thay vì dùng vòng lặp để kiểm tra (xem mã nguồn sẽ rõ).

### # Vấn đề khác

#### Tôi có thể làm gì sau khi đọc bài viết này?
> Nếu bạn thực sự hiểu được ẩn ý trong đây thì không cần phải xem câu hỏi này. Đơn giản là viết được "**tool**".

#### Garena khởi động LMHT như thế nào?
> Vẫn là truyền tham số vào **LeagueClient.exe**, thử xem các tham số của nó bằng lệnh trong mục [Tìm cổng kết nối đến LCU](#tìm-cổng-kết-nối-đến-lcu). Bạn sẽ có thấy một đoạn **token** của Garena sinh ra, hạn dùng của nó là 3p sau khi tắt League Client.

#### Có thể custom pass và port của LCU không?
> Không thành vấn đề, thêm 2 tham số này vào khi thực thi **LeagueClient** (đối với máy chủ **Garena** thì copy tham số lấy được từ câu hỏi ở trên):<br>`--remoting-auth-token=abcdef123456fedcba654321 --app-port=1234`

#### Làm sao để chạy nhiều League Client cùng lúc?
> Thêm tham số `--allow-multiple-clients` khi thực thi **LeagueClient**.

#### Tôi có thể đóng hết tất cả League Client của một quán net không?
> Có thể, nếu bạn truy cập được máy chủ và tìm được IP cục bộ của các máy tính cùng port của League Client đang chạy. Sau đó chỉ cần một thiết bị có thể truy cập mạng của quán net và gửi POST request:<br> `https://riot:PASS@LAN_IP:PORT/process-control/v1/process/quit`

#### Giống như câu hỏi trên, nhưng mục đích dành cho quản lý quán net?
> Được, bạn muốn xem thông tin của người chơi ư?
