import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Home = () => {
  const navigate = useNavigate();
  const [inputGameId, setInputGameId] = useState("");
  const [showInputIdGame, setShowInputIdGame] = useState(false);
  const createGame = () => {
    fetch("https://poker-api-dev-kjsc.4.us-1.fl0.io/createGame", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const { name } = data.game;
        navigate(`/game/${name}`);
        //console.log(data);
      });
  };

  const findGame = () => {
    fetch(`https://poker-api-dev-kjsc.4.us-1.fl0.io/game/${inputGameId}`)
      .then((res) => res.json())
      .then((data) => {
        const { name } = data.game;
        if (!name) {
          alert("no existe el juego");
          return;
        }
        navigate(`/game/${inputGameId}`);
      });
  };

  return (
    <section>
      <h1>Planning Poker c:</h1>
      <div className="flex flex-col w-[320px]">
        <button
          onClick={createGame}
          className="transition-all duration-200 ease-in-out box-border rounded-md py-1 px-2 my-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 border-emerald-200 text-white border-2 hover:bg-emerald-900 active:rotate-2"
        >
          Create a Game
        </button>
        {!showInputIdGame ? (
          <button
            onClick={() => setShowInputIdGame(true)}
            className="transition-all duration-200 ease-in-out box-border rounded-md py-1 px-2 my-2 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-200 border-emerald-200 text-white border-2 hover:bg-emerald-900 active:rotate-2"
          >
            Join a Game
          </button>
        ) : (
          <div className="flex flex-col w-[320px]">
            <input
              type="text"
              onChange={(e) => setInputGameId(e.target.value)}
            />
            <button
              onClick={findGame}
              className="transition-all duration-200 ease-in-out box-border rounded-md py-1 px-2 my-2 appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-200 border-emerald-200 text-white border-2 hover:bg-emerald-900"
            >
              Enter the Game ID to join
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
