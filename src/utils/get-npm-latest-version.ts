import axios, { AxiosResponse } from 'axios';
import 'tslib';

import log from './log';

const getNpmInfo = async (npmName: string) => {
  const npmUrl = `https://registry.npmjs.org/${npmName}`;
  let res = {};
  try {
    res = await axios.get(npmUrl);
  } catch (error) {
    log.error(error as string);
  }
  return res;
};

const getNpmLatestVersion = async (name: string) => {
  const { data } = (await getNpmInfo(name)) as AxiosResponse;
  return data?.['dist-tags']?.latest;
};

export default getNpmLatestVersion;
