// calcula progresso dos eventos
export function calculateCardProgress(cardEvents) {
    if (!cardEvents || !Array.isArray(cardEvents)) {
        return { totalEvents : 0, completedEvents: 0, progressPercent: 0 };
    }

    const totalEvents = cardEvents.length;

    const completedEvents = cardEvents.filter((event) => {
        const status = typeof event === "object" ? event.status : "";
        const currentStatus = (status || "").toLowerCase();

        return currentStatus !== "pending" && currentStatus !== "";
    }).length;

    const progressPercent = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

    return {
        totalEvents,
        completedEvents,
        progressPercent,
    };
}