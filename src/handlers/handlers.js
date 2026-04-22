import { http, HttpResponse, delay } from "msw";

const INITIAL_CARDS = [
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

const INITIAL_EVENTS = [
  { id: "e1", sport: "Football", team1: "FC Porto", team1: "Benfica", prediction: "FC Porto wins", date: "15/03/2026", status: "won" },
  { id: "e2", sport: "Football", team2: "Sporting", team2: "Braga", prediction: "Over 2.5 goals", date: "16/03/2026", status: "pending" }
];


const getCardsDB = () => {
  try {
    const data = localStorage.getItem("bingo_db_cards");
    const parsed = data ? JSON.parse(data) : INITIAL_CARDS;
    return Array.isArray(parsed) ? parsed : INITIAL_CARDS;
  } catch (e) {
    return INITIAL_CARDS;
  }
};

const saveCardsDB = (data) => localStorage.setItem("bingo_db_cards", JSON.stringify(data));

const getEventsDB = () => {
  try {
    const data = localStorage.getItem("bingo_db_events");
    const parsed = data ? JSON.parse(data) : INITIAL_EVENTS;
    return Array.isArray(parsed) ? parsed : INITIAL_EVENTS;
  } catch (e) {
    return INITIAL_EVENTS;
  }
};

const saveEventsDB = (data) => localStorage.setItem("bingo_db_events", JSON.stringify(data));


export const handlers = [
  
  // LOGIN
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

  http.get("/api/cards", async () => {
    await delay(800);
    return HttpResponse.json(getCardsDB());
  }),

  http.get("/api/cards/:id", async ({ params }) => {
    const { id } = params;
    const db = getCardsDB();
    const card = db.find((c) => c.id === id);
    if (!card) return new HttpResponse(null, { status: 404 });
    return HttpResponse.json(card);
  }),

  http.get("/api/admin/events", async () => {
    await delay(500);
    return HttpResponse.json(getEventsDB());
  }),

  http.post("/api/admin/events", async ({ request }) => {
    const eventData = await request.json();
    const db = getEventsDB();
    
    const newEvent = {
      id: crypto.randomUUID(),
      ...eventData,
      status: "pending"
    };
    
    db.push(newEvent);
    saveEventsDB(db);
    
    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.delete("/api/admin/events/:id", async ({ params }) => {
    const { id } = params;
    const db = getEventsDB(); 

    const filteredDB = db.filter(event => event.id !== id);

    if (db.length !== filteredDB.length) {
      saveEventsDB(filteredDB);
      return new HttpResponse(null, { status: 204 });
    }

    return new HttpResponse(
        JSON.stringify({ message: "Event Not Found" }), 
        { status: 404 }
    );
  }),

  http.post("/api/admin/cards/add-event", async ({ request }) => {
    const { cardId, eventData } = await request.json();
    const db = getCardsDB();
    
    const cardIndex = db.findIndex(c => c.id === cardId);
    
    if (cardIndex !== -1) {
      const eventToLink = {
        id: eventData.id || crypto.randomUUID(),
        ...eventData,
        status: eventData.status || "pending"
      };
      
      db[cardIndex].events.push(eventToLink);
      saveCardsDB(db);
      
      return HttpResponse.json(eventToLink, { status: 201 });
    }
    
    return new HttpResponse("Card not found", { status: 404 });
  })
];