/**
 * 陈睿：B站最有争议的男人 — Remotion Video Component
 * 62 sections, ~10s pacing, Bilibili pink/blue theme with dramatic dark sections
 */

import React from "react";
import { Audio, staticFile, AbsoluteFill } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import timing from "../../public/timing.json";
import type { VideoProps } from "./Root";

import {
  T01_HeroSplit,
  T02_PhotoOverlay,
  T04_QuotePortrait,
  T07_MagazineSpread,
  T09_BigNumber,
  T11_FeaturedImage,
} from "./section-templates";

import {
  Scale4K,
  ProgressBar,
  getPresentation,
} from "./components";

const FONT = "'PingFang SC', 'Noto Sans SC', -apple-system, sans-serif";
const SILENT_EXTRA_FRAMES = 150;
const M = "media/chenrui-bilibili-ceo";

/* ── Color palettes per narrative phase ── */
const C = {
  // B站 pink — intro, outro, neutral
  bili: { pri: "#FB7299", bg: "#FFF5F7", txt: "#333333", acc: "#00A1D6" },
  biliW: { pri: "#FB7299", bg: "#FFFFFF", txt: "#333333", acc: "#00A1D6" },
  // Blue — tech/career
  tech: { pri: "#0277BD", bg: "#E3F2FD", txt: "#37474F", acc: "#0288D1" },
  techW: { pri: "#0277BD", bg: "#FFFFFF", txt: "#37474F", acc: "#0288D1" },
  // Red/dark — controversy, anger, drama
  drama: { pri: "#E53935", bg: "#FFEBEE", txt: "#333333", acc: "#C62828" },
  dramaD: { pri: "#FF5252", bg: "#1A1A2E", txt: "#E0E0E0", acc: "#FF8A80" },
  // Gold — money, business, stock
  gold: { pri: "#E65100", bg: "#FFF3E0", txt: "#4E342E", acc: "#F57C00" },
  goldW: { pri: "#E65100", bg: "#FFFBF5", txt: "#4E342E", acc: "#F57C00" },
  // Green — achievements, positive
  green: { pri: "#2E7D32", bg: "#E8F5E9", txt: "#1B5E20", acc: "#43A047" },
  greenW: { pri: "#2E7D32", bg: "#F1F8F2", txt: "#1B5E20", acc: "#43A047" },
  // Gray — analysis, neutral
  gray: { pri: "#455A64", bg: "#ECEFF1", txt: "#37474F", acc: "#607D8B" },
  grayW: { pri: "#455A64", bg: "#F5F7F8", txt: "#37474F", acc: "#607D8B" },
};

/* ── Image shorthand ── */
const I = {
  portrait1: `${M}/chenrui_163_01.jpg`,
  portrait2: `${M}/chenrui_163_02.jpg`,
  portrait3: `${M}/chenrui_163_03.jpg`,
  portrait4: `${M}/chenrui_163_04.jpg`,
  portrait5: `${M}/chenrui_163_05.jpg`,
  portrait6: `${M}/chenrui_163_06.jpg`,
  ipo1: `${M}/ipo_ceremony_01.jpeg`,
  ipo2: `${M}/ipo_ceremony_02.jpeg`,
  ipo3: `${M}/ipo_ceremony_03.jpeg`,
  ipoCgtn: `${M}/ipo_cgtn.jpg`,
  brand: `${M}/labbrand_bilibili_brand.png`,
  content: `${M}/labbrand_bilibili_content.jpeg`,
  iface: `${M}/labbrand_bilibili_interface.jpeg`,
  ipoLab: `${M}/labbrand_bilibili_ipo.png`,
  platform: `${M}/labbrand_bilibili_platform.jpeg`,
};

const SectionComponent = ({
  section,
  props,
}: {
  section: (typeof timing.sections)[0];
  props: VideoProps;
}) => {
  switch (section.name) {

    // ════════════════════════════════════════
    //  PART 1: INTRO + BACKGROUND (12 sections)
    // ════════════════════════════════════════

    case "hero":
      return (
        <T02_PhotoOverlay
          title="陈睿"
          subtitle="B站最有争议的男人"
          caption="人人喊打，却谁也离不开他"
          image={I.portrait1}
          overlayColor="rgba(0,0,0,0.55)"
        />
      );

    case "who":
      return (
        <T01_HeroSplit
          title="他不是创始人"
          subtitle="B站创始人是徐逸 · 江湖人称9bishi"
          description="先帝创业未半，睿帝中道接盘"
          image={I.brand}
          primaryColor={C.bili.pri}
          backgroundColor={C.biliW.bg}
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    case "ruidi":
      return (
        <T04_QuotePortrait
          quote="先帝创业，睿帝收割——在老粉眼里，陈睿就是那个篡位夺权的人。"
          author="陈睿"
          role="外号「睿帝」· 对应徐逸的「先帝」"
          portrait={I.portrait2}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "background":
      return (
        <T01_HeroSplit
          title="1978 · 成都"
          subtitle="三线建设家庭，父母隶属民航系统"
          description="在厂区长大，一直说普通话"
          image={I.portrait3}
          primaryColor={C.gray.pri}
          backgroundColor={C.gray.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "anime_fan":
      return (
        <T07_MagazineSpread
          title="二次元少年"
          bullets={[
            "家里第一台电视机开启了动漫之旅",
            "圣斗士星矢、龙珠、灌篮高手——80后二次元启蒙三件套",
          ]}
          image={I.content}
          primaryColor={C.bili.pri}
          backgroundColor={C.biliW.bg}
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    case "computer_nerd":
      return (
        <T11_FeaturedImage
          title="电脑城少年"
          caption="高中泡电脑城，成都信息工程大学毕业——互联网人的标准起点"
          tag="技术宅"
          image={I.portrait4}
          primaryColor={C.tech.pri}
          backgroundColor={C.tech.bg}
          textColor={C.tech.txt}
          accentColor={C.tech.acc}
        />
      );

    case "jinshan":
      return (
        <T09_BigNumber
          number="2001"
          label="加入金山 · 杀毒引擎工程师"
          description="最底层做起——那个年代的互联网人，很多都从杀毒软件起家"
          image={I.portrait5}
          overlayColor="rgba(2,119,189,0.65)"
        />
      );

    case "jinshan_rise":
      return (
        <T01_HeroSplit
          title="五年封侯"
          subtitle="从基层工程师到金山毒霸事业部总经理"
          description="不管怎么黑他，能力确实强"
          image={I.portrait6}
          primaryColor={C.tech.pri}
          backgroundColor={C.techW.bg}
          textColor={C.tech.txt}
          accentColor={C.tech.acc}
        />
      );

    case "startup":
      return (
        <T11_FeaturedImage
          title="贝壳安全"
          caption="2008年创业 · 中国第一个云安全公司——名字听着像房产中介"
          tag="2008"
          image={I.platform}
          primaryColor={C.tech.pri}
          backgroundColor={C.tech.bg}
          textColor={C.tech.txt}
          accentColor={C.tech.acc}
        />
      );

    case "cheetah":
      return (
        <T01_HeroSplit
          title="猎豹移动"
          subtitle="贝壳被金山并购 → 猎豹联合创始人 → 2014纽交所上市"
          description="第一桶金到手"
          image={I.portrait1}
          primaryColor={C.gold.pri}
          backgroundColor={C.goldW.bg}
          textColor={C.gold.txt}
          accentColor={C.gold.acc}
        />
      );

    case "angel":
      return (
        <T09_BigNumber
          number="2011"
          label="天使投资B站"
          description="一笔改变中国视频行业格局的投资"
          image={I.brand}
          overlayColor="rgba(251,114,153,0.6)"
        />
      );

    case "join":
      return (
        <T02_PhotoOverlay
          title="睿帝登基"
          subtitle="2014年全职加入B站 · 出任董事长"
          caption="放弃上市公司高管，全力押注二次元"
          image={I.ipo1}
          overlayColor="rgba(0,0,0,0.5)"
        />
      );

    // ════════════════════════════════════════
    //  PART 2: PROMISES & SLAPS (8 sections)
    // ════════════════════════════════════════

    case "promise_era":
      return (
        <T01_HeroSplit
          title="许诺时代"
          subtitle="陈睿最辉煌也最打脸的篇章"
          description="这个男人，最擅长的就是画饼和许诺"
          image={I.portrait2}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "no_ads":
      return (
        <T04_QuotePortrait
          quote="正版番剧永远不添加贴片广告。"
          author="陈睿"
          role="2014年 · 微博公开承诺 · 请注意关键词——永远"
          portrait={I.portrait3}
          primaryColor={C.bili.pri}
          backgroundColor={C.biliW.bg}
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    case "ads_slap":
      return (
        <T09_BigNumber
          number="2年"
          label="从「永远」到打脸"
          description="2016年 · B站五部番剧出现15秒贴片广告"
          image={I.iface}
          overlayColor="rgba(229,57,53,0.65)"
        />
      );

    case "user_rage":
      return (
        <T02_PhotoOverlay
          title="众怒"
          subtitle="用户攻占陈睿微博 · 骂他出尔反尔"
          caption="说好的永远呢？"
          image={I.portrait4}
          overlayColor="rgba(198,40,40,0.6)"
        />
      );

    case "excuse":
      return (
        <T07_MagazineSpread
          title="无奈之举"
          subtitle="陈睿的解释"
          bullets={[
            "版权方强制要求所有平台统一加贴片广告",
            "B站也是被迫的——翻译：别怪我，怪资本",
          ]}
          image={I.content}
          primaryColor={C.gray.pri}
          backgroundColor={C.grayW.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "famous_quote":
      return (
        <T04_QuotePortrait
          quote="B站未来有可能会倒闭，但绝不会变质。"
          author="陈睿"
          role="2016年 · 载入B站史册的名言"
          portrait={I.portrait5}
          primaryColor={C.bili.pri}
          backgroundColor={C.bili.bg}
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    case "meme_flip":
      return (
        <T01_HeroSplit
          title="名言反转"
          subtitle="B站可能会变质，但绝不会倒闭"
          description="讽刺效果拉满 · 至今仍在流传"
          image={I.brand}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "apology_king":
      return (
        <T11_FeaturedImage
          title="道歉之王"
          caption="从此获封「全互联网最爱道歉的CEO」——他自己澄清说那叫「解释」"
          tag="新头衔"
          image={I.portrait6}
          primaryColor={C.drama.pri}
          backgroundColor={C.biliW.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    // ════════════════════════════════════════
    //  PART 3: DID IT CHANGE? (7 sections)
    // ════════════════════════════════════════

    case "quality_check":
      return (
        <T09_BigNumber
          number="变了吗？"
          label="陈睿说B站绝不会变质"
          description="那我们来检验一下"
          image={I.iface}
          overlayColor="rgba(0,0,0,0.6)"
        />
      );

    case "algorithm":
      return (
        <T01_HeroSplit
          title="算法抖音化"
          subtitle="首页全是没关注的内容 · 关注的UP主更新反而刷不到"
          image={I.platform}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "danmaku":
      return (
        <T07_MagazineSpread
          title="弹幕崩坏"
          bullets={[
            "曾经的弹幕是艺术品——现在全是复读机和键盘侠",
            "没有营养的废话占满屏幕——老用户看在眼里、痛在心里",
          ]}
          image={I.iface}
          primaryColor={C.gray.pri}
          backgroundColor={C.gray.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "fanquan":
      return (
        <T11_FeaturedImage
          title="饭圈入侵"
          caption="明星入驻 · 追星打投弹幕出现在B站——以前完全不可想象"
          tag="变质证据"
          image={I.content}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "acg_gone":
      return (
        <T02_PhotoOverlay
          title="老区没落"
          subtitle="ACG · 鬼畜 · 动漫 → 生活区 · 知识区 · 带货区"
          caption="传统艺能正在消亡"
          image={I.brand}
          overlayColor="rgba(69,90,100,0.65)"
        />
      );

    case "old_fans":
      return (
        <T04_QuotePortrait
          quote="这还是我认识的那个小破站吗？答案是——不是了，早就不是了。"
          author="五级以上老用户"
          role="B站最早的一批核心粉丝"
          portrait={I.iface}
          primaryColor={C.gray.pri}
          backgroundColor={C.grayW.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "by_love":
      return (
        <T01_HeroSplit
          title="由爱生恨"
          subtitle="骂陈睿最狠的人，恰恰是最早跟他一起喊「干杯」的老粉"
          description="不是路人黑，是真的心寒"
          image={I.ipo2}
          primaryColor={C.bili.pri}
          backgroundColor={C.bili.bg}
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    // ════════════════════════════════════════
    //  PART 4: MONEY (14 sections)
    // ════════════════════════════════════════

    case "biz_pain":
      return (
        <T09_BigNumber
          number="¥"
          label="商业化——原罪与宿命"
          description="情怀不能当饭吃"
          image={I.portrait1}
          overlayColor="rgba(230,81,0,0.6)"
        />
      );

    case "ipo":
      return (
        <T02_PhotoOverlay
          title="纳斯达克敲钟"
          subtitle="2018年3月28日 · 「哔哩哔哩干杯！」"
          image={I.ipo1}
          overlayColor="rgba(0,0,0,0.4)"
        />
      );

    case "stock_peak":
      return (
        <T09_BigNumber
          number="600亿"
          suffix="美元"
          label="市值巅峰 · 2021年"
          description="陈睿个人身家超255亿元"
          image={I.ipo3}
          overlayColor="rgba(230,81,0,0.55)"
        />
      );

    case "stock_crash":
      return (
        <T09_BigNumber
          number="-80%"
          label="七个月蒸发3000+亿港币"
          description="从巅峰到深渊"
          image={I.ipoCgtn}
          overlayColor="rgba(198,40,40,0.7)"
        />
      );

    case "loss_pile":
      return (
        <T09_BigNumber
          number="254亿"
          label="2018-2024年累计亏损"
          description="记住这个数字"
          image={I.ipoLab}
          overlayColor="rgba(0,0,0,0.65)"
        />
      );

    case "salary":
      return (
        <T01_HeroSplit
          title="年薪揭秘"
          subtitle="陈睿2024年年薪2.54亿元"
          description="国内上市游戏公司董事长薪酬第一名"
          image={I.portrait2}
          primaryColor={C.gold.pri}
          backgroundColor={C.gold.bg}
          textColor={C.gold.txt}
          accentColor={C.gold.acc}
        />
      );

    case "salary_irony":
      return (
        <T09_BigNumber
          number="2.54亿"
          label="公司亏254亿 · CEO拿2.54亿"
          description="这个数字巧合，简直是上天的讽刺"
          image={I.portrait3}
          overlayColor="rgba(198,40,40,0.7)"
        />
      );

    case "up_storm":
      return (
        <T02_PhotoOverlay
          title="停更潮"
          subtitle="2023年 · UP主集体发声 · 收入锐减"
          image={I.content}
          overlayColor="rgba(0,0,0,0.6)"
        />
      );

    case "up_dismiss":
      return (
        <T04_QuotePortrait
          quote="就三个UP主停更，不算停更潮。"
          author="陈睿"
          role="2023年 · 财报电话会议 · 经典回应"
          portrait={I.portrait4}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "up_reality":
      return (
        <T07_MagazineSpread
          title="创作者困境"
          bullets={[
            "创作激励大幅削减——万粉以下UP主补贴基本腰斩",
            "很多小UP主一个月收入不够买杯奶茶",
          ]}
          image={I.platform}
          primaryColor={C.gray.pri}
          backgroundColor={C.grayW.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "up_advice":
      return (
        <T04_QuotePortrait
          quote="万粉以上UP主应该自己去接广告、做直播赚钱。"
          author="陈睿"
          role="翻译：平台养不起你了，自己想办法"
          portrait={I.portrait5}
          primaryColor={C.gold.pri}
          backgroundColor={C.goldW.bg}
          textColor={C.gold.txt}
          accentColor={C.gold.acc}
        />
      );

    case "fgo":
      return (
        <T11_FeaturedImage
          title="FGO翻车"
          caption="游戏运营大翻车 · 陈睿自掏200万现金平息众怒——算他有诚意"
          tag="200万"
          image={I.iface}
          primaryColor={C.gold.pri}
          backgroundColor={C.gold.bg}
          textColor={C.gold.txt}
          accentColor={C.gold.acc}
        />
      );

    case "audit":
      return (
        <T01_HeroSplit
          title="审核重灾区"
          subtitle="未成年人保护漏洞 · 盗版泛滥 · 监控偷窥直播"
          image={I.brand}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "penalties":
      return (
        <T09_BigNumber
          number="6+10"
          label="行政处罚6次 · 约谈10次+"
          description="这成绩单，在互联网公司里也算独一份"
          image={I.brand}
          overlayColor="rgba(198,40,40,0.7)"
        />
      );

    // ════════════════════════════════════════
    //  PART 5: BREAKING OUT (6 sections)
    // ════════════════════════════════════════

    case "circle_intro":
      return (
        <T02_PhotoOverlay
          title="破圈"
          subtitle="功勋勋章 · 也是永久伤疤"
          image={I.content}
          overlayColor="rgba(69,90,100,0.6)"
        />
      );

    case "circle_result":
      return (
        <T09_BigNumber
          number="3.4亿"
          label="月活用户"
          description="从二次元小众社区变成国民级平台"
          image={I.ipoLab}
          overlayColor="rgba(46,125,50,0.6)"
        />
      );

    case "circle_cost":
      return (
        <T01_HeroSplit
          title="代价"
          subtitle="当所有人都能进来，独特的氛围就不可避免地被稀释"
          description="社区灵魂的消散"
          image={I.brand}
          primaryColor={C.gray.pri}
          backgroundColor={C.gray.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "identity":
      return (
        <T07_MagazineSpread
          title="身份危机"
          subtitle="B站到底是什么？"
          bullets={[
            "二次元社区？综合视频网站？",
            "还是一个没有短视频的抖音？连B站自己可能都说不清",
          ]}
          image={I.iface}
          primaryColor={C.bili.pri}
          backgroundColor={C.biliW.bg}
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    case "vs_douyin":
      return (
        <T01_HeroSplit
          title="做不了张一鸣"
          subtitle="长视频基因打不赢短视频——虽然扎心，但不无道理"
          image={I.platform}
          primaryColor={C.drama.pri}
          backgroundColor={C.drama.bg}
          textColor={C.drama.txt}
          accentColor={C.drama.acc}
        />
      );

    case "impossible":
      return (
        <T09_BigNumber
          number="△"
          label="不可能三角"
          description="社区氛围 · 商业变现 · 用户增长——最多选两个"
          image={I.portrait1}
          overlayColor="rgba(69,90,100,0.7)"
        />
      );

    // ════════════════════════════════════════
    //  PART 6: ACHIEVEMENTS (6 sections)
    // ════════════════════════════════════════

    case "fair_turn":
      return (
        <T11_FeaturedImage
          title="公道话"
          caption="黑了这么久，该说点公道话了——做人不能太双标"
          tag="转折"
          image={I.ipo2}
          primaryColor={C.green.pri}
          backgroundColor={C.green.bg}
          textColor={C.green.txt}
          accentColor={C.green.acc}
        />
      );

    case "ach_scale":
      return (
        <T09_BigNumber
          number="3.4亿"
          label="从草台班子到国民级平台"
          description="这份功劳，任何人都无法否认"
          image={I.ipo1}
          overlayColor="rgba(46,125,50,0.6)"
        />
      );

    case "ach_member":
      return (
        <T01_HeroSplit
          title="2.78亿"
          subtitle="正式会员 · 全球最大弹幕视频社区"
          description="这个成就全球独一无二"
          image={I.brand}
          primaryColor={C.green.pri}
          backgroundColor={C.greenW.bg}
          textColor={C.green.txt}
          accentColor={C.green.acc}
        />
      );

    case "ach_profit":
      return (
        <T09_BigNumber
          number="25.9亿"
          label="2025年首次全年盈利"
          description="营收303.5亿元 · 亏了这么多年，终于赚钱了"
          image={I.ipo3}
          overlayColor="rgba(46,125,50,0.55)"
        />
      );

    case "ach_game":
      return (
        <T11_FeaturedImage
          title="逃离鸭科夫"
          caption="全球大卖380万份 · 国产单机年度冠军——游戏研发能力的证明"
          tag="380万份"
          image={I.content}
          primaryColor={C.green.pri}
          backgroundColor={C.green.bg}
          textColor={C.green.txt}
          accentColor={C.green.acc}
        />
      );

    case "ach_content":
      return (
        <T07_MagazineSpread
          title="内容高地"
          bullets={[
            "全网最优质的科普视频、独立纪录片",
            "深度内容创作生态——这是抖音快手给不了的",
          ]}
          image={I.platform}
          primaryColor={C.green.pri}
          backgroundColor={C.greenW.bg}
          textColor={C.green.txt}
          accentColor={C.green.acc}
        />
      );

    // ════════════════════════════════════════
    //  PART 7: COST & EXIT (9 sections)
    // ════════════════════════════════════════

    case "real_cost":
      return (
        <T09_BigNumber
          number="?"
          label="代价是什么"
          image={I.portrait6}
          overlayColor="rgba(0,0,0,0.7)"
        />
      );

    case "cost_soul":
      return (
        <T02_PhotoOverlay
          title="再也回不来了"
          subtitle="那个小众的、温暖的「小破站」永远消失了"
          image={I.brand}
          overlayColor="rgba(69,90,100,0.65)"
        />
      );

    case "cost_trust":
      return (
        <T01_HeroSplit
          title="信任透支"
          subtitle="从热爱到习惯，从习惯到调侃，从调侃到「算了随便吧」"
          image={I.iface}
          primaryColor={C.gray.pri}
          backgroundColor={C.gray.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "exit":
      return (
        <T07_MagazineSpread
          title="退场"
          subtitle="2025年起逐步退出"
          bullets={[
            "卸任多个子公司法人代表和执行董事",
            "日常管理交给职业团队——陈睿时代落幕",
          ]}
          image={I.portrait2}
          primaryColor={C.gray.pri}
          backgroundColor={C.grayW.bg}
          textColor={C.gray.txt}
          accentColor={C.gray.acc}
        />
      );

    case "exit_timing":
      return (
        <T09_BigNumber
          number="2025"
          label="在B站业绩最好的时刻离开"
          description="功成身退？还是见好就收？"
          image={I.ipo1}
          overlayColor="rgba(0,0,0,0.6)"
        />
      );

    case "exit_control":
      return (
        <T01_HeroSplit
          title="手没松"
          subtitle="保留核心公司100%控股权"
          description="嘴上说退，实际依然掌控全局"
          image={I.portrait3}
          primaryColor={C.gold.pri}
          backgroundColor={C.goldW.bg}
          textColor={C.gold.txt}
          accentColor={C.gold.acc}
        />
      );

    case "verdict":
      return (
        <T04_QuotePortrait
          quote="功臣还是罪人？他两个都是。他让B站活下来了，也让B站变了味。"
          author="最终评价"
          role="答案可能让你失望"
          portrait={I.portrait1}
          primaryColor={C.bili.pri}
          backgroundColor={C.bili.bg}
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    case "final_word":
      return (
        <T02_PhotoOverlay
          title="做大了，也做变了"
          subtitle="功过相抵还是功不抵过？留给每个B站用户回答"
          image={I.portrait1}
          overlayColor="rgba(251,114,153,0.5)"
        />
      );

    case "outro":
      return (
        <T01_HeroSplit
          title="一键三连！"
          subtitle="点赞 · 投币 · 收藏"
          image={I.brand}
          primaryColor={C.bili.pri}
          backgroundColor="#FFFFFF"
          textColor={C.bili.txt}
          accentColor={C.bili.acc}
        />
      );

    default:
      return (
        <AbsoluteFill
          style={{
            backgroundColor: "#FFFFFF",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: FONT,
          }}
        >
          <h2 style={{ fontSize: 72, fontWeight: 700, color: props.primaryColor }}>
            {section.name}
          </h2>
        </AbsoluteFill>
      );
  }
};

export const Video = (props: VideoProps) => {
  const sections = timing.sections;
  const transitionFrames = props.transitionDuration;

  const compensatedSections = sections.map((s, i) => ({
    ...s,
    duration_frames:
      s.duration_frames +
      (i < sections.length - 1 ? transitionFrames : 0) +
      (s.is_silent ? SILENT_EXTRA_FRAMES : 0),
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: props.backgroundColor, fontFamily: FONT }}>
      <Scale4K orientation={props.orientation}>
        <TransitionSeries>
          {compensatedSections.map((section, i) => (
            <React.Fragment key={section.name}>
              <TransitionSeries.Sequence
                durationInFrames={section.duration_frames}
              >
                <SectionComponent section={section} props={props} />
              </TransitionSeries.Sequence>
              {i < sections.length - 1 &&
                transitionFrames > 0 &&
                props.transitionType !== "none" && (
                  <TransitionSeries.Transition
                    presentation={getPresentation(props.transitionType)}
                    timing={linearTiming({
                      durationInFrames: transitionFrames,
                    })}
                  />
                )}
            </React.Fragment>
          ))}
        </TransitionSeries>
      </Scale4K>

      <ProgressBar props={props} />

      {props.bgmVolume > 0 && (
        <Audio src={staticFile("bgm.mp3")} volume={props.bgmVolume} />
      )}

      <Audio src={staticFile("podcast_audio.wav")} />
    </AbsoluteFill>
  );
};

export default Video;
