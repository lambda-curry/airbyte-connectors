import axios, {AxiosInstance} from 'axios';
import * as cacheManager from 'cache-manager';
import {AirbyteConfig, AirbyteLogger} from 'faros-airbyte-cdk';
import {DateTime} from 'luxon';
import qs from 'qs';
import VError from 'verror';

import {Company, LoginV2, Schedule, ScheduleEntry, StaffMember} from './types';

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
    private readonly logger: AirbyteLogger
  ) {}

  public static instance(config: QGendaConfig, logger: AirbyteLogger): QGenda {
    if (typeof config.email !== 'string') {
      throw new VError('server_url: must be a string');
    }
    if (typeof config.password !== 'string') {
      throw new VError('user: must be a string');
    }

    const client = axios.create({
      baseURL: 'https://api.qgenda.com',
    });

    return new QGenda(client, logger);
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
      email: 'DerekSTRGAPI@qgenda.com',
      password: 'FCm2axXfAUZBT7pr',
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

  // async *syncBuilds(
  //   jenkinsCfg: JenkinsConfig,
  //   existingState: JenkinsState | null
  // ): AsyncGenerator<Build> {
  //   const jobs = await this.syncJobs(jenkinsCfg, null);
  //   for (const job of jobs) {
  //     const builds = this.constructBuilds(job, existingState);
  //     for (const build of builds) {
  //       yield build;
  //     }
  //   }
  // }

  // @Memoize((jenkinsCfg: JenkinsConfig, streamSlice: Job | null) => {
  //   return `${JSON.stringify(jenkinsCfg)}${JSON.stringify(streamSlice || {})}`;
  // })
  // async syncJobs(
  //   jenkinsCfg: JenkinsConfig,
  //   streamSlice: Job | null
  // ): Promise<Job[]> {
  //   const pageSize = jenkinsCfg.pageSize || DEFAULT_PAGE_SIZE;
  //   const last100Builds = jenkinsCfg.last100Builds ?? false;
  //   const depth = jenkinsCfg.depth ?? (await this.calculateMaxJobsDepth());
  //   this.logger.debug(Jenkins.parse('Max depth: %s', depth));

  //   const numRootJobs = await this.countRootJobs();
  //   const numPages = Math.ceil(numRootJobs / pageSize);
  //   this.logger.debug(
  //     Jenkins.parse(
  //       'Number of root jobs: %s. Number of pages: %s',
  //       numRootJobs,
  //       numPages
  //     )
  //   );
  //   const result = [];
  //   for (let i = 0, from, to; i < numRootJobs; i += pageSize) {
  //     from = i;
  //     to = Math.min(numRootJobs, i + pageSize);
  //     const jobs = await this.fetchJobs(depth, last100Builds, from, to);
  //     for (const job of jobs) {
  //       if (streamSlice && streamSlice.url === job.url) {
  //         return undefined;
  //       }
  //       result.push(job);
  //     }
  //   }
  //   return result;
  // }

  // /*
  // http://localhost:8080/job/job_105_folder/job/job_custom_105/
  // job fullName: job_105_folder/job_custom_105
  // level: 1 (starts with 0)
  // */
  // private async calculateMaxJobsDepth(): Promise<number> {
  //   const jobs = await this.client.job.list({
  //     depth: POTENTIAL_MAX_DEPTH,
  //     tree: this.generateTree(POTENTIAL_MAX_DEPTH, FEED_MAX_DEPTH_CALC_PATTERN),
  //   });
  //   const allJobs = this.retrieveAllJobs(jobs);

  //   let maxLevel = 0;
  //   for (const job of allJobs) {
  //     const level = (job.fullName.match(/\//g) || []).length;
  //     if (level > maxLevel) {
  //       maxLevel = level;
  //     }
  //   }
  //   return maxLevel;
  // }

  // private constructBuilds(
  //   job: Job,
  //   existingState: JenkinsState | null
  // ): Build[] {
  //   const lastBuildNumber =
  //     existingState?.newJobsLastCompletedBuilds?.[job.fullName];
  //   const builds = job.allBuilds ?? job.builds ?? [];
  //   if (!builds.length) {
  //     this.logger.info(Jenkins.parse("Job '%s' has no builds", job.fullName));
  //     return builds;
  //   }
  //   return lastBuildNumber
  //     ? builds.filter(
  //         (build: Build) => build.number > lastBuildNumber && !build.building
  //       )
  //     : builds;
  // }

  // private async countRootJobs(): Promise<number> {
  //   const jobs = await this.client.job.list({tree: FEED_JOBS_COUNT_PATTERN});
  //   return jobs.length;
  // }

  // private async fetchJobs(
  //   depth: number,
  //   last100Builds: boolean,
  //   from: number,
  //   to: number
  // ): Promise<Job[]> {
  //   const page = `{${from},${to}}`; // `to` parameter is exclusive
  //   const builds = last100Builds ? 'builds' : 'allBuilds';
  //   try {
  //     const rootJobs = await this.client.job.list({
  //       // https://www.jenkins.io/doc/book/using/remote-access-api/#RemoteaccessAPI-Depthcontrol
  //       depth: depth,
  //       tree:
  //         this.generateTree(
  //           depth,
  //           util.format(FEED_ALL_FIELDS_PATTERN, builds)
  //         ) + page,
  //     });

  //     return this.retrieveAllJobs(rootJobs);
  //   } catch (err: any) {
  //     this.logger.warn(
  //       Jenkins.parse(
  //         'Failed to fetch jobs in page %s: %s. Skipping page.',
  //         page,
  //         err.message
  //       )
  //     );
  //     return [];
  //   }
  // }

  // /** Jenkins JSON API does not support deep scan, it is required to
  //  * generate a suitable tree for the corresponding depth. Job in some cases have
  //  * many sub jobs, depth needs to quantify how many sub jobs are showed
  //  */
  // private generateTree(depth: number, fieldsPattern: string): string {
  //   let tree = 'jobs[' + fieldsPattern + ']';
  //   for (let i = 0; i < depth; i++) {
  //     tree = tree.replace('*', fieldsPattern);
  //   }

  //   return tree;
  // }

  // // we need to flatten all jobs to a list from the tree structure
  // private retrieveAllJobs(rootJobs: Job[]): Job[] {
  //   const allJobs: Job[] = [];
  //   while (rootJobs?.length) {
  //     const job = rootJobs.pop();
  //     // only jobs with builds are required, skip folders
  //     if (!job) {
  //       break;
  //     }
  //     if (job._class === FOLDER_JOB_TYPE) {
  //       if (job.jobs) {
  //         for (const nestedJob of job.jobs) {
  //           nestedJob.name = `${job.name}/${nestedJob.name}`;
  //         }
  //         rootJobs.push(...job.jobs);
  //       }
  //     } else {
  //       allJobs.push(job);
  //     }
  //   }
  //   return allJobs;
  // }
}
