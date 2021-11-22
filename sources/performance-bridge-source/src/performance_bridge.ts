import axios, {AxiosInstance} from 'axios';
import * as crypto from 'crypto';
import {AirbyteConfig, AirbyteLogger} from 'faros-airbyte-cdk';
import {DateTime} from 'luxon';
import VError from 'verror';

export interface PerformanceBridgeConfig extends AirbyteConfig {
  readonly ip_address: string;
  readonly app_name: string;
  readonly secret_key: string;
}

export interface ColumnSchema {
  ordinal_position: number;
  is_nullable: 'NO' | 'YES';
  data_type: string;
  column_name: string;
  column_default: boolean;
}

export interface TableSchema {
  table_schema: string;
  table: string;
}

export class PerformanceBridge {
  constructor(
    private readonly client: AxiosInstance,
    private readonly logger: AirbyteLogger,
    private readonly config: PerformanceBridgeConfig
  ) {}

  public static instance(
    config: PerformanceBridgeConfig,
    logger: AirbyteLogger
  ): PerformanceBridge {
    if (typeof config.email !== 'string') {
      throw new VError('email: must be a string');
    }
    if (typeof config.password !== 'string') {
      throw new VError('password: must be a string');
    }

    const client = axios.create({
      baseURL: config.ip_address,
    });

    return new PerformanceBridge(client, logger, config);
  }

  async checkConnection(): Promise<void> {
    // TODO
    return;
  }

  getHeaders(sql: string): {[key: string]: string} {
    const content_hash = crypto
      .createHash('sha512')
      .update(sql)
      .digest('base64');
    const requestTime = DateTime.utc().toISO();
    const hmac = crypto
      .createHash('sha512')
      .update(this.config.secret_key + requestTime + content_hash)
      .digest('base64');
    const authentication = `PB  ${this.config.app_name}: ${hmac}`;
    return {
      'Content-Hash': content_hash,
      'Content-Type': 'application/json',
      Date: requestTime,
      Authorization: authentication,
    };
  }

  async columnSchema(tableName: string): Promise<ColumnSchema[]> {
    const headers = this.getHeaders('');
    const res = await this.client.get<ColumnSchema[]>(
      `/schema/columns?table=${encodeURIComponent(tableName)}`,
      {
        headers,
      }
    );
    return res.data;
  }

  async listTables(): Promise<TableSchema[]> {
    const headers = this.getHeaders('');
    const res = await this.client.get<any[]>('/schema/tables', {
      headers,
    });
    return res.data;
  }

  async select(sql: string, params: any[] = []): Promise<any[]> {
    const data = {select: sql, params: params};
    const headers = this.getHeaders(sql);
    const res = await this.client.post<any[]>('/query/select', data, {
      headers,
    });
    return res.data;
  }
}
