import {
  AirbyteLogger,
  AirbyteStreamBase,
  StreamKey,
  SyncMode,
} from 'faros-airbyte-cdk';
import {Dictionary} from 'ts-essentials';

import {QGenda, QGendaConfig} from '../qgenda';

export class StaffMember extends AirbyteStreamBase {
  constructor(readonly config: QGendaConfig, logger: AirbyteLogger) {
    super(logger);
  }

  getJsonSchema(): Dictionary<any, string> {
    return require('../../resources/schemas/schema.json')['definitions'][
      'StaffMember'
    ];
  }
  get primaryKey(): StreamKey {
    return ['StaffKey'];
  }

  async *readRecords(
    syncMode: SyncMode,
    cursorField?: string[],
    streamSlice?: Dictionary<any, string>,
    streamState?: Dictionary<any, string>
  ): AsyncGenerator<Dictionary<any, string>, any, unknown> {
    const qgenda = QGenda.instance(this.config, this.logger);
    yield* qgenda.syncStaffMember();
  }
}
