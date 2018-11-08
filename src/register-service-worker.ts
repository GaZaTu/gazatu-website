import { register } from "register-service-worker";

if (process.env.NODE_ENV === "production") {
  register("service-worker.js", {
    ready() {
      console.log("Service worker is active.")
    },
    registered(registration) {
      console.log("Service worker has been registered.")
    },
    cached(registration) {
      console.log("Content has been cached for offline use.")
    },
    updatefound(registration) {
      console.log("New content is downloading.")
    },
    updated(registration) {
      location.reload(true)
    },
    offline() {
      console.log("No internet connection found. App is running in offline mode.")
    },
    error(error) {
      console.error("Error during service worker registration:", error)
    },
  })
}
