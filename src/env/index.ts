import {dev, stag, prod} from './config';

const ENV = process.env.TS_ENV;
const config = (ENV === 'development' ? dev : ENV === 'staging' ? stag : prod);

export default config;