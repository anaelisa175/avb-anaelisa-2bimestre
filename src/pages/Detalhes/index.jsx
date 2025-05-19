import axios from "axios";
import { useEffect, useState } from "react";

export default function Detalhes() {
  const [perguntas, setPerguntas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    axios
      .get("https://opentdb.com/api.php?amount=10")
      .then((res) => {
        setPerguntas(res.data.results);
        setCarregando(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar perguntas:", err);
        setCarregando(false);
      });
  }, []);

  return (
    <div className="quiz-container">
      <h1 className="quiz-title">Quiz de Conhecimentos Gerais</h1>
      
      {carregando ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Carregando perguntas...</p>
        </div>
      ) : (
        <div className="questions-grid">
          {perguntas.map((pergunta, index) => (
            <div className="question-card" key={index}>
              <h3 className="question-text" dangerouslySetInnerHTML={{ __html: pergunta.question }} />
              
              <div className="question-meta">
                <span className="meta-item">
                  <strong>Categoria:</strong> {pergunta.category}
                </span>
                <span className="meta-item">
                  <strong>Dificuldade:</strong> 
                  <span className={`difficulty ${pergunta.difficulty}`}>
                    {pergunta.difficulty}
                  </span>
                </span>
              </div>
              
              <div className="answers-section">
                <h4>Respostas:</h4>
                <ul className="answers-list">
                  {[...pergunta.incorrect_answers, pergunta.correct_answer]
                    .sort(() => Math.random() - 0.5)
                    .map((resposta, i) => (
                      <li 
                        key={i} 
                        className={`answer ${resposta === pergunta.correct_answer ? 'correct' : ''}`}
                        dangerouslySetInnerHTML={{ __html: resposta }}
                      />
                    ))}
                </ul>
              </div>
              
              <div className="correct-answer">
                <strong>Resposta correta:</strong> 
                <span dangerouslySetInnerHTML={{ __html: pergunta.correct_answer }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}