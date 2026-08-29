import { useMemo, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar.jsx";
import Topbar from "../../components/Topbar/Topbar.jsx";
import Footer from "../../components/Footer/Footer";
import "./BemEstar.css";

const moods = [
  { emoji: "😊", label: "Muito bem", value: "muito-bem" },
  { emoji: "🙂", label: "Bem", value: "bem" },
  { emoji: "😐", label: "Mais ou menos", value: "mais-ou-menos" },
  { emoji: "🙁", label: "Mal", value: "mal" },
  { emoji: "😣", label: "Muito mal", value: "muito-mal" },
];

const discomfortOptions = [
  "Barulho",
  "Luz",
  "Ansiedade",
  "Irritação",
  "Cansaço",
  "Tristeza",
  "Dor",
  "Não sei",
];

const recentDays = [
  ["Seg", "🙂"],
  ["Ter", "😊"],
  ["Qua", "😐"],
  ["Qui", "🙂"],
  ["Sex", "🙂"],
];

function BemEstar({
  userName = "Lucas",
  onLogout,
}) {
  const [selectedMood, setSelectedMood] = useState("bem");
  const [selectedDiscomforts, setSelectedDiscomforts] = useState([]);
  const [energy, setEnergy] = useState(3);
  const [note, setNote] = useState("");
  const [saved, setSaved] = useState(false);

  const selectedMoodData = useMemo(
    () => moods.find((item) => item.value === selectedMood),
    [selectedMood],
  );

  function toggleDiscomfort(option) {
    setSaved(false);

    setSelectedDiscomforts((current) =>
      current.includes(option)
        ? current.filter((item) => item !== option)
        : [...current, option],
    );
  }

  function saveWellbeing(event) {
    event.preventDefault();
    setSaved(true);
  }

  return (
    <div className="caretea-dashboard bem-estar-page">
      <Sidebar
        hideExames
        accountType="autista"
        autismLevel={1}
     />

      <div className="bem-estar-content">
      <main className="bem-estar-main">
        <Topbar
          title={`Olá, ${userName}! 👋`}
          subtitle="Este espaço é seu. Registre como você está se sentindo hoje."
          userName={userName}
          userLevel="Nível 1 · Autonomia"
          notifications={2}
          onLogout={onLogout}
        />

        <section className="bem-estar-hero">
          <div>
            <span>Seu bem-estar</span>
            <h1>Como você está hoje?</h1>
            <p>
              Não existe resposta certa. Escolha o que mais combina com o seu momento.
            </p>
          </div>

          <div className="bem-estar-current">
            <small>Agora</small>
            <strong>{selectedMoodData?.emoji}</strong>
            <span>{selectedMoodData?.label}</span>
          </div>
        </section>

        <form className="bem-estar-form" onSubmit={saveWellbeing}>
          <section className="bem-estar-card">
            <header>
              <div className="bem-estar-step">1</div>
              <div>
                <h2>Como está seu humor?</h2>
                <p>Toque na opção que representa melhor como você se sente.</p>
              </div>
            </header>

            <div className="bem-estar-moods">
              {moods.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  className={selectedMood === mood.value ? "selected" : ""}
                  onClick={() => {
                    setSelectedMood(mood.value);
                    setSaved(false);
                  }}
                >
                  <span>{mood.emoji}</span>
                  <strong>{mood.label}</strong>
                </button>
              ))}
            </div>
          </section>

          <section className="bem-estar-card">
            <header>
              <div className="bem-estar-step">2</div>
              <div>
                <h2>Tem alguma coisa te incomodando?</h2>
                <p>Você pode escolher mais de uma opção ou nenhuma.</p>
              </div>
            </header>

            <div className="bem-estar-tags">
              {discomfortOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={
                    selectedDiscomforts.includes(option) ? "selected" : ""
                  }
                  onClick={() => toggleDiscomfort(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </section>

          <section className="bem-estar-card bem-estar-energy-card">
            <header>
              <div className="bem-estar-step">3</div>
              <div>
                <h2>Como está sua energia?</h2>
                <p>De pouca energia até muita energia.</p>
              </div>
            </header>

            <div className="bem-estar-energy">
              <span>Pouca</span>

              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  className={energy === value ? "selected" : ""}
                  onClick={() => {
                    setEnergy(value);
                    setSaved(false);
                  }}
                  aria-label={`Energia ${value} de 5`}
                >
                  {value}
                </button>
              ))}

              <span>Muita</span>
            </div>
          </section>

          <section className="bem-estar-card">
            <header>
              <div className="bem-estar-step">4</div>
              <div>
                <h2>Quer contar alguma coisa?</h2>
                <p>Este campo é opcional. Escreva do seu jeito.</p>
              </div>
            </header>

            <textarea
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                setSaved(false);
              }}
              placeholder="Ex.: Hoje fiquei cansado depois da aula, mas agora estou melhor..."
              maxLength={500}
            />

            <small className="bem-estar-counter">{note.length}/500</small>
          </section>

          <button className="bem-estar-save" type="submit">
            Salvar como estou me sentindo
          </button>

          {saved && (
            <div className="bem-estar-saved" role="status">
              <span>✓</span>
              <div>
                <strong>Seu registro foi salvo.</strong>
                <p>
                  Humor: {selectedMoodData?.label}
                  {selectedDiscomforts.length
                    ? ` · Incômodos: ${selectedDiscomforts.join(", ")}`
                    : ""}
                  {" · "}Energia: {energy}/5
                </p>
              </div>
            </div>
          )}
        </form>

        <section className="bem-estar-history">
          <header>
            <div>
              <span>Histórico recente</span>
              <h2>Como foram seus últimos dias</h2>
            </div>

            <button type="button">Ver histórico completo</button>
          </header>

          <div className="bem-estar-days">
            {recentDays.map(([day, emoji]) => (
              <article key={day}>
                <span>{emoji}</span>
                <strong>{day}</strong>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      </div>
    </div>
  );
}

export default BemEstar;
