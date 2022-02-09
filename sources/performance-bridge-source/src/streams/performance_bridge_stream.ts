import {
  AirbyteLogger,
  AirbyteStreamBase,
  StreamKey,
  SyncMode,
} from 'faros-airbyte-cdk';
import {Dictionary} from 'ts-essentials';

import {
  ColumnSchema,
  PerformanceBridge,
  PerformanceBridgeConfig,
  TableSchema,
} from '../performance_bridge';

export class PerformanceBridgeStream extends AirbyteStreamBase {
  constructor(
    private readonly config: PerformanceBridgeConfig,
    logger: AirbyteLogger,
    private readonly table: TableSchema,
    private readonly columns: ColumnSchema[]
  ) {
    super(logger);
  }

  get supportsIncremental(): boolean {
    return false;
  }

  getJsonSchema(): Dictionary<any, string> {
    return {
      type: 'object',
      additionalProperties: false,
      properties: this.columns.reduce((acc, column) => {
        if (['float8'].includes(column.data_type))
          return {
            ...acc,
            [column.column_name]: {type: 'number'},
          };

        if (
          ['int8', 'int4', 'int2', 'int', 'integer', 'bigserial'].includes(
            column.data_type
          )
        )
          return {
            ...acc,
            [column.column_name]: {type: 'integer'},
          };

        if (['timestampz', 'date'].includes(column.data_type))
          return {
            ...acc,
            [column.column_name]: {type: 'string', format: 'date-time'},
          };
        if (['bool'].includes(column.data_type))
          return {
            ...acc,
            [column.column_name]: {type: 'boolean'},
          };

        return {
          ...acc,
          [column.column_name]: {type: 'string'},
        };
      }),
    };
  }

  get primaryKey(): StreamKey {
    return ['id'];
  }

  async *readRecords(
    syncMode: SyncMode,
    cursorField?: string[],
    streamSlice?: Dictionary<any, string>,
    streamState?: Dictionary<any, string>
  ): AsyncGenerator<Dictionary<any, string>, any, unknown> {
    const pageSize = 1000;
    const pb = PerformanceBridge.instance(this.config, this.logger);
    let results = [];
    let offset = 0;
    do {
      const sql = `SELECT * from ${this.table.table_schema}.${this.table.table} LIMIT 1000 OFFSET ${offset}`;
      results = await pb.select(sql);
      for (const result of results) {
        yield result;
      }
      offset += pageSize;
    } while (results.length === pageSize);
  }
}
