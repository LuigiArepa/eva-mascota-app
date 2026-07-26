import { createContext } from "react";

import { Notyf } from "notyf";

const notyf = new Notyf({
  duration: 4000,

  position: { x: "right", y: "top" },

  dismissible: true,

  types: [
    {
      type: "warning",

      background: "orange",

      icon: { className: "notyf__icon--warning", tagName: "i", text: "!" },

      duration: 5000,

      dismissible: true,
    },
  ],
});

export const NotyfContext = createContext(notyf);
