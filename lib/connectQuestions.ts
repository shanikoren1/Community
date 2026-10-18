/**
 * Connect — the question bank for the in-person conversation game.
 *
 * Framing rule (grounded in Vanessa Van Edwards' conversation sparks + positive
 * psychology): ask about the positive, the specific, the alive version. Not
 * "what do you do?" but "what excites you about what you do?". Questions deepen
 * across three layers as the group warms up.
 *
 * Shani can add more questions any time: just push strings into the arrays below.
 */

export interface ConnectLayer {
  id: string;
  title: string;      // shown as the round label
  subtitle: string;   // one soft line of context
  questions: string[];
}

export const CONNECT_LAYERS: ConnectLayer[] = [
  {
    id: "warmup",
    title: "Warm up",
    subtitle: "Light and easy. Just getting the room smiling.",
    questions: [
      "What is something small that made you smile this week?",
      "What are you most excited about right now?",
      "What is a song you cannot help but turn up?",
      "What is the best thing you ate recently?",
      "What is a place that instantly puts you in a good mood?",
      "What is something you are quietly looking forward to?",
      "What hobby would you dive into if time was free?",
      "What is a small win you had today?",
      "What is a movie or show you would happily rewatch right now?",
      "What is something you are a little bit nerdy about?",
      "What is the last thing that made you laugh out loud?",
      "What is a tiny luxury that always feels worth it to you?",
      "If tomorrow afternoon was free, how would you spend it?",
      "What is something new you tried lately that you enjoyed?",
    ],
  },
  {
    id: "deeper",
    title: "Go deeper",
    subtitle: "A little more personal. Values and what drives you.",
    questions: [
      "What is a recent moment you are quietly proud of?",
      "What is something you have changed your mind about?",
      "Who is someone that shaped who you are, and how?",
      "What is a risk you took that you are glad you took?",
      "What does a genuinely good day look like for you now?",
      "What is something you are working to get better at?",
      "When do you feel most like yourself?",
      "What is a compliment you received that has stuck with you?",
      "What is a goal that actually excites you, not just one you feel you should have?",
      "What is the kindest thing someone has done for you?",
      "What part of your life would the younger you be amazed by?",
      "What do you want more of in your life this year?",
      "What is a lesson you learned the hard way but are grateful for?",
      "What is something you believe that the people around you might not?",
    ],
  },
  {
    id: "heart",
    title: "Heart",
    subtitle: "The good stuff. Warm, honest, and real.",
    questions: [
      "What are you most grateful for in your life right now?",
      "What is a memory you would love to relive exactly as it was?",
      "Who do you love that you do not tell often enough?",
      "What would you want people to remember about you?",
      "When did you last feel truly understood?",
      "What is a dream you have not said out loud much?",
      "What is something that always restores your hope?",
      "What does feeling at home mean to you?",
      "What is a moment you realized how much someone mattered to you?",
      "What is the bravest thing you have done with your heart?",
      "What do you hope is true about your life ten years from now?",
      "What is something this group does not know about you that you would love to share?",
      "What has someone in this room taught you, maybe without knowing it?",
      "What is a kindness you want to pass on?",
    ],
  },
];
