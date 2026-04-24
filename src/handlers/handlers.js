import { http, HttpResponse, delay } from "msw";

const INITIAL_EVENTS = [
  {
    id: "e1",
    sport: "Football",
    team1: "FC Porto",
    team2: "Benfica",
    prediction: "Benfica wins",
    date: "2026-04-25 20:00",
    status: "won",
  },
  {
    id: "e2",
    sport: "Football",
    team1: "Sporting",
    team2: "Braga",
    prediction: "Over 2.5 goals",
    date: "2026-04-26 18:00",
    status: "pending",
  },
  {
    id: "e3",
    sport: "Basketball",
    team1: "Lakers",
    team2: "Warriors",
    prediction: "Home wins",
    date: "2026-04-27 02:00",
    status: "pending",
  },
  {
    id: "e4",
    sport: "Football",
    team1: "Real Madrid",
    team2: "Barcelona",
    prediction: "Both teams score",
    date: "2026-04-25 21:00",
    status: "pending",
  },
  {
    id: "e5",
    sport: "Tennis",
    team1: "Alcaraz",
    team2: "Sinner",
    prediction: "Away wins",
    date: "2026-04-28 14:00",
    status: "pending",
  },
  {
    id: "e6",
    sport: "MMA",
    team1: "McGregor",
    team2: "Poirier",
    prediction: "Home wins",
    date: "2026-04-29 04:00",
    status: "pending",
  },
  {
    id: "e7",
    sport: "Football",
    team1: "Man. City",
    team2: "Arsenal",
    prediction: "Draw",
    date: "2026-04-26 16:30",
    status: "pending",
  },
  {
    id: "e8",
    sport: "Basketball",
    team1: "Boston",
    team2: "Miami",
    prediction: "More than 210 points",
    date: "2026-04-27 01:30",
    status: "pending",
  },
  {
    id: "e9",
    sport: "Football",
    team1: "PSG",
    team2: "Dortmund",
    prediction: "Home wins",
    date: "2026-05-01 20:00",
    status: "pending",
  },
];

const INITIAL_CARDS = [
  {
    id: "c1",
    title: "Champions League Special",
    size: "3x3",
    prizePerLine: "€50",
    fullPrize: "€500",
    price: "10",
    isPurchased: true,
    date: "20/04/2026",
    events: INITIAL_EVENTS.slice(0, 9),
  },
  {
    id: "c2",
    title: "Multi-Sport Weekend",
    size: "4x4",
    prizePerLine: "€100",
    fullPrize: "€2000",
    price: "25",
    isPurchased: false,
    date: "21/04/2026",
    events: [...INITIAL_EVENTS, ...INITIAL_EVENTS].slice(0, 16),
  },
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

const saveCardsDB = (data) =>
  localStorage.setItem("bingo_db_cards", JSON.stringify(data));

const getEventsDB = () => {
  try {
    const data = localStorage.getItem("bingo_db_events");
    const parsed = data ? JSON.parse(data) : INITIAL_EVENTS;
    return Array.isArray(parsed) ? parsed : INITIAL_EVENTS;
  } catch (e) {
    return INITIAL_EVENTS;
  }
};

const saveEventsDB = (data) =>
  localStorage.setItem("bingo_db_events", JSON.stringify(data));

export const handlers = [
  http.post("/api/login", async ({ request }) => {
    const { username, password } = await request.json();
    await delay(1000);

    if (username === "userTest" && password === "user123") {
      return HttpResponse.json({
        id: "u-1",
        username: "userTest",
        role: "user",
        balance: 1000,
      });
    }

    if (username === "admin" && password === "admin123") {
      return HttpResponse.json({
        id: "a-1",
        username: "admin",
        role: "admin",
        balance: 999999,
      });
    }

    return new HttpResponse(
      JSON.stringify({ message: "Credenciais inválidas." }),
      { status: 401, headers: { "Content-Type": "application/json" } },
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
      status: "pending",
    };

    db.push(newEvent);
    saveEventsDB(db);

    return HttpResponse.json(newEvent, { status: 201 });
  }),

  http.patch("/api/admin/events/:id/status", async ({ params, request }) => {
    const { id } = params;
    const { status } = await request.json();
    const db = getEventsDB();

    const eventIndex = db.findIndex((e) => e.id === id);

    if (eventIndex !== -1) {
      db[eventIndex].status = status;
      saveEventsDB(db);
      return HttpResponse.json(db[eventIndex]);
    }

    return new HttpResponse("Event Not Found", { status: 404 });
  }),

  http.put("/api/admin/events/:id", async ({ params, request }) => {
    const { id } = params;
    const updatedData = await request.json();
    const db = getEventsDB();

    const index = db.findIndex((e) => e.id === id);

    if (index !== -1) {
      db[index] = {
        ...db[index],
        ...updatedData,
        id: db[index].id,
        status: db[index].status,
      };

      saveEventsDB(db);

      console.log(`MSW: Evento ${id} atualizado com sucesso!`);
      return HttpResponse.json(db[index]);
    }

    return new HttpResponse(
      JSON.stringify({ message: "Evento não encontrado para edição" }),
      { status: 404 },
    );
  }),

  http.delete("/api/admin/events/:id", async ({ params }) => {
    const { id } = params;
    const db = getEventsDB();

    const filteredDB = db.filter((event) => event.id !== id);

    if (db.length !== filteredDB.length) {
      saveEventsDB(filteredDB);
      return new HttpResponse(null, { status: 204 });
    }

    return new HttpResponse(JSON.stringify({ message: "Event Not Found" }), {
      status: 404,
    });
  }),

  http.post("/api/admin/cards", async ({ request }) => {
    const cardData = await request.json();
    const db = getCardsDB();

    const newCard = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("pt-PT"),
      isPurchased: false,
      ...cardData,
    };

    db.push(newCard);
    saveCardsDB(db);

    return HttpResponse.json(newCard, { status: 201 });
  }),

  http.post("/api/admin/cards/add-event", async ({ request }) => {
    const { cardId, eventData } = await request.json();
    const db = getCardsDB();

    const cardIndex = db.findIndex((c) => c.id === cardId);

    if (cardIndex !== -1) {
      const eventToLink = {
        id: eventData.id || crypto.randomUUID(),
        ...eventData,
        status: eventData.status || "pending",
      };

      db[cardIndex].events.push(eventToLink);
      saveCardsDB(db);

      return HttpResponse.json(eventToLink, { status: 201 });
    }

    return new HttpResponse("Card not found", { status: 404 });
  }),
];
