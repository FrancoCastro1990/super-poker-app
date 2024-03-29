import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Game } from "./page/Game";
import { Home } from "./page/Home";

export const AppRouter = () => {
  return (
    <main className="flex min-h-screen flex-col items-center p-4 bg-slate-900 text-slate-500 ">
      <Router>
        <Routes>
          <Route path="/game/:gameId" Component={Game}></Route>
          <Route path="/" Component={Home}></Route>
          <Route path="*" Component={Home}></Route>
        </Routes>
      </Router>
    </main>
  );
};
