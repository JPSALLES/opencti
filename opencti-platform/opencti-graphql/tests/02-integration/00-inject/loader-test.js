/* eslint-disable prettier/prettier */
import { checkSystemDependencies, initializeData, initializeSchema } from '../../../src/initialization';
import { listenServer, stopServer } from '../../../src/httpServer';
import conf from '../../../src/config/conf';
import { ONE_MINUTE, ONE_HOUR } from '../../utils/testQuery';
import { execPython3 } from "../../../src/python/pythonBridge";

describe('Database provision', () => {
  let httpServer = null;
  beforeAll(async () => {
    httpServer = await listenServer();
  });
  afterAll(async () => {
    await stopServer(httpServer);
  });

  it('should dependencies accessible',  () => {
    return expect(checkSystemDependencies()).resolves.toBe(true);
  }, ONE_MINUTE);
  it('should schema initialized', () => {
    return expect(initializeSchema()).resolves.toBe(true);
  }, ONE_MINUTE);
  it('should default data initialized', () => {
    return expect(initializeData()).resolves.toBe(true);
  }, ONE_MINUTE);
  it('Should import succeed', async () => {
    const apiUri = `http://localhost:${conf.get('app:port')}`;
    const apiToken = conf.get('app:admin:token');
    const importOpts = [apiUri, apiToken, '/tests/data/DATA-TEST-STIX2_v2.json'];
    const path = './src/python';
    const execution = await execPython3(path, 'local_importer.py', importOpts);
    expect(execution).not.toBeNull();
    expect(execution.status).toEqual('success');
  }, ONE_HOUR);
});
