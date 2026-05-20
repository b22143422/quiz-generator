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
  header: ExamHeader;
  questions: Question[];
  groups: CommonGroup[];
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

function loadLibrary(): SavedPaper[] {
  try {
    const raw = localStorage.getItem(LIBRARY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((p) => p && p.id && p.header)
      .map((p) => ({
        id: p.id,
        name: p.name ?? '제목 없음',
        createdAt: p.createdAt ?? Date.now(),
        header: p.header,
        questions: Array.isArray(p.questions)
          ? p.questions.map(normalizeQuestion)
          : [],
        groups: Array.isArray(p.groups) ? p.groups.map(normalizeGroup) : [],
      }));
  } catch {
    return [];
  }
}

function persistLibrary(papers: SavedPaper[]) {
  try {
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(papers));
  } catch (e) {
    console.error('Failed to persist library:', e);
  }
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
  const [header, setHeader] = useState<ExamHeader>(initialHeader);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [groups, setGroups] = useState<CommonGroup[]>([]);
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
      `시험지 ${new Date().toLocaleDateString('ko-KR')}`;
    const name = prompt('이 시험지를 어떤 이름으로 저장할까요?', defaultName);
    if (!name?.trim()) return;

    const newPaper: SavedPaper = {
      id: `paper_${Date.now()}`,
      name: name.trim(),
      createdAt: Date.now(),
      header: { ...header },
      questions: questions.map((q) => ({ ...q })),
      groups: groups.map((g) => ({ ...g })),
    };
    const next = [newPaper, ...library];
    setLibrary(next);
    persistLibrary(next);
  };

  const loadPaper = (id: string) => {
    const paper = library.find((p) => p.id === id);
    if (!paper) return;
    if (questions.length > 0) {
      const ok = confirm(
        '현재 작업 중인 시험지가 사라지고 저장된 시험지로 대체됩니다. 계속할까요?\n\n(저장하지 않은 변경사항은 사라집니다)'
      );
      if (!ok) return;
    }
    setHeader(paper.header);
    setQuestions(paper.questions.map(normalizeQuestion));
    setGroups(paper.groups.map(normalizeGroup));
    setEditingId(null);
  };

  const deletePaper = (id: string) => {
    const paper = library.find((p) => p.id === id);
    if (!paper) return;
    if (!confirm(`"${paper.name}" 시험지를 라이브러리에서 삭제할까요?`))
      return;
    const next = library.filter((p) => p.id !== id);
    setLibrary(next);
    persistLibrary(next);
  };

  const newBlankPaper = () => {
    if (questions.length > 0) {
      const ok = confirm(
        '현재 작업 중인 시험지가 사라집니다. 새 시험지로 시작할까요?'
      );
      if (!ok) return;
    }
    setHeader({ ...initialHeader });
    setQuestions([]);
    setGroups([]);
    setEditingId(null);
  };

  return (
    <div className="app-shell">
      <ControlPanel
        header={header}
        onHeaderChange={updateHeader}
        questions={questions}
        groups={groups}
        editingId={editingId}
        onSelectEdit={setEditingId}
        onAdd={addQuestion}
        onUpdate={updateQuestion}
        onDelete={deleteQuestion}
        onMove={moveQuestion}
        onCreateGroup={createGroup}
        onUpdateGroup={updateGroup}
        onUngroup={ungroupQuestions}
        library={library}
        onSavePaper={savePaper}
        onLoadPaper={loadPaper}
        onDeletePaper={deletePaper}
        onNewBlank={newBlankPaper}
      />
      <ExamPaper header={header} questions={questions} groups={groups} />
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
  header: ExamHeader;
  onHeaderChange: (patch: Partial<ExamHeader>) => void;
  questions: Question[];
  groups: CommonGroup[];
  editingId: string | null;
  onSelectEdit: (id: string | null) => void;
  onAdd: (q: Omit<Question, 'id'>) => void;
  onUpdate: (id: string, patch: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
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
  header,
  onHeaderChange,
  questions,
  groups,
  editingId,
  onSelectEdit,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  onCreateGroup,
  onUpdateGroup,
  onUngroup,
  library,
  onSavePaper,
  onLoadPaper,
  onDeletePaper,
  onNewBlank,
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
          title="새 빈 시험지로 시작"
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

      {/* ───────── 03 문제 목록 ───────── */}
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

      {/* ───────── 04 답지 작성 ───────── */}
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
              disabled={questions.length === 0}
              title={
                questions.length === 0
                  ? '문제를 1개 이상 추가하면 저장할 수 있습니다'
                  : '현재 시험지를 라이브러리에 저장합니다'
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
              브라우저에 저장됩니다. 브라우저 데이터를 지우면 라이브러리도 함께
              사라질 수 있습니다.
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
        // 공통 발문 + (공통 본문) 을 한 묶음 블록으로 추가
        blocks.push({
          id: `${groupId}-header`,
          groupId: `gr-${groupId}`,
          kind: 'group-header',
          pullPriority: 0,
          render: () => (
            <CommonGroupHeader
              group={group}
              startNum={startNum}
              endNum={endNum}
            />
          ),
        });
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
    blocks.push({
      id: `${q.id}-passage`,
      groupId: q.id,
      kind: 'q-passage',
      pullPriority: 10, // 발문이랑 같이 묶임
      render: () => <PassageView html={q.passage} />,
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

  const totalPages = examPages.length + (hasAnyAnswer ? 1 : 0);

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
        {hasAnyAnswer && (
          <AnswerKeyPage
            header={header}
            questions={questions}
            numberMap={numberMap}
            pageIndex={examPages.length}
            totalPages={totalPages}
            scale={scale}
          />
        )}
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

function PaperHeader({ header }: { header: ExamHeader }) {
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
            <h1 className="paper-header-title">{header.title}</h1>
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
      {group.hasCommonPassage && !isPlainTextEmpty(group.commonPassage) && (
        <PassageView html={group.commonPassage} />
      )}
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

function PassageView({ html }: { html: string }) {
  return (
    <div
      className="q-passage"
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
function AnswerKeyPage({
  header,
  questions,
  numberMap,
  pageIndex,
  totalPages,
  scale,
}: {
  header: ExamHeader;
  questions: Question[];
  numberMap: Map<string, number>;
  pageIndex: number;
  totalPages: number;
  scale: number;
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
