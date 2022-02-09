import {Promise} from 'bluebird';
import {Command} from 'commander';
import {
  AirbyteConfig,
  AirbyteLogger,
  AirbyteSourceBase,
  AirbyteSourceRunner,
  AirbyteSpec,
  AirbyteStreamBase,
} from 'faros-airbyte-cdk';
import VError from 'verror';

import {PerformanceBridge, PerformanceBridgeConfig} from './performance_bridge';
import {PerformanceBridgeStream} from './streams';

/** The main entry point. */
export function mainCommand(): Command {
  const logger = new AirbyteLogger();
  const source = new PerformanceBridgeSource(logger);
  return new AirbyteSourceRunner(logger, source).mainCommand();
}

export class PerformanceBridgeSource extends AirbyteSourceBase {
  async spec(): Promise<AirbyteSpec> {
    return new AirbyteSpec(require('../resources/spec.json'));
  }
  async checkConnection(
    config: PerformanceBridgeConfig
  ): Promise<[boolean, VError | undefined]> {
    try {
      const pb = PerformanceBridge.instance(
        config as PerformanceBridgeConfig,
        this.logger
      );
      await pb.checkConnection();
    } catch (err: any) {
      return [false, err];
    }
    return [true, undefined];
  }

  async streams(config: AirbyteConfig): Promise<AirbyteStreamBase[]> {
    const pb = PerformanceBridge.instance(
      config as PerformanceBridgeConfig,
      this.logger
    );

    const tables = await pb.listTables();

    const streams = await Promise.map(tables, async (table) => {
      const column = await pb.columnSchema(table.table);
      return new PerformanceBridgeStream(
        config as PerformanceBridgeConfig,
        this.logger,
        table,
        column
      );
    });

    return streams;
  }
}
