import {
  FastifyInstance,
  FastifyPluginOptions,
  FastifyRequest,
  FastifyReply
} from 'fastify'

import { authMiddleware } from '../middlewares/passaport';
import { CreateNutricionController } from '../controllers/createNutricionController'

export async function nutritionRoutes(fastify: FastifyInstance, options: FastifyPluginOptions) {

  fastify.get("/teste", { preHandler: authMiddleware }, (request: FastifyRequest, reply: FastifyReply) => {
    let responseText = "```json\n{\n  \"nome\": \"Tiago\",\n  \"sexo\": \"Masculino\",\n  \"idade\": 32,\n  \"altura\": 1.75,\n  \"peso\": 60,\n  \"objetivo\": \"engordar\",\n  \"refeicoes\": [\n    {\n      \"horario\": \"08:00\",\n      \"nome\": \"Cafe da Manha\",\n      \"alimentos\": [\n        \"2 fatias de pao integral\",\n        \"2 colheres de sopa de queijo minas\",\n        \"1 banana\",\n        \"1 copo de leite integral\",\n        \"1 ovo cozido\"\n      ]\n    },\n    {\n      \"horario\": \"10:00\",\n      \"nome\": \"Lanche da Manha\",\n        \"alimentos\": [\n        \"1 iogurte grego com granola\",\n        \"1 fruta de sua preferencia\"\n      ]\n    },\n    {\n      \"horario\": \"12:00\",\n      \"nome\": \"Almoco\",\n      \"alimentos\": [\n        \"150g de frango grelhado\",\n        \"100g de arroz integral\",\n        \"100g de feijao\",\n        \"Salada de folhas verdes com tomate e cenoura\",\n        \"1 colher de sopa de azeite de oliva\"\n      ]\n    },\n    {\n      \"horario\": \"15:00\",\n      \"nome\": \"Lanche da Tarde\",\n        \"alimentos\": [\n        \"Sanduiche natural com peito de peru e queijo\",\n        \"1 fruta de sua preferencia\"\n      ]\n    },\n    {\n      \"horario\": \"19:00\",\n      \"nome\": \"Jantar\",\n      \"alimentos\": [\n        \"150g de carne vermelha magra\",\n        \"100g de batata doce\",\n        \"100g de brócolis\",\n        \"1 colher de sopa de azeite de oliva\"\n      ]\n    },\n    {\n      \"horario\": \"21:00\",\n      \"nome\": \"Lanche da Noite\",\n      \"alimentos\": [\n        \"1 pote de iogurte grego com 2 colheres de sopa de granola\"\n      ]\n    }\n  ],\n  \"suplementos\": [\n    \"Whey protein\",\n    \"Creatina\",\n    \"BCAA\",\n    \"Glutamina\"\n  ]\n}\n```"

    try {
      let jsonString = responseText.replace(/```\w*\n/g, '').replace(/\n```/g, '').trim();

      let jsonObject = JSON.parse(jsonString);
      return reply.send({ data: jsonObject });
    } catch (err) {
      console.log(err)
    }
  })

  fastify.post("/createNutrition", { preHandler: authMiddleware }, async (request: FastifyRequest, reply: FastifyReply) => {
    return new CreateNutricionController().handle(request, reply);
  })

}