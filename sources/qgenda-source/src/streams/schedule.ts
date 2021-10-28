import {
  AirbyteLogger,
  AirbyteStreamBase,
  StreamKey,
  SyncMode,
} from 'faros-airbyte-cdk';
import {Dictionary} from 'ts-essentials';

import {QGenda, QGendaConfig} from '../qgenda';

export class Schedule extends AirbyteStreamBase {
  constructor(readonly config: QGendaConfig, logger: AirbyteLogger) {
    super(logger);
  }

  getJsonSchema(): Dictionary<any, string> {
    return require('../../resources/schemas/schema.json')['definitions'][
      'ScheduleElement'
    ];
  }
  get primaryKey(): StreamKey {
    return ['ScheduleKey'];
  }

  get cursorField(): string[] {
    return ['LastModifiedDateUTC'];
  }

  async *readRecords(
    syncMode: SyncMode,
    cursorField?: string[],
    streamSlice?: Dictionary<any, string>,
    streamState?: Dictionary<any, string>
  ): AsyncGenerator<Dictionary<any, string>, any, unknown> {
    const qgenda = QGenda.instance(this.config, this.logger);
    if (syncMode == SyncMode.INCREMENTAL)
      yield* qgenda.syncSchedule(streamState?.lastModifiedDateUTC);
    if (syncMode == SyncMode.FULL_REFRESH) yield* qgenda.syncSchedule();
  }

  getUpdatedState(
    currentStreamState: Dictionary<any>,
    latestRecord: Dictionary<any>
  ): Dictionary<any> {
    return {
      lastModifiedDateUTC: latestRecord['LastModifiedDateUTC'],
    };
  }
}
