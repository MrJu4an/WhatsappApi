import {addKeyword, createBot, createFlow, createProvider, MemoryDB} from '@bot-whatsapp/bot'
import {BaileysProvider, handleCtx} from '@bot-whatsapp/provider-baileys'

const flowBienvenida = addKeyword('hola').addAnswer('Buenas!! Bienvenido')



const main = async () => {

    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3002)

    provider.http.server.post('/send-message', handleCtx(async (bot, req, res) => {
        const body = req.body
        const phone = body.phone
        const msg = body.msg
        await bot.sendMessage(phone, msg, {})
        res.end('El mensaje se envió correctamente')
    }))

    await createBot({
        flow: createFlow([]),
        database: new MemoryDB(),
        provider: provider
    })
}

main()