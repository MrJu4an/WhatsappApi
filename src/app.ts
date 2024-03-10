import {addKeyword, createBot, createFlow, createProvider, EVENTS, MemoryDB} from '@bot-whatsapp/bot'
import {BaileysProvider, handleCtx} from '@bot-whatsapp/provider-baileys'
import { ServerResponse } from 'http';
import fs from 'fs'

const flowBienvenida = addKeyword(['Hola', 'Buen día']).addAnswer(['Buenas, bienvenido a mi chat', '¿Como puedo ayudarte?'])



const main = async () => {

    const provider = createProvider(BaileysProvider)

    provider.initHttpServer(3002)

    provider.http?.server.post('/send-message', handleCtx(async (bot, req, res) => {
        try{
            const body = req.body
            const phone = body.phone
            const msg = body.msg
            await bot.sendMessage(phone, msg, {})
        } catch(error){
            res.statusCode = 400
            res.end('No se ha podido enviar el mensaje. Puede que el proveedor no este autenticado.')
        }
       
    }))

    provider.http?.server.get('/get-qr', handleCtx(async (bot, req, res) => {
        const rutaQR = 'bot.qr.png'

        //Verificamos si existe la imagen
        fs.access(rutaQR, fs.constants.F_OK, (err) => {
            if (err) {
                // Si hay un error (por ejemplo, el archivo no existe), enviar una respuesta 404
                res.statusCode = 404;
                res.end('Imagen no encontrada');
                return;
            }

             // Si el archivo existe, establecer los encabezados de respuesta adecuados
             res.setHeader('Content-Type', 'image/png');

             // Leer el archivo de imagen y enviarlo como respuesta
            fs.createReadStream(rutaQR).pipe(res as ServerResponse);
        })
    }))

    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider: provider
    })
}

main()