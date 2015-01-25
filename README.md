# What is NCCU forking share

- 這是一個為了應付政大課程查詢系統過度忙碌而生的網站。

- 我認為把server端太複雜的處理簡化呈現在前端是有趣的事情，這次就是一個好例子。

- 本來是的title是NCCU fucking shit，不過基於學校方無法接受這個名字，我把它換成歡迎大家fork和分享的forking share。

- 是個簡單的Single page application。

# 使用方法

- 如果你要整理乾淨的資料可以使用`node clean_data.js 資料來源路徑`

- 接著就可以在console看到整理過後的資料了！Magic！



# 這個project用到了什麼

- regular expression：正規表示法、正則表示式。這是我第一次使用它來比對字串，不過是到第二階段才開始使用，所以前面比對的code看起來會顯得有點笨笨的。

- Javascript: 用到一些常用的library。

- D3.js: 比較特別的要講一下這個，因為這是我最近專案在用的，所以想說拿來練習下怎樣做文字雲ＸＤ。

- CSS/HTML

- 是的，這是一個純靜態的網站，所有資料的處理必須在本機處理完再丟上來，乍看之下很蠢，但卻避開了許多server的問題。