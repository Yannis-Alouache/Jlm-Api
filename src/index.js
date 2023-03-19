import { Router } from "./router/Router.js";


try {
    const router = new Router()
    router.handle()
    router.listen()
} catch (error) {
    throw error
}
