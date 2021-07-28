import web3 from './web3';
import compiledFactory from './build/CampaignFactory.json';


const instance = new web3.eth.Contract(JSON.parse(compiledFactory.interface), '0x6Fda14532943caAE034B28fCf13E00f09634c0B6');



export default instance;