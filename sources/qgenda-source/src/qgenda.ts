import axios, {AxiosInstance} from 'axios';
import * as cacheManager from 'cache-manager';
import {AirbyteConfig, AirbyteLogger} from 'faros-airbyte-cdk';
import {DateTime} from 'luxon';
import qs from 'qs';
import VError from 'verror';

import {Company, LoginV2, Schedule, StaffMember} from './types';

const tokenCache = cacheManager.caching({
  store: 'memory',
  max: 100,
  ttl: 60 * 58 /*seconds*/,
});

export interface QGendaConfig extends AirbyteConfig {
  readonly email: string;
  readonly password: string;
}

export class QGenda {
  constructor(
    private readonly client: AxiosInstance,
    private readonly logger: AirbyteLogger,
    private readonly config: QGendaConfig
  ) {}

  public static instance(config: QGendaConfig, logger: AirbyteLogger): QGenda {
    if (typeof config.email !== 'string') {
      throw new VError('email: must be a string');
    }
    if (typeof config.password !== 'string') {
      throw new VError('password: must be a string');
    }

    const client = axios.create({
      baseURL: 'https://api.qgenda.com',
    });

    return new QGenda(client, logger, config);
  }

  async checkConnection(): Promise<void> {
    try {
      const result = await this.login();
      if (!result.access_token) {
        const err = JSON.stringify({
          error: result.error,
          description: result.error_description,
        });
        throw new VError(
          `Please verify your and user/password are correct. Error: ${err}`
        );
      }
    } catch (error: any) {
      const err = error?.message ?? JSON.stringify(error);
      throw new VError(
        `Please verify your server_url and user/password are correct. Error: ${err}`
      );
    }
  }

  async login(): Promise<LoginV2> {
    const data = qs.stringify({
      email: this.config.email,
      password: this.config.password,
    });

    const response = await this.client.post<LoginV2>('/v2/login', data, {
      headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    });
    return response.data;
  }

  async fetchAccessToken(): Promise<string> {
    const result = await this.login();
    return result.access_token;
  }

  async cachedAccessToken(): Promise<string> {
    return await tokenCache.wrap('access_token', () => this.fetchAccessToken());
  }

  async *syncCompanies(): AsyncGenerator<Company> {
    const response = await this.client.get<Company[]>('/v2/company', {
      headers: {Authorization: `Bearer ${await this.cachedAccessToken()}`},
    });
    for (const company of response.data) {
      yield company;
    }
  }

  async *syncStaffMember(): AsyncGenerator<StaffMember> {
    const response = await this.client.get<StaffMember[]>('/v2/staffmember', {
      headers: {Authorization: `Bearer ${await this.cachedAccessToken()}`},
    });
    for (const staffMember of response.data) {
      yield staffMember;
    }
  }

  async *syncSchedule(lastModifiedDate?: string): AsyncGenerator<Schedule> {
    let date = DateTime.fromObject({month: 1, day: 1, year: 2010});
    const now = DateTime.local();

    while (date.toMillis() < now.toMillis()) {
      const url = `/v2/schedule?$orderby=Date&sinceModifiedTimestamp=${
        lastModifiedDate || ''
      }&startDate=${date.toFormat('MM/dd/yyyy')}&endDate=${date
        .plus({days: 31})
        .toFormat('MM/dd/yyyy')}`;

      const response = await this.client.get<Schedule[]>(url, {
        headers: {Authorization: `Bearer ${await this.cachedAccessToken()}`},
      });
      for (const schedule of response.data) {
        yield schedule;
      }
      date = date.plus({days: 31});
    }
  }
}
