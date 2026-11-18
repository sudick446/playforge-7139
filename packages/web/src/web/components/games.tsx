import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowUp, ArrowLeft, ArrowRight } from "lucide-react";
export function Game({ name, onScore }: { name: string; onScore: (value: number) => void }) {
  return name === "Snake" ? (
    <Snake onScore={onScore} />
  ) : name === "Memory" ? (
    <Memory onScore={onScore} />
  ) : (
    <Tic onScore={onScore} />
  );
}
function Snake({ onScore }: { onScore: (n: number) => void }) {
  const [body, setBody] = useState([
      [7, 7],
      [6, 7],
      [5, 7],
    ]),
    [food, setFood] = useState([11, 7]),
    [running, setRunning] = useState(false),
    [over, setOver] = useState(false),
    [score, setScore] = useState(0);
  const dir = useRef([1, 0]);
  const changed = useRef(false);
  function turn(d: number[]) {
    if (!changed.current && (d[0] !== -dir.current[0] || d[1] !== -dir.current[1])) {
      dir.current = d;
      changed.current = true;
    }
  }
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const d: Record<string, number[]> = {
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        w: [0, -1],
        s: [0, 1],
        a: [-1, 0],
        d: [1, 0],
      };
      if (d[e.key]) {
        e.preventDefault();
        turn(d[e.key]);
      }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  useEffect(() => {
    if (!running) return;
    const timer = setInterval(() => {
      changed.current = false;
      const h = [body[0][0] + dir.current[0], body[0][1] + dir.current[1]];
      const eat = h[0] === food[0] && h[1] === food[1];
      const tail = eat ? body : body.slice(0, -1);
      if (h.some((v) => v < 0 || v > 15) || tail.some((p) => p[0] === h[0] && p[1] === h[1])) {
        setRunning(false);
        setOver(true);
        onScore(score);
        return;
      }
      setBody([h, ...(eat ? body : body.slice(0, -1))]);
      if (eat) {
        setScore(score + 10);
        let f: number[];
        do {
          f = [Math.floor(Math.random() * 16), Math.floor(Math.random() * 16)];
        } while ([h, ...body].some((p) => p[0] === f[0] && p[1] === f[1]));
        setFood(f);
      }
    }, 140);
    return () => clearInterval(timer);
  }, [body, food, running, score, onScore]);
  return (
    <>
      <div className="game-status">
        <span>SCORE {score.toString().padStart(3, "0")}</span>
        <span>{over ? "Game over" : running ? "Stay sharp." : "Ready when you are."}</span>
      </div>
      <div className="snake-board">
        {Array.from({ length: 256 }, (_, i) => (
          <div
            key={i}
            className={
              body.some((p) => p[0] === i % 16 && p[1] === Math.floor(i / 16))
                ? "snake-cell"
                : food[0] === i % 16 && food[1] === Math.floor(i / 16)
                  ? "food-cell"
                  : ""
            }
          />
        ))}
      </div>
      <p className="muted">Arrow keys / WASD or the controls below. Eat, grow, avoid the walls.</p>
      <div className="controls">
        {[
          [0, -1],
          [-1, 0],
          [0, 1],
          [1, 0],
        ].map((d, i) => {
          const Icon = [ArrowUp, ArrowLeft, ArrowDown, ArrowRight][i];
          return (
            <button aria-label={["Up", "Left", "Down", "Right"][i]} key={i} onClick={() => turn(d)}>
              <Icon size={18} />
            </button>
          );
        })}
        <button
          className="accent"
          onClick={() => {
            setBody([
              [7, 7],
              [6, 7],
              [5, 7],
            ]);
            setFood([11, 7]);
            dir.current = [1, 0];
            changed.current = false;
            setScore(0);
            setOver(false);
            setRunning(true);
          }}
        >
          {running ? "Restart" : over ? "Play again" : "Start game"}
        </button>
      </div>
    </>
  );
}
const fresh = () => [...Array(8).keys(), ...Array(8).keys()].sort(() => Math.random() - 0.5);
function Memory({ onScore }: { onScore: (n: number) => void }) {
  const [cards, setCards] = useState(fresh),
    [open, setOpen] = useState<number[]>([]),
    [matched, setMatched] = useState<number[]>([]),
    [moves, setMoves] = useState(0);
  useEffect(() => {
    if (open.length !== 2) return;
    const timer = setTimeout(() => {
      if (cards[open[0]] === cards[open[1]]) {
        const next = [...matched, ...open];
        setMatched(next);
        if (next.length === 16) onScore(Math.max(10, 1000 - (moves - 8) * 25));
      }
      setOpen([]);
    }, 650);
    return () => clearTimeout(timer);
  }, [open, matched, onScore, moves, cards]);
  return (
    <>
      <div className="game-status">
        <span>{moves} MOVES</span>
        <span>
          {matched.length === 16 ? "Perfectly paired." : `${matched.length / 2} / 8 pairs`}
        </span>
      </div>
      <div className="memory-board">
        {cards.map((v, i) => (
          <button
            key={i}
            className={open.includes(i) || matched.includes(i) ? "revealed" : ""}
            aria-label={`Card ${i + 1}`}
            onClick={() => {
              if (open.length === 2 || open.includes(i) || matched.includes(i)) return;
              if (open.length === 1) setMoves(moves + 1);
              setOpen([...open, i]);
            }}
          >
            {open.includes(i) || matched.includes(i)
              ? ["✦", "◆", "●", "▲", "■", "＋", "◎", "〰"][v]
              : "?"}
          </button>
        ))}
      </div>
      <p className="muted">Find all eight pairs. Fewer moves means a higher score.</p>
      <button
        onClick={() => {
          setCards(fresh());
          setMatched([]);
          setMoves(0);
          setOpen([]);
        }}
      >
        New game
      </button>
    </>
  );
}
function Tic({ onScore }: { onScore: (n: number) => void }) {
  const [cells, setCells] = useState<string[]>(Array(9).fill("")),
    [turn, setTurn] = useState("X");
  const winner = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ]
    .map((l) => (cells[l[0]] && l.every((i) => cells[i] === cells[l[0]]) ? cells[l[0]] : ""))
    .find(Boolean);
  const done = winner || cells.every(Boolean);
  return (
    <>
      <div className="game-status">
        <span>LOCAL TWO-PLAYER</span>
        <span>{winner ? `${winner} wins!` : done ? "A worthy draw." : `${turn}'s turn`}</span>
      </div>
      <div className="tic-board">
        {cells.map((v, i) => (
          <button
            key={i}
            aria-label={`Square ${i + 1}${v ? " " + v : ""}`}
            onClick={() => {
              if (v || done) return;
              const next = [...cells];
              next[i] = turn;
              setCells(next);
              setTurn(turn === "X" ? "O" : "X");
              if (
                [
                  [0, 1, 2],
                  [3, 4, 5],
                  [6, 7, 8],
                  [0, 3, 6],
                  [1, 4, 7],
                  [2, 5, 8],
                  [0, 4, 8],
                  [2, 4, 6],
                ].some((l) => l.every((j) => next[j] === turn))
              )
                onScore(100);
              else if (next.every(Boolean)) onScore(50);
            }}
          >
            {v}
          </button>
        ))}
      </div>
      <p className="muted">Take turns with a friend on the same device. Three in a row wins.</p>
      <button
        onClick={() => {
          setCells(Array(9).fill(""));
          setTurn("X");
        }}
      >
        Play again
      </button>
    </>
  );
}
