export type Message = { id: string; from: "student" | "teacher"; text: string; time: string };

export const conversation = {
  name: "Yana Budhiraja",
  role: "Your teacher · TEF Canada",
};

export const seedMessages: Message[] = [
  { id: "m1", from: "teacher", text: "Bonjour Amelia ! I left a voice note on your last recording — your rhythm is really improving.", time: "Mon · 10:12 AM" },
  { id: "m2", from: "student", text: "Thank you! I'll listen to it before our next class.", time: "Mon · 11:40 AM" },
  { id: "m3", from: "teacher", text: "Perfect. Also, don't forget Lesson 13 is up — it builds directly on what we covered Thursday.", time: "Mon · 11:52 AM" },
  { id: "m4", from: "teacher", text: "Thursday 9:30 AM as usual — see you then!", time: "Yesterday · 6:05 PM" },
];
