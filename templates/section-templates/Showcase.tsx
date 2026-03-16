/**
 * Template Showcase — demo compositions for visual review.
 * Each template is wrapped in Scale4K and populated with demo content.
 * Render at --frame=60 to see fully animated state.
 */
import React from "react";
import { AbsoluteFill } from "remotion";
import {
  T01_HeroSplit,
  T02_PhotoOverlay,
  T03_ImageGrid,
  T04_QuotePortrait,
  T05_SplitDataViz,
  T06_TimelineMedia,
  T07_MagazineSpread,
  T08_StepByStep,
  T09_BigNumber,
  T10_DualCompare,
  T11_FeaturedImage,
  T12_BannerCards,
} from "./templates";

// 1920×1080 design space → 3840×2160 via Scale4K
const Scale: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <AbsoluteFill style={{ transform: "scale(2)", transformOrigin: "top left", width: 1920, height: 1080 }}>
    {children}
  </AbsoluteFill>
);

const P = "media/template-showcase"; // image path prefix
const C = {
  primary: "#2D3436",
  bg: "#FAFAFA",
  text: "#2D3436",
  accent: "#E17055",
};

// ── Demo compositions ──────────────────────────────────────

export const Demo_T01: React.FC = () => (
  <Scale>
    <T01_HeroSplit
      title="人工智能的下一个十年"
      subtitle="从大语言模型到通用人工智能，技术演进全景解析"
      description="探索 AI 如何重塑产业格局与人类生活方式"
      tags={["AI", "深度学习", "AGI"]}
      image={`${P}/sample_1.jpg`}
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T02: React.FC = () => (
  <Scale>
    <T02_PhotoOverlay
      title="当机器开始理解世界"
      subtitle="多模态大模型正在打破文字、图像、视频之间的边界，开启全新的交互范式"
      caption="2026 · AI 前沿观察"
      image={`${P}/sample_6.jpg`}
    />
  </Scale>
);

export const Demo_T03: React.FC = () => (
  <Scale>
    <T03_ImageGrid
      title="四大核心能力"
      subtitle="现代 AI 系统的基础技术栈"
      items={[
        { image: `${P}/sample_1.jpg`, title: "自然语言处理", description: "理解和生成人类语言，支撑对话、翻译、摘要等场景" },
        { image: `${P}/sample_4.jpg`, title: "计算机视觉", description: "图像识别、目标检测、视频理解，赋能自动驾驶与安防" },
        { image: `${P}/sample_3.jpg`, title: "强化学习", description: "通过试错与奖励机制学习最优策略，从游戏到机器人控制" },
        { image: `${P}/sample_7.jpg`, title: "多模态融合", description: "跨越文本、图像、音频的统一理解与生成能力" },
      ]}
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
    />
  </Scale>
);

export const Demo_T04: React.FC = () => (
  <Scale>
    <T04_QuotePortrait
      quote="人工智能不会取代人类，但善用 AI 的人会取代不用 AI 的人。这不是威胁，而是一次前所未有的能力放大器。"
      author="李明远"
      role="清华大学计算机系教授 · AI 研究院院长"
      portrait={`${P}/sample_5.jpg`}
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T05: React.FC = () => (
  <Scale>
    <T05_SplitDataViz
      title="AI 应用渗透率"
      subtitle="各行业 AI 技术采纳程度（2026年）"
      bars={[
        { label: "金融科技", value: 87 },
        { label: "医疗健康", value: 72 },
        { label: "智能制造", value: 65 },
        { label: "教育培训", value: 58 },
        { label: "文化创意", value: 43 },
      ]}
      image={`${P}/sample_2.jpg`}
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T06: React.FC = () => (
  <Scale>
    <T06_TimelineMedia
      title="AI 发展里程碑"
      subtitle="从学术论文到改变世界，关键转折点回顾"
      sideImage={`${P}/sample_7.jpg`}
      events={[
        { image: `${P}/sample_1.jpg`, label: "2017 · Transformer 诞生", description: "Google 发表 Attention Is All You Need，自注意力机制取代 RNN 成为主流架构", detail: "论文被引用超 12 万次，催生 BERT、GPT 等后续模型", tags: ["NLP", "架构革新"] },
        { image: `${P}/sample_4.jpg`, label: "2022 · ChatGPT 爆发", description: "OpenAI 发布 ChatGPT，两个月用户突破一亿，AI 进入大众视野", detail: "推动全球 AI 投资激增 300%，微软追加 100 亿美元投资", tags: ["消费级AI", "现象级"] },
        { image: `${P}/sample_6.jpg`, label: "2024 · 多模态元年", description: "GPT-4o、Claude 3.5、Gemini 实现文本+图像+音频统一理解", detail: "视觉推理准确率突破 90%，实时语音对话延迟降至 300ms", tags: ["多模态", "实时交互"] },
        { image: `${P}/sample_3.jpg`, label: "2026 · Agent 时代", description: "AI Agent 自主完成复杂任务链，编程、研究、运营全面渗透", detail: "企业 Agent 采纳率达 65%，人机协作成为新常态", tags: ["Agent", "自主决策"] },
      ]}
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T07: React.FC = () => (
  <Scale>
    <T07_MagazineSpread
      title="AI 如何重塑内容创作"
      subtitle="从辅助工具到创作伙伴，AIGC 正在改变每一个创作者的工作流"
      bullets={[
        "文本生成：从大纲到完整文章，AI 可以在数秒内完成初稿",
        "图像创作：Midjourney、DALL-E 让非设计师也能产出专业级视觉",
        "视频制作：自动字幕、智能剪辑、AI 配音降低 90% 的制作门槛",
        "音乐创作：Suno、Udio 实现一句描述生成完整歌曲",
      ]}
      image={`${P}/sample_8.jpg`}
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T08: React.FC = () => (
  <Scale>
    <T08_StepByStep
      title="AI 产品落地三步法"
      subtitle="从构想到规模化部署的完整路径"
      steps={[
        { image: `${P}/sample_1.jpg`, label: "需求分析", description: "明确业务痛点，评估 AI 可解决的具体问题与预期 ROI", metric: "2-4周", metricLabel: "平均周期" },
        { image: `${P}/sample_4.jpg`, label: "原型验证", description: "搭建最小可行产品，用真实数据测试模型效果与用户反馈", metric: "85%", metricLabel: "验证通过率" },
        { image: `${P}/sample_2.jpg`, label: "规模部署", description: "优化推理性能，建立 A/B 测试与监控体系，逐步扩大覆盖", metric: "3-6月", metricLabel: "上线周期" },
      ]}
      summary="关键原则：先小后大、数据驱动、持续迭代 — 避免一步到位的完美主义陷阱"
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T09: React.FC = () => (
  <Scale>
    <T09_BigNumber
      number="86"
      suffix="%"
      label="企业已将 AI 纳入核心战略"
      description="根据麦肯锡 2026 全球企业 AI 调研报告，超过八成企业已在至少一个核心业务流程中部署了 AI 技术"
      image={`${P}/sample_2.jpg`}
    />
  </Scale>
);

export const Demo_T10: React.FC = () => (
  <Scale>
    <T10_DualCompare
      title="开源 vs 闭源模型"
      subtitle="两种路线的核心差异与适用场景对比"
      left={{
        image: `${P}/sample_3.jpg`,
        title: "开源模型",
        subtitle: "LLaMA · Qwen · DeepSeek",
        stat: "70B+",
        statLabel: "最大参数",
        items: [
          "✦ 完全可控，支持私有化部署和微调",
          "✦ 社区生态活跃，模型变体迭代极快",
          "✦ 数据不出境，满足金融/政务合规需求",
          "✦ 推理成本可控，大规模调用更经济",
          "△ 需要专业团队运维，部署门槛较高",
        ],
      }}
      right={{
        image: `${P}/sample_7.jpg`,
        title: "闭源模型",
        subtitle: "GPT-4o · Claude · Gemini",
        stat: "SOTA",
        statLabel: "性能基准",
        highlight: true,
        items: [
          "✦ 综合性能领先，持续迭代优化",
          "✦ API 开箱即用，零运维成本",
          "✦ 企业级 SLA 与安全合规认证",
          "✦ 多模态能力成熟，生态工具丰富",
          "△ 数据传输依赖第三方，按量计费成本高",
        ],
      }}
      verdict="选择建议：数据敏感型/高并发场景选开源；快速原型/综合能力场景选闭源；混合架构是最优解"
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T11: React.FC = () => (
  <Scale>
    <T11_FeaturedImage
      title="AI 芯片的算力竞赛"
      tag="深度解析"
      caption="从 NVIDIA H100 到自研芯片，全球科技巨头正在掀起一场前所未有的算力军备竞赛。每一代芯片的性能飞跃，都在推动 AI 能力边界的扩展。"
      image={`${P}/sample_8.jpg`}
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);

export const Demo_T12: React.FC = () => (
  <Scale>
    <T12_BannerCards
      title="2026 AI 市场全景"
      subtitle="全球人工智能产业核心指标一览"
      bannerImage={`${P}/sample_6.jpg`}
      cards={[
        { icon: "💰", title: "全球市场规模", value: "$1.8万亿", trend: "↑ 42%", description: "较 2025 年增长 42%，生成式 AI 占比首次突破 30%。北美市场占全球份额 38%，亚太地区增速领先达 51%" },
        { icon: "🚀", title: "年复合增长率", value: "38.1%", trend: "+5.2pp", description: "CAGR 连续三年加速，AI 基础设施与大模型训练投资是核心驱动力。预计 2028 年前维持 35% 以上高增长" },
        { icon: "🏢", title: "AI 独角兽企业", value: "340+", trend: "↑ 68家", description: "中美两国合计占比 78%，医疗 AI 赛道增速最快。企业级 AI SaaS 与 Agent 平台成为新一轮融资热点" },
        { icon: "👥", title: "AI 从业者", value: "2200万", trend: "↑ 31%", description: "全球 AI 人才缺口仍达 400 万，MLOps 与 AI 安全工程师需求增幅最大，薪资中位数同比上涨 22%" },
      ]}
      footnote="数据来源：IDC Global AI Market Forecast 2026 · McKinsey Global AI Survey"
      primaryColor={C.primary}
      backgroundColor={C.bg}
      textColor={C.text}
      accentColor={C.accent}
    />
  </Scale>
);
