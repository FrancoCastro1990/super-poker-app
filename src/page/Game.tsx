import { useRef, useState, useEffect } from "react";
import { Card } from "../components/Card";
//import { socket } from "../main";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
//const socket = io("http://localhost:8080");
const socket = io("https://poker-api-dev-kjsc.4.us-1.fl0.io");

interface CardGame {
  selectedCard: number | null;
  player: string;
}

export const Game = () => {
  const { gameId } = useParams();
  const cards = useRef([0.5, 1, 2, 3, 5, 8, 13, 21, 34]);
  const [userName, setUserName] = useState("");
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [newUser, setNewUser] = useState("");

  const [playerSelectedCard, setPlayerSelectedCard] = useState<CardGame[]>([]);
  const [showVotes, setShowVotes] = useState(false);

  useEffect(() => {
    window.addEventListener("beforeunload", () => {
      // sessionStorage.removeItem("userName");
      // socket.emit("removeUser", { name: userName });
    });
  }, [userName]);

  const handleIsSelected = (value: number) => {
    setSelectedCard(value);
    socket.emit("message", { selectedCard: value, player: userName });
  };

  const getAverage = () => {
    let sum = 0;
    const filtered = playerSelectedCard.filter(
      (element) => element.selectedCard !== null
    );
    filtered.forEach((element) => {
      if (element.selectedCard) sum += element.selectedCard;
    });
    return filtered.length > 0 ? (sum / filtered.length).toFixed(1) : 0;
  };

  useEffect(() => {
    const localUsername = sessionStorage.getItem("userName");
    if (localUsername) {
      setUserName(localUsername);
    }
  }, [userName]);

  useEffect(() => {
    fetch("https://poker-api-dev-kjsc.4.us-1.fl0.io/cards")
      .then((res) => res.json())
      .then((data) => setPlayerSelectedCard(data.cards));
  }, []);

  useEffect(() => {
    fetch("https://poker-api-dev-kjsc.4.us-1.fl0.io/showVotes")
      .then((res) => res.json())
      .then((data) => setShowVotes(data.showVotes));
  }, []);

  useEffect(() => {
    socket.on("message", (data) => {
      console.log(data);
      setPlayerSelectedCard(data);
    });
  }, []);

  useEffect(() => {
    socket.on("showVotes", (data) => {
      console.log(data);
      setShowVotes(data);
    });
  }, []);
  useEffect(() => {
    socket.on("clearAllVotes", () => {
      console.log("clearAllVotes");
      setSelectedCard(null);
    });
  }, []);

  const clearVotes = () => {
    socket.emit("clearAllVotes");
    socket.emit("showVotes", false);
  };

  const onShowVotes = () => {
    socket.emit("showVotes", !showVotes);
  };

  const onSubmit = () => {
    console.log(newUser);
    sessionStorage.setItem("userName", newUser);
    socket.emit("message", { selectedCard: null, player: newUser });
    setUserName(newUser);
  };

  if (!userName)
    return (
      <div>
        <input
          name="name"
          className="transition-all duration-200 ease-in-out box-border appearance-none mr-4 p-1 border-4 border-emerald-200 rounded-md focus:outline-none"
          type="text"
          //value={newUser}
          onChange={(e) => {
            if (e.target.value.length > 10)
              e.target.value = e.target.value.slice(0, 10);
            setNewUser(e.target.value);
          }}
        />
        <button
          onClick={onSubmit}
          className="transition-all duration-200 ease-in-out box-border rounded-md py-1 px-4 my-4 appearance-none focus:outline-none focus:bg-emerald-900 border-emerald-200 text-white border-4 hover:bg-emerald-900 active:rotate-2"
        >
          Enter your name
        </button>
      </div>
    );

  return (
    <>
      <div className="flex center mb-4">
        <h2 className="text-2xl text-slate-100 font-bold self-end">
          Game: {gameId}
        </h2>
        <svg
          width="32px"
          height="32px"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g id="SVGRepo_bgCarrier"></g>
          <g id="SVGRepo_tracerCarrier"></g>
          <g id="SVGRepo_iconCarrier">
            <path
              d="M19.5 16.5L19.5 4.5L18.75 3.75H9L8.25 4.5L8.25 7.5L5.25 7.5L4.5 8.25V20.25L5.25 21H15L15.75 20.25V17.25H18.75L19.5 16.5ZM15.75 15.75L15.75 8.25L15 7.5L9.75 7.5V5.25L18 5.25V15.75H15.75ZM6 9L14.25 9L14.25 19.5L6 19.5L6 9Z"
              fill="#a7f3d0"
            ></path>
          </g>
        </svg>
      </div>

      <section className="flex gap-1 flex-wrap justify-center">
        {cards.current.map((card, index) => (
          <Card
            key={index}
            value={card}
            handleIsSelected={handleIsSelected}
            isSelect={selectedCard === card}
          />
        ))}
      </section>

      <section className="box-border bg-slate-300  max-w-[400px] w-full rounded-lg border-4 border-grey-200 my-4">
        <table className="table-fixed bg-slate-300 w-full rounded overflow-hidden">
          <thead className="rounded-t-lg">
            <tr className="border-b-4 bg-slate-500 rounded-t-lg">
              <th className="py-4 w-4/3 text-white rounded-tl-sm">Players</th>
              <th className="py-4 w-1/3 text-white rounded-tr-sm">Cards</th>
            </tr>
          </thead>
          <tbody>
            {showVotes
              ? playerSelectedCard
                  .sort((a, b) => {
                    if (a.selectedCard === null || b.selectedCard === null) {
                      return 0;
                    }
                    return a.selectedCard - b.selectedCard;
                  })
                  .map((card, index) => (
                    <tr key={index} className="border-b-4">
                      <td
                        className={`${
                          card.player === userName && "font-bold"
                        } pl-4`}
                      >
                        {card.player}
                      </td>
                      <td className="grid place-items-center py-1">
                        <div
                          className={`rounded-lg text-2xl w-12 h-16 bg-white text-black box-border flex justify-center items-center shadow-md border-4 select-none ${
                            card.player === userName
                              ? "border-emerald-200 "
                              : "border-grey-200"
                          }`}
                        >
                          {card.selectedCard ? card.selectedCard : "..."}
                        </div>
                      </td>
                    </tr>
                  ))
              : playerSelectedCard.map((card, index) => (
                  <tr key={index} className="border-b-4">
                    <td
                      className={`${
                        card.player === userName && "font-bold"
                      } pl-4`}
                    >
                      {card.player}
                    </td>
                    <td className="grid place-items-center py-1">
                      <div
                        className={`rounded-lg text-2xl w-12 h-16 bg-slate-500 text-black box-border flex justify-center items-center shadow-md border-4 select-none ${
                          card.player === userName
                            ? "border-emerald-200 "
                            : "border-slate-200"
                        } ${card.selectedCard === null && ""}
                        `}
                      >
                        {card.selectedCard === null ? (
                          <svg
                            width="64px"
                            height="64px"
                            viewBox="0 0 1024 1024"
                            className="animate-pulse"
                            version="1.1"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#a7f3d0"
                          >
                            <g id="SVGRepo_bgCarrier"></g>
                            <g id="SVGRepo_tracerCarrier"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M292.6 513m-54.9 0a54.9 54.9 0 1 0 109.8 0 54.9 54.9 0 1 0-109.8 0Z"
                                fill="#a7f3d0"
                              ></path>
                              <path
                                d="M512 513m-54.9 0a54.9 54.9 0 1 0 109.8 0 54.9 54.9 0 1 0-109.8 0Z"
                                fill="#a7f3d0"
                              ></path>
                              <path
                                d="M731.4 513m-54.9 0a54.9 54.9 0 1 0 109.8 0 54.9 54.9 0 1 0-109.8 0Z"
                                fill="#a7f3d0"
                              ></path>
                            </g>
                          </svg>
                        ) : (
                          <svg
                            width="64px"
                            height="64px"
                            className="animate-fade-in"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            stroke="#a7f3d0"
                          >
                            <g id="SVGRepo_bgCarrier"></g>
                            <g id="SVGRepo_tracerCarrier"></g>
                            <g id="SVGRepo_iconCarrier">
                              <path
                                d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                stroke="#a7f3d0"
                              ></path>
                              <path
                                d="M9 12L10.6828 13.6828V13.6828C10.858 13.858 11.142 13.858 11.3172 13.6828V13.6828L15 10"
                                stroke="#a7f3d0"
                              ></path>
                            </g>
                          </svg>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
            <tr className="border-t-4">
              <td className="font-bold py-4 pl-4">Average</td>
              <td className="font-bold py-4 grid place-items-center">
                {showVotes ? (
                  <div className="animate-fade-in">{getAverage()}</div>
                ) : (
                  "..."
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <section className="flex max-w-[400px] w-full justify-end">
        <button
          className="transition-all duration-200 ease-in-out box-border rounded-md py-1 px-4 appearance-none focus:outline-none focus:bg-emerald-900 border-emerald-200 text-white border-4 hover:bg-emerald-900 active:rotate-2"
          onClick={onShowVotes}
        >
          {showVotes ? "Hidden" : "Show"}
        </button>
        <button
          className="transition-all duration-200 ease-in-out box-border rounded-md py-1 px-4 ml-4 appearance-none focus:outline-none focus:bg-red-950 text-white border-4 border-red-500 hover:bg-red-950 active:rotate-2"
          onClick={clearVotes}
        >
          Clean
        </button>
      </section>
    </>
  );
};
