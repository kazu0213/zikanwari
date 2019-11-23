// -----------------------------------------------------------------------------
// モジュールのインポート
const server = require("express")();
const line = require("@line/bot-sdk"); // Messaging APIのSDKをインポート
const weeks = new Array('日','月','火','水','木','金','土');

const lastup = new Date(document.lastModified);

const year = lastup.getYear(); // 年
const month = lastup.getMonth() + 1; // 月
const day = lastup.getDate(); // 日
const week = weeks[ lastup.getDay() ]; // 曜日
const hour = lastup.getHours(); // 時
const min = lastup.getMinutes(); // 分
const sec = lastup.getSeconds(); // 秒

if(year < 2000) { year += 1900; }

// 数値が1桁の場合、頭に0を付けて2桁で表示する指定
if(month < 10) { month = "0" + month; }
if(day < 10) { day = "0" + day; }
if(hour < 10) { hour = "0" + hour; }
if(min < 10) { min = "0" + min; }
if(sec < 10) { sec = "0" + sec; }

// -----------------------------------------------------------------------------
// パラメータ設定
const line_config = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN, // 環境変数からアクセストークンをセットしています
    channelSecret: process.env.LINE_CHANNEL_SECRET // 環境変数からChannel Secretをセットしています
};

// -----------------------------------------------------------------------------
// Webサーバー設定
server.listen(process.env.PORT || 3000);

// APIコールのためのクライアントインスタンスを作成
const bot = new line.Client(line_config);
// -----------------------------------------------------------------------------
// ルーター設定
server.post('/bot/webhook', line.middleware(line_config), (req, res, next) => {
    res.sendStatus(200);
    // すべてのイベント処理のプロミスを格納する配列。
    let events_processed = [];

    // イベントオブジェクトを順次処理。
    req.body.events.forEach((event) => {
        // この処理の対象をイベントタイプがメッセージで、かつ、テキストタイプだった場合に限定。
        if (event.type == "message" && event.message.type == "text") {
            let text = "何時限目を知りたいのかな？"+year;
            switch (event.message.text) {
                case 'おはよう':
                    text = "おはよう！！"
                    break;
                case 'こんにちは':
                    text = "こんにちは！！"
                    break;
                case 'こんばんは':
                    text = "こんばんは！！"
                    break;
            }
            // replyMessage()で返信し、そのプロミスをevents_processedに追加。
            events_processed.push(bot.replyMessage(event.replyToken, {
                type: "text",
                text: text
            }));
        }
    });

    // すべてのイベント処理が終了したら何個のイベントが処理されたか出力。
    Promise.all(events_processed).then(
        (response) => {
            console.log(`${response.length} event(s) processed.`);
	});
});
