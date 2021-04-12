import {getEndedAuctions} from '../lib/getEndedAuctions.js'

async function processAuctions(event, context){
    const auctionsToClose = await getEndedAuctions();
    console.log(auctionsToClose)
}

export const handler = processAuctions;