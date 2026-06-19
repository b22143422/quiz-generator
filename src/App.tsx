import {
  Fragment,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import './App.css';

// ═══════════════════════════════════════════════════════
//  EMBEDDED LOGO (옵티멈 로고 — 투명 배경 PNG)
// ═══════════════════════════════════════════════════════
const DEFAULT_LOGO =
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAUAAAABCCAMAAAAR8f8nAAABCGlDQ1BJQ0MgUHJvZmlsZQAAeJxjYGA8wQAELAYMDLl5JUVB7k4KEZFRCuwPGBiBEAwSk4sLGHADoKpv1yBqL+viUYcLcKakFicD6Q9ArFIEtBxopAiQLZIOYWuA2EkQtg2IXV5SUAJkB4DYRSFBzkB2CpCtkY7ETkJiJxcUgdT3ANk2uTmlyQh3M/Ck5oUGA2kOIJZhKGYIYnBncAL5H6IkfxEDg8VXBgbmCQixpJkMDNtbGRgkbiHEVBYwMPC3MDBsO48QQ4RJQWJRIliIBYiZ0tIYGD4tZ2DgjWRgEL7AwMAVDQsIHG5TALvNnSEfCNMZchhSgSKeDHkMyQx6QJYRgwGDIYMZAKbWPz9HbOBQAAAAP1BMVEX9/f0hFxXkAhKtqqhXUlB4cnCRjYvPtLSDfXpCPDncVGBGQD3gN0zkh4/Dwb6FgX4AAAAAAAAAAAAAAAAAAAB8tu1aAAAAEHRSTlMA//9g4LKKUaP/2/v+kECeZfDj1AAAA89JREFUeNrtm9t6gyAMgLXhINbq+7/tWtutAgln3Cm52TekIfwGCBCHgYXl38ptuGmmUCp6uexyYxRFMl8+ZWYYJXK5MMGa8Xs5CvOoGMBMsHYAP4TX4qoRzB5YDZCXEVRgPIhiD8wWRQLkObAW4MIeWAeQ48BKgFYguDCqfIC8F64FyKcxtQDvCPk8sA7gn46Bd8mpnBVI/3HHEV+9NhJQsvAGDF+17br3x+IIULwxgyu45gEmcRdH7fYoExMEjXIL9wnD168Q/XuZkFCMz+q17zoWk3t7xilAh+9bpKtjF79hW8OEaVW4USPm/tLVf+cDV9uqXb8Z/cIskVivgQQ4kbRDAEUKwOvxX/NkYgi78gG6RjzXsivd70TBe330LMssSRCqBmgAqaLIN1vgga4q7fyiaN6GcYwSHGMim3igL6h1UAowT381vwPBKMDXa2sOEH/cDmBIf934tQnGAY59AIbeVguAwfFUtvyi80FCo+JEgGNngBkuqNJUpTQKJwJcOwOENgP47c1jogueBRA6A1TNHBAbLYGaIYCmIcCtM0BZOAM+tjIgkJfheRtScY/zR+GUPnZIZtchhfMMtwD8lyDBbWsqBSgI/bIQoPWrKxrYCAQgHgGJ+GmMiADUiL8LpK1SgM+5zUT1y5IY0BChod+l99Ee9gIqAALVvltxKt4Lp+mXJXtgCPSTWqI2xJQKgMTZha+2EKDO2QTmToGCGtpAtEiZUgFQBwBCOw/sA1CmAhRhIr088McDtLp6DQCUDJA9sPccqL9pDqwHqNoC1Ps99nLrtgrLHwMQiGCkCuAcy6IA3LOS40CIBtLbWQCxcHirBDjHE3lGLJJW0Z0IJO9Exo4Ahbe7VL6ZNQAv8Uwef6cISsQOPj5vKwWO1emF3KQ8AyBxDlIB0M7Fu51yGkPoXLsAhH4AH43ebIDLKeeBBMA+HjikmF7ugXNSQnLjE+lTPRC/zk44rEgDuKRldIskKhkOiI2sTh44JIyd7gDb3sqdDBDiBvUews3uhSH0SnoBDA3itRagTv2opUlmwhTMtOkGkCYIQy3AIf2bDBO9WbHibRHmR+VhdQFIrIICbzEPoE7/qmpCbDB0dpaMXaOeCBBdBtXQAuAxEoymxEvk2o0gYgL5gYS6VIAr0tw1ety0yoDpVYcJOueTlsPOzM/U9Hr0VdsQR2fPPNNH1uekgvf8K1amX4ml979vjfoloH2FIJ+N+W1F9GtHv9OonudlTv+iYKVSpDGXGDLyqf+9oABZGCAD/I0ADeNgD2QP/G1y/NyHPxRkYfl2+QCamC5YGy4leQAAAABJRU5ErkJggg==';

// ═══════════════════════════════════════════════════════
//  TYPES
// ═══════════════════════════════════════════════════════
type PaperMode = 'exam' | 'worksheet';
type WorksheetType = 'grammar' | 'content';

type QuestionType = 'multiple-choice' | 'written' | 'ox';

interface OxSentence {
  id: string;
  text: string;
  answer: 'O' | 'X' | '';
  explanation: string;
}

interface Question {
  id: string;
  type: QuestionType;
  questionText: string;       // 발문 (위지윅 HTML)
  hasPassage: boolean;
  passage: string;            // 본문 (위지윅 HTML)
  conditions: string[];       // 영작 조건 (서술형 전용)
  choices: string[];          // 객관식 선택지 [5]
  answerLines: number;        // 서술형 답란 줄 수
  answer: string;             // 정답 (객관식: ① 등 / 서술형: text)
  oxSentences: OxSentence[];  // OX 문장들
  groupId?: string;           // 공통 발문 그룹 ID (선택)
}

interface CommonGroup {
  id: string;
  commonQuestionText: string; // 공통 발문 (위지윅 HTML)
  hasCommonPassage: boolean;
  commonPassage: string;      // 공통 본문 (위지윅 HTML)
}

// ─── 워크시트 (어법) ───
interface WorksheetBlank {
  id: string;
  marker: string;        // ⓐ, ⓑ, ⓒ... (자동 생성)
  answer: string;        // 정답 단어/표현
  grammarPoint: string;  // 어법명 (예: "사역동사 let + O + 동사원형")
  explanation: string;   // 자세한 해설
}

interface WorksheetItem {
  id: string;
  koreanTranslation: string;      // 한국어 해석
  englishSentence: string;        // 영어 문장 (빈칸은 {{marker:blank-id}} 토큰)
  blanks: WorksheetBlank[];
}

interface ExamHeader {
  academyName: string;
  grade: string;
  title: string;
  scope: string;
  logoDataUrl?: string;
}

interface SavedPaper {
  id: string;
  name: string;
  createdAt: number;
  mode: PaperMode;                  // 'exam' | 'worksheet'
  worksheetType?: WorksheetType;    // 워크시트일 때만 의미
  header: ExamHeader;
  questions: Question[];            // 시험지 모드용
  groups: CommonGroup[];            // 시험지 모드용
  worksheetItems: WorksheetItem[];  // 워크시트 모드용
}

// ═══════════════════════════════════════════════════════
//  A4 SIZING
// ═══════════════════════════════════════════════════════
const MM_TO_PX = 96 / 25.4;
const PAPER_W_MM = 210;
const PAPER_H_MM = 297;
const PAPER_W_PX = PAPER_W_MM * MM_TO_PX;
const PAPER_H_PX = PAPER_H_MM * MM_TO_PX;

const PAD_X_MM = 12;
const PAD_TOP_MM = 11;
const PAD_BOTTOM_MM = 11;
const COL_GAP_MM = 10;
const COL_W_MM = (PAPER_W_MM - PAD_X_MM * 2 - COL_GAP_MM) / 2;
const COL_W_PX = COL_W_MM * MM_TO_PX;
const COL_FULL_H_PX = (PAPER_H_MM - PAD_TOP_MM - PAD_BOTTOM_MM) * MM_TO_PX;

const BLOCK_GAP_PX = 1.5 * MM_TO_PX;
const GROUP_GAP_PX = 6 * MM_TO_PX;

const FOOTER_PX = 8 * MM_TO_PX;
const SAFETY_MARGIN_PX = 4 * MM_TO_PX;

// ═══════════════════════════════════════════════════════
//  LIBRARY (localStorage)
// ═══════════════════════════════════════════════════════
const LIBRARY_KEY = 'exam-studio.library.v2';
const LIBRARY_KEY_V1 = 'exam-studio.library.v1';

function normalizeQuestion(q: any): Question {
  const type: QuestionType =
    q?.type === 'written' || q?.type === 'ox' ? q.type : 'multiple-choice';
  return {
    id: q?.id ?? `q${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type,
    questionText: q?.questionText ?? '',
    hasPassage: !!q?.hasPassage,
    passage: q?.passage ?? '',
    conditions: Array.isArray(q?.conditions) ? q.conditions : [],
    choices:
      Array.isArray(q?.choices) && q.choices.length === 5
        ? q.choices
        : ['', '', '', '', ''],
    answerLines: typeof q?.answerLines === 'number' ? q.answerLines : 3,
    answer: q?.answer ?? '',
    oxSentences: Array.isArray(q?.oxSentences)
      ? q.oxSentences.map((s: any) => ({
          id: s?.id ?? `s${Date.now()}_${Math.random().toString(36).slice(2)}`,
          text: s?.text ?? '',
          answer: s?.answer === 'O' || s?.answer === 'X' ? s.answer : '',
          explanation: s?.explanation ?? '',
        }))
      : [],
    groupId: q?.groupId,
  };
}

function normalizeGroup(g: any): CommonGroup {
  return {
    id: g?.id ?? `g${Date.now()}_${Math.random().toString(36).slice(2)}`,
    commonQuestionText: g?.commonQuestionText ?? '',
    hasCommonPassage: !!g?.hasCommonPassage,
    commonPassage: g?.commonPassage ?? '',
  };
}

function normalizeWorksheetBlank(b: any): WorksheetBlank {
  return {
    id: b?.id ?? `b${Date.now()}_${Math.random().toString(36).slice(2)}`,
    marker: b?.marker ?? 'ⓐ',
    answer: b?.answer ?? '',
    grammarPoint: b?.grammarPoint ?? '',
    explanation: b?.explanation ?? '',
  };
}

function normalizeWorksheetItem(w: any): WorksheetItem {
  return {
    id: w?.id ?? `w${Date.now()}_${Math.random().toString(36).slice(2)}`,
    koreanTranslation: w?.koreanTranslation ?? '',
    englishSentence: w?.englishSentence ?? '',
    blanks: Array.isArray(w?.blanks) ? w.blanks.map(normalizeWorksheetBlank) : [],
  };
}

function parsePapers(raw: string | null): SavedPaper[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p) => p && p.id && p.header)
      .map((p) => {
        const mode: PaperMode = p.mode === 'worksheet' ? 'worksheet' : 'exam';
        const worksheetType: WorksheetType =
          p.worksheetType === 'content' ? 'content' : 'grammar';
        return {
          id: p.id,
          name: p.name ?? '제목 없음',
          createdAt: p.createdAt ?? Date.now(),
          mode,
          worksheetType,
          header: p.header,
          questions: Array.isArray(p.questions)
            ? p.questions.map(normalizeQuestion)
            : [],
          groups: Array.isArray(p.groups) ? p.groups.map(normalizeGroup) : [],
          worksheetItems: Array.isArray(p.worksheetItems)
            ? p.worksheetItems.map(normalizeWorksheetItem)
            : [],
        };
      });
  } catch {
    return [];
  }
}

function loadLibrary(): SavedPaper[] {
  // v2 데이터 로드
  const v2 = parsePapers(localStorage.getItem(LIBRARY_KEY));

  // v1 데이터가 남아있으면 마이그레이션
  try {
    const v1Raw = localStorage.getItem(LIBRARY_KEY_V1);
    if (v1Raw) {
      const v1Papers = parsePapers(v1Raw);
      if (v1Papers.length > 0) {
        // v2에 이미 같은 id가 있으면 중복 방지
        const existingIds = new Set(v2.map((p) => p.id));
        const toMigrate = v1Papers.filter((p) => !existingIds.has(p.id));
        if (toMigrate.length > 0) {
          const merged = [...v2, ...toMigrate];
          localStorage.setItem(LIBRARY_KEY, JSON.stringify(merged));
          console.log(
            `라이브러리 마이그레이션 완료: ${toMigrate.length}개 시험지를 v1 → v2로 이관`
          );
          return merged;
        }
      }
    }
  } catch (e) {
    console.error('Library v1 migration failed:', e);
  }

  return v2;
}

function persistLibrary(papers: SavedPaper[]) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(papers));
  } catch (e) {
    console.error('Failed to persist library:', e);
  }
}

// ─── JSON 파일 내보내기 / 불러오기 (백업 & 컴퓨터 간 이동) ───
function exportLibraryAsJson(papers: SavedPaper[]) {
  const payload = {
    type: 'exam-studio-library',
    version: 2,
    exportedAt: Date.now(),
    papers,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  a.href = url;
  a.download = `exam-studio-backup-${dateStr}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function parseImportedFile(text: string): SavedPaper[] {
  try {
    const parsed = JSON.parse(text);
    // 백업 파일 형식
    if (parsed?.type === 'exam-studio-library' && Array.isArray(parsed.papers)) {
      return parsePapers(JSON.stringify(parsed.papers));
    }
    // 또는 그냥 배열 형식
    if (Array.isArray(parsed)) {
      return parsePapers(text);
    }
  } catch {
    // ignore
  }
  return [];
}

function formatRelDate(ts: number): string {
  const d = new Date(ts);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const hh = String(d.getHours()).padStart(2, '0');
  const mi = String(d.getMinutes()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd} ${hh}:${mi}`;
}

// ═══════════════════════════════════════════════════════
//  HTML SANITIZER (위지윅 출력값 정화 — strong/u만 허용)
// ═══════════════════════════════════════════════════════
function sanitizeRichHtml(html: string): string {
  if (!html) return '';
  // 1) <br> 보존을 위해 임시 마커로 치환
  const withBr = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '');

  // 2) 허용 태그만 남기기 (strong/b → strong, u → u)
  const allowed = withBr
    .replace(/<\s*b(\s[^>]*)?>/gi, '<strong>')
    .replace(/<\s*\/\s*b\s*>/gi, '</strong>')
    .replace(/<(?!\s*\/?\s*(strong|u)\b)[^>]*>/gi, '');

  return allowed;
}

function isPlainTextEmpty(html: string): boolean {
  const stripped = html
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .trim();
  return stripped.length === 0;
}

// 긴 지문을 문장(또는 줄바꿈) 단위로 쪼개서 페이지를 넘어 흐를 수 있게 만든다.
// 각 조각은 독립 블록이 되어 컬럼/페이지 경계에서 자연스럽게 분리된다.
function splitPassageIntoSegments(html: string): string[] {
  if (!html) return [];

  // 1) 줄바꿈(\n, <br>, </p>)을 기준으로 1차 분리
  const normalized = html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>\s*<p[^>]*>/gi, '\n')
    .replace(/<\/?p[^>]*>/gi, '');

  const lines = normalized.split('\n');

  // 2) 각 줄을 문장 단위(. ! ?)로 더 쪼갬 — 단, 태그 안 망가지게 단순 분리
  const segments: string[] = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // 문장 끝(. ! ?) 뒤 공백을 기준으로 분리하되, 마침표는 유지
    const sentences = trimmed.match(/[^.!?]+[.!?]*\s*/g);
    if (sentences && sentences.length > 1) {
      // 2문장씩 묶어서 너무 잘게 쪼개지지 않게
      for (let i = 0; i < sentences.length; i += 2) {
        const chunk = sentences
          .slice(i, i + 2)
          .join('')
          .trim();
        if (chunk) segments.push(chunk);
      }
    } else {
      segments.push(trimmed);
    }
  }

  return segments.length > 0 ? segments : [html];
}

// ═══════════════════════════════════════════════════════
//  INITIAL
// ═══════════════════════════════════════════════════════
const initialHeader: ExamHeader = {
  academyName: '옵티멈N스터디 영어학원',
  grade: '',
  title: '',
  scope: '',
  logoDataUrl: DEFAULT_LOGO,
};

// ═══════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════
export default function App() {
  const [paperMode, setPaperMode] = useState<PaperMode>('exam');
  const [worksheetType, setWorksheetType] = useState<WorksheetType>('grammar');

  const [header, setHeader] = useState<ExamHeader>(initialHeader);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [groups, setGroups] = useState<CommonGroup[]>([]);
  const [worksheetItems, setWorksheetItems] = useState<WorksheetItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [library, setLibrary] = useState<SavedPaper[]>(() => loadLibrary());

  const updateHeader = (patch: Partial<ExamHeader>) =>
    setHeader((prev) => ({ ...prev, ...patch }));

  const addQuestion = (q: Omit<Question, 'id'>) =>
    setQuestions((prev) => [
      ...prev,
      { ...q, id: `q${Date.now()}_${Math.random().toString(36).slice(2)}` },
    ]);

  const updateQuestion = (id: string, patch: Partial<Question>) =>
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...patch } : q))
    );

  const deleteQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveQuestion = (id: string, dir: -1 | 1) => {
    setQuestions((prev) => {
      const idx = prev.findIndex((q) => q.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  // ─── 워크시트 아이템 관리 ───
  const addWorksheetItem = (item: Omit<WorksheetItem, 'id'>) =>
    setWorksheetItems((prev) => [
      ...prev,
      { ...item, id: `w${Date.now()}_${Math.random().toString(36).slice(2)}` },
    ]);

  const updateWorksheetItem = (id: string, patch: Partial<WorksheetItem>) =>
    setWorksheetItems((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...patch } : w))
    );

  const deleteWorksheetItem = (id: string) => {
    setWorksheetItems((prev) => prev.filter((w) => w.id !== id));
    if (editingId === id) setEditingId(null);
  };

  const moveWorksheetItem = (id: string, dir: -1 | 1) => {
    setWorksheetItems((prev) => {
      const idx = prev.findIndex((w) => w.id === id);
      if (idx < 0) return prev;
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= prev.length) return prev;
      const next = [...prev];
      [next[idx], next[newIdx]] = [next[newIdx], next[idx]];
      return next;
    });
  };

  // 모드 전환 시 작업 보호
  const switchMode = (mode: PaperMode) => {
    if (mode === paperMode) return;
    const hasWork =
      questions.length > 0 || worksheetItems.length > 0;
    if (hasWork) {
      const ok = confirm(
        '모드를 바꾸면 현재 작업 중인 내용이 다른 모드로 전환되어 캔버스에 보이지 않게 됩니다.\n(라이브러리에 저장 안 한 내용은 잃을 수 있어요)\n계속할까요?'
      );
      if (!ok) return;
    }
    setPaperMode(mode);
    setEditingId(null);
  };

  // ─── 공통 발문 그룹 관리 ───
  const createGroup = (
    questionIds: string[],
    commonQuestionText: string,
    hasCommonPassage: boolean,
    commonPassage: string
  ) => {
    const groupId = `g${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const newGroup: CommonGroup = {
      id: groupId,
      commonQuestionText,
      hasCommonPassage,
      commonPassage,
    };
    setGroups((prev) => [...prev, newGroup]);
    setQuestions((prev) =>
      prev.map((q) => (questionIds.includes(q.id) ? { ...q, groupId } : q))
    );
  };

  const updateGroup = (id: string, patch: Partial<CommonGroup>) =>
    setGroups((prev) =>
      prev.map((g) => (g.id === id ? { ...g, ...patch } : g))
    );

  const ungroupQuestions = (groupId: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.groupId === groupId ? { ...q, groupId: undefined } : q
      )
    );
    setGroups((prev) => prev.filter((g) => g.id !== groupId));
  };

  // ─── 라이브러리 ───
  const savePaper = () => {
    const defaultName =
      header.title?.trim() ||
      `${paperMode === 'exam' ? '시험지' : '워크시트'} ${new Date().toLocaleDateString('ko-KR')}`;
    const name = prompt('어떤 이름으로 저장할까요?', defaultName);
    if (!name?.trim()) return;

    const newPaper: SavedPaper = {
      id: `paper_${Date.now()}`,
      name: name.trim(),
      createdAt: Date.now(),
      mode: paperMode,
      worksheetType: paperMode === 'worksheet' ? worksheetType : undefined,
      header: { ...header },
      questions: questions.map((q) => ({ ...q })),
      groups: groups.map((g) => ({ ...g })),
      worksheetItems: worksheetItems.map((w) => ({
        ...w,
        blanks: w.blanks.map((b) => ({ ...b })),
      })),
    };
    const next = [newPaper, ...library];
    setLibrary(next);
    persistLibrary(next);
  };

  const loadPaper = (id: string) => {
    const paper = library.find((p) => p.id === id);
    if (!paper) return;
    const hasWork = questions.length > 0 || worksheetItems.length > 0;
    if (hasWork) {
      const ok = confirm(
        '현재 작업 중인 내용이 사라지고 저장된 항목으로 대체됩니다. 계속할까요?\n\n(저장하지 않은 변경사항은 사라집니다)'
      );
      if (!ok) return;
    }
    setPaperMode(paper.mode ?? 'exam');
    if (paper.worksheetType) setWorksheetType(paper.worksheetType);
    setHeader(paper.header);
    setQuestions(paper.questions.map(normalizeQuestion));
    setGroups(paper.groups.map(normalizeGroup));
    setWorksheetItems(
      (paper.worksheetItems ?? []).map(normalizeWorksheetItem)
    );
    setEditingId(null);
  };

  const deletePaper = (id: string) => {
    const paper = library.find((p) => p.id === id);
    if (!paper) return;
    if (!confirm(`"${paper.name}"을(를) 라이브러리에서 삭제할까요?`)) return;
    const next = library.filter((p) => p.id !== id);
    setLibrary(next);
    persistLibrary(next);
  };

  const newBlankPaper = () => {
    const hasWork = questions.length > 0 || worksheetItems.length > 0;
    if (hasWork) {
      const ok = confirm(
        '현재 작업 중인 내용이 사라집니다. 새로 시작할까요?'
      );
      if (!ok) return;
    }
    setHeader({ ...initialHeader });
    setQuestions([]);
    setGroups([]);
    setWorksheetItems([]);
    setEditingId(null);
  };

  // 라이브러리 백업 파일로 내보내기
  const exportLibrary = () => {
    if (library.length === 0) {
      alert('내보낼 시험지가 없습니다.');
      return;
    }
    exportLibraryAsJson(library);
  };

  // 라이브러리 백업 파일에서 불러오기
  const importLibrary = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const imported = parseImportedFile(text);
      if (imported.length === 0) {
        alert('파일에서 시험지를 찾을 수 없습니다. 올바른 백업 파일인지 확인하세요.');
        return;
      }
      // 기존 라이브러리와 병합 (중복 id는 새 데이터로 덮어쓰기 옵션 묻기)
      const existingIds = new Set(library.map((p) => p.id));
      const newOnes = imported.filter((p) => !existingIds.has(p.id));
      const duplicates = imported.filter((p) => existingIds.has(p.id));

      let merged = [...library, ...newOnes];

      if (duplicates.length > 0) {
        const ok = confirm(
          `${imported.length}개 시험지 중 ${duplicates.length}개가 라이브러리에 이미 존재합니다.\n\n[확인]: 새 파일로 덮어쓰기\n[취소]: 새 항목만 추가 (중복은 무시)`
        );
        if (ok) {
          // 중복은 새 파일 것으로 교체
          merged = library.map((p) => {
            const dup = duplicates.find((d) => d.id === p.id);
            return dup ?? p;
          });
          merged = [...merged, ...newOnes];
        }
      }

      setLibrary(merged);
      persistLibrary(merged);
      alert(`불러오기 완료: ${newOnes.length}개 새 시험지 추가됨` + (duplicates.length > 0 ? `, ${duplicates.length}개 중복 처리됨` : ''));
    };
    reader.readAsText(file);
  };

  return (
    <div className="app-shell">
      <ControlPanel
        paperMode={paperMode}
        worksheetType={worksheetType}
        onSwitchMode={switchMode}
        onSwitchWorksheetType={setWorksheetType}
        header={header}
        onHeaderChange={updateHeader}
        questions={questions}
        groups={groups}
        worksheetItems={worksheetItems}
        editingId={editingId}
        onSelectEdit={setEditingId}
        onAdd={addQuestion}
        onUpdate={updateQuestion}
        onDelete={deleteQuestion}
        onMove={moveQuestion}
        onAddWorksheetItem={addWorksheetItem}
        onUpdateWorksheetItem={updateWorksheetItem}
        onDeleteWorksheetItem={deleteWorksheetItem}
        onMoveWorksheetItem={moveWorksheetItem}
        onCreateGroup={createGroup}
        onUpdateGroup={updateGroup}
        onUngroup={ungroupQuestions}
        library={library}
        onSavePaper={savePaper}
        onLoadPaper={loadPaper}
        onDeletePaper={deletePaper}
        onNewBlank={newBlankPaper}
        onExportLibrary={exportLibrary}
        onImportLibrary={importLibrary}
      />
      {paperMode === 'exam' ? (
        <ExamPaper header={header} questions={questions} groups={groups} />
      ) : (
        <WorksheetPaper
          header={header}
          items={worksheetItems}
          worksheetType={worksheetType}
        />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  RICH TEXT EDITOR (위지윅 - 볼드 + 밑줄)
// ═══════════════════════════════════════════════════════
interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
}

function RichTextEditor({
  value,
  onChange,
  placeholder,
  minHeight = 84,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);

  // 외부에서 value 바뀌면(다른 문제 선택 등) 에디터에 반영
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = () => {
    if (!editorRef.current) return;
    const html = sanitizeRichHtml(editorRef.current.innerHTML);
    onChange(html);
    force((n) => n + 1);
  };

  const exec = (cmd: 'bold' | 'underline') => {
    editorRef.current?.focus();
    document.execCommand(cmd, false);
    handleInput();
  };

  const isEmpty = isPlainTextEmpty(value || '');

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        <button
          type="button"
          className="rte-btn rte-btn-bold"
          onMouseDown={(e) => {
            e.preventDefault();
            exec('bold');
          }}
          title="굵게 (Ctrl+B)"
        >
          B
        </button>
        <button
          type="button"
          className="rte-btn rte-btn-underline"
          onMouseDown={(e) => {
            e.preventDefault();
            exec('underline');
          }}
          title="밑줄 (Ctrl+U)"
        >
          U
        </button>
        <span className="rte-toolbar-hint">
          드래그 선택 후 버튼 클릭
        </span>
      </div>
      <div
        ref={editorRef}
        className="rte-editor"
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleInput}
        style={{ minHeight }}
        data-placeholder={placeholder}
        data-empty={isEmpty ? 'true' : 'false'}
      />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  CONTROL PANEL
// ═══════════════════════════════════════════════════════
interface ControlPanelProps {
  paperMode: PaperMode;
  worksheetType: WorksheetType;
  onSwitchMode: (mode: PaperMode) => void;
  onSwitchWorksheetType: (type: WorksheetType) => void;
  header: ExamHeader;
  onHeaderChange: (patch: Partial<ExamHeader>) => void;
  questions: Question[];
  groups: CommonGroup[];
  worksheetItems: WorksheetItem[];
  editingId: string | null;
  onSelectEdit: (id: string | null) => void;
  onAdd: (q: Omit<Question, 'id'>) => void;
  onUpdate: (id: string, patch: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onAddWorksheetItem: (item: Omit<WorksheetItem, 'id'>) => void;
  onUpdateWorksheetItem: (id: string, patch: Partial<WorksheetItem>) => void;
  onDeleteWorksheetItem: (id: string) => void;
  onMoveWorksheetItem: (id: string, dir: -1 | 1) => void;
  onCreateGroup: (
    ids: string[],
    commonQT: string,
    hasPassage: boolean,
    passage: string
  ) => void;
  onUpdateGroup: (id: string, patch: Partial<CommonGroup>) => void;
  onUngroup: (groupId: string) => void;
  library: SavedPaper[];
  onSavePaper: () => void;
  onLoadPaper: (id: string) => void;
  onDeletePaper: (id: string) => void;
  onNewBlank: () => void;
  onExportLibrary: () => void;
  onImportLibrary: (file: File) => void;
}

interface ComposerState {
  type: QuestionType;
  questionText: string;
  hasPassage: boolean;
  passage: string;
  conditions: string[];
  choices: string[];
  answerLines: number;
  answer: string;
  oxSentences: OxSentence[];
}

const blankComposer: ComposerState = {
  type: 'multiple-choice',
  questionText: '',
  hasPassage: false,
  passage: '',
  conditions: [],
  choices: ['', '', '', '', ''],
  answerLines: 3,
  answer: '',
  oxSentences: [],
};

function ControlPanel({
  paperMode,
  worksheetType,
  onSwitchMode,
  onSwitchWorksheetType,
  header,
  onHeaderChange,
  questions,
  groups,
  worksheetItems,
  editingId,
  onSelectEdit,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  onAddWorksheetItem,
  onUpdateWorksheetItem,
  onDeleteWorksheetItem,
  onMoveWorksheetItem,
  onCreateGroup,
  onUpdateGroup,
  onUngroup,
  library,
  onSavePaper,
  onLoadPaper,
  onDeletePaper,
  onNewBlank,
  onExportLibrary,
  onImportLibrary,
}: ControlPanelProps) {
  const [composer, setComposer] = useState<ComposerState>(blankComposer);
  const [listExpanded, setListExpanded] = useState(false);
  const [answersExpanded, setAnswersExpanded] = useState(false);
  const [libraryExpanded, setLibraryExpanded] = useState(false);

  // 그룹화 모드: 문제 목록에서 multi-select 후 묶기
  const [groupingMode, setGroupingMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [groupModal, setGroupModal] = useState<{
    questionIds: string[];
  } | null>(null);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  useEffect(() => {
    if (editingId) {
      const q = questions.find((qq) => qq.id === editingId);
      if (q) {
        setComposer({
          type: q.type,
          questionText: q.questionText,
          hasPassage: q.hasPassage,
          passage: q.passage,
          conditions: [...q.conditions],
          choices: [...q.choices],
          answerLines: q.answerLines,
          answer: q.answer,
          oxSentences: q.oxSentences.map((s) => ({ ...s })),
        });
        setListExpanded(true);
      }
    }
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setComposer({
      ...blankComposer,
      type: composer.type, // 유형은 유지
    });
    onSelectEdit(null);
  };

  const submit = () => {
    if (isPlainTextEmpty(composer.questionText)) return;

    // OX의 경우 빈 문장 제거
    const cleanedOx = composer.oxSentences.filter(
      (s) => s.text.trim() !== ''
    );
    // 빈 조건 제거
    const cleanedConditions = composer.conditions.filter(
      (c) => c.trim() !== ''
    );

    const payload: Omit<Question, 'id'> = {
      ...composer,
      oxSentences: cleanedOx,
      conditions: cleanedConditions,
    };

    if (editingId) onUpdate(editingId, payload);
    else onAdd(payload);
    reset();
  };

  const typeCounts = useMemo(() => {
    return {
      mc: questions.filter((q) => q.type === 'multiple-choice').length,
      wr: questions.filter((q) => q.type === 'written').length,
      ox: questions.filter((q) => q.type === 'ox').length,
    };
  }, [questions]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onHeaderChange({ logoDataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  // 조건 관리
  const addCondition = () =>
    setComposer((s) => ({ ...s, conditions: [...s.conditions, ''] }));
  const updateCondition = (i: number, v: string) =>
    setComposer((s) => ({
      ...s,
      conditions: s.conditions.map((c, idx) => (idx === i ? v : c)),
    }));
  const removeCondition = (i: number) =>
    setComposer((s) => ({
      ...s,
      conditions: s.conditions.filter((_, idx) => idx !== i),
    }));

  // OX 문장 관리
  const addOxSentence = () =>
    setComposer((s) => ({
      ...s,
      oxSentences: [
        ...s.oxSentences,
        {
          id: `s${Date.now()}_${Math.random().toString(36).slice(2)}`,
          text: '',
          answer: '',
          explanation: '',
        },
      ],
    }));
  const updateOxSentence = (i: number, patch: Partial<OxSentence>) =>
    setComposer((s) => ({
      ...s,
      oxSentences: s.oxSentences.map((ox, idx) =>
        idx === i ? { ...ox, ...patch } : ox
      ),
    }));
  const removeOxSentence = (i: number) =>
    setComposer((s) => ({
      ...s,
      oxSentences: s.oxSentences.filter((_, idx) => idx !== i),
    }));

  // 그룹화 모드 토글
  const toggleGroupingMode = () => {
    setGroupingMode((m) => !m);
    setSelectedIds(new Set());
  };
  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const startGrouping = () => {
    if (selectedIds.size < 2) {
      alert('공통 발문으로 묶을 문제를 2개 이상 선택해주세요.');
      return;
    }
    // 선택된 문제 중 이미 다른 그룹에 속한 문제가 있는지 확인
    const selectedQs = questions.filter((q) => selectedIds.has(q.id));
    const alreadyGrouped = selectedQs.filter((q) => q.groupId);
    if (alreadyGrouped.length > 0) {
      alert('이미 다른 공통 발문에 속한 문제가 있습니다. 먼저 그룹을 해제해주세요.');
      return;
    }
    // 선택 순서가 아닌 문제 목록 순서로 정렬
    const orderedIds = questions
      .filter((q) => selectedIds.has(q.id))
      .map((q) => q.id);
    setGroupModal({ questionIds: orderedIds });
  };

  return (
    <aside className="control-panel">
      <div className="cp-brand">
        <div className="cp-brand-mark">EX</div>
        <div className="cp-brand-text">
          <div className="cp-brand-title">EXAM STUDIO</div>
          <div className="cp-brand-sub">학원 자료 편집 · 실시간 미리보기</div>
        </div>
        <button
          className="cp-brand-action"
          onClick={onNewBlank}
          title="새로 시작"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 5v14M5 12h14"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      {/* ───────── 모드 토글 ───────── */}
      <div className="cp-mode-bar">
        <button
          className={`cp-mode-opt ${paperMode === 'exam' ? 'active' : ''}`}
          onClick={() => onSwitchMode('exam')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          시험지
        </button>
        <button
          className={`cp-mode-opt ${paperMode === 'worksheet' ? 'active' : ''}`}
          onClick={() => onSwitchMode('worksheet')}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8 M10 9H8"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          워크시트
        </button>
      </div>

      {/* 워크시트 모드일 때만 - 유형 토글 */}
      {paperMode === 'worksheet' && (
        <div className="cp-worksheet-type-bar">
          <button
            className={`cp-worksheet-type-opt ${worksheetType === 'grammar' ? 'active' : ''}`}
            onClick={() => onSwitchWorksheetType('grammar')}
          >
            <span className="cp-worksheet-type-mark">G</span>
            어법
          </button>
          <button
            className={`cp-worksheet-type-opt ${worksheetType === 'content' ? 'active' : ''}`}
            onClick={() => onSwitchWorksheetType('content')}
          >
            <span className="cp-worksheet-type-mark">C</span>
            내용
          </button>
        </div>
      )}

      {/* ───────── 01 시험지 정보 ───────── */}
      <section className="cp-section">
        <div className="cp-section-head">
          <span className="cp-section-num">01</span>
          <h3>시험지 정보</h3>
        </div>

        <div className="cp-logo-row">
          <div className="cp-logo-preview">
            {header.logoDataUrl ? (
              <img src={header.logoDataUrl} alt="logo" />
            ) : (
              <span>{header.academyName?.[0] ?? 'A'}</span>
            )}
          </div>
          <div className="cp-logo-controls">
            <label className="cp-file-btn">
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                hidden
              />
              로고 변경
            </label>
            <button
              className="cp-link-btn"
              onClick={() => onHeaderChange({ logoDataUrl: DEFAULT_LOGO })}
            >
              기본 로고로
            </button>
          </div>
        </div>

        <div className="cp-grid-2">
          <Field
            label="학원명"
            value={header.academyName}
            onChange={(v) => onHeaderChange({ academyName: v })}
          />
          <Field
            label="학년"
            value={header.grade}
            placeholder="예: 고등 2학년"
            onChange={(v) => onHeaderChange({ grade: v })}
          />
        </div>

        <Field
          label="타이틀"
          value={header.title}
          placeholder="예: 2026학년도 1학기 기말 대비"
          onChange={(v) => onHeaderChange({ title: v })}
        />

        <div className="cp-field cp-field-emphasis">
          <label>
            <span className="cp-field-pin" />
            시험 범위
          </label>
          <input
            className="cp-input cp-input-emphasis"
            value={header.scope}
            onChange={(e) => onHeaderChange({ scope: e.target.value })}
            placeholder="예: 엘레나T - 해리포터 Ch. 1 ~ 3"
          />
        </div>
      </section>

      {/* ───────── 02 문제 추가 ───────── */}
      {paperMode === 'exam' && (
      <section className="cp-section">
        <div className="cp-section-head">
          <span className="cp-section-num">02</span>
          <h3>{editingId ? '문제 수정' : '문제 추가'}</h3>
          {editingId && (
            <button className="cp-mini-btn" onClick={reset}>
              새 문제로
            </button>
          )}
        </div>

        <div className="cp-type-toggle cp-type-toggle-3">
          <button
            className={`cp-type-opt ${
              composer.type === 'multiple-choice' ? 'active' : ''
            }`}
            onClick={() =>
              setComposer({ ...composer, type: 'multiple-choice' })
            }
          >
            <span className="cp-type-mark">①</span>
            <span>객관식</span>
            <span className="cp-type-count">{typeCounts.mc}</span>
          </button>
          <button
            className={`cp-type-opt ${
              composer.type === 'written' ? 'active' : ''
            }`}
            onClick={() => setComposer({ ...composer, type: 'written' })}
          >
            <span className="cp-type-mark">✎</span>
            <span>서술형</span>
            <span className="cp-type-count">{typeCounts.wr}</span>
          </button>
          <button
            className={`cp-type-opt ${composer.type === 'ox' ? 'active' : ''}`}
            onClick={() => setComposer({ ...composer, type: 'ox' })}
          >
            <span className="cp-type-mark">O/X</span>
            <span>OX</span>
            <span className="cp-type-count">{typeCounts.ox}</span>
          </button>
        </div>

        <div className="cp-field">
          <label>발문</label>
          <RichTextEditor
            value={composer.questionText}
            onChange={(html) =>
              setComposer({ ...composer, questionText: html })
            }
            placeholder="문제의 발문을 입력하세요. 드래그 선택 후 B / U 버튼으로 강조 가능"
          />
        </div>

        {/* 본문 (모든 유형 공통) */}
        <div className="cp-passage-block">
          <label className="cp-checkbox-label">
            <input
              type="checkbox"
              checked={composer.hasPassage}
              onChange={(e) =>
                setComposer({ ...composer, hasPassage: e.target.checked })
              }
            />
            <span className="cp-checkbox-box" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="cp-checkbox-text">
              주어진 지문 / 본문 포함
              <em>본문에도 굵게·밑줄 적용 가능</em>
            </span>
          </label>
          {composer.hasPassage && (
            <div className="cp-passage-input">
              <RichTextEditor
                value={composer.passage}
                onChange={(html) =>
                  setComposer({ ...composer, passage: html })
                }
                placeholder="발문과 선지(또는 답란) 사이에 들어갈 본문/지문/예문. 단어/구절 드래그 후 B 또는 U 버튼으로 강조 표시."
                minHeight={120}
              />
            </div>
          )}
        </div>

        {/* 유형별 입력 영역 */}
        {composer.type === 'multiple-choice' && (
          <div className="cp-field">
            <label>선택지</label>
            <div className="cp-choices">
              {composer.choices.map((c, i) => (
                <div key={i} className="cp-choice-row">
                  <span className="cp-choice-mark">
                    {['①', '②', '③', '④', '⑤'][i]}
                  </span>
                  <input
                    className="cp-input"
                    value={c}
                    placeholder={`선택지 ${i + 1}`}
                    onChange={(e) => {
                      const next = [...composer.choices];
                      next[i] = e.target.value;
                      setComposer({ ...composer, choices: next });
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {composer.type === 'written' && (
          <>
            {/* 영작 조건 박스 */}
            <div className="cp-conditions-block">
              <label className="cp-checkbox-label">
                <input
                  type="checkbox"
                  checked={composer.conditions.length > 0}
                  onChange={(e) => {
                    if (e.target.checked) {
                      if (composer.conditions.length === 0) {
                        setComposer({ ...composer, conditions: [''] });
                      }
                    } else {
                      setComposer({ ...composer, conditions: [] });
                    }
                  }}
                />
                <span className="cp-checkbox-box" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                    <path
                      d="M3 8.5L6.5 12L13 4.5"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="cp-checkbox-text">
                  영작 조건 포함
                  <em>주어진 단어 활용·어법 조건 등</em>
                </span>
              </label>

              {composer.conditions.length > 0 && (
                <div className="cp-conditions-list">
                  {composer.conditions.map((c, i) => (
                    <div key={i} className="cp-condition-row">
                      <span className="cp-condition-num">{i + 1}.</span>
                      <input
                        className="cp-input"
                        value={c}
                        placeholder={`조건 ${i + 1}`}
                        onChange={(e) => updateCondition(i, e.target.value)}
                      />
                      <button
                        className="cp-condition-del"
                        onClick={() => removeCondition(i)}
                        title="조건 삭제"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button className="cp-condition-add" onClick={addCondition}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                    조건 추가
                  </button>
                </div>
              )}
            </div>

            <div className="cp-field">
              <label>정답 작성란 줄 수</label>
              <div className="cp-stepper">
                <button
                  onClick={() =>
                    setComposer({
                      ...composer,
                      answerLines: Math.max(1, composer.answerLines - 1),
                    })
                  }
                >
                  −
                </button>
                <span>{composer.answerLines}줄</span>
                <button
                  onClick={() =>
                    setComposer({
                      ...composer,
                      answerLines: Math.min(20, composer.answerLines + 1),
                    })
                  }
                >
                  +
                </button>
              </div>
            </div>
          </>
        )}

        {composer.type === 'ox' && (
          <div className="cp-field">
            <label>OX 판단 문장</label>
            <div className="cp-ox-list">
              {composer.oxSentences.length === 0 && (
                <div className="cp-ox-empty">
                  아직 문장이 없습니다. 아래 버튼으로 추가하세요.
                </div>
              )}
              {composer.oxSentences.map((s, i) => (
                <div key={s.id} className="cp-ox-row">
                  <div className="cp-ox-row-head">
                    <span className="cp-ox-num">({i + 1})</span>
                    <textarea
                      className="cp-textarea cp-ox-text"
                      value={s.text}
                      placeholder="OX로 판단할 문장 (1~2문장)"
                      rows={2}
                      onChange={(e) =>
                        updateOxSentence(i, { text: e.target.value })
                      }
                    />
                    <button
                      className="cp-condition-del"
                      onClick={() => removeOxSentence(i)}
                      title="문장 삭제"
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}
              <button className="cp-condition-add" onClick={addOxSentence}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 5v14M5 12h14"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
                문장 추가
              </button>
            </div>
            <small className="cp-hint">
              ※ 정답(O/X) 및 X일 경우 해설은 <strong>04. 답지 작성</strong> 섹션에서 입력하세요.
            </small>
          </div>
        )}

        <div className="cp-actions">
          <button className="cp-btn-primary" onClick={submit}>
            {editingId ? '수정 적용' : '시험지에 추가'}
          </button>
          {editingId && (
            <button
              className="cp-btn-ghost danger"
              onClick={() => {
                if (confirm('이 문제를 삭제할까요?')) {
                  onDelete(editingId);
                  reset();
                }
              }}
            >
              삭제
            </button>
          )}
        </div>
      </section>
      )}

      {/* ───────── 03 문제 목록 ───────── */}
      {paperMode === 'exam' && (
      <section className="cp-section">
        <button
          className="cp-section-head cp-section-head-toggle"
          onClick={() => setListExpanded((v) => !v)}
          aria-expanded={listExpanded}
        >
          <span className="cp-section-num">03</span>
          <h3>문제 목록</h3>
          <span className="cp-list-total">{questions.length} 문항</span>
          <Chevron open={listExpanded} />
        </button>

        {listExpanded && (
          <>
            {questions.length > 0 && (
              <div className="cp-grouping-bar">
                {!groupingMode ? (
                  <button
                    className="cp-grouping-btn"
                    onClick={toggleGroupingMode}
                    title="여러 문제를 같은 발문으로 묶기"
                  >
                    <svg
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <rect
                        x="3"
                        y="3"
                        width="7"
                        height="7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <rect
                        x="14"
                        y="3"
                        width="7"
                        height="7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                      <rect
                        x="3"
                        y="14"
                        width="7"
                        height="7"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      />
                    </svg>
                    공통 발문으로 묶기
                  </button>
                ) : (
                  <div className="cp-grouping-active">
                    <span className="cp-grouping-count">
                      {selectedIds.size}개 선택됨
                    </span>
                    <button className="cp-grouping-apply" onClick={startGrouping}>
                      묶기
                    </button>
                    <button
                      className="cp-grouping-cancel"
                      onClick={toggleGroupingMode}
                    >
                      취소
                    </button>
                  </div>
                )}
              </div>
            )}

            {questions.length === 0 ? (
              <div className="cp-empty">아직 추가된 문제가 없습니다.</div>
            ) : (
              <QuestionList
                questions={questions}
                groups={groups}
                editingId={editingId}
                groupingMode={groupingMode}
                selectedIds={selectedIds}
                onToggleSelect={toggleSelect}
                onSelectEdit={onSelectEdit}
                onDelete={onDelete}
                onMove={onMove}
                onEditGroup={(gid) => setEditingGroupId(gid)}
              />
            )}
          </>
        )}
      </section>
      )}

      {/* ───────── 04 답지 작성 ───────── */}
      {paperMode === 'exam' && (
      <section className="cp-section">
        <button
          className="cp-section-head cp-section-head-toggle"
          onClick={() => setAnswersExpanded((v) => !v)}
          aria-expanded={answersExpanded}
        >
          <span className="cp-section-num">04</span>
          <h3>답지 작성</h3>
          <span className="cp-list-total">맨 뒷장에 첨부</span>
          <Chevron open={answersExpanded} />
        </button>

        {answersExpanded &&
          (questions.length === 0 ? (
            <div className="cp-empty">먼저 문제를 추가해 주세요.</div>
          ) : (
            <div className="cp-answer-list">
              {questions.map((q, idx) => (
                <AnswerRow
                  key={q.id}
                  q={q}
                  num={idx + 1}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          ))}
      </section>
      )}

      {/* ───────── 워크시트 모드용 패널 ───────── */}
      {paperMode === 'worksheet' && worksheetType === 'grammar' && (
        <WorksheetGrammarPanel
          items={worksheetItems}
          editingId={editingId}
          onSelectEdit={onSelectEdit}
          onAdd={onAddWorksheetItem}
          onUpdate={onUpdateWorksheetItem}
          onDelete={onDeleteWorksheetItem}
          onMove={onMoveWorksheetItem}
        />
      )}

      {paperMode === 'worksheet' && worksheetType === 'content' && (
        <section className="cp-section">
          <div className="cp-section-head">
            <span className="cp-section-num">02</span>
            <h3>내용 워크시트</h3>
          </div>
          <div className="cp-coming-soon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M12 6v6l4 2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <div className="cp-coming-soon-title">곧 추가됩니다</div>
            <div className="cp-coming-soon-desc">
              내용 워크시트 유형은 작업자가 추후 확정한 후 추가될 예정입니다.
              <br />
              어법 워크시트는 좌측 상단 토글에서 선택해 사용할 수 있어요.
            </div>
          </div>
        </section>
      )}

      {/* ───────── 05 라이브러리 ───────── */}
      <section className="cp-section">
        <button
          className="cp-section-head cp-section-head-toggle"
          onClick={() => setLibraryExpanded((v) => !v)}
          aria-expanded={libraryExpanded}
        >
          <span className="cp-section-num">05</span>
          <h3>라이브러리</h3>
          <span className="cp-list-total">{library.length} 시험지</span>
          <Chevron open={libraryExpanded} />
        </button>

        {libraryExpanded && (
          <>
           <button
              className="cp-btn-primary cp-library-save-btn"
              onClick={onSavePaper}
              disabled={questions.length === 0 && worksheetItems.length === 0}
              title={
                questions.length === 0 && worksheetItems.length === 0
                  ? '1개 이상 추가하면 저장할 수 있습니다'
                  : '현재 작업물을 라이브러리에 저장합니다'
              }
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path
                  d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              현재 시험지 저장
            </button>

            {library.length === 0 ? (
              <div className="cp-empty">
                저장된 시험지가 없습니다.
                <br />
                <small>
                  완성된 시험지를 저장하면 나중에 다시 불러올 수 있어요.
                </small>
              </div>
            ) : (
              <ul className="cp-library-list">
                {library.map((paper) => (
                  <li key={paper.id} className="cp-library-item">
                    <div className="cp-library-info">
                      <div className="cp-library-name">{paper.name}</div>
                      <div className="cp-library-meta">
                        <span>{paper.questions.length}문항</span>
                        <span className="cp-library-dot">·</span>
                        <span>{formatRelDate(paper.createdAt)}</span>
                      </div>
                    </div>
                    <div className="cp-library-tools">
                      <button
                        className="cp-library-load"
                        onClick={() => onLoadPaper(paper.id)}
                        title="이 시험지로 불러오기"
                      >
                        불러오기
                      </button>
                      <button
                        className="cp-library-delete danger"
                        onClick={() => onDeletePaper(paper.id)}
                        title="라이브러리에서 삭제"
                      >
                        ×
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="cp-library-backup">
              <button
                className="cp-library-backup-btn"
                onClick={onExportLibrary}
                disabled={library.length === 0}
                title="라이브러리 전체를 백업 파일로 다운로드"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                백업 파일 내보내기
              </button>
              <label
                className="cp-library-backup-btn"
                title="백업 파일에서 시험지 불러오기"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                백업 파일 불러오기
                <input
                  type="file"
                  accept=".json,application/json"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onImportLibrary(f);
                    e.target.value = ''; // 같은 파일 다시 선택 가능하게
                  }}
                />
              </label>
            </div>

            <div className="cp-library-note">
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                style={{ flexShrink: 0 }}
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M12 8v4M12 16h.01"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              라이브러리는 이 브라우저에만 저장됩니다. 다른 컴퓨터에서 쓰거나 안전한 백업을 원하면 <strong>백업 파일 내보내기</strong>로 JSON 파일을 저장해두세요.
            </div>
          </>
        )}
      </section>

      {/* 공통 발문 생성 모달 */}
      {groupModal && (
        <GroupModal
          questionIds={groupModal.questionIds}
          onClose={() => setGroupModal(null)}
          onConfirm={(commonQT, hasP, p) => {
            onCreateGroup(groupModal.questionIds, commonQT, hasP, p);
            setGroupModal(null);
            setGroupingMode(false);
            setSelectedIds(new Set());
          }}
        />
      )}

      {/* 그룹 수정 모달 */}
      {editingGroupId && (
        <GroupEditModal
          group={groups.find((g) => g.id === editingGroupId)!}
          onClose={() => setEditingGroupId(null)}
          onSave={(patch) => {
            onUpdateGroup(editingGroupId, patch);
            setEditingGroupId(null);
          }}
          onUngroup={() => {
            if (confirm('이 공통 발문 그룹을 해제할까요?\n(개별 문제는 그대로 유지됩니다)')) {
              onUngroup(editingGroupId);
              setEditingGroupId(null);
            }
          }}
        />
      )}
    </aside>
  );
}

// ─────────── 공통 발문 생성/수정 모달 ───────────
function GroupModal({
  questionIds,
  onClose,
  onConfirm,
}: {
  questionIds: string[];
  onClose: () => void;
  onConfirm: (commonQT: string, hasP: boolean, p: string) => void;
}) {
  const [commonQT, setCommonQT] = useState('');
  const [hasP, setHasP] = useState(false);
  const [p, setP] = useState('');

  return (
    <div className="cp-modal-backdrop" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cp-modal-head">
          <h3>공통 발문 그룹 생성</h3>
          <button className="cp-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cp-modal-body">
          <p className="cp-modal-info">
            선택된 <strong>{questionIds.length}개 문제</strong>가 같은 발문/본문을
            공유하게 됩니다. 각 문제의 개별 발문은 그대로 유지됩니다.
          </p>

          <div className="cp-field">
            <label>공통 발문</label>
            <RichTextEditor
              value={commonQT}
              onChange={setCommonQT}
              placeholder="예: 다음 글을 읽고 물음에 답하시오."
              minHeight={70}
            />
          </div>

          <div className="cp-passage-block">
            <label className="cp-checkbox-label">
              <input
                type="checkbox"
                checked={hasP}
                onChange={(e) => setHasP(e.target.checked)}
              />
              <span className="cp-checkbox-box" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.5 12L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="cp-checkbox-text">
                공통 본문 포함
                <em>여러 문제가 같은 지문을 공유</em>
              </span>
            </label>
            {hasP && (
              <div className="cp-passage-input">
                <RichTextEditor
                  value={p}
                  onChange={setP}
                  placeholder="공통 지문/본문 입력. 단어 드래그 후 B / U 로 강조."
                  minHeight={140}
                />
              </div>
            )}
          </div>
        </div>
        <div className="cp-modal-foot">
          <button className="cp-btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            className="cp-btn-primary"
            onClick={() => onConfirm(commonQT, hasP, p)}
            disabled={isPlainTextEmpty(commonQT)}
          >
            그룹 생성
          </button>
        </div>
      </div>
    </div>
  );
}

function GroupEditModal({
  group,
  onClose,
  onSave,
  onUngroup,
}: {
  group: CommonGroup;
  onClose: () => void;
  onSave: (patch: Partial<CommonGroup>) => void;
  onUngroup: () => void;
}) {
  const [commonQT, setCommonQT] = useState(group.commonQuestionText);
  const [hasP, setHasP] = useState(group.hasCommonPassage);
  const [p, setP] = useState(group.commonPassage);

  return (
    <div className="cp-modal-backdrop" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <div className="cp-modal-head">
          <h3>공통 발문 수정</h3>
          <button className="cp-modal-close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="cp-modal-body">
          <div className="cp-field">
            <label>공통 발문</label>
            <RichTextEditor
              value={commonQT}
              onChange={setCommonQT}
              placeholder="공통 발문"
              minHeight={70}
            />
          </div>

          <div className="cp-passage-block">
            <label className="cp-checkbox-label">
              <input
                type="checkbox"
                checked={hasP}
                onChange={(e) => setHasP(e.target.checked)}
              />
              <span className="cp-checkbox-box" aria-hidden="true">
                <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M3 8.5L6.5 12L13 4.5"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="cp-checkbox-text">공통 본문 포함</span>
            </label>
            {hasP && (
              <div className="cp-passage-input">
                <RichTextEditor
                  value={p}
                  onChange={setP}
                  placeholder="공통 지문/본문"
                  minHeight={140}
                />
              </div>
            )}
          </div>
        </div>
        <div className="cp-modal-foot">
          <button className="cp-btn-ghost danger" onClick={onUngroup}>
            그룹 해제
          </button>
          <div style={{ flex: 1 }} />
          <button className="cp-btn-ghost" onClick={onClose}>
            취소
          </button>
          <button
            className="cp-btn-primary"
            onClick={() =>
              onSave({
                commonQuestionText: commonQT,
                hasCommonPassage: hasP,
                commonPassage: p,
              })
            }
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────── 문제 목록 (그룹 표시 포함) ───────────
function QuestionList({
  questions,
  groups,
  editingId,
  groupingMode,
  selectedIds,
  onToggleSelect,
  onSelectEdit,
  onDelete,
  onMove,
  onEditGroup,
}: {
  questions: Question[];
  groups: CommonGroup[];
  editingId: string | null;
  groupingMode: boolean;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onSelectEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  onEditGroup: (gid: string) => void;
}) {
  // 연속된 같은 그룹끼리 묶어 렌더링
  const blocks: Array<
    | { kind: 'single'; q: Question; index: number }
    | { kind: 'group'; group: CommonGroup; items: Array<{ q: Question; index: number }> }
  > = [];

  questions.forEach((q, idx) => {
    if (q.groupId) {
      const last = blocks[blocks.length - 1];
      if (last && last.kind === 'group' && last.group.id === q.groupId) {
        last.items.push({ q, index: idx });
        return;
      }
      const group = groups.find((g) => g.id === q.groupId);
      if (group) {
        blocks.push({ kind: 'group', group, items: [{ q, index: idx }] });
        return;
      }
    }
    blocks.push({ kind: 'single', q, index: idx });
  });

  const renderItem = (q: Question, idx: number) => {
    const typeLabel =
      q.type === 'multiple-choice' ? '객' : q.type === 'written' ? '술' : 'OX';
    const tagClass =
      q.type === 'multiple-choice'
        ? 'tag-mc'
        : q.type === 'written'
          ? 'tag-wr'
          : 'tag-ox';
    const isSelected = selectedIds.has(q.id);

    return (
      <li
        key={q.id}
        className={`cp-list-item ${editingId === q.id ? 'editing' : ''} ${
          groupingMode && isSelected ? 'selected' : ''
        }`}
      >
        {groupingMode && (
          <label className="cp-list-select">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(q.id)}
              disabled={!!q.groupId}
            />
            <span className="cp-checkbox-box" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8.5L6.5 12L13 4.5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </label>
        )}
        <div className={`cp-tag ${tagClass}`}>
          {typeLabel}
          <em>{idx + 1}</em>
        </div>
        <div className="cp-list-text" onClick={() => onSelectEdit(q.id)}>
          {q.hasPassage && <span className="cp-list-badge">본문</span>}
          {q.conditions.length > 0 && (
            <span className="cp-list-badge cond">조건</span>
          )}
          {isPlainTextEmpty(q.questionText) ? (
            <i>(제목 없음)</i>
          ) : (
            <RichTextDisplay html={q.questionText} />
          )}
        </div>
        <div className="cp-list-tools">
          <button
            title="위로"
            onClick={() => onMove(q.id, -1)}
            disabled={idx === 0}
          >
            ↑
          </button>
          <button
            title="아래로"
            onClick={() => onMove(q.id, 1)}
            disabled={idx === questions.length - 1}
          >
            ↓
          </button>
          <button
            title="삭제"
            className="danger"
            onClick={() => onDelete(q.id)}
          >
            ×
          </button>
        </div>
      </li>
    );
  };

  return (
    <ul className="cp-list">
      {blocks.map((b) => {
        if (b.kind === 'single') {
          return <Fragment key={`s-${b.q.id}`}>{renderItem(b.q, b.index)}</Fragment>;
        }
        const firstIdx = b.items[0].index + 1;
        const lastIdx = b.items[b.items.length - 1].index + 1;
        return (
          <li key={`g-${b.group.id}`} className="cp-list-group">
            <div className="cp-list-group-head">
              <span className="cp-list-group-tag">
                공통 [{firstIdx}~{lastIdx}]
              </span>
              <span className="cp-list-group-preview">
                {isPlainTextEmpty(b.group.commonQuestionText) ? (
                  <i>발문 없음</i>
                ) : (
                  <RichTextDisplay html={b.group.commonQuestionText} />
                )}
              </span>
              <button
                className="cp-list-group-edit"
                onClick={() => onEditGroup(b.group.id)}
                title="공통 발문 수정"
              >
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            <ul className="cp-list-group-items">
              {b.items.map((it) => renderItem(it.q, it.index))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

// ─────────── 답지 작성 행 (유형별) ───────────
function AnswerRow({
  q,
  num,
  onUpdate,
}: {
  q: Question;
  num: number;
  onUpdate: (id: string, patch: Partial<Question>) => void;
}) {
  if (q.type === 'multiple-choice') {
    return (
      <div className="cp-answer-row">
        <div className="cp-tag tag-mc">
          객<em>{num}</em>
        </div>
        <div className="cp-answer-mc">
          {['①', '②', '③', '④', '⑤'].map((opt) => (
            <button
              key={opt}
              className={`cp-answer-mc-btn ${q.answer === opt ? 'active' : ''}`}
              onClick={() => onUpdate(q.id, { answer: opt })}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (q.type === 'written') {
    return (
      <div className="cp-answer-row">
        <div className="cp-tag tag-wr">
          술<em>{num}</em>
        </div>
        <textarea
          className="cp-textarea cp-answer-text"
          value={q.answer}
          placeholder="예시 정답 / 채점 기준"
          onChange={(e) => onUpdate(q.id, { answer: e.target.value })}
          rows={2}
        />
      </div>
    );
  }

  // OX
  return (
    <div className="cp-answer-row cp-answer-row-ox">
      <div className="cp-tag tag-ox">
        OX<em>{num}</em>
      </div>
      <div className="cp-ox-answer-list">
        {q.oxSentences.length === 0 ? (
          <div className="cp-ox-empty">02번 섹션에서 OX 문장을 먼저 추가하세요.</div>
        ) : (
          q.oxSentences.map((s, i) => (
            <div key={s.id} className="cp-ox-answer-row">
              <span className="cp-ox-answer-num">({i + 1})</span>
              <div className="cp-ox-answer-toggle">
                <button
                  className={`cp-ox-toggle-btn ${s.answer === 'O' ? 'active-o' : ''}`}
                  onClick={() =>
                    onUpdate(q.id, {
                      oxSentences: q.oxSentences.map((ox, idx) =>
                        idx === i ? { ...ox, answer: 'O' } : ox
                      ),
                    })
                  }
                >
                  O
                </button>
                <button
                  className={`cp-ox-toggle-btn ${s.answer === 'X' ? 'active-x' : ''}`}
                  onClick={() =>
                    onUpdate(q.id, {
                      oxSentences: q.oxSentences.map((ox, idx) =>
                        idx === i ? { ...ox, answer: 'X' } : ox
                      ),
                    })
                  }
                >
                  X
                </button>
              </div>
              {s.answer === 'X' && (
                <input
                  className="cp-input cp-ox-explanation"
                  value={s.explanation}
                  placeholder="X 해설 (간단히)"
                  onChange={(e) =>
                    onUpdate(q.id, {
                      oxSentences: q.oxSentences.map((ox, idx) =>
                        idx === i ? { ...ox, explanation: e.target.value } : ox
                      ),
                    })
                  }
                />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <span className={`cp-chevron ${open ? 'open' : ''}`}>
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="cp-field">
      <label>{label}</label>
      <input
        className="cp-input"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// 위지윅 HTML을 안전하게 미리보기로 표시
function RichTextDisplay({ html }: { html: string }) {
  const safe = sanitizeRichHtml(html);
  return <span dangerouslySetInnerHTML={{ __html: safe }} />;
}

// ═══════════════════════════════════════════════════════
//  WORKSHEET (GRAMMAR) — 어법 워크시트
// ═══════════════════════════════════════════════════════
const BLANK_MARKERS = ['ⓐ', 'ⓑ', 'ⓒ', 'ⓓ', 'ⓔ', 'ⓕ', 'ⓖ', 'ⓗ', 'ⓘ', 'ⓙ'];

// 영문장 텍스트에서 마커 토큰 처리
// 토큰 형식: ⟦BLANK:blank-id⟧
// 캔버스/표시 시: 해당 위치에 ⓐ_________ 등 마커+밑줄 합체

function makeBlankToken(blankId: string): string {
  return `⟦BLANK:${blankId}⟧`;
}

interface ParsedToken {
  type: 'text' | 'blank';
  text: string;
  blankId?: string;
}

function parseSentence(sentence: string): ParsedToken[] {
  const result: ParsedToken[] = [];
  const regex = /⟦BLANK:([^⟧]+)⟧/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(sentence)) !== null) {
    if (m.index > last) {
      result.push({ type: 'text', text: sentence.slice(last, m.index) });
    }
    result.push({ type: 'blank', text: '', blankId: m[1] });
    last = m.index + m[0].length;
  }
  if (last < sentence.length) {
    result.push({ type: 'text', text: sentence.slice(last) });
  }
  return result;
}

// 컴포저 상태
interface WorksheetComposerState {
  koreanTranslation: string;
  englishSentence: string;
  blanks: WorksheetBlank[];
}

const blankWorksheetComposer: WorksheetComposerState = {
  koreanTranslation: '',
  englishSentence: '',
  blanks: [],
};

function WorksheetGrammarPanel({
  items,
  editingId,
  onSelectEdit,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
}: {
  items: WorksheetItem[];
  editingId: string | null;
  onSelectEdit: (id: string | null) => void;
  onAdd: (item: Omit<WorksheetItem, 'id'>) => void;
  onUpdate: (id: string, patch: Partial<WorksheetItem>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
}) {
  const [composer, setComposer] = useState<WorksheetComposerState>(
    blankWorksheetComposer
  );
  const [listExpanded, setListExpanded] = useState(false);
  const [answersExpanded, setAnswersExpanded] = useState(false);

  // 영문장 입력 textarea ref (커서 위치 + selection 감지)
  const sentenceRef = useRef<HTMLTextAreaElement>(null);
  const [hasSelection, setHasSelection] = useState(false);

  // 편집 모드 진입 시 데이터 로드
  useEffect(() => {
    if (editingId) {
      const item = items.find((it) => it.id === editingId);
      if (item) {
        setComposer({
          koreanTranslation: item.koreanTranslation,
          englishSentence: item.englishSentence,
          blanks: item.blanks.map((b) => ({ ...b })),
        });
        setListExpanded(true);
      }
    }
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  // 영문장 내 블랭크 마커 재정렬 (1, 2, 3번째 등장 순서대로 ⓐⓑⓒ)
  const reorderedBlanks = useMemo(() => {
    // englishSentence에 등장하는 순서대로 blanks 재정렬
    const tokens = parseSentence(composer.englishSentence);
    const idsInOrder: string[] = [];
    for (const t of tokens) {
      if (t.type === 'blank' && t.blankId) idsInOrder.push(t.blankId);
    }
    const byId = new Map(composer.blanks.map((b) => [b.id, b]));
    const ordered: WorksheetBlank[] = [];
    idsInOrder.forEach((id, i) => {
      const b = byId.get(id);
      if (b) {
        ordered.push({ ...b, marker: BLANK_MARKERS[i] ?? `(${i + 1})` });
      }
    });
    return ordered;
  }, [composer.englishSentence, composer.blanks]);

  const reset = () => {
    setComposer(blankWorksheetComposer);
    onSelectEdit(null);
  };

  const submit = () => {
    if (!composer.englishSentence.trim()) {
      alert('영어 문장을 입력해주세요.');
      return;
    }
    const payload: Omit<WorksheetItem, 'id'> = {
      koreanTranslation: composer.koreanTranslation,
      englishSentence: composer.englishSentence,
      blanks: reorderedBlanks,
    };
    if (editingId) {
      onUpdate(editingId, payload);
    } else {
      onAdd(payload);
    }
    reset();
  };

  // 선택된 단어를 빈칸으로 만들기
  const makeBlankFromSelection = () => {
    const ta = sentenceRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    if (start === end) {
      alert('빈칸으로 만들 단어를 드래그해서 선택해주세요.');
      return;
    }
    const selected = composer.englishSentence.slice(start, end).trim();
    if (!selected) {
      alert('선택한 부분이 공백입니다. 단어를 드래그해주세요.');
      return;
    }

    // 새 빈칸 ID 생성
    const blankId = `b${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const token = makeBlankToken(blankId);

    // 선택 영역의 원래 문장 양옆 공백 유지하면서 토큰으로 교체
    const before = composer.englishSentence.slice(0, start);
    const after = composer.englishSentence.slice(end);

    // 선택 영역의 leading/trailing 공백을 보존 (이게 자연스러움)
    const origSelected = composer.englishSentence.slice(start, end);
    const lead = origSelected.match(/^\s*/)?.[0] ?? '';
    const trail = origSelected.match(/\s*$/)?.[0] ?? '';
    const newSentence = before + lead + token + trail + after;

    const newBlank: WorksheetBlank = {
      id: blankId,
      marker: '', // reorderedBlanks에서 재할당
      answer: selected,
      grammarPoint: '',
      explanation: '',
    };

    setComposer({
      ...composer,
      englishSentence: newSentence,
      blanks: [...composer.blanks, newBlank],
    });
    setHasSelection(false);
  };

  // 빈칸 제거 (영문장에서 토큰 빼고 원래 단어로 복원)
  const removeBlank = (blankId: string) => {
    const blank = composer.blanks.find((b) => b.id === blankId);
    if (!blank) return;
    const token = makeBlankToken(blankId);
    const newSentence = composer.englishSentence.replace(token, blank.answer);
    setComposer({
      ...composer,
      englishSentence: newSentence,
      blanks: composer.blanks.filter((b) => b.id !== blankId),
    });
  };

  

  const handleSelectionChange = () => {
    const ta = sentenceRef.current;
    if (!ta) return;
    setHasSelection(ta.selectionStart !== ta.selectionEnd);
  };

  return (
    <>
      {/* ───────── 02 어법 워크시트 입력 ───────── */}
      <section className="cp-section">
        <div className="cp-section-head">
          <span className="cp-section-num">02</span>
          <h3>{editingId ? '문장 수정' : '문장 추가'}</h3>
          {editingId && (
            <button className="cp-mini-btn" onClick={reset}>
              새 문장으로
            </button>
          )}
        </div>

        <div className="cp-field">
          <label>한국어 해석</label>
          <textarea
            className="cp-textarea"
            value={composer.koreanTranslation}
            placeholder={'예: "내 상사는 내가 더 이상 휴가를 내도록 허락하지 않을 거야."'}
            onChange={(e) =>
              setComposer({ ...composer, koreanTranslation: e.target.value })
            }
            rows={2}
          />
        </div>

        <div className="cp-field">
          <label>
            영어 문장
            <span className="cp-field-sub">단어 드래그 후 "빈칸으로 만들기"</span>
          </label>
          <div className="cp-blank-toolbar">
            <button
              className="cp-blank-btn"
              onClick={makeBlankFromSelection}
              disabled={!hasSelection}
              title={
                hasSelection
                  ? '선택한 단어를 빈칸으로 변환'
                  : '먼저 영문장에서 단어를 드래그해서 선택'
              }
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="9"
                  width="18"
                  height="6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeDasharray="3 2"
                />
                <path
                  d="M7 12h2 M14 12h2"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              빈칸으로 만들기
            </button>
            <span className="cp-blank-hint">
              {hasSelection ? '선택됨 ✓' : '문장에서 단어 드래그'}
            </span>
          </div>
          <textarea
            ref={sentenceRef}
            className="cp-textarea cp-sentence-input"
            value={composer.englishSentence}
            placeholder={
              "예: My boss won't let me take any more time off.\n— 단어를 드래그한 뒤 위 [빈칸으로 만들기] 버튼을 누르세요."
            }
            onChange={(e) =>
              setComposer({ ...composer, englishSentence: e.target.value })
            }
            onSelect={handleSelectionChange}
            onMouseUp={handleSelectionChange}
            onKeyUp={handleSelectionChange}
            rows={4}
          />
          {/* 미리보기 */}
          {composer.englishSentence && (
            <div className="cp-sentence-preview">
              <span className="cp-sentence-preview-label">미리보기</span>
              <div className="cp-sentence-preview-text">
                <SentencePreview
                  tokens={parseSentence(composer.englishSentence)}
                  markersById={Object.fromEntries(
                    reorderedBlanks.map((b) => [b.id, b.marker])
                  )}
                />
              </div>
            </div>
          )}
        </div>

        {/* 빈칸 목록 + 어법명/해설 입력 */}
        {reorderedBlanks.length > 0 && (
          <div className="cp-blanks-list">
            <div className="cp-blanks-list-head">
              <span>빈칸 정보</span>
              <span className="cp-blanks-count">{reorderedBlanks.length}개</span>
            </div>
            {reorderedBlanks.map((b) => (
              <div key={b.id} className="cp-blank-card">
                <div className="cp-blank-card-head">
                  <span className="cp-blank-marker">{b.marker}</span>
                  <span className="cp-blank-info-text">
                    빈칸 위치 표시
                    {b.answer && (
                      <em className="cp-blank-source-hint">
                        (원본: {b.answer})
                      </em>
                    )}
                  </span>
                  <button
                    className="cp-blank-remove"
                    onClick={() => removeBlank(b.id)}
                    title="이 빈칸 제거"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="cp-actions">
          <button className="cp-btn-primary" onClick={submit}>
            {editingId ? '수정 적용' : '워크시트에 추가'}
          </button>
          {editingId && (
            <button
              className="cp-btn-ghost danger"
              onClick={() => {
                if (confirm('이 문장을 삭제할까요?')) {
                  onDelete(editingId);
                  reset();
                }
              }}
            >
              삭제
            </button>
          )}
        </div>
      </section>

      {/* ───────── 03 문장 목록 ───────── */}
      <section className="cp-section">
        <button
          className="cp-section-head cp-section-head-toggle"
          onClick={() => setListExpanded((v) => !v)}
          aria-expanded={listExpanded}
        >
          <span className="cp-section-num">03</span>
          <h3>문장 목록</h3>
          <span className="cp-list-total">{items.length} 문장</span>
          <Chevron open={listExpanded} />
        </button>

        {listExpanded &&
          (items.length === 0 ? (
            <div className="cp-empty">아직 추가된 문장이 없습니다.</div>
          ) : (
            <ul className="cp-list">
              {items.map((it, idx) => (
                <li
                  key={it.id}
                  className={`cp-list-item ${editingId === it.id ? 'editing' : ''}`}
                >
                  <div className="cp-tag tag-ws">
                    어<em>{idx + 1}</em>
                  </div>
                  <div
                    className="cp-list-text"
                    onClick={() => onSelectEdit(it.id)}
                  >
                    {it.blanks.length > 0 && (
                      <span className="cp-list-badge ws">
                        빈칸 {it.blanks.length}
                      </span>
                    )}
                    {it.koreanTranslation || it.englishSentence || (
                      <i>(내용 없음)</i>
                    )}
                  </div>
                  <div className="cp-list-tools">
                    <button
                      title="위로"
                      onClick={() => onMove(it.id, -1)}
                      disabled={idx === 0}
                    >
                      ↑
                    </button>
                    <button
                      title="아래로"
                      onClick={() => onMove(it.id, 1)}
                      disabled={idx === items.length - 1}
                    >
                      ↓
                    </button>
                    <button
                      title="삭제"
                      className="danger"
                      onClick={() => onDelete(it.id)}
                    >
                      ×
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ))}
      </section>

      {/* ───────── 04 답지 작성 (어법명 + 해설) ───────── */}
      <section className="cp-section">
        <button
          className="cp-section-head cp-section-head-toggle"
          onClick={() => setAnswersExpanded((v) => !v)}
          aria-expanded={answersExpanded}
        >
          <span className="cp-section-num">04</span>
          <h3>답지 작성</h3>
          <span className="cp-list-total">어법명 · 해설</span>
          <Chevron open={answersExpanded} />
        </button>

        {answersExpanded &&
          (items.length === 0 ? (
            <div className="cp-empty">먼저 문장을 추가해 주세요.</div>
          ) : (
            <div className="cp-ws-answer-list">
              {items.map((it, idx) => (
                <WorksheetAnswerCard
                  key={it.id}
                  item={it}
                  num={idx + 1}
                  onUpdate={onUpdate}
                />
              ))}
            </div>
          ))}
      </section>
    </>
  );
}

// 답지 작성 카드 (한 문장의 모든 빈칸을 한 번에 편집)
function WorksheetAnswerCard({
  item,
  num,
  onUpdate,
}: {
  item: WorksheetItem;
  num: number;
  onUpdate: (id: string, patch: Partial<WorksheetItem>) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const updateBlank = (blankId: string, patch: Partial<WorksheetBlank>) => {
    onUpdate(item.id, {
      blanks: item.blanks.map((b) =>
        b.id === blankId ? { ...b, ...patch } : b
      ),
    });
  };

  const filledCount = item.blanks.filter(
    (b) =>
      b.answer.trim() &&
      (b.grammarPoint.trim() || b.explanation.trim())
  ).length;
  const totalCount = item.blanks.length;
  const isComplete = filledCount === totalCount && totalCount > 0;

  return (
    <div className={`cp-ws-answer-card ${expanded ? 'expanded' : ''}`}>
      <button
        className="cp-ws-answer-card-head"
        onClick={() => setExpanded((v) => !v)}
      >
        <span className="cp-tag tag-ws">
          어<em>{num}</em>
        </span>
        <span className="cp-ws-answer-card-preview">
          {item.koreanTranslation || item.englishSentence || (
            <i>(내용 없음)</i>
          )}
        </span>
        <span
          className={`cp-ws-answer-status ${isComplete ? 'complete' : ''}`}
        >
          {filledCount} / {totalCount}
        </span>
        <Chevron open={expanded} />
      </button>

      {expanded && (
        <div className="cp-ws-answer-card-body">
          {item.blanks.length === 0 ? (
            <div className="cp-empty">이 문장에는 빈칸이 없습니다.</div>
          ) : (
            item.blanks.map((b) => (
              <div key={b.id} className="cp-ws-answer-blank">
                <div className="cp-ws-answer-blank-head">
                  <span className="cp-blank-marker">{b.marker}</span>
                  <span className="cp-ws-answer-blank-hint">
                    빈칸 {b.marker} 정답 정보
                  </span>
                </div>
                <div className="cp-blank-fields">
                  <div className="cp-blank-field">
                    <label>정답</label>
                    <input
                      className="cp-input cp-input-answer"
                      value={b.answer}
                      placeholder="예: take"
                      onChange={(e) =>
                        updateBlank(b.id, { answer: e.target.value })
                      }
                    />
                  </div>
                  <div className="cp-blank-field">
                    <label>어법명</label>
                    <input
                      className="cp-input"
                      value={b.grammarPoint}
                      placeholder="예: 사역동사 let + O + 동사원형"
                      onChange={(e) =>
                        updateBlank(b.id, { grammarPoint: e.target.value })
                      }
                    />
                  </div>
                  <div className="cp-blank-field">
                    <label>해설</label>
                    <textarea
                      className="cp-textarea cp-blank-explanation"
                      value={b.explanation}
                      placeholder="자세한 해설 입력"
                      onChange={(e) =>
                        updateBlank(b.id, { explanation: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

function SentencePreview({
  tokens,
  markersById,
}: {
  tokens: ParsedToken[];
  markersById: Record<string, string>;
}) {
  return (
    <>
      {tokens.map((t, i) => {
        if (t.type === 'text') return <span key={i}>{t.text}</span>;
        const marker = markersById[t.blankId!] ?? '?';
        return (
          <span key={i} className="cp-blank-marker-inline">
            {marker}_________
          </span>
        );
      })}
    </>
  );
}

// ═══════════════════════════════════════════════════════
//  EXAM PAPER
// ═══════════════════════════════════════════════════════
function useDisplayScale(stageRef: React.RefObject<HTMLDivElement | null>) {
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const calc = () => {
      const el = stageRef.current;
      if (!el) return;
      const available = el.clientWidth - 80;
      if (available <= 0) return;
      setScale(Math.min(1.05, available / PAPER_W_PX));
    };
    calc();
    const ro = new ResizeObserver(calc);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', calc);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', calc);
    };
  }, [stageRef]);
  return scale;
}

type BlockKind =
  | 'group-header'    // 공통 발문 (단독 또는 공통 본문 포함)
  | 'group-passage'   // 공통 본문 (group-header에 합쳐서 한 덩어리)
  | 'q-stem'          // 발문 + 본문(있으면) = 한 묶음으로 처리
  | 'q-passage'       // 개별 본문
  | 'q-conditions'    // 영작 조건 박스
  | 'q-choice'        // 객관식 선지 1개
  | 'q-answer'        // 서술형 답란
  | 'q-ox';           // OX 전체 (한 덩어리)

interface Block {
  id: string;
  groupId: string; // 같은 question id 단위로 묶임 (공통그룹은 그룹id로 묶임)
  kind: BlockKind;
  pullPriority: number; // 0 = 항상 자유, 높을수록 같은 그룹의 다음 블록과 묶이는 우선순위 높음
  render: () => React.ReactNode;
}

function buildBlocks(
  questions: Question[],
  groups: CommonGroup[]
): { blocks: Block[]; numberMap: Map<string, number> } {
  const blocks: Block[] = [];
  const numberMap = new Map<string, number>();
  questions.forEach((q, i) => numberMap.set(q.id, i + 1));

  // 그룹 블록 정보 (연속된 같은 그룹 처리)
  let cursor = 0;
  while (cursor < questions.length) {
    const q = questions[cursor];

    // 공통 그룹이 시작되는 시점 체크
    if (q.groupId) {
      const groupId = q.groupId;
      const group = groups.find((g) => g.id === groupId);

      // 같은 그룹의 연속 문제 찾기
      let end = cursor;
      while (end + 1 < questions.length && questions[end + 1].groupId === groupId) {
        end++;
      }

      const startNum = cursor + 1;
      const endNum = end + 1;

      if (group) {
        // 공통 발문 블록 (본문과 분리)
        blocks.push({
          id: `${groupId}-header`,
          groupId: `gr-${groupId}`,
          kind: 'group-header',
          pullPriority: 10, // 본문 첫 조각과 묶임
          render: () => (
            <CommonGroupHeader
              group={group}
              startNum={startNum}
              endNum={endNum}
            />
          ),
        });

        // 공통 본문을 문장 단위로 쪼개서 별도 블록들로 추가
        if (group.hasCommonPassage && !isPlainTextEmpty(group.commonPassage)) {
          const segs = splitPassageIntoSegments(group.commonPassage);
          segs.forEach((seg, si) => {
            blocks.push({
              id: `${groupId}-cpassage-${si}`,
              groupId: `gr-${groupId}`,
              kind: 'group-passage',
              pullPriority: si === 0 ? 10 : 0,
              render: () => (
                <PassageView
                  html={seg}
                  isFirst={si === 0}
                  isLast={si === segs.length - 1}
                />
              ),
            });
          });
        }
      }

      // 그룹 내 각 문제 블록 추가
      for (let i = cursor; i <= end; i++) {
        const qq = questions[i];
        pushQuestionBlocks(blocks, qq, numberMap.get(qq.id)!, true);
      }

      cursor = end + 1;
    } else {
      pushQuestionBlocks(blocks, q, numberMap.get(q.id)!, false);
      cursor++;
    }
  }

  return { blocks, numberMap };
}

function pushQuestionBlocks(
  blocks: Block[],
  q: Question,
  num: number,
  inGroup: boolean
) {
  // 발문 (+ 개별 본문은 별개 블록이지만 stem과 묶음 우선순위 부여)
  blocks.push({
    id: `${q.id}-stem`,
    groupId: q.id,
    kind: 'q-stem',
    pullPriority: 10,
    render: () => <QuestionStem q={q} number={num} inGroup={inGroup} />,
  });

if (q.hasPassage && !isPlainTextEmpty(q.passage)) {
    const segs = splitPassageIntoSegments(q.passage);
    segs.forEach((seg, si) => {
      blocks.push({
        id: `${q.id}-passage-${si}`,
        groupId: q.id,
        kind: 'q-passage',
        pullPriority: si === 0 ? 10 : 0, // 첫 조각만 발문과 묶음, 나머지는 자유롭게 흐름
        render: () => (
          <PassageView
            html={seg}
            isFirst={si === 0}
            isLast={si === segs.length - 1}
          />
        ),
      });
    });
  }
  if (q.type === 'written') {
    if (q.conditions.length > 0) {
      blocks.push({
        id: `${q.id}-cond`,
        groupId: q.id,
        kind: 'q-conditions',
        pullPriority: 10, // 답란이랑 같이
        render: () => <ConditionsView conditions={q.conditions} />,
      });
    }
    blocks.push({
      id: `${q.id}-ans`,
      groupId: q.id,
      kind: 'q-answer',
      pullPriority: 10,
      render: () => <AnswerArea lines={q.answerLines} />,
    });
  } else if (q.type === 'multiple-choice') {
    q.choices.forEach((c, i) => {
      // 첫 2개 선지는 발문/본문과 묶음 (priority 10), 나머지는 자유 (priority 0)
      blocks.push({
        id: `${q.id}-c${i}`,
        groupId: q.id,
        kind: 'q-choice',
        pullPriority: i < 2 ? 10 : 0,
        render: () => <ChoiceItem choice={c} index={i} />,
      });
    });
  } else if (q.type === 'ox') {
    // OX는 통째로 한 덩어리
    blocks.push({
      id: `${q.id}-ox`,
      groupId: q.id,
      kind: 'q-ox',
      pullPriority: 10,
      render: () => <OxBlock sentences={q.oxSentences} />,
    });
  }
}

interface PageData {
  cols: [Block[], Block[]];
}

function paginate(
  blocks: Block[],
  heights: Record<string, number>,
  firstPageHeaderH: number,
  miniHeaderH: number
): PageData[] {
  const pages: PageData[] = [];
  let current: PageData = { cols: [[], []] };
  let pageIdx = 0;
  let colIdx: 0 | 1 = 0;
  let used = 0;
  let lastGroupId: string | null = null;

  const headerForPage = (p: number) =>
    p === 0 ? firstPageHeaderH : miniHeaderH;

  const available = (): number =>
    COL_FULL_H_PX - headerForPage(pageIdx) - FOOTER_PX - SAFETY_MARGIN_PX;

  const startNextPage = () => {
    pages.push(current);
    current = { cols: [[], []] };
    pageIdx++;
    colIdx = 0;
    used = 0;
    lastGroupId = null;
  };

  // 같은 group의 "묶음 블록"만 회수 (pullPriority가 높은 것들)
  // 발문/본문/조건/첫 선지 2개 등을 같이 다음 컬럼/페이지로 이동
  const pullSameGroupHighPriority = (groupId: string): Block[] => {
    const pulled: Block[] = [];

    const pullFromCol = (col: Block[]) => {
      while (col.length > 0) {
        const last = col[col.length - 1];
        if (last.groupId === groupId && last.pullPriority >= 10) {
          pulled.unshift(col.pop()!);
        } else {
          break;
        }
      }
    };

    pullFromCol(current.cols[1]);
    if (colIdx === 1) {
      // 컬럼0의 끝부분에서도 같은 groupId가 있다면 회수 (좌→우로 이어진 묶음)
      // 단, 회수 후 컬럼0이 비지 않도록 한다
      const col0 = current.cols[0];
      while (col0.length > 0) {
        const last = col0[col0.length - 1];
        if (last.groupId === groupId && last.pullPriority >= 10) {
          pulled.unshift(col0.pop()!);
        } else {
          break;
        }
      }
    }

    return pulled;
  };

  const place = (block: Block, allowPull: boolean): void => {
    const h = heights[block.id] ?? 0;
    const isContinuation = lastGroupId === block.groupId;
    const gap = used === 0 ? 0 : isContinuation ? BLOCK_GAP_PX : GROUP_GAP_PX;
    const proposed = used + gap + h;

    if (used === 0 || proposed <= available()) {
      current.cols[colIdx].push(block);
      used = used === 0 ? h : proposed;
      lastGroupId = block.groupId;
      return;
    }

    // 안 들어감 - 다음 컬럼으로 이동
    if (colIdx === 0) {
      colIdx = 1;
      used = 0;
      lastGroupId = null;
      place(block, allowPull);
      return;
    }

    // 우측 컬럼도 꽉 참 - 다음 페이지로 이동
    if (allowPull && isContinuation && block.pullPriority >= 10) {
      // 같은 그룹의 묶음 블록들을 같이 다음 페이지로
      const pulled = pullSameGroupHighPriority(block.groupId);

      startNextPage();

      for (const pb of [...pulled, block]) {
        place(pb, false);
      }
      return;
    }

    startNextPage();
    place(block, allowPull);
  };

  for (const block of blocks) {
    place(block, true);
  }

  pages.push(current);
  return pages;
}

function ExamPaper({
  header,
  questions,
  groups,
}: {
  header: ExamHeader;
  questions: Question[];
  groups: CommonGroup[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const scale = useDisplayScale(stageRef);
  const { blocks, numberMap } = useMemo(
    () => buildBlocks(questions, groups),
    [questions, groups]
  );

  const [heights, setHeights] = useState<Record<string, number>>({});
  const [headerHeight, setHeaderHeight] = useState(160);
  const [miniHeaderHeight, setMiniHeaderHeight] = useState(40);

  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next: Record<string, number> = {};
        node.querySelectorAll<HTMLElement>('[data-mid]').forEach((el) => {
          next[el.dataset.mid!] = el.getBoundingClientRect().height;
        });

        setHeights((prev) => {
          const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
          for (const k of keys) {
            if (Math.abs((prev[k] ?? 0) - (next[k] ?? 0)) > 0.5) {
              return next;
            }
          }
          return prev;
        });

        const head = node.querySelector<HTMLElement>('[data-mhead]');
        if (head) {
          const hh = head.getBoundingClientRect().height;
          setHeaderHeight((prev) => (Math.abs(prev - hh) > 0.5 ? hh : prev));
        }

        const miniHead = node.querySelector<HTMLElement>('[data-mhead-mini]');
        if (miniHead) {
          const mh = miniHead.getBoundingClientRect().height;
          setMiniHeaderHeight((prev) =>
            Math.abs(prev - mh) > 0.5 ? mh : prev
          );
        }
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    node
      .querySelectorAll<HTMLElement>('[data-mid]')
      .forEach((el) => ro.observe(el));
    const head = node.querySelector<HTMLElement>('[data-mhead]');
    if (head) ro.observe(head);
    const miniHead = node.querySelector<HTMLElement>('[data-mhead-mini]');
    if (miniHead) ro.observe(miniHead);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => measure());
    }

    node.querySelectorAll('img').forEach((img) => {
      if (!img.complete) {
        img.addEventListener('load', measure, { once: true });
        img.addEventListener('error', measure, { once: true });
      }
    });

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [blocks, header]);

  const examPages = useMemo(
    () => paginate(blocks, heights, headerHeight, miniHeaderHeight),
    [blocks, heights, headerHeight, miniHeaderHeight]
  );

  const hasAnyAnswer = useMemo(() => {
    return questions.some((q) => {
      if (q.type === 'multiple-choice' || q.type === 'written') {
        return q.answer.trim() !== '';
      }
      if (q.type === 'ox') {
        return q.oxSentences.some((s) => s.answer === 'O' || s.answer === 'X');
      }
      return false;
    });
  }, [questions]);

  // 답지 페이지네이션 (2단 구성, 항목별 높이 기반)
  const [answerHeights, setAnswerHeights] = useState<Record<string, number>>(
    {}
  );
  const [answerHeaderH, setAnswerHeaderH] = useState(60);
  const answerMeasureRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!hasAnyAnswer) return;
    const node = answerMeasureRef.current;
    if (!node) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next: Record<string, number> = {};
        node.querySelectorAll<HTMLElement>('[data-aid]').forEach((el) => {
          next[el.dataset.aid!] = el.getBoundingClientRect().height;
        });

        setAnswerHeights((prev) => {
          const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
          for (const k of keys) {
            if (Math.abs((prev[k] ?? 0) - (next[k] ?? 0)) > 0.5) {
              return next;
            }
          }
          return prev;
        });

        const head = node.querySelector<HTMLElement>('[data-ahead]');
        if (head) {
          const hh = head.getBoundingClientRect().height;
          setAnswerHeaderH((prev) => (Math.abs(prev - hh) > 0.5 ? hh : prev));
        }
      });
    };

    measure();

    const ro = new ResizeObserver(measure);
    node
      .querySelectorAll<HTMLElement>('[data-aid]')
      .forEach((el) => ro.observe(el));
    const head = node.querySelector<HTMLElement>('[data-ahead]');
    if (head) ro.observe(head);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => measure());
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [questions, hasAnyAnswer]);

  // 답지 항목을 2단으로 나누어 페이지 단위로 묶기
  const answerPages = useMemo<Question[][]>(() => {
    if (!hasAnyAnswer) return [];

    // 첫 페이지는 ANSWER KEY 헤더가 있어서 사용 가능 공간이 다름
    const firstPageAvailH =
      COL_FULL_H_PX - answerHeaderH - FOOTER_PX - SAFETY_MARGIN_PX;
    const nextPageAvailH =
      COL_FULL_H_PX - miniHeaderHeight - FOOTER_PX - SAFETY_MARGIN_PX;

    // 2단이므로 한 페이지에 들어갈 수 있는 총 높이 = avail * 2 (각 컬럼 = avail)
    const pages: Question[][] = [];
    let current: Question[] = [];
    let usedCol1 = 0;
    let usedCol2 = 0;
    let currentCol: 0 | 1 = 0;
    let pageIdx = 0;

    const availForPage = (p: number) =>
      p === 0 ? firstPageAvailH : nextPageAvailH;

    for (const q of questions) {
      const h = answerHeights[`a-${q.id}`] ?? 60; // 미측정시 안전한 기본값
      const avail = availForPage(pageIdx);

      // 현재 컬럼에 들어가는지 체크
      const target = currentCol === 0 ? usedCol1 : usedCol2;
      if (target + h <= avail) {
        current.push(q);
        if (currentCol === 0) usedCol1 += h;
        else usedCol2 += h;
      } else if (currentCol === 0) {
        // 우측 컬럼으로
        currentCol = 1;
        if (h <= avail) {
          current.push(q);
          usedCol2 = h;
        } else {
          // 우측에도 안 들어감 → 다음 페이지
          pages.push(current);
          current = [q];
          usedCol1 = h;
          usedCol2 = 0;
          currentCol = 0;
          pageIdx++;
        }
      } else {
        // 우측 컬럼도 꽉참 → 다음 페이지
        pages.push(current);
        current = [q];
        usedCol1 = h;
        usedCol2 = 0;
        currentCol = 0;
        pageIdx++;
      }
    }

    if (current.length > 0) pages.push(current);
    return pages;
  }, [questions, hasAnyAnswer, answerHeights, answerHeaderH, miniHeaderHeight]);

  const totalPages = examPages.length + answerPages.length;

  return (
    <main className="paper-stage" ref={stageRef}>
      <div className="paper-stage-bar">
        <div className="paper-stage-bar-left">
          <span className="paper-stage-label">A4 · 210 × 297 mm</span>
          <span className="paper-stage-pages">
            총 <strong>{totalPages}</strong>페이지
          </span>
        </div>
        <button
          className="paper-print-btn"
          onClick={() => window.print()}
          title="인쇄 / PDF 저장 (Ctrl+P)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          인쇄 / PDF 저장
        </button>
      </div>

      <div className="measure-layer" aria-hidden="true" ref={measureRef}>
        <div data-mhead style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}>
          <PaperHeader header={header} />
        </div>
        <div
          data-mhead-mini
          style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}
        >
          <PaperHeaderMini header={header} />
        </div>
        <div className="measure-col" style={{ width: COL_W_PX }}>
          {blocks.map((b) => (
            <div data-mid={b.id} key={b.id} className="measure-item">
              {b.render()}
            </div>
          ))}
        </div>
      </div>

      {/* 답지 항목 측정용 레이어 (2단 컬럼 너비 기준) */}
      {hasAnyAnswer && (
        <div
          className="measure-layer"
          aria-hidden="true"
          ref={answerMeasureRef}
        >
          <div
            data-ahead
            style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}
          >
            <AnswerHeader header={header} />
          </div>
          <div className="measure-col" style={{ width: COL_W_PX }}>
            {questions.map((q) => (
              <div
                data-aid={`a-${q.id}`}
                key={q.id}
                className="measure-item"
              >
                <AnswerItem q={q} num={numberMap.get(q.id)!} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="paper-stack">
        {examPages.map((page, i) => (
          <PaperPage
            key={i}
            page={page}
            pageIndex={i}
            totalPages={totalPages}
            header={header}
            scale={scale}
          />
        ))}
        {answerPages.map((pageQuestions, i) => (
          <AnswerKeyPage
            key={`ans-${i}`}
            header={header}
            questions={pageQuestions}
            numberMap={numberMap}
            pageIndex={examPages.length + i}
            totalPages={totalPages}
            scale={scale}
            isFirst={i === 0}
          />
        ))}
      </div>
    </main>
  );
}

function PaperPage({
  page,
  pageIndex,
  totalPages,
  header,
  scale,
}: {
  page: PageData;
  pageIndex: number;
  totalPages: number;
  header: ExamHeader;
  scale: number;
}) {
  const isFirst = pageIndex === 0;
  return (
    <div
      className="paper-frame"
      style={{ width: PAPER_W_PX * scale, height: PAPER_H_PX * scale }}
    >
      <div className="paper" style={{ transform: `scale(${scale})` }}>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        <div className="paper-inner">
          {isFirst ? (
            <PaperHeader header={header} />
          ) : (
            <PaperHeaderMini header={header} />
          )}

          <div className="paper-columns">
            <Column blocks={page.cols[0]} />
            <div className="paper-divider" />
            <Column blocks={page.cols[1]} />
          </div>

          <footer className="paper-footer">
            <span className="paper-footer-academy">{header.academyName}</span>
            <span className="paper-footer-pageno">
              {pageIndex + 1} / {totalPages}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function Column({ blocks }: { blocks: Block[] }) {
  // 같은 groupId의 연속 블록을 article로 묶음
  const groups: { groupId: string; items: Block[] }[] = [];
  for (const b of blocks) {
    const last = groups[groups.length - 1];
    if (last && last.groupId === b.groupId) {
      last.items.push(b);
    } else {
      groups.push({ groupId: b.groupId, items: [b] });
    }
  }

  return (
    <div className="paper-col">
      {groups.map((g, i) => {
        const isGroupHeader = g.groupId.startsWith('gr-');
        return (
          <article
            className={`q ${isGroupHeader ? 'q-group-header' : ''}`}
            key={i}
          >
            {g.items.map((b, j) => (
              <Fragment key={j}>{b.render()}</Fragment>
            ))}
          </article>
        );
      })}
    </div>
  );
}

function PaperHeader({
  header,
  worksheetLabel,
}: {
  header: ExamHeader;
  worksheetLabel?: string;
}) {
  const hasLogo = !!header.logoDataUrl;
  return (
    <header className="paper-header">
      <div className="paper-header-main">
        <div className={`paper-header-logo ${hasLogo ? 'has-image' : ''}`}>
          {hasLogo ? (
            <img src={header.logoDataUrl} alt="logo" />
          ) : (
            <span>{header.academyName?.[0] ?? 'A'}</span>
          )}
        </div>
        <div className="paper-header-text">
          <div className="paper-header-meta">
            <span>{header.academyName}</span>
            {header.grade && (
              <>
                <span className="paper-header-dot">·</span>
                <span>{header.grade}</span>
              </>
            )}
          </div>
          {header.title && (
            <h1 className="paper-header-title">
              {header.title}
              {worksheetLabel && (
                <span className="paper-header-ws-label">{worksheetLabel}</span>
              )}
            </h1>
          )}
        </div>
        <div className="paper-header-name">
          <label>이름</label>
          <span />
        </div>
      </div>

      {header.scope && (
        <div className="paper-header-scope">
          <span className="paper-header-scope-label">범위</span>
          <span className="paper-header-scope-text">{header.scope}</span>
        </div>
      )}
    </header>
  );
}

function PaperHeaderMini({ header }: { header: ExamHeader }) {
  const hasLogo = !!header.logoDataUrl;
  return (
    <header className="paper-header-mini">
      {hasLogo ? (
        <img
          src={header.logoDataUrl}
          alt=""
          className="paper-header-mini-logo"
        />
      ) : (
        <span className="paper-header-mini-mark">
          {header.academyName?.[0] ?? 'A'}
        </span>
      )}
      <div className="paper-header-mini-text">
        {header.academyName && (
          <span className="paper-header-mini-academy">
            {header.academyName}
          </span>
        )}
        {header.title && (
          <>
            {header.academyName && (
              <span className="paper-header-mini-dot">·</span>
            )}
            <span className="paper-header-mini-title">{header.title}</span>
          </>
        )}
      </div>
      {header.scope && (
        <span className="paper-header-mini-scope">
          <strong>범위</strong>
          {header.scope}
        </span>
      )}
    </header>
  );
}

// ─────────── 블록 컴포넌트 ───────────
function CommonGroupHeader({
  group,
  startNum,
  endNum,
}: {
  group: CommonGroup;
  startNum: number;
  endNum: number;
}) {
  return (
    <div className="q-common-group">
      <div className="q-common-head">
        <span className="q-common-range">
          [{startNum}~{endNum}]
        </span>
        <p
          className="q-common-text"
          dangerouslySetInnerHTML={{
            __html: sanitizeRichHtml(group.commonQuestionText),
          }}
        />
      </div>
    </div>
  );
}

function QuestionStem({
  q,
  number,
  inGroup,
}: {
  q: Question;
  number: number;
  inGroup: boolean;
}) {
  const isEmpty = isPlainTextEmpty(q.questionText);
  return (
    <header className={`q-head ${inGroup ? 'q-head-in-group' : ''}`}>
      <span className="q-num">{number}.</span>
      {isEmpty ? (
        <p className="q-text q-text-empty">(문제를 입력하세요)</p>
      ) : (
        <p
          className="q-text"
          dangerouslySetInnerHTML={{
            __html: sanitizeRichHtml(q.questionText),
          }}
        />
      )}
    </header>
  );
}

function PassageView({
  html,
  isFirst = true,
  isLast = true,
}: {
  html: string;
  isFirst?: boolean;
  isLast?: boolean;
}) {
  const cls = [
    'q-passage',
    isFirst ? 'q-passage-first' : 'q-passage-mid',
    isLast ? 'q-passage-last' : '',
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <div
      className={cls}
      dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(html) }}
    />
  );
}

function ConditionsView({ conditions }: { conditions: string[] }) {
  if (conditions.length === 0) return null;
  return (
    <div className="q-conditions">
      <span className="q-conditions-label">조건</span>
      <ol className="q-conditions-list">
        {conditions.map((c, i) => (
          <li key={i}>{c}</li>
        ))}
      </ol>
    </div>
  );
}

function ChoiceItem({ choice, index }: { choice: string; index: number }) {
  return (
    <div className="q-choice-item">
      <span className="q-choice-mark">
        {['①', '②', '③', '④', '⑤'][index]}
      </span>
      <span className="q-choice-text">{choice || ' '}</span>
    </div>
  );
}

function AnswerArea({ lines }: { lines: number }) {
  return (
    <div className="q-answer">
      <div className="q-answer-label">답</div>
      <div className="q-answer-lines">
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="q-answer-line" />
        ))}
      </div>
    </div>
  );
}

function OxBlock({ sentences }: { sentences: OxSentence[] }) {
  if (sentences.length === 0) {
    return (
      <div className="q-ox-empty">(OX 문장이 없습니다)</div>
    );
  }
  return (
    <ol className="q-ox-list">
      {sentences.map((s, i) => (
        <li key={s.id} className="q-ox-item">
          <span className="q-ox-num">({i + 1})</span>
          <span className="q-ox-text">{s.text}</span>
          <span className="q-ox-dots" aria-hidden="true" />
          <span className="q-ox-box">(&nbsp;&nbsp;&nbsp;&nbsp;)</span>
        </li>
      ))}
    </ol>
  );
}

// ═══════════════════════════════════════════════════════
//  ANSWER KEY PAGE (2단 구성, 통합 번호 + 유형별 답)
// ═══════════════════════════════════════════════════════
function AnswerHeader({ header }: { header: ExamHeader }) {
  return (
    <header className="answer-header">
      <div className="answer-header-text">
        <div className="answer-header-tag">ANSWER KEY</div>
        <h1 className="answer-header-title">정답 및 해설</h1>
      </div>
      <div className="answer-header-meta">
        <span>{header.academyName}</span>
        {header.title && <span>{header.title}</span>}
      </div>
    </header>
  );
}

function AnswerKeyPage({
  header,
  questions,
  numberMap,
  pageIndex,
  totalPages,
  scale,
  isFirst,
}: {
  header: ExamHeader;
  questions: Question[];
  numberMap: Map<string, number>;
  pageIndex: number;
  totalPages: number;
  scale: number;
  isFirst: boolean;
}) {
  return (
    <div
      className="paper-frame"
      style={{ width: PAPER_W_PX * scale, height: PAPER_H_PX * scale }}
    >
      <div className="paper" style={{ transform: `scale(${scale})` }}>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />

        <div className="paper-inner">
          {isFirst ? (
            <AnswerHeader header={header} />
          ) : (
            <PaperHeaderMini header={header} />
          )}

          <div className="answer-body-2col">
            {questions.map((q) => {
              const num = numberMap.get(q.id)!;
              return <AnswerItem key={q.id} q={q} num={num} />;
            })}
          </div>

          <footer className="paper-footer">
            <span className="paper-footer-academy">{header.academyName}</span>
            <span className="paper-footer-pageno">
              {pageIndex + 1} / {totalPages}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function AnswerItem({ q, num }: { q: Question; num: number }) {
  if (q.type === 'multiple-choice') {
    return (
      <div className="answer-item">
        <span className="answer-item-num">{num}.</span>
        <span className="answer-item-body">
          <span className="answer-item-value">{q.answer || '—'}</span>
        </span>
      </div>
    );
  }

  if (q.type === 'written') {
    return (
      <div className="answer-item">
        <span className="answer-item-num">{num}.</span>
        <span className="answer-item-body">
          <span className="answer-item-value answer-item-text">
            {q.answer || <i>(정답 미입력)</i>}
          </span>
        </span>
      </div>
    );
  }

  // OX
  return (
    <div className="answer-item answer-item-ox">
      <span className="answer-item-num">{num}.</span>
      <span className="answer-item-body">
        <div className="answer-ox-grid">
          {q.oxSentences.map((s, i) => (
            <div key={s.id} className="answer-ox-row">
              <span className="answer-ox-num">({i + 1})</span>
              <span
                className={`answer-ox-mark ${
                  s.answer === 'O' ? 'is-o' : s.answer === 'X' ? 'is-x' : ''
                }`}
              >
                {s.answer || '—'}
              </span>
              {s.answer === 'X' && s.explanation && (
                <span className="answer-ox-explanation">→ {s.explanation}</span>
              )}
            </div>
          ))}
        </div>
      </span>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  WORKSHEET PAPER (단일 컬럼 캔버스)
// ═══════════════════════════════════════════════════════
function WorksheetPaper({
  header,
  items,
  worksheetType,
}: {
  header: ExamHeader;
  items: WorksheetItem[];
  worksheetType: WorksheetType;
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const explMeasureRef = useRef<HTMLDivElement>(null);
  const scale = useDisplayScale(stageRef);

  const [itemHeights, setItemHeights] = useState<Record<string, number>>({});
  const [explHeights, setExplHeights] = useState<Record<string, number>>({});
  const [headerHeight, setHeaderHeight] = useState(160);
  const [miniHeaderHeight, setMiniHeaderHeight] = useState(40);
  const [answerHeaderH, setAnswerHeaderH] = useState(60);

  // 측정
  useLayoutEffect(() => {
    const node = measureRef.current;
    if (!node) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next: Record<string, number> = {};
        node.querySelectorAll<HTMLElement>('[data-wid]').forEach((el) => {
          next[el.dataset.wid!] = el.getBoundingClientRect().height;
        });
        setItemHeights((prev) => {
          const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
          for (const k of keys) {
            if (Math.abs((prev[k] ?? 0) - (next[k] ?? 0)) > 0.5) return next;
          }
          return prev;
        });

        const head = node.querySelector<HTMLElement>('[data-mhead]');
        if (head) {
          const hh = head.getBoundingClientRect().height;
          setHeaderHeight((p) => (Math.abs(p - hh) > 0.5 ? hh : p));
        }
        const miniHead = node.querySelector<HTMLElement>('[data-mhead-mini]');
        if (miniHead) {
          const mh = miniHead.getBoundingClientRect().height;
          setMiniHeaderHeight((p) => (Math.abs(p - mh) > 0.5 ? mh : p));
        }
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    node.querySelectorAll<HTMLElement>('[data-wid]').forEach((el) => ro.observe(el));
    const head = node.querySelector<HTMLElement>('[data-mhead]');
    if (head) ro.observe(head);
    const miniHead = node.querySelector<HTMLElement>('[data-mhead-mini]');
    if (miniHead) ro.observe(miniHead);

    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => measure());
    }

    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [items, header]);

  // 해설지 측정
  const hasExplanations = useMemo(
    () =>
      items.some((it) =>
        it.blanks.some((b) => b.grammarPoint.trim() || b.explanation.trim())
      ),
    [items]
  );

  useLayoutEffect(() => {
    if (!hasExplanations) return;
    const node = explMeasureRef.current;
    if (!node) return;

    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const next: Record<string, number> = {};
        node.querySelectorAll<HTMLElement>('[data-eid]').forEach((el) => {
          next[el.dataset.eid!] = el.getBoundingClientRect().height;
        });
        setExplHeights((prev) => {
          const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
          for (const k of keys) {
            if (Math.abs((prev[k] ?? 0) - (next[k] ?? 0)) > 0.5) return next;
          }
          return prev;
        });

        const head = node.querySelector<HTMLElement>('[data-ahead]');
        if (head) {
          const hh = head.getBoundingClientRect().height;
          setAnswerHeaderH((p) => (Math.abs(p - hh) > 0.5 ? hh : p));
        }
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    node.querySelectorAll<HTMLElement>('[data-eid]').forEach((el) => ro.observe(el));
    const head = node.querySelector<HTMLElement>('[data-ahead]');
    if (head) ro.observe(head);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => measure());
    }
    return () => {
      ro.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [items, hasExplanations]);

  // 페이지네이션 (단일 컬럼, 각 item 통째)
  const itemPages = useMemo<WorksheetItem[][]>(() => {
    if (items.length === 0) return [];
    const ITEM_GAP = 6 * MM_TO_PX;
    const fullW = PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX;
    void fullW;
    const firstAvail = COL_FULL_H_PX - headerHeight - FOOTER_PX - SAFETY_MARGIN_PX;
    const restAvail = COL_FULL_H_PX - miniHeaderHeight - FOOTER_PX - SAFETY_MARGIN_PX;

    const pages: WorksheetItem[][] = [];
    let current: WorksheetItem[] = [];
    let used = 0;
    let pageIdx = 0;

    for (const it of items) {
      const h = itemHeights[`w-${it.id}`] ?? 80;
      const avail = pageIdx === 0 ? firstAvail : restAvail;
      const gap = current.length === 0 ? 0 : ITEM_GAP;
      if (used + gap + h <= avail) {
        current.push(it);
        used += gap + h;
      } else {
        if (current.length > 0) pages.push(current);
        current = [it];
        used = h;
        pageIdx++;
      }
    }
    if (current.length > 0) pages.push(current);
    return pages;
  }, [items, itemHeights, headerHeight, miniHeaderHeight]);

  // 해설지 페이지네이션
  const explPages = useMemo<WorksheetItem[][]>(() => {
    if (!hasExplanations) return [];
    const ITEM_GAP = 5 * MM_TO_PX;
    const firstAvail = COL_FULL_H_PX - answerHeaderH - FOOTER_PX - SAFETY_MARGIN_PX;
    const restAvail = COL_FULL_H_PX - miniHeaderHeight - FOOTER_PX - SAFETY_MARGIN_PX;

    const pages: WorksheetItem[][] = [];
    let current: WorksheetItem[] = [];
    let used = 0;
    let pageIdx = 0;

    for (const it of items) {
      const h = explHeights[`e-${it.id}`] ?? 80;
      const avail = pageIdx === 0 ? firstAvail : restAvail;
      const gap = current.length === 0 ? 0 : ITEM_GAP;
      if (used + gap + h <= avail) {
        current.push(it);
        used += gap + h;
      } else {
        if (current.length > 0) pages.push(current);
        current = [it];
        used = h;
        pageIdx++;
      }
    }
    if (current.length > 0) pages.push(current);
    return pages;
  }, [items, explHeights, answerHeaderH, miniHeaderHeight, hasExplanations]);

  const totalPages = itemPages.length + explPages.length;

  // 빈칸 마커 매핑 (저장된 blank의 marker 그대로 사용)
  const getMarkerMap = (item: WorksheetItem): Record<string, string> => {
    return Object.fromEntries(item.blanks.map((b) => [b.id, b.marker]));
  };

  return (
    <main className="paper-stage" ref={stageRef}>
      <div className="paper-stage-bar">
        <div className="paper-stage-bar-left">
          <span className="paper-stage-label">
            A4 · 워크시트 · {worksheetType === 'grammar' ? '어법' : '내용'}
          </span>
          <span className="paper-stage-pages">
            총 <strong>{Math.max(totalPages, 1)}</strong>페이지
          </span>
        </div>
        <button
          className="paper-print-btn"
          onClick={() => window.print()}
          title="인쇄 / PDF 저장 (Ctrl+P)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9V3h12v6M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2M6 14h12v8H6z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          인쇄 / PDF 저장
        </button>
      </div>

      {/* 측정 레이어 */}
      <div className="measure-layer" aria-hidden="true" ref={measureRef}>
        <div data-mhead style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}>
          <PaperHeader header={header} />
        </div>
        <div
          data-mhead-mini
          style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}
        >
          <PaperHeaderMini header={header} />
        </div>
        <div style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}>
          {items.map((it, idx) => (
            <div data-wid={`w-${it.id}`} key={it.id}>
              <WorksheetItemView
                item={it}
                num={idx + 1}
                markersById={getMarkerMap(it)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 해설지 측정 레이어 */}
      {hasExplanations && (
        <div className="measure-layer" aria-hidden="true" ref={explMeasureRef}>
          <div data-ahead style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}>
            <AnswerHeader header={header} />
          </div>
          <div style={{ width: PAPER_W_PX - PAD_X_MM * 2 * MM_TO_PX }}>
            {items.map((it, idx) => (
              <div data-eid={`e-${it.id}`} key={it.id}>
                <WorksheetExplanationView item={it} num={idx + 1} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="paper-stack">
        {items.length === 0 ? (
          <WorksheetEmptyPage
            header={header}
            scale={scale}
            worksheetLabel={worksheetType === 'grammar' ? '어법확인 워크시트' : '내용확인 워크시트'}
          />
        ) : (
          <>
            {itemPages.map((page, i) => (
              <WorksheetPaperPage
                key={`p-${i}`}
                items={page}
                allItems={items}
                pageIndex={i}
                totalPages={totalPages}
                header={header}
                scale={scale}
                isFirst={i === 0}
                worksheetLabel={worksheetType === 'grammar' ? '어법확인 워크시트' : '내용확인 워크시트'}
              />
            ))}
            {explPages.map((page, i) => (
              <WorksheetExplanationPage
                key={`e-${i}`}
                items={page}
                allItems={items}
                pageIndex={itemPages.length + i}
                totalPages={totalPages}
                header={header}
                scale={scale}
                isFirst={i === 0}
              />
            ))}
          </>
        )}
      </div>
    </main>
  );
}

function WorksheetEmptyPage({
  header,
  scale,
  worksheetLabel,
}: {
  header: ExamHeader;
  scale: number;
  worksheetLabel?: string;
}) {
  return (
    <div
      className="paper-frame"
      style={{ width: PAPER_W_PX * scale, height: PAPER_H_PX * scale }}
    >
      <div className="paper" style={{ transform: `scale(${scale})` }}>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <div className="paper-inner">
          <PaperHeader header={header} worksheetLabel={worksheetLabel} />
          <div className="ws-empty">
            <div className="ws-empty-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none">
                <path
                  d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6 M16 13H8 M16 17H8"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="ws-empty-text">
              좌측 패널에서 첫 번째 문장을 추가하면
              <br />
              여기 워크시트가 만들어집니다.
            </div>
          </div>
          <footer className="paper-footer">
            <span className="paper-footer-academy">{header.academyName}</span>
            <span className="paper-footer-pageno">1 / 1</span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function WorksheetPaperPage({
  items,
  allItems,
  pageIndex,
  totalPages,
  header,
  scale,
  isFirst,
  worksheetLabel,
}: {
  items: WorksheetItem[];
  allItems: WorksheetItem[];
  pageIndex: number;
  totalPages: number;
  header: ExamHeader;
  scale: number;
  isFirst: boolean;
  worksheetLabel?: string;
}) {
  return (
    <div
      className="paper-frame"
      style={{ width: PAPER_W_PX * scale, height: PAPER_H_PX * scale }}
    >
      <div className="paper" style={{ transform: `scale(${scale})` }}>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <div className="paper-inner">
          {isFirst ? (
            <PaperHeader header={header} worksheetLabel={worksheetLabel} />
          ) : (
            <PaperHeaderMini header={header} />
          )}
          <div className="ws-body">
            {items.map((it) => {
              const num = allItems.indexOf(it) + 1;
              const markersById = Object.fromEntries(
                it.blanks.map((b) => [b.id, b.marker])
              );
              return (
                <WorksheetItemView
                  key={it.id}
                  item={it}
                  num={num}
                  markersById={markersById}
                />
              );
            })}
          </div>
          <footer className="paper-footer">
            <span className="paper-footer-academy">{header.academyName}</span>
            <span className="paper-footer-pageno">
              {pageIndex + 1} / {totalPages}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function WorksheetItemView({
  item,
  num,
  markersById,
}: {
  item: WorksheetItem;
  num: number;
  markersById: Record<string, string>;
}) {
  const tokens = parseSentence(item.englishSentence);
  return (
    <article className="ws-item">
      <header className="ws-item-head">
        <span className="ws-item-num">[{num}]</span>
        {item.koreanTranslation && (
          <p className="ws-item-korean">{item.koreanTranslation}</p>
        )}
      </header>

      <div className="ws-item-english">
        {tokens.map((t, i) => {
          if (t.type === 'text') return <span key={i}>{t.text}</span>;
          const marker = markersById[t.blankId!] ?? '?';
          return (
            <span key={i} className="ws-blank">
              <span className="ws-blank-marker">{marker}</span>
              <span className="ws-blank-line" />
            </span>
          );
        })}
      </div>

      {item.blanks.length > 0 && (
        <div className="ws-item-blanks">
          {item.blanks.map((b) => (
            <div key={b.id} className="ws-item-blank-row">
              <span className="ws-item-blank-marker">{b.marker}</span>
              <span className="ws-item-blank-fields">
                <span className="ws-item-blank-field">
                  단어:&nbsp;
                  <span className="ws-item-blank-write" />
                </span>
                <span className="ws-item-blank-sep">/</span>
                <span className="ws-item-blank-field">
                  어법:&nbsp;
                  <span className="ws-item-blank-write" />
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </article>
  );
}

// 해설지 페이지
function WorksheetExplanationPage({
  items,
  allItems,
  pageIndex,
  totalPages,
  header,
  scale,
  isFirst,
}: {
  items: WorksheetItem[];
  allItems: WorksheetItem[];
  pageIndex: number;
  totalPages: number;
  header: ExamHeader;
  scale: number;
  isFirst: boolean;
}) {
  return (
    <div
      className="paper-frame"
      style={{ width: PAPER_W_PX * scale, height: PAPER_H_PX * scale }}
    >
      <div className="paper" style={{ transform: `scale(${scale})` }}>
        <span className="corner tl" />
        <span className="corner tr" />
        <span className="corner bl" />
        <span className="corner br" />
        <div className="paper-inner">
          {isFirst ? (
            <AnswerHeader header={header} />
          ) : (
            <PaperHeaderMini header={header} />
          )}
          <div className="ws-expl-body">
            {items.map((it) => {
              const num = allItems.indexOf(it) + 1;
              return (
                <WorksheetExplanationView key={it.id} item={it} num={num} />
              );
            })}
          </div>
          <footer className="paper-footer">
            <span className="paper-footer-academy">{header.academyName}</span>
            <span className="paper-footer-pageno">
              {pageIndex + 1} / {totalPages}
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}

function WorksheetExplanationView({
  item,
  num,
}: {
  item: WorksheetItem;
  num: number;
}) {
  const meaningfulBlanks = item.blanks.filter(
    (b) => b.answer || b.grammarPoint || b.explanation
  );
  if (meaningfulBlanks.length === 0) return null;
  return (
    <article className="ws-expl-item">
      <header className="ws-expl-item-head">
        <span className="ws-expl-item-num">[{num}]</span>
      </header>
      <div className="ws-expl-blanks">
        {meaningfulBlanks.map((b) => (
          <div key={b.id} className="ws-expl-blank">
            <div className="ws-expl-blank-head">
              <span className="ws-expl-marker">{b.marker}</span>
              <span className="ws-expl-answer">{b.answer || '—'}</span>
              {b.grammarPoint && (
                <>
                  <span className="ws-expl-em-dash">—</span>
                  <span className="ws-expl-point">{b.grammarPoint}</span>
                </>
              )}
            </div>
            {b.explanation && (
              <p className="ws-expl-text">{b.explanation}</p>
            )}
          </div>
        ))}
      </div>
    </article>
  );
}
