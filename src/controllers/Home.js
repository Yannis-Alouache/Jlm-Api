
export class Home {

    async home(req, res) {
        return res.status(200).send({
            status: "success",
            msg: "Bienvenue sur l'api JLM"
        }) 
    }


}