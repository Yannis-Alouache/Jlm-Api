
export class Home {

    async contact(req, res) {
        return res.status(200).send({
            status: "success",
            msg: "Bienvenue sur l'api JLM"
        }) 
    }


}