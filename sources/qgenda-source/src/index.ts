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

import {QGenda, QGendaConfig} from './qgenda';
import {Company, Schedule, StaffMember} from './streams';

/** The main entry point. */
export function mainCommand(): Command {
  const logger = new AirbyteLogger();
  const source = new QGendaSource(logger);
  return new AirbyteSourceRunner(logger, source).mainCommand();
}

export class QGendaSource extends AirbyteSourceBase {
  async spec(): Promise<AirbyteSpec> {
    return new AirbyteSpec(require('../resources/spec.json'));
  }
  async checkConnection(
    config: QGendaConfig
  ): Promise<[boolean, VError | undefined]> {
    try {
      const qgenda = QGenda.instance(config as QGendaConfig, this.logger);
      await qgenda.checkConnection();
    } catch (err: any) {
      return [false, err];
    }
    return [true, undefined];
  }
  streams(config: QGendaConfig): AirbyteStreamBase[] {
    return [
      new Company(config, this.logger),
      new Schedule(config, this.logger),
      new StaffMember(config, this.logger),
    ];
  }
}
