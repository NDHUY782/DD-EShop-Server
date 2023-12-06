const Parser = require('rss-parser');
const fs = require('fs');
const moment = require('moment');

const rssHelpers = require(`${__path_helpers}rss`);
const parser = new Parser();

module.exports = {
    getRss: async (req, res) => {

        let time = 1000*60
        let data = fs.readFileSync('src/public/uploads/rss.txt')

        let items = JSON.parse(data)

        if (new Date() - new Date(items.date) > time) {
            let feed = await parser.parseURL('https://vnexpress.net/rss/the-thao.rss');

            let newData = feed.items.map((item) => {
                let content = item.content
                item.content = content.match(/<img([\w\W]+?)>/g)[0]
                return item
            })
            let rss = { 
                date: new Date(),
                items: newData,
            }

            fs.writeFile('src/public/uploads/rss.txt', JSON.stringify(rss), err => {
                if (err) {
                  console.error(err);
                }
              }); 
              console.log('1 phut');
        } else {
            console.log('chưa đc 1 phút');
        }

        res.send(items);
    },
    
}
