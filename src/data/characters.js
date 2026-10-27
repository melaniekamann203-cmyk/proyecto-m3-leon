// Datos de los personajes que se muestran en la página
export const characters = [
  {
    id: "leon",
    name: "Leon S. Kennedy",
    emoji: "🛡️",
    role: "Agente especial",
    status: "en línea",
    bio: "Su primer día como policía en Raccoon City fue el día del brote. Años después, ya como agente del gobierno, viaja a un pueblo rural de España para rescatar a la hija del presidente.",
    greeting: "Leon S. Kennedy, agente especial. ¿En qué te puedo ayudar?",
  },
  {
    id: "ada",
    name: "Ada Wong",
    emoji: "🌹",
    role: "Espía",
    status: "ubicación desconocida",
    bio: "Espía misteriosa que siempre aparece cuando Leon menos lo espera. Nunca dice para quién trabaja y siempre tiene un plan propio.",
    greeting: "Vaya, una visita. Tenés cinco minutos. Usalos bien.",
  },
  {
    id: "ashley",
    name: "Ashley Graham",
    emoji: "🎓",
    role: "Hija del presidente",
    status: "a salvo (por ahora)",
    bio: "Estudiante universitaria y hija del presidente de Estados Unidos. Fue secuestrada por la secta Los Iluminados y Leon tiene que llevarla de vuelta a casa.",
    greeting: "¡Hola! ¿Vos también estás atrapado acá? Leon dice que vamos a salir de esta.",
  },
  {
    id: "zombie",
    name: "Zombi de Raccoon City",
    emoji: "🧟",
    role: "Infectado por el Virus-T",
    status: "hambriento",
    bio: "Antes era un vecino común de Raccoon City. Después de la fuga del Virus-T de Umbrella, solo le quedan gruñidos y algunos recuerdos sueltos.",
    greeting: "Uuuuhhh... grrr... ¿ce... rebro...?",
  },
];

export function getCharacter(id) {
  return characters.find((c) => c.id === id);
}
