import { useState } from "react";
import "../playforge.css";
import { useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  X,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import { authClient } from "../lib/auth";
import { Game } from "../components/games";
import { useProfile, useSaveScore } from "../queries/player";
const games = [
  {
    name: "Snake",
    kind: "Arcade",
    tag: "THE CULT CLASSIC",
    desc: "One more bite. One more high score.",
    class: "snake-art",
  },
  {
    name: "Memory",
    kind: "Puzzle",
    tag: "TRAIN YOUR BRAIN",
    desc: "Stay focused. Find your match.",
    class: "memory-art",
  },
  {
    name: "Tic-Tac-Toe",
    kind: "Strategy",
    tag: "BETTER WITH A FRIEND",
    desc: "Small grid. Big rivalries.",
    class: "tic-art",
  },
];
const articles = [
  {
    tag: "FIELD NOTES",
    title: "Small games. Serious staying power.",
    body: "The best arcade games make the rules clear in seconds. Snake needs only a direction and a little restraint. Its growing tail turns a familiar space into a new puzzle every round. Short sessions, readable feedback and immediate restarts keep the challenge approachable.",
  },
  {
    tag: "THE REVIEW",
    title: "Memory: a little focus goes a long way.",
    body: "Our Memory game is a quiet counterpoint to fast arcade play. Sixteen cards hide eight pairs. The first few turns are exploration; the final turns reward attention. Try naming each symbol as you reveal it and grouping positions into rows. This is a review of our own browser game, not an independent product endorsement.",
  },
  {
    tag: "PLAYER GUIDE",
    title: "A smarter way to start your next session.",
    body: "Take a short break between rounds and choose a goal before you start. In Snake, practice turning early instead of chasing every bite. In Memory, aim to remember two new positions each turn. Playable games here require no downloads. Keep your password unique and never share your account with another player.",
  },
];
export default function Home() {
  const [modal, setModal] = useState<string | null>(null),
    [query, setQuery] = useState(""),
    [filter, setFilter] = useState("All games"),
    [article, setArticle] = useState<number | null>(null),
    [result, setResult] = useState<number | null>(null);
  const { data: session } = authClient.useSession();
  const save = useSaveScore();
  const close = () => {
    setModal(null);
    setArticle(null);
    setResult(null);
    save.reset();
  };
  const launch = (name: string) => {
    setResult(null);
    save.reset();
    setModal(name);
  };
  return (
    <>
      <header>
        <a className="brand" href="/">
          PLAYFORGE<span>®</span>
        </a>
        <nav>
          <a href="#games">The arcade</a>
          <a href="#tournaments">Tournaments</a>
          <a href="#journal">The journal</a>
        </nav>
        <button className="pill" onClick={() => setModal(session ? "Profile" : "Sign in")}>
          {session ? "My profile" : "Join the play"} <ArrowUpRight size={15} />
        </button>
      </header>
      <main>
        <section className="hero">
          <div className="mosaic" aria-hidden="true">
            {Array.from({ length: 15 }, (_, i) => (
              <div
                key={i}
                className={`tile tile-${i % 5}`}
                style={
                  i % 5 < 3
                    ? {
                        backgroundImage: `url(/images/${["controller", "gaming", "arcade"][i % 5]}.jpg)`,
                      }
                    : {}
                }
              >
                {i % 5 === 3 ? "✳" : i % 5 === 4 ? "×" : ""}
              </div>
            ))}
          </div>
          <div className="hero-shade" />
          <div className="hero-copy">
            <span className="eyebrow">NO DOWNLOADS. JUST GOOD GAMES.</span>
            <h1>
              A new home
              <br />
              for your <em>next level.</em>
            </h1>
            <p>
              Quick escapes. Friendly rivalries. Endless replay.
              <br />
              Great games, right here in your browser.
            </p>
            <a className="accent hero-cta" href="#games">
              Enter the arcade <ArrowUpRight size={18} />
            </a>
          </div>
          <div className="hero-bottom">
            <span>
              <ShieldCheck size={15} /> Play free. No installs required.
            </span>
            <a href="#intro">
              SCROLL TO EXPLORE <ChevronDown size={14} />
            </a>
          </div>
        </section>
        <section className="intro section" id="intro">
          <span className="eyebrow">BUILT FOR THE LOVE OF PLAY</span>
          <h2>
            Less friction.
            <br />
            More <span className="muted">“one more round.”</span>
          </h2>
          <div className="values">
            <div className="value light">
              <span>01 / INSTANT</span>
              <h3>Jump right in.</h3>
              <p>No downloads, no waiting rooms. Pick a game and get straight to the good part.</p>
              <ArrowUpRight />
            </div>
            <div className="value orange">
              <span>02 / YOUR SPACE</span>
              <h3>Play your way.</h3>
              <p>
                Solo focus or a friendly face-off. Find your rhythm, and make every session your
                own.
              </p>
              <ArrowUpRight />
            </div>
            <div className="value dark">
              <span>03 / PEACE OF MIND</span>
              <h3>Keep it yours.</h3>
              <p>
                Optional accounts, protected profiles, and no need to share personal details to
                play.
              </p>
              <ShieldCheck />
            </div>
          </div>
        </section>
        <section className="section" id="games">
          <div className="section-top">
            <div>
              <span className="eyebrow">PICK YOUR NEXT OBSESSION</span>
              <h2>
                The arcade<span className="accent-dot">.</span>
              </h2>
            </div>
            <span className="muted">03 GAMES / ALL FREE TO PLAY</span>
          </div>
          <div className="browse">
            <div className="filters">
              {["All games", "Arcade", "Puzzle", "Strategy"].map((f) => (
                <button
                  className={filter === f ? "selected" : ""}
                  onClick={() => setFilter(f)}
                  key={f}
                >
                  {f}
                </button>
              ))}
            </div>
            <label className="search">
              <Search size={16} />
              <input
                aria-label="Search games"
                placeholder="Find your game"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
          </div>
          <div className="game-grid">
            {games
              .filter(
                (g) =>
                  (filter === "All games" || g.kind === filter) &&
                  g.name.toLowerCase().includes(query.toLowerCase()),
              )
              .map((g) => (
                <button className="game-card" key={g.name} onClick={() => launch(g.name)}>
                  <div className={`game-art ${g.class}`}>
                    <span className="game-tag">{g.tag}</span>
                    {g.name === "Snake" ? (
                      <div className="pixel-snake">↳</div>
                    ) : g.name === "Memory" ? (
                      <div className="mini-cards">
                        <span>✦</span>
                        <span>?</span>
                        <span>?</span>
                        <span>◆</span>
                      </div>
                    ) : (
                      <div className="mini-tic">
                        ×<span>○</span>×
                      </div>
                    )}
                    <span className="play-round">
                      <ArrowUpRight size={24} />
                    </span>
                  </div>
                  <div className="game-info">
                    <div>
                      <h3>{g.name}</h3>
                      <p>{g.desc}</p>
                    </div>
                    <span>{g.kind}</span>
                  </div>
                </button>
              ))}
          </div>
          {!games.some(
            (g) =>
              (filter === "All games" || g.kind === filter) &&
              g.name.toLowerCase().includes(query.toLowerCase()),
          ) && <p className="empty">No games found. Try a different search.</p>}
        </section>
        <section className="rally">
          <img src="/images/gaming.jpg" alt="An immersive gaming setup" />
          <div>
            <span className="eyebrow">GOOD GAMES. GREAT COMPANY.</span>
            <h2>
              Made for players.
              <br />
              Not just playtime.
            </h2>
            <p>
              A quick brain break or a proper rivalry.
              <br />
              There’s always room for one more.
            </p>
            <button className="light" onClick={() => setModal(session ? "Profile" : "Sign in")}>
              Find your place <ArrowUpRight size={18} />
            </button>
          </div>
        </section>
        <section className="section" id="tournaments">
          <div className="section-top">
            <div>
              <span className="eyebrow">A LITTLE FRIENDLY COMPETITION</span>
              <h2>Raise the stakes.</h2>
            </div>
            <span className="outlined">DEMO EVENTS</span>
          </div>
          <p className="muted tournament-note">
            A preview of what’s next. These are sample listings, not live competitions; registration
            and prizes are not available.
          </p>
          {[
            {
              day: "21",
              month: "NOV",
              name: "The Snake Sprint",
              game: "Snake",
              format: "High-score challenge",
            },
            {
              day: "28",
              month: "NOV",
              name: "Mind Games Weekend",
              game: "Memory",
              format: "Fewest moves wins",
            },
            {
              day: "05",
              month: "DEC",
              name: "Gridlock Showdown",
              game: "Tic-Tac-Toe",
              format: "Local two-player",
            },
          ].map((t) => (
            <div className="event" key={t.name}>
              <div className="date">
                {t.day}
                <span>{t.month} 2026</span>
              </div>
              <div>
                <span className="eyebrow">
                  {t.game} / {t.format}
                </span>
                <h3>{t.name}</h3>
              </div>
              <span className="event-status">SAMPLE EVENT</span>
              <button aria-label={`View ${t.name}`} onClick={() => setModal(t.name)}>
                <ArrowUpRight />
              </button>
            </div>
          ))}
        </section>
        <section className="section journal" id="journal">
          <div className="section-top">
            <div>
              <span className="eyebrow">FROM THE PLAYFORGE JOURNAL</span>
              <h2>Beyond the game.</h2>
            </div>
            <span className="muted">ORIGINAL EDITORIAL</span>
          </div>
          <div className="articles">
            {articles.map((a, i) => (
              <button
                className="article"
                key={a.title}
                onClick={() => {
                  setArticle(i);
                  setModal("Article");
                }}
              >
                <span className="outlined">{a.tag}</span>
                <h3>{a.title}</h3>
                <div>
                  <span>18 NOV 2026</span>
                  <ArrowUpRight size={20} />
                </div>
              </button>
            ))}
          </div>
        </section>
        <section className="join">
          <div className="join-art" />
          <div className="join-box">
            <span className="eyebrow">YOUR NEXT CHAPTER</span>
            <h2>
              Same you.
              <br />
              New high score.
            </h2>
            <button className="accent" onClick={() => setModal(session ? "Profile" : "Sign in")}>
              {session ? "View your profile" : "Create your player profile"}{" "}
              <ArrowUpRight size={18} />
            </button>
            <p>Save your scores. Keep your progress yours.</p>
          </div>
          <div className="join-art second" />
        </section>
      </main>
      <footer>
        <div className="footer-top">
          <a className="brand" href="/">
            PLAYFORGE®
          </a>
          <p>
            A little escape.
            <br />A lot of possibility.
          </p>
          <div>
            <a href="#games">The arcade</a>
            <a href="#tournaments">Tournaments</a>
            <a href="#journal">The journal</a>
          </div>
          <div>
            <button onClick={() => setModal("Privacy")}>Privacy & safety</button>
            <button onClick={() => setModal(session ? "Profile" : "Sign in")}>
              Player account <ArrowUpRight size={14} />
            </button>
          </div>
        </div>
        <div className="wordmark">
          PLAYFORGE<span>®</span>
        </div>
        <div className="footer-bottom">
          <span>© 2026 PLAYFORGE</span>
          <span>BUILT FOR YOUR NEXT LEVEL.</span>
        </div>
      </footer>
      {modal && (
        <div className="overlay">
          <dialog open
            className="dialog"
            aria-modal="true"
            aria-label={modal}
            onKeyDown={(e) => { if(e.key==='Escape')close(); }}
          >
            <button className="close" aria-label="Close dialog" onClick={close}>
              <X />
            </button>
            {games.some((g) => g.name === modal) ? (
              <>
                <span className="eyebrow">THE PLAYFORGE ARCADE</span>
                <h2>{modal}</h2>
                <Game key={modal} name={modal} onScore={setResult} />
                {result !== null && (
                  <div className="score-save">
                    <p>
                      Your score: <strong>{result}</strong>
                    </p>
                    {session ? (
                      <button
                        disabled={save.isPending || save.isSuccess}
                        onClick={() =>
                          save.mutate({
                            game: modal as "Snake" | "Memory" | "Tic-Tac-Toe",
                            value: result,
                          })
                        }
                      >
                        {save.isPending
                          ? "Saving…"
                          : save.isSuccess
                            ? "Score saved"
                            : "Save to profile"}
                      </button>
                    ) : (
                      <button onClick={() => setModal("Sign in")}>Sign in to save scores</button>
                    )}
                    {save.isError && <p className="error">Could not save. Please try again.</p>}
                  </div>
                )}
              </>
            ) : modal === "Sign in" ? (
              <Auth />
            ) : modal === "Profile" ? (
              <Profile />
            ) : modal === "Article" && article !== null ? (
              <>
                <span className="eyebrow">{articles[article].tag} / ORIGINAL EDITORIAL</span>
                <h2>{articles[article].title}</h2>
                <p className="article-body">{articles[article].body}</p>
              </>
            ) : modal === "Privacy" ? (
              <>
                <ShieldCheck />
                <h2>
                  Your play.
                  <br />
                  Your privacy.
                </h2>
                <p className="article-body">
                  You can play without an account. If you create one, we store your name, email,
                  protected password credentials and any scores you choose to save. Your profile and
                  score history are accessible only after authentication. Personal scores are
                  browser-reported, not verified competition results. Use a unique password of at
                  least 10 characters. Never share account credentials. Platform analytics may
                  record usage events. This first version has no live tournament entries, purchases
                  or prize payouts.
                </p>
              </>
            ) : (
              <>
                <span className="eyebrow">SAMPLE TOURNAMENT / 2026</span>
                <h2>{modal}</h2>
                <p className="article-body">
                  This event is a demonstration of the tournament listing experience. No
                  registration is open and no prizes are offered. You can practice the game in the
                  arcade now.
                </p>
                <button
                  className="accent"
                  onClick={() =>
                    launch(
                      modal.includes("Snake")
                        ? "Snake"
                        : modal.includes("Mind")
                          ? "Memory"
                          : "Tic-Tac-Toe",
                    )
                  }
                >
                  Play a practice round <ArrowRight size={18} />
                </button>
              </>
            )}
          </dialog>
        </div>
      )}
    </>
  );
}
function Auth() {
  const [up, setUp] = useState(false),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [name, setName] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const { data: session } = authClient.useSession();
  if (session) return <Profile />;
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const r = up
        ? await authClient.signUp.email({ name, email, password })
        : await authClient.signIn.email({ email, password });
      if (r.error) setError(r.error.message || "Sign-in failed.");
    } catch {
      setError("Unable to connect. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <span className="eyebrow">WELCOME TO YOUR NEXT LEVEL</span>
      <h2>{up ? "Make it yours." : "Welcome back."}</h2>
      <p className="muted">Your games. Your progress. Your own space.</p>
      <div className="auth-tabs">
        <button className={!up ? "selected" : ""} onClick={() => setUp(false)}>
          Sign in
        </button>
        <button className={up ? "selected" : ""} onClick={() => setUp(true)}>
          Create account
        </button>
      </div>
      <button
        className="google"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          setError("");
          try {
            const r = await authClient.managedAuth.signIn({ provider: "google" });
            if (r.error) setError(r.error.message || "Google sign-in failed");
          } catch {
            setError("Google sign-in could not complete.");
          } finally {
            setBusy(false);
          }
        }}
      >
        Continue with Google <ArrowUpRight size={16} />
      </button>
      <div className="or">OR USE EMAIL</div>
      <form onSubmit={submit}>
        {up && (
          <label>
            Player name
            <input
              required
              maxLength={40}
                aria-label="Player name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
        )}
        <label>
          Email
          <input
            type="email"
              aria-label="Email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Password
          <input
            type="password"
              aria-label="Password"
            minLength={10}
            required
            autoComplete={up ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <p className="muted">Use at least 10 characters.</p>
        {error && <p className="error">{error}</p>}
        <button className="accent" disabled={busy}>
          {busy ? "Connecting…" : up ? "Create your account" : "Sign in"}
          <ArrowRight size={18} />
        </button>
      </form>
    </>
  );
}
function Profile() {
  const profile = useProfile();
  const { data: session } = authClient.useSession();
  const qc = useQueryClient();
  if (!session) return <Auth />;
  if (profile.isLoading) return <p>Loading your profile…</p>;
  if (profile.isError)
    return <p className="error">Could not load your profile. Sign in again or try later.</p>;
  return (
    <>
      <span className="eyebrow">YOUR PLAYER SPACE</span>
      <h2>{profile.data?.user.name}</h2>
      <p className="muted">{profile.data?.user.email}</p>
      <h3>Personal score history</h3>
      <p className="muted">Browser-reported scores, not tournament rankings.</p>
      <div className="score-list">
        {profile.data?.scores.length ? (
          profile.data.scores.map((s) => (
            <div key={s.id}>
              <span>{s.game}</span>
              <strong>{s.value}</strong>
              <span>{new Date(s.createdAt).toLocaleDateString()}</span>
            </div>
          ))
        ) : (
          <p>No scores yet. Play a game and save your result.</p>
        )}
      </div>
      <button
        onClick={async () => {
          await authClient.signOut();
          qc.clear();
        }}
      >
        Sign out
      </button>
    </>
  );
}
