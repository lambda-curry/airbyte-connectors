import {AirbyteRecord} from 'cdk';
import jsonata from 'jsonata';
import {VError} from 'verror';

import {Converter, DestinationRecord} from './converter';

/** Record converter to convert records using provided JSONata expression */
export class JSONataConverter implements Converter {
  constructor(private readonly jsonataExpr: jsonata.Expression) {}

  convert(record: AirbyteRecord): ReadonlyArray<DestinationRecord> {
    const res = this.jsonataExpr.evaluate(record.record);
    if (!res) return [];
    if (!Array.isArray(res)) return [res];
    return res;
  }

  static make(expression: string): JSONataConverter {
    try {
      const jsonataExpr = jsonata(expression);
      return new JSONataConverter(jsonataExpr);
    } catch (error) {
      throw new VError(
        error,
        'Failed to parse JSONata expression: %s (code: %s, position: %s, token: %s)',
        error.message,
        error.code,
        error.position,
        error.token
      );
    }
  }
}

export enum JSONataApplyMode {
  FALLBACK = 'FALLBACK',
  OVERRIDE = 'OVERRIDE',
}