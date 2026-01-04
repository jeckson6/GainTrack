export function generateCalendarLink(trainingPlan = []) {
  if (!Array.isArray(trainingPlan)) return "#";

  const events = trainingPlan.map((day) => {
    const exercisesText = Array.isArray(day.exercises)
      ? day.exercises
          .map(
            (ex) =>
              `• ${ex.name} — ${ex.sets} sets x ${ex.reps}` +
              (ex.rest ? ` (Rest ${ex.rest})` : "")
          )
          .join("\n")
      : "";

    const description = `${day.focus}\n\n${exercisesText}`;

    return {
      text: `Workout: ${day.day}`,
      details: description
    };
  });

  // Google Calendar URL (single combined event)
  const fullDescription = events
    .map((e) => `${e.text}\n${e.details}`)
    .join("\n\n");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: "AI Training Plan",
    details: fullDescription
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}
