export type Category = "K-POP" | "드라마" | "뉴스" | "문화" | "스포츠" | "음식";

export interface CandidateArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  summary: string;
  selected: boolean;
}

export interface Content {
  id: string;
  title: string;
  titleEs: string;
  category: Category;
  summary: string;
  summaryEs: string;
  body: string;
  bodyEs: string;
  culturalNote: string;
  culturalNoteEs: string;
  sources: { title: string; url: string }[];
  publishedAt: string;
  likes: number;
  status: "draft" | "published";
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  body: string;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  likedContentIds: string[];
}

export const MOCK_CANDIDATE_ARTICLES: CandidateArticle[] = [
  {
    id: "ca1",
    title: "BTS 뷔, 솔로 앨범 발매 예정 발표",
    source: "Naver 뉴스",
    url: "https://news.naver.com/1",
    publishedAt: "2026-04-22",
    summary: "BTS 멤버 뷔가 두 번째 솔로 앨범을 5월 중 발매할 예정이라고 소속사가 밝혔다.",
    selected: false,
  },
  {
    id: "ca2",
    title: "BLACKPINK 리사, 월드투어 일정 공개",
    source: "Melon 뉴스",
    url: "https://news.melon.com/1",
    publishedAt: "2026-04-22",
    summary: "BLACKPINK 리사가 첫 솔로 월드투어 일정을 공개했다. 멕시코, 아르헨티나, 브라질 포함.",
    selected: false,
  },
  {
    id: "ca3",
    title: "넷플릭스 신작 한국 드라마 '무빙2' 확정",
    source: "한국경제",
    url: "https://hankyung.com/1",
    publishedAt: "2026-04-21",
    summary: "넷플릭스가 한국 슈퍼히어로 드라마 '무빙' 시즌2를 정식 발표했다.",
    selected: false,
  },
  {
    id: "ca4",
    title: "손흥민, 시즌 20호골 달성",
    source: "스포츠조선",
    url: "https://sportschosun.com/1",
    publishedAt: "2026-04-21",
    summary: "토트넘의 손흥민이 프리미어리그에서 시즌 20호골을 기록했다.",
    selected: false,
  },
  {
    id: "ca5",
    title: "2026 한국 관광 트렌드: 로컬 감성 여행",
    source: "한국관광공사",
    url: "https://visitkorea.or.kr/1",
    publishedAt: "2026-04-20",
    summary: "한국관광공사가 2026년 외국인 관광 트렌드로 '로컬 감성 여행'을 꼽았다.",
    selected: false,
  },
];

export const MOCK_CONTENTS: Content[] = [
  {
    id: "c1",
    title: "BTS 뷔 솔로 컴백 예고: 알아야 할 모든 것",
    titleEs: "El regreso en solitario de V de BTS: todo lo que necesitas saber",
    category: "K-POP",
    summary: "BTS 뷔가 2026년 5월 두 번째 솔로 앨범으로 돌아옵니다.",
    summaryEs: "V de BTS regresa en mayo de 2026 con su segundo álbum en solitario.",
    body: `BTS의 멤버 뷔(김태형)가 두 번째 솔로 앨범으로 5월 컴백을 예고했습니다.

소속사 빅히트 뮤직은 공식 SNS를 통해 뷔의 새 앨범 발매 일정을 공개했으며, 이번 앨범은 그의 첫 솔로 앨범 'Layover'에 이은 두 번째 작품입니다.

팬들 사이에서는 이미 새 앨범에 대한 기대가 높아지고 있으며, 특히 중남미 팬덤 'ARMY'의 반응이 뜨겁습니다.`,
    bodyEs: `V (Kim Taehyung), miembro de BTS, ha anunciado su regreso con su segundo álbum en solitario en mayo.

Big Hit Music reveló el calendario del nuevo álbum de V a través de sus redes sociales oficiales. Este álbum será el sucesor de su primer trabajo en solitario, 'Layover'.

La expectativa entre los fans ya es alta, especialmente entre el ARMY latinoamericano.`,
    culturalNote: "빅히트 뮤직은 BTS가 소속된 하이브(HYBE)의 레이블입니다. 한국 아이돌 산업에서 소속사는 아티스트의 모든 활동을 직접 관리합니다.",
    culturalNoteEs: "Big Hit Music es el sello de HYBE, la empresa a la que pertenece BTS. En la industria del idol coreano, la agencia gestiona directamente todas las actividades del artista.",
    sources: [
      { title: "Naver 뉴스 - BTS 뷔 솔로 컴백", url: "https://news.naver.com/1" },
    ],
    publishedAt: "2026-04-22",
    likes: 142,
    status: "published",
    comments: [
      { id: "cm1", userId: "u2", userName: "Maria G.", body: "¡Estoy tan emocionada! 😭", createdAt: "2026-04-22" },
      { id: "cm2", userId: "u3", userName: "Carlos R.", body: "Layover fue increíble, espero que este álbum sea igual.", createdAt: "2026-04-22" },
    ],
  },
  {
    id: "c2",
    title: "리사 월드투어, 중남미 팬들의 꿈이 현실로",
    titleEs: "La gira mundial de LISA llega a Latinoamérica",
    category: "K-POP",
    summary: "BLACKPINK 리사가 멕시코, 아르헨티나, 브라질을 포함한 첫 솔로 월드투어를 확정했습니다.",
    summaryEs: "LISA de BLACKPINK confirma su primera gira mundial en solitario, incluyendo México, Argentina y Brasil.",
    body: `BLACKPINK의 리사(라리사 마노반)가 첫 솔로 월드투어 일정을 전격 공개했습니다.

이번 투어에는 멕시코시티, 부에노스아이레스, 상파울루가 포함되어 있어 중남미 팬들의 환호를 받고 있습니다.`,
    bodyEs: `LISA (Lalisa Manoban) de BLACKPINK anunció su primera gira mundial en solitario.

La gira incluye Ciudad de México, Buenos Aires y São Paulo, lo que ha generado gran emoción entre los fans latinoamericanos.`,
    culturalNote: "BLACKPINK는 YG엔터테인먼트 소속의 4인조 걸그룹으로, 전 세계에서 가장 많은 팔로워를 보유한 걸그룹입니다.",
    culturalNoteEs: "BLACKPINK es un grupo de chicas de 4 miembros de YG Entertainment, el grupo femenino con más seguidores del mundo.",
    sources: [
      { title: "Melon 뉴스 - 리사 월드투어", url: "https://news.melon.com/1" },
    ],
    publishedAt: "2026-04-22",
    likes: 89,
    status: "published",
    comments: [],
  },
  {
    id: "c3",
    title: "무빙 시즌2: 한국 슈퍼히어로의 귀환",
    titleEs: "Moving Temporada 2: El regreso de los superhéroes coreanos",
    category: "드라마",
    summary: "넷플릭스 오리지널 '무빙' 시즌2가 공식 확정되었습니다.",
    summaryEs: "Se confirma oficialmente la temporada 2 de la serie original de Netflix 'Moving'.",
    body: `넷플릭스가 한국 슈퍼히어로 드라마 '무빙' 시즌2를 공식 발표했습니다.

시즌1은 공개 직후 넷플릭스 글로벌 차트 상위권에 오르며 큰 인기를 끌었습니다.`,
    bodyEs: `Netflix ha anunciado oficialmente la segunda temporada del drama coreano de superhéroes 'Moving'.

La primera temporada se convirtió en un éxito global inmediatamente después de su lanzamiento.`,
    culturalNote: "'무빙'은 강풀 작가의 동명 웹툰을 원작으로 한 드라마입니다. 한국에서는 웹툰을 원작으로 한 드라마 제작이 매우 활발합니다.",
    culturalNoteEs: "'Moving' está basada en el webtoon homónimo del autor Kang Full. En Corea, la adaptación de webtoons a dramas es muy común.",
    sources: [
      { title: "한국경제 - 무빙2 확정", url: "https://hankyung.com/1" },
    ],
    publishedAt: "2026-04-21",
    likes: 67,
    status: "published",
    comments: [],
  },
  {
    id: "c4",
    title: "손흥민 20골: 프리미어리그의 한국 영웅",
    titleEs: "Son Heung-min 20 goles: el héroe coreano de la Premier League",
    category: "스포츠",
    summary: "손흥민이 시즌 20호골을 기록하며 아시아 선수 역대 최다 골 기록에 도전하고 있습니다.",
    summaryEs: "Son Heung-min marca 20 goles esta temporada y desafía el récord histórico de goles para un jugador asiático.",
    body: `토트넘의 손흥민이 프리미어리그에서 시즌 20호골을 달성했습니다.

이 기록으로 손흥민은 아시아 선수 최초로 프리미어리그 2번의 20골 달성이라는 역사를 썼습니다.`,
    bodyEs: `Son Heung-min del Tottenham ha marcado su gol número 20 en la Premier League esta temporada.

Con este récord, Son se convierte en el primer jugador asiático en marcar 20 goles en dos temporadas de la Premier League.`,
    culturalNote: "손흥민은 한국에서 국민 영웅으로 불리며, 그의 경기는 한국 시간 새벽에도 많은 팬들이 생중계로 시청합니다.",
    culturalNoteEs: "Son Heung-min es considerado un héroe nacional en Corea, y sus partidos son vistos en directo por millones de fans coreanos incluso de madrugada.",
    sources: [
      { title: "스포츠조선 - 손흥민 20골", url: "https://sportschosun.com/1" },
    ],
    publishedAt: "2026-04-21",
    likes: 55,
    status: "published",
    comments: [],
  },
  {
    id: "c5",
    title: "2026 한국 여행 트렌드: 로컬 감성이 뜬다",
    titleEs: "Tendencias de viaje a Corea en 2026: el turismo local está de moda",
    category: "문화",
    summary: "한국 관광공사가 발표한 2026년 트렌드는 '로컬 감성 여행'입니다.",
    summaryEs: "La Organización de Turismo de Corea destaca el 'turismo de experiencia local' como tendencia de 2026.",
    body: `한국관광공사가 2026년 외국인 관광 트렌드로 '로컬 감성 여행'을 선정했습니다.

서울 중심의 관광에서 벗어나 전주, 경주, 통영 등 지역 도시로 발길을 돌리는 외국인 여행자가 급증하고 있습니다.`,
    bodyEs: `La Organización de Turismo de Corea ha seleccionado el 'turismo de experiencia local' como tendencia para turistas extranjeros en 2026.

Cada vez más viajeros extranjeros se alejan del turismo centrado en Seúl y visitan ciudades regionales como Jeonju, Gyeongju y Tongyeong.`,
    culturalNote: "전주는 한국 전통 한옥마을로 유명하며, 경주는 신라 왕조의 수도였던 역사 도시입니다.",
    culturalNoteEs: "Jeonju es famosa por su aldea tradicional de casas Hanok, mientras que Gyeongju fue la capital de la dinastía Silla.",
    sources: [
      { title: "한국관광공사 - 2026 관광 트렌드", url: "https://visitkorea.or.kr/1" },
    ],
    publishedAt: "2026-04-20",
    likes: 43,
    status: "published",
    comments: [],
  },
];

export const MOCK_USER: User = {
  id: "u1",
  name: "Maria González",
  email: "maria@example.com",
  avatarUrl: "",
  likedContentIds: ["c1", "c3"],
};
