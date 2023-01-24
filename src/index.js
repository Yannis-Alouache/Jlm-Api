import { Router } from "./router/Router.js";


try {
    const router = new Router()
    router.handle()
    router.listen(3001)
} catch (error) {
    throw error
}
