import type { ReactNode } from 'react'
import type { TocItem } from '../components/AnchorTOC'
import ReadingLayout from '../components/ReadingLayout'
import Timeline from '../components/Timeline'

const toc: TocItem[] = [
  { id: 'sec-time', number: '1', title: '报到时间', level: 1 },
  { id: 'sec-campus', number: '2', title: '校区分配', level: 1 },
  { id: 'sec-channel', number: '3', title: '报到渠道', level: 1 },
  { id: 'sec-online', number: '4', title: '网上报到流程', level: 1 },
  { id: 'sec-site', number: '5', title: '现场报到流程', level: 1 },
]

/** 网上报到 10 步流程 */
const onlineSteps = [
  { id: 'step-1', title: '填写信息', description: '登录自助迎新页面，核对个人基本信息。' },
  { id: 'step-2', title: '个人信息采集', description: '补充完善联系方式与家庭成员信息。' },
  { id: 'step-3', title: '到校交通信息', description: '填写预计到校时间与交通方式，便于学校接站安排。' },
  { id: 'step-4', title: '军训用品登记', description: '填报军训服装尺码。' },
  { id: 'step-5', title: '选购床上用品', description: '自愿选购学校统一供货的床上用品套装。' },
  { id: 'step-6', title: '财务缴费', description: '缴纳学费、住宿费等；经济困难新生可选绿色通道。' },
  { id: 'step-7', title: '校园卡充值', description: '为校园卡预充值，到校即可食堂就餐。' },
  { id: 'step-8', title: '入学教育', description: '了解入学教育安排与必修课程。' },
  { id: 'step-9', title: '宿舍分配', description: '系统分配宿舍，查看入住信息。' },
  { id: 'step-10', title: '完成报到', description: '生成报到二维码，完成网上报到。' },
]

const campusRows = [
  {
    campus: '主校区',
    address: '长沙市湘江新区枫林二路 139 号',
    colleges: '厚生国际教育学院、经济地理学院',
  },
  {
    campus: '雷锋校区',
    address: '长沙市湘江新区黄桥大道（谷苑路交汇处以西约 500 米）',
    colleges:
      '会计学院、财政金融学院、经济学院、工商管理学院、信息技术与管理学院、法学与公共管理学院、外国语学院、工程管理学院、人文与艺术学院、数学与统计学院、体育学院、马克思主义学院',
  },
]

function Section({
  id,
  number,
  title,
  children,
}: {
  id: string
  number: string
  title: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="flex items-baseline gap-2 text-lg font-semibold text-slate-800">
        <span className="shrink-0 tabular-nums text-blue-600">{number}</span>
        {title}
      </h2>
      <div className="mt-2">{children}</div>
    </section>
  )
}

function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-slate-200">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-slate-50 text-left text-slate-700">
            {headers.map((header) => (
              <th
                key={header}
                className="whitespace-nowrap border-b border-slate-200 px-3.5 py-2.5 font-medium"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="even:bg-slate-50/60">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className="whitespace-pre-line border-b border-slate-100 px-3.5 py-2 text-slate-600 last:border-b-0"
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-3 space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-600">
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-slate-400" aria-hidden />
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function Registration() {
  return (
    <ReadingLayout
      title="新生报到流程"
      lead="湖南财政经济学院分学院分时段报到，请按录取学院要求的时间到指定校区完成网上报到与现场报到。"
      meta="适用对象：新生 · 现场报到地址见「校区分配」"
      toc={toc}
    >
      <Section id="sec-time" number="1" title="报到时间">
        <Table
          headers={['报到方式', '时间']}
          rows={[
            ['网上报到', '9 月 2 日 — 9 月 10 日'],
            ['现场报到', '9 月 11 日 — 9 月 12 日'],
          ]}
        />
        <BulletList
          items={[
            '学校分学院分时段报到，请关注官微通知',
            '无法按时报到须提前向教务处请假',
            '逾期两周不报到取消入学资格',
          ]}
        />
      </Section>

      <Section id="sec-campus" number="2" title="校区分配">
        <Table
          headers={['校区', '报到地址', '适用学院']}
          rows={campusRows.map((r) => [r.campus, r.address, r.colleges])}
        />
      </Section>

      <Section id="sec-channel" number="3" title="报到渠道">
        <Table
          headers={['方式', '入口', '说明']}
          rows={[
            ['电脑端', '湖南财政经济学院官网（hufe.edu.cn）', '官网导航「自助迎新」入口 → 立即进入'],
            ['手机端', '微信「湖南财政经济学院学工在线」公众号', '「智慧迎新」进入移动端'],
          ]}
        />
        <BulletList
          items={['账号：智慧校园卡号', '初始密码：hufe@加上身份证后六位（X 大写）']}
        />
      </Section>

      <Section id="sec-online" number="4" title="网上报到流程">
        <p className="mt-3 text-sm leading-7 text-slate-600">
          在自助迎新页面依次完成以下步骤，绿色通道供家庭经济困难新生申请。
        </p>
        <div className="mt-4">
          <Timeline steps={onlineSteps} />
        </div>
        <p className="mt-4 text-sm leading-7 text-slate-600">
          绿色通道：家庭经济困难新生，在「财务缴费」环节选择绿色通道，上传资料申请，审核 1-2 天；已全额缴费学生无需申请。
        </p>
      </Section>

      <Section id="sec-site" number="5" title="现场报到流程">
        <BulletList
          items={[
            '携带《录取通知书》，凭线上报到生成的二维码前往指定地点现场办理',
            '到校后完成门禁核验',
            '激活食堂消费功能',
            '由辅导员扫码确认报到',
          ]}
        />
      </Section>
    </ReadingLayout>
  )
}
