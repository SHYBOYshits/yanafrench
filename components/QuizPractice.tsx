"use client";

import { useEffect, useRef, useState } from "react";
import type { QuizGradedItem, QuizLevel, QuizQuestionPublic, QuizSession } from "@/lib/quizData";
import { countSessionsToday, DAILY_QUIZ_LIMIT } from "@/lib/quizData";
import { IconCheck, IconClose, IconMic } from "./Icons";
import styles from "./QuizPractice.module.css";

type FlowState = "landing" | "loading" | "active" | "grading" | "results";
type RecorderState = "idle" | "requesting" | "recording" | "recorded";

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

function formatSessionDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });
}

/** Compact record/stop/re-record control for the quiz's one speaking
 * question — same MediaRecorder approach as SpeakingPractice, without the
 * waveform visualizer this flow doesn't need. */
function SpeakingRecorder({ onRecorded }: { onRecorded: (blob: Blob | null) => void }) {
  const [state, setState] = useState<RecorderState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const startTimeRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function startRecording() {
    setError(null);
    setState("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "audio/webm" });
        setAudioUrl(URL.createObjectURL(blob));
        onRecorded(blob);
        setState("recorded");
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };
      recorder.start();
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => setElapsedMs(Date.now() - startTimeRef.current), 200);
      setState("recording");
    } catch {
      setError("Couldn't access your microphone — check permissions and try again.");
      setState("idle");
    }
  }

  function stopRecording() {
    if (timerRef.current) clearInterval(timerRef.current);
    recorderRef.current?.stop();
  }

  function reRecord() {
    if (audioUrl) URL.revokeObjectURL(audioUrl);
    setAudioUrl(null);
    setElapsedMs(0);
    onRecorded(null);
    setState("idle");
  }

  return (
    <div className={styles.recorder}>
      {state === "idle" && (
        <button type="button" className={styles.recordButton} onClick={startRecording}>
          <IconMic size={16} /> Start recording
        </button>
      )}
      {state === "requesting" && <p className={styles.recorderHint}>Requesting microphone…</p>}
      {state === "recording" && (
        <button type="button" className={`${styles.recordButton} ${styles.recordButtonActive}`} onClick={stopRecording}>
          <span className={styles.recDot} /> Stop — {formatDuration(elapsedMs)}
        </button>
      )}
      {state === "recorded" && audioUrl && (
        <div className={styles.recorderDone}>
          <audio src={audioUrl} controls className={styles.recorderAudio} />
          <button type="button" className={styles.reRecord} onClick={reRecord}>Re-record</button>
        </div>
      )}
      {error && <p className={styles.recorderError}>{error}</p>}
    </div>
  );
}

function ResultItem({ item }: { item: QuizGradedItem }) {
  if (item.type === "speaking" && item.speakingEval) {
    return (
      <div className={styles.resultCard}>
        <div className={styles.resultTop}>
          <span className={styles.resultSkill}>SPEAKING</span>
          <span className={styles.resultScore}>{item.speakingEval.overall.toFixed(1)} / 10</span>
        </div>
        <p className={styles.resultPrompt}>{item.prompt}</p>
        <p className={styles.resultTranscript}>&ldquo;{item.speakingEval.transcript}&rdquo;</p>
        <p className={styles.resultNote}><strong>Well done:</strong> {item.speakingEval.wellDone}</p>
        <p className={styles.resultNote}><strong>Improve:</strong> {item.speakingEval.improve}</p>
        {item.speakingEval.corrections.map((c, i) => (
          <div key={i} className={styles.correction}>
            <span className={styles.correctionSaid}>{c.said}</span>
            <span className={styles.correctionArrow}>→</span>
            <span className={styles.correctionBetter}>{c.better}</span>
            <p>{c.explanation}</p>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={styles.resultCard}>
      <div className={styles.resultTop}>
        <span className={styles.resultSkill}>{item.skill.toUpperCase()}</span>
        <span className={item.correct ? styles.resultBadgeGood : styles.resultBadgeBad}>
          {item.correct ? <IconCheck size={12} /> : <IconClose size={12} />}
          {item.correct ? "Correct" : "Incorrect"}
        </span>
      </div>
      <p className={styles.resultPrompt}>{item.prompt}</p>
      <p className={styles.resultNote}>Your answer: <strong>{item.response || "(no answer)"}</strong></p>
      {!item.correct && <p className={styles.resultNote}>Correct answer: <strong>{item.correctAnswer}</strong></p>}
      {item.explanation && <p className={styles.resultExplanation}>{item.explanation}</p>}
    </div>
  );
}

function SessionSummary({ session }: { session: QuizSession }) {
  return (
    <div className={styles.pastCard}>
      <div className={styles.pastTop}>
        <span>{formatSessionDate(session.date)} · {session.level}</span>
        <strong>{session.overallScore.toFixed(1)} / 10</strong>
      </div>
      <p>{session.summary}</p>
    </div>
  );
}

export function QuizPractice({
  level,
  sessions,
  onSessionCompleted,
}: {
  level: QuizLevel;
  sessions: QuizSession[];
  onSessionCompleted: () => void;
}) {
  const [flow, setFlow] = useState<FlowState>("landing");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [questions, setQuestions] = useState<QuizQuestionPublic[]>([]);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [speakingBlob, setSpeakingBlob] = useState<Blob | null>(null);
  const [result, setResult] = useState<QuizSession | null>(null);

  const usedToday = countSessionsToday(sessions);
  const remaining = Math.max(0, DAILY_QUIZ_LIMIT - usedToday);

  async function startQuiz() {
    setError(null);
    setFlow("loading");
    try {
      const res = await fetch("/api/quiz/generate", { method: "POST" });
      if (res.status === 403) {
        setError("You've used both quiz sessions for today — come back tomorrow.");
        setFlow("landing");
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setToken(data.token);
      setQuestions(data.questions);
      setAnswers({});
      setSpeakingBlob(null);
      setFlow("active");
    } catch {
      setError("Couldn't generate a quiz right now — try again in a moment.");
      setFlow("landing");
    }
  }

  const speakingQuestion = questions.find((q) => q.type === "speaking");
  const allAnswered =
    questions.filter((q) => q.type !== "speaking").every((q) => (answers[q.id] ?? "").trim().length > 0) &&
    (!speakingQuestion || speakingBlob != null);

  async function submitQuiz() {
    if (!token) return;
    setError(null);
    setFlow("grading");
    try {
      const formData = new FormData();
      formData.append("token", token);
      formData.append(
        "answers",
        JSON.stringify(questions.filter((q) => q.type !== "speaking").map((q) => ({ questionId: q.id, response: answers[q.id] ?? "" })))
      );
      if (speakingQuestion && speakingBlob) {
        formData.append("speakingQuestionId", speakingQuestion.id);
        formData.append("speakingAudio", speakingBlob, "quiz-speaking.webm");
      }

      const res = await fetch("/api/quiz/submit", { method: "POST", body: formData });
      if (res.status === 403) {
        setError("Daily quiz limit reached.");
        setFlow("landing");
        onSessionCompleted();
        return;
      }
      if (!res.ok) throw new Error();
      const session: QuizSession = await res.json();
      setResult(session);
      setFlow("results");
      onSessionCompleted();
    } catch {
      setError("Grading failed — try submitting again.");
      setFlow("active");
    }
  }

  if (flow === "landing") {
    return (
      <div className={styles.landing}>
        <div className={styles.startCard}>
          <span className={styles.levelBadge}>LEVEL {level}</span>
          <h2>Ready for today&rsquo;s quiz?</h2>
          <p>6 questions — a mix of multiple choice, fill-in-the-blank, and one speaking prompt — graded by AI with a written remark.</p>
          <p className={styles.remaining}>{remaining} of {DAILY_QUIZ_LIMIT} sessions left today</p>
          <button type="button" className={styles.startButton} disabled={remaining === 0} onClick={startQuiz}>
            {remaining === 0 ? "Come back tomorrow" : "Start quiz →"}
          </button>
          {error && <p className={styles.errorText}>{error}</p>}
        </div>

        {sessions.length > 0 && (
          <div className={styles.pastList}>
            <span className={styles.sectionLabel}>PAST REMARKS</span>
            {sessions.map((s) => <SessionSummary key={s.id} session={s} />)}
          </div>
        )}
      </div>
    );
  }

  if (flow === "loading") {
    return <div className={styles.empty}><p>Generating your quiz…</p></div>;
  }

  if (flow === "active") {
    return (
      <div className={styles.active}>
        {questions.map((q, i) => (
          <div key={q.id} className={styles.questionCard}>
            <div className={styles.questionTop}>
              <span className={styles.questionNumber}>Question {i + 1} of {questions.length}</span>
              <span className={styles.resultSkill}>{q.skill.toUpperCase()}</span>
            </div>
            <p className={styles.questionPrompt}>{q.prompt}</p>

            {q.type === "mcq" && (
              <div className={styles.choices}>
                {q.choices.map((c) => (
                  <button
                    key={c}
                    type="button"
                    className={answers[q.id] === c ? styles.choiceActive : styles.choice}
                    onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: c }))}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}

            {q.type === "fillBlank" && (
              <input
                className={styles.blankInput}
                placeholder="Your answer…"
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
              />
            )}

            {q.type === "speaking" && <SpeakingRecorder onRecorded={setSpeakingBlob} />}
          </div>
        ))}

        {error && <p className={styles.errorText}>{error}</p>}
        <button type="button" className={styles.startButton} disabled={!allAnswered} onClick={submitQuiz}>
          Submit quiz →
        </button>
      </div>
    );
  }

  if (flow === "grading") {
    return <div className={styles.empty}><p>Grading your answers…</p></div>;
  }

  if (flow === "results" && result) {
    return (
      <div className={styles.results}>
        <div className={styles.remarkCard}>
          <div className={styles.pastTop}>
            <span>{formatSessionDate(result.date)} · {result.level}</span>
            <strong>{result.overallScore.toFixed(1)} / 10</strong>
          </div>
          <p>{result.summary}</p>
          <p className={styles.resultNote}><strong>Strengths:</strong> {result.strengths}</p>
          <p className={styles.resultNote}><strong>Focus next:</strong> {result.focusAreas}</p>
        </div>

        {result.items.map((item) => <ResultItem key={item.id} item={item} />)}

        <button type="button" className={styles.startButton} onClick={() => setFlow("landing")}>Back to Quiz</button>
      </div>
    );
  }

  return null;
}
