import {
  AirbyteLogger,
  AirbyteStreamBase,
  StreamKey,
  SyncMode,
} from 'faros-airbyte-cdk';
import {Dictionary} from 'ts-essentials';

import {QGenda, QGendaConfig} from '../qgenda';

export class Company extends AirbyteStreamBase {
  constructor(readonly config: QGendaConfig, logger: AirbyteLogger) {
    super(logger);
  }

  getJsonSchema(): Dictionary<any, string> {
    return require('../../resources/schemas/schema.json')['definitions'][
      'CompanyElement'
    ];
  }
  get primaryKey(): StreamKey {
    return ['CompanyKey'];
  }

  async *readRecords(
    syncMode: SyncMode,
    cursorField?: string[],
    streamSlice?: Dictionary<any, string>,
    streamState?: Dictionary<any, string>
  ): AsyncGenerator<Dictionary<any, string>, any, unknown> {
    const qgenda = QGenda.instance(this.config, this.logger);
    yield* qgenda.syncCompanies();
  }

  getUpdatedState(
    currentStreamState: Dictionary<any>,
    latestRecord: Dictionary<any>
  ): Dictionary<any> {
    return {};
  }
}
