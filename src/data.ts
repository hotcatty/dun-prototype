export type VideoId = 'p1' | 'p2'

const img = (name: string) => `${import.meta.env.BASE_URL}img/${name}`

export const IMG = {
  p1: img('p1.jpg'),
  p2: img('p2.jpg'),
  creator: img('avatar-creator.jpg'),
  rec1: img('rec1.jpg'),
  rec2: img('rec2.jpg'),
  rec3: img('rec3.jpg'),
}

export interface Person {
  name: string
  emoji: string
  color: string
  img?: string
}

export const CREATOR: Person = { name: '三楼的小满', emoji: '', color: '#F1E4D8', img: IMG.creator }

export const DUN_COUNT = '3.2万'
export const SEQUEL_HINT = '五只小猫都平安！物业也松口了，谢谢大家'

export interface Chapter {
  time: string
  title: string
  at: number
}

export interface VideoData {
  id: VideoId
  cover: string
  title: string
  caption: string
  short: string
  tags: string[]
  date: string
  likes: string
  comments: string
  stars: string
  shares: string
  recommend: string
  search: string
  related: string
  placeholder: string
  chapters: Chapter[]
}

export function getVideos(someoneDun: boolean): Record<VideoId, VideoData> {
  return {
    p1: {
      id: 'p1',
      cover: IMG.p1,
      title: '楼道里来了只大肚子橘猫，物业说周五前要清走',
      caption: '楼道里来了只大肚子橘猫，物业说周五前要清走……我先给它搭了个窝，接下来怎么办？',
      short: '楼道里来了只大肚子橘猫，物业说周五前要清走……我先给它搭了个窝 #流浪…',
      tags: ['#流浪猫', '#救助日记', '#楼道日常'],
      date: '10月20日',
      likes: '28.4万',
      comments: '9126',
      stars: '1.3万',
      shares: '2.1万',
      recommend: '共8600人推荐',
      search: '楼道流浪猫',
      related: '流浪猫怀孕了怎么办',
      placeholder: '发条评论，和大家一起讨论',
      chapters: [
        { time: '00:00', title: '发现', at: 0 },
        { time: '00:41', title: '物业通知', at: 0.36 },
        { time: '01:12', title: '搭窝', at: 0.68 },
      ],
    },
    p2: {
      id: 'p2',
      cover: IMG.p2,
      title: someoneDun ? `${DUN_COUNT}人蹲的后续来了：五只小猫都平安` : '后续来了：五只小猫都平安',
      caption: someoneDun
        ? `${DUN_COUNT}人蹲的后续来了😭 五只小猫都平安！物业也松口了，谢谢大家出的主意`
        : '后续来了😭 五只小猫都平安！物业也松口了，谢谢大家出的主意',
      short: someoneDun
        ? `${DUN_COUNT}人蹲的后续来了😭 五只小猫都平安！物业也松口了，谢谢大家…`
        : '后续来了😭 五只小猫都平安！物业也松口了，谢谢大家出的主意 #流浪…',
      tags: ['#流浪猫', '#救助日记', '#后续'],
      date: '10月22日',
      likes: '12.7万',
      comments: '3518',
      stars: '6021',
      shares: '8893',
      recommend: '共3100人推荐',
      search: '搜你想看的',
      related: '小猫多大可以领养',
      placeholder: '发条评论，和大家一起讨论',
      chapters: [],
    },
  }
}

export const ME: Person = { name: '路过的阿喵', emoji: '😺', color: '#FFD9E1' }

export const SQUATTERS: Person[] = [
  { name: '橘子汽水', emoji: '🍊', color: '#FFE3C2' },
  { name: 'momo', emoji: '🐰', color: '#F8DCE6' },
  { name: '小王同学', emoji: '🐻', color: '#EADFD2' },
  { name: '夏天的风', emoji: '🌻', color: '#FFF0BC' },
  { name: '山海', emoji: '🌊', color: '#D6E8F7' },
  { name: '阿June', emoji: '🌿', color: '#DDF1D7' },
]

export interface CommentData {
  id: string
  person: Person
  text: string
  meta: string
  likes: string
  replies?: number
  authorLiked?: boolean
  image?: string
}

const P = Object.fromEntries(SQUATTERS.map((p) => [p.name, p])) as Record<string, Person>
const CAT_BOSS: Person = { name: '猫猫教主', emoji: '😼', color: '#EBE2FA' }

export const COMMENTS_P1_DUN: CommentData[] = [
  { id: 'd1', person: P['橘子汽水'], text: '蹲后续', meta: '50分钟前 · 浙江', likes: '1.2万', replies: 386 },
  {
    id: 'd2',
    person: P['阿June'],
    text: '物业要是真赶它走，我第一个打12345',
    meta: '50分钟前 · 上海',
    likes: '8721',
    authorLiked: true,
    replies: 92,
  },
  { id: 'd3', person: P['小王同学'], text: '蹲一个，生了记得踢我', meta: '50分钟前 · 四川', likes: '3046', replies: 386 },
  { id: 'd4', person: P['momo'], text: '蹲后续', meta: '50分钟前 · 浙江', likes: '1.2万', replies: 386 },
  {
    id: 'd5',
    person: P['山海'],
    text: '我家楼下也有一只，后来被一楼阿姨领走了，现在胖成球',
    meta: '10-21 · 江苏',
    likes: '1653',
    authorLiked: true,
    image: IMG.rec3,
  },
  { id: 'd6', person: P['夏天的风'], text: '作者快更！已经蹲两天了', meta: '10-21 · 北京', likes: '987' },
]

export const COMMENTS_P1_HOT: CommentData[] = [
  {
    id: 'h1',
    person: P['阿June'],
    text: '物业要是真赶它走，我第一个打12345',
    meta: '10-20 · 上海',
    likes: '8721',
    authorLiked: true,
    replies: 92,
  },
  {
    id: 'h2',
    person: CAT_BOSS,
    text: '孕猫别乱挪窝，容易应激，纸箱放原地就行',
    meta: '10-20 · 湖北',
    likes: '6310',
    authorLiked: true,
    replies: 41,
  },
  { id: 'h3', person: P['山海'], text: '可以先联系附近的救助站，有的能免费绝育', meta: '10-21 · 江苏', likes: '2876' },
  { id: 'h4', person: P['夏天的风'], text: '物业这么做也太绝了吧', meta: '10-21 · 北京', likes: '1520' },
  {
    id: 'h5',
    person: P['橘子汽水'],
    text: '楼里有人怕猫的话，先挨家沟通一下会好很多',
    meta: '10-21 · 浙江',
    likes: '1033',
    image: IMG.rec1,
  },
]

export function commentsP2(someoneDun: boolean): CommentData[] {
  return [
    {
      id: 's1',
      person: P['momo'],
      text: someoneDun ? '踢到我了！五只都好可爱😭' : '终于有后续了！五只都好可爱😭',
      meta: '10-22 · 广东',
      likes: '6321',
      replies: 58,
    },
    { id: 's2', person: P['橘子汽水'], text: '物业松口太好了，楼里的人都挺好', meta: '10-22 · 浙江', likes: '4105' },
    {
      id: 's3',
      person: P['山海'],
      text: '求领养方式！我在杭州',
      meta: '10-22 · 江苏',
      likes: '2290',
      authorLiked: true,
      replies: 31,
    },
    { id: 's4', person: P['小王同学'], text: '从上集一路追过来的', meta: '10-22 · 四川', likes: '1187' },
  ]
}

export interface RecCard {
  cover: string
  title: string
  person: Person
  likes: string
}

export const RECS: RecCard[] = [
  { cover: IMG.rec2, title: '领养小猫前，这5样东西一定要备好', person: { name: '猫咪领养日', emoji: '🐾', color: '#FFE9D6' }, likes: '2310' },
  { cover: IMG.rec1, title: '楼道里的纸箱怎么搭才保暖？', person: { name: '阿梨养猫', emoji: '🍐', color: '#EEF6D2' }, likes: '155' },
  { cover: IMG.rec3, title: '被投诉的流浪猫，最后都去哪了', person: { name: '城市观察员', emoji: '🏙️', color: '#E2E8F3' }, likes: '1.1万' },
]

export interface Work {
  id: string
  cover: string
  title: string
  date: string
  likes: string
}

export const WORKS: Work[] = [
  { id: 'p1', cover: IMG.p1, title: '楼道里来了只大肚子橘猫，物业说周五前要清走', date: '10月20日', likes: '28.4万' },
  { id: 'w2', cover: IMG.rec1, title: '给楼道的纸箱换了条厚毯子', date: '10月18日', likes: '3.6万' },
  { id: 'w3', cover: IMG.rec3, title: '我家胖橘的下午：晒太阳', date: '10月12日', likes: '1.9万' },
]

export const HOME_VIDEO = {
  cover: IMG.rec3,
  name: '窗台上的胖橘',
  avatar: { name: '窗台上的胖橘', emoji: '🐈', color: '#FFE2B8' } as Person,
  caption: '下午三点的阳光，刚好够胖橘睡一觉 #猫咪日常 #治愈',
  date: '1天前',
  likes: '5.6万',
  comments: '1204',
  stars: '3388',
  shares: '2671',
}
