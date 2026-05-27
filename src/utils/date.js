export const formatDateTime = (dateString) => {
  if (!dateString) return "N/A";

  const normalized = dateString.replace("T", " ");

  const [datePart, timePart] = normalized.split(" ");
  if (!datePart) return dateString;

  const [yyyy, mm, dd] = datePart.split("-");
  if (!yyyy || !mm || !dd) return dateString;

  const dateFormatted = `${dd}/${mm}/${yyyy}`;

  if (timePart) {
    const timeFormatted = timePart.substring(0, 5);
    return `${dateFormatted} - ${timeFormatted}`;
  }

  return dateFormatted;
};

export const formatDate = (dateString) => {
  if (!dateString) return "N/A";

  const normalized = dateString.replace("T", " ");

  const [datePart, timePart] = normalized.split(" ");
  if (!datePart) return dateString;

  const [yyyy, mm, dd] = datePart.split("-");
  if (!yyyy || !mm || !dd) return dateString;

  const dateFormatted = `${dd}/${mm}/${yyyy}`;

  return dateFormatted;
};

