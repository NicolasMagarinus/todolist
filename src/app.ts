import express, {Application} from "express"
import cors from "cors"
import routerUsuario from "./routes/userRoute"
import routerLogin from "./routes/loginRoute"
import routerTask from "./routes/taskRoute"
import errorHandler from "./middleware/errorHandler"

const app: Application = express()
app.use(express.json())
app.use(cors())

app.use("/api", routerUsuario)
app.use("/api", routerLogin)
app.use("/api", routerTask)

app.use(errorHandler);

export default app