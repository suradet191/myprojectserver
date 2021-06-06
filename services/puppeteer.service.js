const puppeteer = require("puppeteer-core");
const { JSDOM } = require("jsdom");
var htmlparser = require("htmlparser");
var html2json = require("html2json");
const cheerio = require("cheerio");

class PuppeteerService {
  constructor() {}
  async test() {
    return new Promise(async (resolve, reject) => {
      console.log("fn test");
      const browser = await puppeteer.launch({ headless: false });
      resolve("test ok");
    });
  }

  async dooseriesth() {
    return new Promise(async (resolve, reject) => {
      console.log("fn test2");
      var dom = await JSDOM.fromURL(
        "https://dooseriesth.com/movie/1165/my-dear-destiny-2020/"
      );
      let titlename = await this.getTitle(dom);
      let titleimg = await this.getTitleImage(dom);
      let linkListEpisode = await this.getLinkEpisode(dom);
      console.log(linkListEpisode);
      let result = { name: titlename, image: titleimg, episode: [] };
      if (linkListEpisode && linkListEpisode.length > 0) {
        for (let index = 0; index < linkListEpisode.length; index++) {
          const episode = linkListEpisode[index];
          const link = await this.getSrcIframe(episode.link);
          result.episode.push({
            ep: linkListEpisode[index].ep,
            src: link,
          });
        }
      }
      console.log(result);
      resolve(result);
    });
  }

  async getTitle(dom) {
    return new Promise(async (resolve, reject) => {
      try {
        const _$ = cheerio.load(dom.serialize());
        const raw = _$(".movie-title");
        let title = "";
        if (raw && raw[0] && raw[0].children[0] && raw[0].children[0].data) {
          title = raw[0].children[0].data;
        }
        resolve(title);
      } catch (error) {
        console.log("get title error");
        console.error(error);
        resolve("");
      }
    });
  }

  async getTitleImage(dom) {
    return new Promise(async (resolve, reject) => {
      try {
        const _$ = cheerio.load(dom.serialize());
        const raw = _$("[class='container py-3']").find("img");
        let result = "";
        if (raw && raw[0] && raw[0].attribs && raw[0].attribs.src) {
          result = raw[0].attribs.src;
        }
        resolve(result);
      } catch (error) {
        console.log("get title error");
        console.error(error);
        resolve("");
      }
    });
  }

  async getLinkEpisode(dom) {
    return new Promise(async (resolve, reject) => {
      try {
        const _$ = cheerio.load(dom.serialize());
        const raw = _$(".ep-list");
        debugger;
        let link_list = [];
        raw.children().each((i, element) => {
          var link = _$(element)[0].attribs.href;
          var ep = _$(element).find(".m-0").text();
          link_list.push({ link: link, ep: ep, index: i + 1 });
        });
        //   .each((i,element) => {
        //     var link = _$(element)[0].attribs.href
        //     var ep = _$(element).find('.m-0').text()
        //     list1.push({"link":link,"ep":ep,"index":i+1})
        //  })
        resolve(link_list);
      } catch (error) {
        console.log("get link episode error");
        console.error(error);
        resolve([]);
      }
    });
  }

  async getSrcIframe(link, ref = null) {
    return new Promise(async (resolve, reject) => {
      try {
        if (link) {
          var dom = await JSDOM.fromURL(link);
          const _$ = cheerio.load(dom.serialize());
          const raw = _$("iframe");
          if (raw && raw[0] && raw[0].attribs && raw[0].attribs.src) {
            var next = raw[0].attribs.src;
            if (next && next.indexOf("https") < 0) {
              next = "https:" + next;
            }
            ref = await this.getSrcIframe(next, link);
            return resolve(ref);
          }
        }
        console.log("getSrcIframe", link);
        resolve(link);
      } catch (error) {
        console.log("get link episode error");
        console.error(error);
        reject("");
      }
    });
  }
}
module.exports = {
  PuppeteerService,
};
