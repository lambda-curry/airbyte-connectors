import {AirbyteRecord} from 'faros-airbyte-cdk';
import {Utils} from 'faros-feeds-sdk';

import {
  DestinationModel,
  DestinationRecord,
  StreamContext,
  StreamName,
} from '../converter';
import {GithubCommon, GithubConverter} from './common';

export class GithubIssues extends GithubConverter {
  readonly destinationModels: ReadonlyArray<DestinationModel> = [
    'tms_Label',
    'tms_Task',
    'tms_TaskAssignment',
    'tms_TaskBoardRelationship',
    'tms_TaskTag',
    'tms_User',
  ];

  private readonly issueLabelsStream = new StreamName('github', 'issue_labels');

  override get dependencies(): ReadonlyArray<StreamName> {
    return [this.issueLabelsStream];
  }

  convert(
    record: AirbyteRecord,
    ctx: StreamContext
  ): ReadonlyArray<DestinationRecord> {
    const source = this.streamName.source;
    const issue = record.record.data;
    const res: DestinationRecord[] = [];
    const uid = `${issue.id}`;

    // GitHub's REST API v3 considers every pull request an issue,
    // but not every issue is a pull request. Will skip pull requests
    // since we pull them separately
    if (issue.pull_request) {
      return res;
    }

    let user: DestinationRecord | undefined;
    if (issue.user) {
      user = GithubCommon.tms_User(issue.user, source);
      res.push(user);
    }

    issue.assignees?.forEach((a) => {
      const assignee = GithubCommon.tms_User(a, source);
      res.push(assignee);
      res.push({
        model: 'tms_TaskAssignment',
        record: {
          task: {uid, source},
          assignee: {uid: assignee.record.uid, source},
        },
      });
    });

    const issueLabelsStream = this.issueLabelsStream.stringify();
    for (const id of issue.labels) {
      const label = ctx.get(issueLabelsStream, String(id)) ?? [];
      if (label.length === 0) continue;
      const name = label[0].record?.data?.name;
      if (!name) continue;
      res.push({
        model: 'tms_TaskTag',
        record: {task: {uid, source}, label: {name}},
      });
    }

    // Github issues only have state either open or closed
    const category = issue.state === 'open' ? 'Todo' : 'Done';
    res.push({
      model: 'tms_Task',
      record: {
        uid,
        name: issue.title,
        description: issue.body?.substring(
          0,
          GithubCommon.MAX_DESCRIPTION_LENGTH
        ),
        status: {category, detail: issue.state},
        createdAt: Utils.toDate(issue.created_at),
        updatedAt: Utils.toDate(issue.updated_at),
        creator: user ? {uid: user.record.uid, source} : undefined,
        source,
      },
    });

    const repository = GithubCommon.parseRepositoryKey(
      issue.repository,
      source
    );

    // TODO: If tasks get transferred between repos or projects, delete previous relationship
    // (this should probably be done in here and in issue-events)
    res.push({
      model: 'tms_TaskBoardRelationship',
      record: {
        task: {uid, source},
        board: repository ? {uid: repository.name, source} : null,
      },
    });

    return res;
  }
}
