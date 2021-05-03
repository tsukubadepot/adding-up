'use strict';
// モジュールの呼び出し
const fs = require('fs')
const readline = require('readline')

// ストリームの作成
// ほとんどの入出力がストリームとして取り扱われる
const rs = fs.ReadStream('./popu-pref.csv')

// 入力として rs を指定しオブジェクトを生成
const rl = readline.createInterface({ 'input': rs, 'output': {}})

// 連想配列を作る
const map = new Map()

// line イベントが発生した時の処理
rl.on('line', (lineString) => {
    const columns = lineString.split(',')
    const year = parseInt(columns[0])
    const prefecture = columns[2]
    const popu = parseInt(columns[7])

    if (year === 2010 || year === 2015) {
        // prefecture をキーとして値を得る
        let value = map.get(prefecture)

        // キーに対応した値がなければ新しく作る
        if (!value) {
            value = {
                popu10: 0,
                popu15: 0,
                change: null
            }
        }

        if (year === 2010) {
            value.popu10 += popu
        }

        if (year === 2015) {
            value.popu15 += popu
        }

        // キーと値をセットする
        map.set(prefecture, value)
    }
})


// 読み込み開始
rl.resume()

rl.on('close', () => {
    for (let pair of map) {
        const value = pair[1]
        value.change = value.popu15 / value.popu10
    }

    const rankingArray = Array.from(map).sort((pair1, pair2) => {
        return pair2[1].change - pair1[1].change
    })

    const rankingStrings = rankingArray.map((pair) => {
        return pair[0] + ': ' + pair[1].popu10 + '=>' + pair[1].popu15 + '　変化率' + pair[1].change
    })

    console.log(rankingStrings)
})