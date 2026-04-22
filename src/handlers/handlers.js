// src/mocks/handlers.js
import { http, HttpResponse, delay } from "msw";

const INITIAL_DATA = [
  {
    id: "1",
    title: "Champions League Final",
    size: "3x3",
    prizePerLine: "€50",
    fullPrize: "€500",
    isPurchased: true,
    date: "10/03/2026",
    events: [
      { id: "e1", sport: "Football", team1: "FC Porto", team2: "Benfica", prediction: "FC Porto wins", date: "15/03/2026", status: "won" },
      { id: "e2", sport: "Football", team1: "Sporting", team2: "Braga", prediction: "Over 2.5 goals", date: "16/03/2026", status: "pending" },
    ]
  },
  {
    id: "2",
    title: "Multi-Sport Special",
    size: "4x4",
    prizePerLine: "€100",
    fullPrize: "€2000",
    isPurchased: true,
    date: "11/03/2026",
    events: []
  },
  {
    id: "3",
    title: "European Football Bonanza",
    size: "5x5",
    prizePerLine: "€200",
    fullPrize: "€5000",
    isPurchased: false,
    date: "12/03/2026",
    events: []
  }
];

const getDB = () => {
  const data = localStorage.getItem("bingo_db");
  return data ? JSON.parse(data) : INITIAL_DATA;
};

const saveDB = (data) => {
  localStorage.setItem("bingo_db", JSON.stringify(data));
};

export const handlers = [
  
  http.get("/api/cards", async () => {
    await delay(800);
    return HttpResponse.json(getDB());
  }),

  http.get("/api/cards/:id", async ({ params }) => {
    const { id } = params;
    const db = getDB();
    const card = db.find((c) => c.id === id);
    if (!card) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(card);
  }),

  http.post("/api/login", async ({ request }) => {
    const { username, password } = await request.json();
    await delay(1000); 

    if (username === "userTest" && password === "user123") {
      return HttpResponse.json({ id: "u-1", username: "userTest", role: "user", balance: 1000 });
    }

    if (username === "admin" && password === "admin123") {
      return HttpResponse.json({ id: "a-1", username: "admin", role: "admin", balance: 999999 });
    }

    return new HttpResponse(
      JSON.stringify({ message: "Credenciais inválidas." }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }),

  http.post("/api/admin/events", async ({ request }) => {
    const { cardId, eventData } = await request.json();
    const db = getDB();
    
    const cardIndex = db.findIndex(c => c.id === cardId);
    
    if (cardIndex !== -1) {
      const newEvent = {
        id: crypto.randomUUID(), // gerar id unico
        ...eventData,
        status: "pending"
      };
      
      db[cardIndex].events.push(newEvent);
      saveDB(db);
      
      return HttpResponse.json(newEvent, { status: 201 });
    }
    
    return new HttpResponse("Card not found", { status: 404 });
  })
];