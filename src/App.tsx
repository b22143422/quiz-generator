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
type QuestionType = 'multiple-choice' | 'written';

interface Question {
  id: string;
  type: QuestionType;
  questionText: string;
  hasPassage: boolean;
  passage: string;
  choices: string[];
  answerLines: number;
  answer: string;
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

const MC_PER_ROW = 10;

// ═══════════════════════════════════════════════════════
//  LIBRARY (localStorage)
// ═══════════════════════════════════════════════════════
const LIBRARY_KEY = 'exam-studio.library.v1';

function normalizeQuestion(q: any): Question {
  return {
    id: q?.id ?? `q${Date.now()}_${Math.random().toString(36).slice(2)}`,
    type: q?.type === 'written' ? 'written' : 'multiple-choice',
    questionText: q?.questionText ?? '',
    hasPassage: !!q?.hasPassage,
    passage: q?.passage ?? '',
    choices: Array.isArray(q?.choices) && q.choices.length === 5
      ? q.choices
      : ['', '', '', '', ''],
    answerLines: typeof q?.answerLines === 'number' ? q.answerLines : 4,
    answer: q?.answer ?? '',
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
//  INITIAL
// ═══════════════════════════════════════════════════════
const initialHeader: ExamHeader = {
  academyName: '옵티멈N스터디 영어학원',
  grade: '',
  title: '',
  scope: '',
  logoDataUrl: DEFAULT_LOGO,
};

const initialQuestions: Question[] = [];

// ═══════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════
export default function App() {
  const [header, setHeader] = useState<ExamHeader>(initialHeader);
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [library, setLibrary] = useState<SavedPaper[]>(() => loadLibrary());

  const updateHeader = (patch: Partial<ExamHeader>) =>
    setHeader((prev) => ({ ...prev, ...patch }));

  const addQuestion = (q: Omit<Question, 'id'>) =>
    setQuestions((prev) => [...prev, { ...q, id: `q${Date.now()}` }]);

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

  // ─── 라이브러리 액션 ───
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
    setEditingId(null);
  };

  return (
    <div className="app-shell">
      <ControlPanel
        header={header}
        onHeaderChange={updateHeader}
        questions={questions}
        editingId={editingId}
        onSelectEdit={setEditingId}
        onAdd={addQuestion}
        onUpdate={updateQuestion}
        onDelete={deleteQuestion}
        onMove={moveQuestion}
        library={library}
        onSavePaper={savePaper}
        onLoadPaper={loadPaper}
        onDeletePaper={deletePaper}
        onNewBlank={newBlankPaper}
      />
      <ExamPaper header={header} questions={questions} />
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
  editingId: string | null;
  onSelectEdit: (id: string | null) => void;
  onAdd: (q: Omit<Question, 'id'>) => void;
  onUpdate: (id: string, patch: Partial<Question>) => void;
  onDelete: (id: string) => void;
  onMove: (id: string, dir: -1 | 1) => void;
  library: SavedPaper[];
  onSavePaper: () => void;
  onLoadPaper: (id: string) => void;
  onDeletePaper: (id: string) => void;
  onNewBlank: () => void;
}

const blankComposer = {
  type: 'multiple-choice' as QuestionType,
  questionText: '',
  hasPassage: false,
  passage: '',
  choices: ['', '', '', '', ''],
  answerLines: 4,
  answer: '',
};

function ControlPanel({
  header,
  onHeaderChange,
  questions,
  editingId,
  onSelectEdit,
  onAdd,
  onUpdate,
  onDelete,
  onMove,
  library,
  onSavePaper,
  onLoadPaper,
  onDeletePaper,
  onNewBlank,
}: ControlPanelProps) {
  const [composer, setComposer] = useState(blankComposer);
  const [listExpanded, setListExpanded] = useState(false);
  const [answersExpanded, setAnswersExpanded] = useState(false);
  const [libraryExpanded, setLibraryExpanded] = useState(false);

  useEffect(() => {
    if (editingId) {
      const q = questions.find((qq) => qq.id === editingId);
      if (q) {
        setComposer({
          type: q.type,
          questionText: q.questionText,
          hasPassage: q.hasPassage,
          passage: q.passage,
          choices: [...q.choices],
          answerLines: q.answerLines,
          answer: q.answer,
        });
        setListExpanded(true);
      }
    }
  }, [editingId]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setComposer(blankComposer);
    onSelectEdit(null);
  };

  const submit = () => {
    if (!composer.questionText.trim()) return;
    if (editingId) onUpdate(editingId, composer);
    else onAdd(composer);
    reset();
  };

  const mcCount = questions.filter((q) => q.type === 'multiple-choice').length;
  const wrCount = questions.filter((q) => q.type === 'written').length;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onHeaderChange({ logoDataUrl: reader.result as string });
    };
    reader.readAsDataURL(file);
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

        <div className="cp-type-toggle">
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
            <span className="cp-type-count">{mcCount}</span>
          </button>
          <button
            className={`cp-type-opt ${
              composer.type === 'written' ? 'active' : ''
            }`}
            onClick={() => setComposer({ ...composer, type: 'written' })}
          >
            <span className="cp-type-mark">✎</span>
            <span>서술형</span>
            <span className="cp-type-count">{wrCount}</span>
          </button>
        </div>

        <div className="cp-field">
          <label>발문</label>
          <textarea
            className="cp-textarea"
            value={composer.questionText}
            placeholder="문제의 발문을 입력하세요."
            onChange={(e) =>
              setComposer({ ...composer, questionText: e.target.value })
            }
            rows={3}
          />
        </div>

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
              <em>빈칸·지칭·삽입 등 본문 활용 문제용</em>
            </span>
          </label>
          {composer.hasPassage && (
            <textarea
              className="cp-textarea cp-passage-input"
              value={composer.passage}
              onChange={(e) =>
                setComposer({ ...composer, passage: e.target.value })
              }
              placeholder="발문과 선지(또는 답란) 사이에 들어갈 본문/지문/예문을 입력하세요. 줄바꿈도 그대로 유지됩니다."
              rows={5}
            />
          )}
        </div>

        {composer.type === 'multiple-choice' ? (
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
        ) : (
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

      {/* ───────── 03 문제 목록 (접기/펼치기) ───────── */}
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

        {listExpanded &&
          (questions.length === 0 ? (
            <div className="cp-empty">아직 추가된 문제가 없습니다.</div>
          ) : (
            <ul className="cp-list">
              {questions.map((q, idx) => {
                const sameTypeBefore = questions
                  .slice(0, idx)
                  .filter((x) => x.type === q.type).length;
                const num = sameTypeBefore + 1;
                return (
                  <li
                    key={q.id}
                    className={`cp-list-item ${
                      editingId === q.id ? 'editing' : ''
                    }`}
                  >
                    <div
                      className={`cp-tag ${
                        q.type === 'multiple-choice' ? 'tag-mc' : 'tag-wr'
                      }`}
                    >
                      {q.type === 'multiple-choice' ? '객' : '술'}
                      <em>{num}</em>
                    </div>
                    <div
                      className="cp-list-text"
                      onClick={() => onSelectEdit(q.id)}
                    >
                      {q.hasPassage && (
                        <span className="cp-list-badge">본문</span>
                      )}
                      {q.questionText || <i>(제목 없음)</i>}
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
              })}
            </ul>
          ))}
      </section>

      {/* ───────── 04 답지 작성 (접기/펼치기) ───────── */}
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
              {questions.map((q, idx) => {
                const sameTypeBefore = questions
                  .slice(0, idx)
                  .filter((x) => x.type === q.type).length;
                const num = sameTypeBefore + 1;
                const isMC = q.type === 'multiple-choice';
                return (
                  <div key={q.id} className="cp-answer-row">
                    <div className={`cp-tag ${isMC ? 'tag-mc' : 'tag-wr'}`}>
                      {isMC ? '객' : '술'}
                      <em>{num}</em>
                    </div>
                    {isMC ? (
                      <div className="cp-answer-mc">
                        {['①', '②', '③', '④', '⑤'].map((opt) => (
                          <button
                            key={opt}
                            className={`cp-answer-mc-btn ${
                              q.answer === opt ? 'active' : ''
                            }`}
                            onClick={() => onUpdate(q.id, { answer: opt })}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        className="cp-textarea cp-answer-text"
                        value={q.answer}
                        placeholder="예시 정답 / 채점 기준"
                        onChange={(e) =>
                          onUpdate(q.id, { answer: e.target.value })
                        }
                        rows={2}
                      />
                    )}
                  </div>
                );
              })}
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
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
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
    </aside>
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

type BlockKind = 'q-stem' | 'q-passage' | 'q-choice' | 'q-answer' | 'divider';

interface Block {
  id: string;
  groupId: string;
  kind: BlockKind;
  render: () => React.ReactNode;
}

function buildBlocks(questions: Question[]): Block[] {
  const blocks: Block[] = [];
  const mc = questions.filter((q) => q.type === 'multiple-choice');
  const wr = questions.filter((q) => q.type === 'written');

  const pushQuestion = (q: Question, num: number) => {
    blocks.push({
      id: `${q.id}-stem`,
      groupId: q.id,
      kind: 'q-stem',
      render: () => <QuestionStem q={q} number={num} />,
    });

    if (q.hasPassage && q.passage.trim()) {
      blocks.push({
        id: `${q.id}-passage`,
        groupId: q.id,
        kind: 'q-passage',
        render: () => <PassageView text={q.passage} />,
      });
    }

    if (q.type === 'multiple-choice') {
      q.choices.forEach((c, i) => {
        blocks.push({
          id: `${q.id}-c${i}`,
          groupId: q.id,
          kind: 'q-choice',
          render: () => <ChoiceItem choice={c} index={i} />,
        });
      });
    } else {
      blocks.push({
        id: `${q.id}-ans`,
        groupId: q.id,
        kind: 'q-answer',
        render: () => <AnswerArea lines={q.answerLines} />,
      });
    }
  };

  mc.forEach((q, i) => pushQuestion(q, i + 1));
  if (mc.length > 0 && wr.length > 0) {
    blocks.push({
      id: '__divider',
      groupId: '__divider',
      kind: 'divider',
      render: () => <DividerView label="서술형 문항" />,
    });
  }
  wr.forEach((q, i) => pushQuestion(q, i + 1));

  return blocks;
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

    if (colIdx === 0) {
      colIdx = 1;
      used = 0;
      lastGroupId = null;
      place(block, allowPull);
      return;
    }

    if (allowPull && isContinuation && block.kind !== 'divider') {
      const qid = block.groupId;
      const pulled: Block[] = [];

      while (
        current.cols[1].length > 0 &&
        current.cols[1][current.cols[1].length - 1].groupId === qid
      ) {
        pulled.unshift(current.cols[1].pop()!);
      }
      while (
        current.cols[0].length > 0 &&
        current.cols[0][current.cols[0].length - 1].groupId === qid
      ) {
        pulled.unshift(current.cols[0].pop()!);
      }

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
}: {
  header: ExamHeader;
  questions: Question[];
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const scale = useDisplayScale(stageRef);
  const blocks = useMemo(() => buildBlocks(questions), [questions]);

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
    node.querySelectorAll<HTMLElement>('[data-mid]').forEach((el) => ro.observe(el));
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

  const hasAnyAnswer = questions.some((q) => q.answer.trim() !== '');
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
  const groups: { groupId: string; kind: BlockKind; items: Block[] }[] = [];
  for (const b of blocks) {
    const last = groups[groups.length - 1];
    if (last && last.groupId === b.groupId) {
      last.items.push(b);
    } else {
      groups.push({ groupId: b.groupId, kind: b.kind, items: [b] });
    }
  }

  return (
    <div className="paper-col">
      {groups.map((g, i) => {
        if (g.kind === 'divider') {
          return <Fragment key={i}>{g.items[0].render()}</Fragment>;
        }
        return (
          <article className="q" key={i}>
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
function QuestionStem({ q, number }: { q: Question; number: number }) {
  return (
    <header className="q-head">
      <span className="q-num">{number}.</span>
      <p className="q-text">{q.questionText || '(문제를 입력하세요)'}</p>
    </header>
  );
}

function PassageView({ text }: { text: string }) {
  return <div className="q-passage">{text}</div>;
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

function DividerView({ label }: { label: string }) {
  return (
    <div className="q-divider">
      <span className="q-divider-rule" />
      <span className="q-divider-label">{label}</span>
      <span className="q-divider-rule" />
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  ANSWER KEY PAGE
// ═══════════════════════════════════════════════════════
function AnswerKeyPage({
  header,
  questions,
  pageIndex,
  totalPages,
  scale,
}: {
  header: ExamHeader;
  questions: Question[];
  pageIndex: number;
  totalPages: number;
  scale: number;
}) {
  const mc = questions.filter((q) => q.type === 'multiple-choice');
  const wr = questions.filter((q) => q.type === 'written');

  const mcChunks: Question[][] = [];
  for (let i = 0; i < mc.length; i += MC_PER_ROW) {
    mcChunks.push(mc.slice(i, i + MC_PER_ROW));
  }

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

          <div className="answer-body">
            {mc.length > 0 && (
              <section className="answer-section">
                <div className="answer-section-head">
                  <span>객관식 정답</span>
                  <span className="answer-section-count">
                    총 {mc.length}문항
                  </span>
                </div>
                <div className="answer-mc-wrap">
                  {mcChunks.map((chunk, ci) => (
                    <table className="answer-mc-table" key={ci}>
                      <tbody>
                        <tr className="answer-mc-row-num">
                          <th>번호</th>
                          {chunk.map((_, i) => (
                            <td key={i}>{ci * MC_PER_ROW + i + 1}</td>
                          ))}
                          {Array.from({
                            length: MC_PER_ROW - chunk.length,
                          }).map((_, i) => (
                            <td key={`pad-n-${i}`} className="empty" />
                          ))}
                        </tr>
                        <tr className="answer-mc-row-ans">
                          <th>정답</th>
                          {chunk.map((q, i) => (
                            <td key={i}>{q.answer || '—'}</td>
                          ))}
                          {Array.from({
                            length: MC_PER_ROW - chunk.length,
                          }).map((_, i) => (
                            <td key={`pad-a-${i}`} className="empty" />
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  ))}
                </div>
              </section>
            )}

            {wr.length > 0 && (
              <section className="answer-section">
                <div className="answer-section-head">
                  <span>서술형 정답 / 채점 기준</span>
                  <span className="answer-section-count">
                    총 {wr.length}문항
                  </span>
                </div>
                <ol className="answer-wr-list">
                  {wr.map((q, i) => (
                    <li key={q.id}>
                      <span className="answer-wr-num">{i + 1}.</span>
                      <span className="answer-wr-text">
                        {q.answer || '(정답 미입력)'}
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            )}
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