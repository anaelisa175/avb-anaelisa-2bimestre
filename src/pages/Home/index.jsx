import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Confetti from 'react-confetti';

const prizeLevels = [
  100, 200, 300, 500, 1000,
  2000, 4000, 8000, 16000, 32000,
  64000, 125000, 250000, 500000, 1000000
];

const MillionaireQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await axios.get('https://opentdb.com/api.php?amount=15&type=multiple&encode=base64');
      const data = response.data.results.map((q) => {
        const allAnswers = [...q.incorrect_answers, q.correct_answer];
        // Embaralhar respostas
        const shuffledAnswers = allAnswers.sort(() => Math.random() - 0.5);

        return {
          question: atob(q.question),
          correct_answer: atob(q.correct_answer),
          all_answers: shuffledAnswers.map(ans => atob(ans)),
        };
      });
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
    setTimeout(() => {
      if (answer === questions[currentQuestionIndex].correct_answer) {
        if (currentQuestionIndex + 1 === questions.length) {
          setShowConfetti(true);
        } else {
          setCurrentQuestionIndex((prev) => prev + 1);
          setSelectedAnswer(null);
        }
      } else {
        alert("Resposta incorreta! Jogo encerrado.");
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
      }
    }, 1500);
  };

  if (questions.length === 0) return <div>Carregando perguntas...</div>;

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="millionaire-container">
      {showConfetti && <Confetti />}

      {/* Barra superior */}
      <div className="top-bar">
        <div className="current-prize">
          <span className="prize-label">PRÊMIO ATUAL:</span>
          <span className="prize-amount">
            R$ {prizeLevels[currentQuestionIndex].toLocaleString('pt-BR')}
          </span>
        </div>
        <div className="question-counter">
          PERGUNTA {currentQuestionIndex + 1} DE {questions.length}
        </div>
      </div>

      {/* Pergunta */}
      <div className="question-area">
        <div className="question-box">
          <h2 className="question-text" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
        </div>
      </div>

      {/* Respostas */}
      <div className="answers-grid">
        {currentQuestion.all_answers.map((answer, index) => (
          <div 
            key={index}
            className={`answer-option ${selectedAnswer ? 
              (answer === currentQuestion.correct_answer ? 'correct' : 
               (selectedAnswer === answer ? 'wrong' : '')) : ''}`}
            onClick={() => !selectedAnswer && handleAnswerSelect(answer)}
          >
            <span className="option-letter">{String.fromCharCode(65 + index)}</span>
            <span className="option-text" dangerouslySetInnerHTML={{ __html: answer }} />
          </div>
        ))}
      </div>

      {/* Escada de prêmios */}
      <div className="prize-ladder">
        {prizeLevels.map((prize, index) => (
          <div 
            key={prize}
            className={`prize-level ${
              index === currentQuestionIndex ? 'current' : ''
            } ${
              index < currentQuestionIndex ? 'passed' : ''
            }`}
          >
            <span className="level-number">{index + 1}.</span>
            <span className="level-amount">R$ {prize.toLocaleString('pt-BR')}</span>
          </div>
        ))}
      </div>

      {/* CSS embutido */}
      <style jsx>{`
        .millionaire-container {
          font-family: 'Montserrat', sans-serif;
          background: linear-gradient(135deg, #0a0a2a, #1a1a4a);
          color: #ffffff; /* Cor mais legível */
          min-height: 100vh;
          padding: 0;
          max-width: 100%;
          overflow-x: hidden;
        }

        .top-bar {
          background: rgba(0, 0, 0, 0.7);
          padding: 15px 30px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 2px solid #f8d64e;
        }

        .current-prize {
          display: flex;
          flex-direction: column;
        }

        .prize-label {
          font-size: 14px;
          color: #f8d64e;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .prize-amount {
          font-size: 28px;
          font-weight: bold;
          color: #ffffff;
          text-shadow: 0 0 10px rgba(248, 214, 78, 0.5); /* Efeito de brilho */
        }

        .question-counter {
          background: #f8d64e;
          color: #1a1a4a;
          padding: 8px 15px;
          border-radius: 20px;
          font-weight: bold;
          font-size: 14px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        }

        .question-area {
          padding: 40px 30px;
          display: flex;
          justify-content: center;
        }

        .question-box {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(248, 214, 78, 0.3);
          border-radius: 10px;
          padding: 30px;
          max-width: 800px;
          width: 100%;
          backdrop-filter: blur(5px);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }

        .question-text {
          font-size: 24px;
          line-height: 1.5;
          text-align: center;
          margin: 0;
          font-weight: 500;
          color: #ffffff; /* Garantindo contraste */
        }

        .answers-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          padding: 0 30px 40px;
          max-width: 1000px;
          margin: 0 auto;
        }

        .answer-option {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          padding: 20px 20px 20px 60px;
          position: relative;
          cursor: pointer;
          transition: all 0.3s ease;
          min-height: 80px;
          display: flex;
          align-items: center;
        }

        .answer-option:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-3px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }

        .answer-option.correct {
          background: rgba(40, 167, 69, 0.3);
          border-color: #28a745;
          animation: pulse-correct 0.5s;
        }

        .answer-option.wrong {
          background: rgba(220, 53, 69, 0.3);
          border-color: #dc3545;
          animation: pulse-wrong 0.5s;
        }

        .option-letter {
          position: absolute;
          left: 20px;
          top: 50%;
          transform: translateY(-50%);
          width: 36px;
          height: 36px;
          background: #f8d64e;
          color: #1a1a4a;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 18px;
        }

        .answer-option.correct .option-letter {
          background: #28a745;
          color: white;
        }

        .answer-option.wrong .option-letter {
          background: #dc3545;
          color: white;
        }

        .option-text {
          font-size: 18px;
          line-height: 1.4;
          color: #ffffff; /* Texto branco para melhor contraste */
        }

        .prize-ladder {
          background: rgba(0, 0, 0, 0.5);
          padding: 20px;
          margin: 0 30px 30px;
          border-radius: 10px;
          max-width: 1000px;
          margin-left: auto;
          margin-right: auto;
        }

        .prize-level {
          padding: 12px 20px;
          margin: 5px 0;
          border-radius: 5px;
          display: flex;
          justify-content: space-between;
          transition: all 0.3s;
        }

        .prize-level.passed {
          background: rgba(40, 167, 69, 0.2);
          color: #28a745;
        }

        .prize-level.current {
          background: rgba(248, 214, 78, 0.3);
          color: #f8d64e;
          font-weight: bold;
          transform: scale(1.02);
          border-left: 4px solid #f8d64e;
        }

        .level-number {
          font-weight: bold;
        }

        .level-amount {
          font-weight: bold;
        }

        @keyframes pulse-correct {
          0% { transform: scale(1); }
          50% { transform: scale(1.03); }
          100% { transform: scale(1); }
        }

        @keyframes pulse-wrong {
          0% { transform: scale(1); }
          50% { transform: scale(0.97); }
          100% { transform: scale(1); }
        }

        @media (max-width: 768px) {
          .answers-grid {
            grid-template-columns: 1fr;
          }

          .question-text {
            font-size: 20px;
          }

          .option-text {
            font-size: 16px;
          }
        }
          .game-title {
  text-align: center;
  padding: 20px 0;
  background: linear-gradient(to right, #f8d64e, #e6b400);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 10px;
}

.game-title h1 {
  font-size: 3rem;
  margin: 0;
  font-weight: 800;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  font-size: 1.2rem;
  color: #f8d64e;
  margin: 5px 0 0;
  font-weight: 600;
}
      `}</style>
    </div>
  );
};

export default MillionaireQuiz;