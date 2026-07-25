import * as __compactRuntime from '@midnight-ntwrk/compact-runtime';
__compactRuntime.checkRuntimeVersion('0.16.0');

const _descriptor_0 = new __compactRuntime.CompactTypeBytes(32);

const _descriptor_1 = new __compactRuntime.CompactTypeUnsignedInteger(255n, 1);

const _descriptor_2 = new __compactRuntime.CompactTypeUnsignedInteger(18446744073709551615n, 8);

const _descriptor_3 = __compactRuntime.CompactTypeBoolean;

class _ReviewPublicState_0 {
  alignment() {
    return _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment())))));
  }
  fromValue(value_0) {
    return {
      employee_hash: _descriptor_0.fromValue(value_0),
      reviewer_hash: _descriptor_0.fromValue(value_0),
      status: _descriptor_1.fromValue(value_0),
      timestamp: _descriptor_2.fromValue(value_0),
      commitment: _descriptor_0.fromValue(value_0),
      exists: _descriptor_3.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.employee_hash).concat(_descriptor_0.toValue(value_0.reviewer_hash).concat(_descriptor_1.toValue(value_0.status).concat(_descriptor_2.toValue(value_0.timestamp).concat(_descriptor_0.toValue(value_0.commitment).concat(_descriptor_3.toValue(value_0.exists))))));
  }
}

const _descriptor_4 = new _ReviewPublicState_0();

class _PrivateReview_0 {
  alignment() {
    return _descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_2.alignment()))))));
  }
  fromValue(value_0) {
    return {
      rating: _descriptor_1.fromValue(value_0),
      strengths: _descriptor_0.fromValue(value_0),
      areas_for_improvement: _descriptor_0.fromValue(value_0),
      comments: _descriptor_0.fromValue(value_0),
      goals: _descriptor_0.fromValue(value_0),
      promotion_recommendation: _descriptor_3.fromValue(value_0),
      salary_recommendation: _descriptor_2.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_1.toValue(value_0.rating).concat(_descriptor_0.toValue(value_0.strengths).concat(_descriptor_0.toValue(value_0.areas_for_improvement).concat(_descriptor_0.toValue(value_0.comments).concat(_descriptor_0.toValue(value_0.goals).concat(_descriptor_3.toValue(value_0.promotion_recommendation).concat(_descriptor_2.toValue(value_0.salary_recommendation)))))));
  }
}

const _descriptor_5 = new _PrivateReview_0();

class _Either_0 {
  alignment() {
    return _descriptor_3.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment()));
  }
  fromValue(value_0) {
    return {
      is_left: _descriptor_3.fromValue(value_0),
      left: _descriptor_0.fromValue(value_0),
      right: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_3.toValue(value_0.is_left).concat(_descriptor_0.toValue(value_0.left).concat(_descriptor_0.toValue(value_0.right)));
  }
}

const _descriptor_6 = new _Either_0();

const _descriptor_7 = new __compactRuntime.CompactTypeUnsignedInteger(340282366920938463463374607431768211455n, 16);

class _ContractAddress_0 {
  alignment() {
    return _descriptor_0.alignment();
  }
  fromValue(value_0) {
    return {
      bytes: _descriptor_0.fromValue(value_0)
    }
  }
  toValue(value_0) {
    return _descriptor_0.toValue(value_0.bytes);
  }
}

const _descriptor_8 = new _ContractAddress_0();

export class Contract {
  witnesses;
  constructor(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract constructor: expected 1 argument, received ${args_0.length}`);
    }
    const witnesses_0 = args_0[0];
    if (typeof(witnesses_0) !== 'object') {
      throw new __compactRuntime.CompactError('first (witnesses) argument to Contract constructor is not an object');
    }
    this.witnesses = witnesses_0;
    this.circuits = {
      submitReview: (...args_1) => {
        if (args_1.length !== 12) {
          throw new __compactRuntime.CompactError(`submitReview: expected 12 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const review_id_0 = args_1[1];
        const employee_hash_0 = args_1[2];
        const reviewer_hash_0 = args_1[3];
        const rating_0 = args_1[4];
        const strengths_0 = args_1[5];
        const areas_for_improvement_0 = args_1[6];
        const comments_0 = args_1[7];
        const goals_0 = args_1[8];
        const promotion_recommendation_0 = args_1[9];
        const salary_recommendation_0 = args_1[10];
        const timestamp_0 = args_1[11];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(review_id_0.buffer instanceof ArrayBuffer && review_id_0.BYTES_PER_ELEMENT === 1 && review_id_0.length === 32)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Bytes<32>',
                                     review_id_0)
        }
        if (!(employee_hash_0.buffer instanceof ArrayBuffer && employee_hash_0.BYTES_PER_ELEMENT === 1 && employee_hash_0.length === 32)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Bytes<32>',
                                     employee_hash_0)
        }
        if (!(reviewer_hash_0.buffer instanceof ArrayBuffer && reviewer_hash_0.BYTES_PER_ELEMENT === 1 && reviewer_hash_0.length === 32)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Bytes<32>',
                                     reviewer_hash_0)
        }
        if (!(typeof(rating_0) === 'bigint' && rating_0 >= 0n && rating_0 <= 255n)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Uint<0..256>',
                                     rating_0)
        }
        if (!(strengths_0.buffer instanceof ArrayBuffer && strengths_0.BYTES_PER_ELEMENT === 1 && strengths_0.length === 32)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Bytes<32>',
                                     strengths_0)
        }
        if (!(areas_for_improvement_0.buffer instanceof ArrayBuffer && areas_for_improvement_0.BYTES_PER_ELEMENT === 1 && areas_for_improvement_0.length === 32)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Bytes<32>',
                                     areas_for_improvement_0)
        }
        if (!(comments_0.buffer instanceof ArrayBuffer && comments_0.BYTES_PER_ELEMENT === 1 && comments_0.length === 32)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Bytes<32>',
                                     comments_0)
        }
        if (!(goals_0.buffer instanceof ArrayBuffer && goals_0.BYTES_PER_ELEMENT === 1 && goals_0.length === 32)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Bytes<32>',
                                     goals_0)
        }
        if (!(typeof(promotion_recommendation_0) === 'boolean')) {
          __compactRuntime.typeError('submitReview',
                                     'argument 9 (argument 10 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Boolean',
                                     promotion_recommendation_0)
        }
        if (!(typeof(salary_recommendation_0) === 'bigint' && salary_recommendation_0 >= 0n && salary_recommendation_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 10 (argument 11 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Uint<0..18446744073709551616>',
                                     salary_recommendation_0)
        }
        if (!(typeof(timestamp_0) === 'bigint' && timestamp_0 >= 0n && timestamp_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitReview',
                                     'argument 11 (argument 12 as invoked from Typescript)',
                                     'hello-world.compact line 27 char 1',
                                     'Uint<0..18446744073709551616>',
                                     timestamp_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(review_id_0).concat(_descriptor_0.toValue(employee_hash_0).concat(_descriptor_0.toValue(reviewer_hash_0).concat(_descriptor_1.toValue(rating_0).concat(_descriptor_0.toValue(strengths_0).concat(_descriptor_0.toValue(areas_for_improvement_0).concat(_descriptor_0.toValue(comments_0).concat(_descriptor_0.toValue(goals_0).concat(_descriptor_3.toValue(promotion_recommendation_0).concat(_descriptor_2.toValue(salary_recommendation_0).concat(_descriptor_2.toValue(timestamp_0))))))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_2.alignment().concat(_descriptor_2.alignment()))))))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._submitReview_0(context,
                                              partialProofData,
                                              review_id_0,
                                              employee_hash_0,
                                              reviewer_hash_0,
                                              rating_0,
                                              strengths_0,
                                              areas_for_improvement_0,
                                              comments_0,
                                              goals_0,
                                              promotion_recommendation_0,
                                              salary_recommendation_0,
                                              timestamp_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      acknowledgeReview: (...args_1) => {
        if (args_1.length !== 9) {
          throw new __compactRuntime.CompactError(`acknowledgeReview: expected 9 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const review_id_0 = args_1[1];
        const rating_0 = args_1[2];
        const strengths_0 = args_1[3];
        const areas_for_improvement_0 = args_1[4];
        const comments_0 = args_1[5];
        const goals_0 = args_1[6];
        const promotion_recommendation_0 = args_1[7];
        const salary_recommendation_0 = args_1[8];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(review_id_0.buffer instanceof ArrayBuffer && review_id_0.BYTES_PER_ELEMENT === 1 && review_id_0.length === 32)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Bytes<32>',
                                     review_id_0)
        }
        if (!(typeof(rating_0) === 'bigint' && rating_0 >= 0n && rating_0 <= 255n)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Uint<0..256>',
                                     rating_0)
        }
        if (!(strengths_0.buffer instanceof ArrayBuffer && strengths_0.BYTES_PER_ELEMENT === 1 && strengths_0.length === 32)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Bytes<32>',
                                     strengths_0)
        }
        if (!(areas_for_improvement_0.buffer instanceof ArrayBuffer && areas_for_improvement_0.BYTES_PER_ELEMENT === 1 && areas_for_improvement_0.length === 32)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Bytes<32>',
                                     areas_for_improvement_0)
        }
        if (!(comments_0.buffer instanceof ArrayBuffer && comments_0.BYTES_PER_ELEMENT === 1 && comments_0.length === 32)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Bytes<32>',
                                     comments_0)
        }
        if (!(goals_0.buffer instanceof ArrayBuffer && goals_0.BYTES_PER_ELEMENT === 1 && goals_0.length === 32)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Bytes<32>',
                                     goals_0)
        }
        if (!(typeof(promotion_recommendation_0) === 'boolean')) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Boolean',
                                     promotion_recommendation_0)
        }
        if (!(typeof(salary_recommendation_0) === 'bigint' && salary_recommendation_0 >= 0n && salary_recommendation_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('acknowledgeReview',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'hello-world.compact line 63 char 1',
                                     'Uint<0..18446744073709551616>',
                                     salary_recommendation_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(review_id_0).concat(_descriptor_1.toValue(rating_0).concat(_descriptor_0.toValue(strengths_0).concat(_descriptor_0.toValue(areas_for_improvement_0).concat(_descriptor_0.toValue(comments_0).concat(_descriptor_0.toValue(goals_0).concat(_descriptor_3.toValue(promotion_recommendation_0).concat(_descriptor_2.toValue(salary_recommendation_0)))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_2.alignment())))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._acknowledgeReview_0(context,
                                                   partialProofData,
                                                   review_id_0,
                                                   rating_0,
                                                   strengths_0,
                                                   areas_for_improvement_0,
                                                   comments_0,
                                                   goals_0,
                                                   promotion_recommendation_0,
                                                   salary_recommendation_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      submitAppeal: (...args_1) => {
        if (args_1.length !== 10) {
          throw new __compactRuntime.CompactError(`submitAppeal: expected 10 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const review_id_0 = args_1[1];
        const rating_0 = args_1[2];
        const strengths_0 = args_1[3];
        const areas_for_improvement_0 = args_1[4];
        const comments_0 = args_1[5];
        const goals_0 = args_1[6];
        const promotion_recommendation_0 = args_1[7];
        const salary_recommendation_0 = args_1[8];
        const appeal_message_0 = args_1[9];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(review_id_0.buffer instanceof ArrayBuffer && review_id_0.BYTES_PER_ELEMENT === 1 && review_id_0.length === 32)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Bytes<32>',
                                     review_id_0)
        }
        if (!(typeof(rating_0) === 'bigint' && rating_0 >= 0n && rating_0 <= 255n)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Uint<0..256>',
                                     rating_0)
        }
        if (!(strengths_0.buffer instanceof ArrayBuffer && strengths_0.BYTES_PER_ELEMENT === 1 && strengths_0.length === 32)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 3 (argument 4 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Bytes<32>',
                                     strengths_0)
        }
        if (!(areas_for_improvement_0.buffer instanceof ArrayBuffer && areas_for_improvement_0.BYTES_PER_ELEMENT === 1 && areas_for_improvement_0.length === 32)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 4 (argument 5 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Bytes<32>',
                                     areas_for_improvement_0)
        }
        if (!(comments_0.buffer instanceof ArrayBuffer && comments_0.BYTES_PER_ELEMENT === 1 && comments_0.length === 32)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 5 (argument 6 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Bytes<32>',
                                     comments_0)
        }
        if (!(goals_0.buffer instanceof ArrayBuffer && goals_0.BYTES_PER_ELEMENT === 1 && goals_0.length === 32)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 6 (argument 7 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Bytes<32>',
                                     goals_0)
        }
        if (!(typeof(promotion_recommendation_0) === 'boolean')) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 7 (argument 8 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Boolean',
                                     promotion_recommendation_0)
        }
        if (!(typeof(salary_recommendation_0) === 'bigint' && salary_recommendation_0 >= 0n && salary_recommendation_0 <= 18446744073709551615n)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 8 (argument 9 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Uint<0..18446744073709551616>',
                                     salary_recommendation_0)
        }
        if (!(appeal_message_0.buffer instanceof ArrayBuffer && appeal_message_0.BYTES_PER_ELEMENT === 1 && appeal_message_0.length === 32)) {
          __compactRuntime.typeError('submitAppeal',
                                     'argument 9 (argument 10 as invoked from Typescript)',
                                     'hello-world.compact line 100 char 1',
                                     'Bytes<32>',
                                     appeal_message_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(review_id_0).concat(_descriptor_1.toValue(rating_0).concat(_descriptor_0.toValue(strengths_0).concat(_descriptor_0.toValue(areas_for_improvement_0).concat(_descriptor_0.toValue(comments_0).concat(_descriptor_0.toValue(goals_0).concat(_descriptor_3.toValue(promotion_recommendation_0).concat(_descriptor_2.toValue(salary_recommendation_0).concat(_descriptor_0.toValue(appeal_message_0))))))))),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_0.alignment().concat(_descriptor_3.alignment().concat(_descriptor_2.alignment().concat(_descriptor_0.alignment()))))))))
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._submitAppeal_0(context,
                                              partialProofData,
                                              review_id_0,
                                              rating_0,
                                              strengths_0,
                                              areas_for_improvement_0,
                                              comments_0,
                                              goals_0,
                                              promotion_recommendation_0,
                                              salary_recommendation_0,
                                              appeal_message_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      getReviewStatus: (...args_1) => {
        if (args_1.length !== 2) {
          throw new __compactRuntime.CompactError(`getReviewStatus: expected 2 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const review_id_0 = args_1[1];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('getReviewStatus',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 140 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(review_id_0.buffer instanceof ArrayBuffer && review_id_0.BYTES_PER_ELEMENT === 1 && review_id_0.length === 32)) {
          __compactRuntime.typeError('getReviewStatus',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 140 char 1',
                                     'Bytes<32>',
                                     review_id_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(review_id_0),
            alignment: _descriptor_0.alignment()
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._getReviewStatus_0(context,
                                                 partialProofData,
                                                 review_id_0);
        partialProofData.output = { value: _descriptor_1.toValue(result_0), alignment: _descriptor_1.alignment() };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      },
      updateReviewStatus: (...args_1) => {
        if (args_1.length !== 3) {
          throw new __compactRuntime.CompactError(`updateReviewStatus: expected 3 arguments (as invoked from Typescript), received ${args_1.length}`);
        }
        const contextOrig_0 = args_1[0];
        const review_id_0 = args_1[1];
        const new_status_0 = args_1[2];
        if (!(typeof(contextOrig_0) === 'object' && contextOrig_0.currentQueryContext != undefined)) {
          __compactRuntime.typeError('updateReviewStatus',
                                     'argument 1 (as invoked from Typescript)',
                                     'hello-world.compact line 146 char 1',
                                     'CircuitContext',
                                     contextOrig_0)
        }
        if (!(review_id_0.buffer instanceof ArrayBuffer && review_id_0.BYTES_PER_ELEMENT === 1 && review_id_0.length === 32)) {
          __compactRuntime.typeError('updateReviewStatus',
                                     'argument 1 (argument 2 as invoked from Typescript)',
                                     'hello-world.compact line 146 char 1',
                                     'Bytes<32>',
                                     review_id_0)
        }
        if (!(typeof(new_status_0) === 'bigint' && new_status_0 >= 0n && new_status_0 <= 255n)) {
          __compactRuntime.typeError('updateReviewStatus',
                                     'argument 2 (argument 3 as invoked from Typescript)',
                                     'hello-world.compact line 146 char 1',
                                     'Uint<0..256>',
                                     new_status_0)
        }
        const context = { ...contextOrig_0, gasCost: __compactRuntime.emptyRunningCost() };
        const partialProofData = {
          input: {
            value: _descriptor_0.toValue(review_id_0).concat(_descriptor_1.toValue(new_status_0)),
            alignment: _descriptor_0.alignment().concat(_descriptor_1.alignment())
          },
          output: undefined,
          publicTranscript: [],
          privateTranscriptOutputs: []
        };
        const result_0 = this._updateReviewStatus_0(context,
                                                    partialProofData,
                                                    review_id_0,
                                                    new_status_0);
        partialProofData.output = { value: [], alignment: [] };
        return { result: result_0, context: context, proofData: partialProofData, gasCost: context.gasCost };
      }
    };
    this.impureCircuits = {
      submitReview: this.circuits.submitReview,
      acknowledgeReview: this.circuits.acknowledgeReview,
      submitAppeal: this.circuits.submitAppeal,
      getReviewStatus: this.circuits.getReviewStatus,
      updateReviewStatus: this.circuits.updateReviewStatus
    };
    this.provableCircuits = {
      submitReview: this.circuits.submitReview,
      acknowledgeReview: this.circuits.acknowledgeReview,
      submitAppeal: this.circuits.submitAppeal,
      getReviewStatus: this.circuits.getReviewStatus,
      updateReviewStatus: this.circuits.updateReviewStatus
    };
  }
  initialState(...args_0) {
    if (args_0.length !== 1) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 1 argument (as invoked from Typescript), received ${args_0.length}`);
    }
    const constructorContext_0 = args_0[0];
    if (typeof(constructorContext_0) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'constructorContext' in argument 1 (as invoked from Typescript) to be an object`);
    }
    if (!('initialZswapLocalState' in constructorContext_0)) {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript)`);
    }
    if (typeof(constructorContext_0.initialZswapLocalState) !== 'object') {
      throw new __compactRuntime.CompactError(`Contract state constructor: expected 'initialZswapLocalState' in argument 1 (as invoked from Typescript) to be an object`);
    }
    const state_0 = new __compactRuntime.ContractState();
    let stateValue_0 = __compactRuntime.StateValue.newArray();
    stateValue_0 = stateValue_0.arrayPush(__compactRuntime.StateValue.newNull());
    state_0.data = new __compactRuntime.ChargedState(stateValue_0);
    state_0.setOperation('submitReview', new __compactRuntime.ContractOperation());
    state_0.setOperation('acknowledgeReview', new __compactRuntime.ContractOperation());
    state_0.setOperation('submitAppeal', new __compactRuntime.ContractOperation());
    state_0.setOperation('getReviewStatus', new __compactRuntime.ContractOperation());
    state_0.setOperation('updateReviewStatus', new __compactRuntime.ContractOperation());
    const context = __compactRuntime.createCircuitContext(__compactRuntime.dummyContractAddress(), constructorContext_0.initialZswapLocalState.coinPublicKey, state_0.data, constructorContext_0.initialPrivateState);
    const partialProofData = {
      input: { value: [], alignment: [] },
      output: undefined,
      publicTranscript: [],
      privateTranscriptOutputs: []
    };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_1.toValue(0n),
                                                                                              alignment: _descriptor_1.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newMap(
                                                          new __compactRuntime.StateMap()
                                                        ).encode() } },
                                       { ins: { cached: false, n: 1 } }]);
    state_0.data = new __compactRuntime.ChargedState(context.currentQueryContext.state.state);
    return {
      currentContractState: state_0,
      currentPrivateState: context.currentPrivateState,
      currentZswapLocalState: context.currentZswapLocalState
    }
  }
  _persistentHash_0(value_0) {
    const result_0 = __compactRuntime.persistentHash(_descriptor_5, value_0);
    return result_0;
  }
  _submitReview_0(context,
                  partialProofData,
                  review_id_0,
                  employee_hash_0,
                  reviewer_hash_0,
                  rating_0,
                  strengths_0,
                  areas_for_improvement_0,
                  comments_0,
                  goals_0,
                  promotion_recommendation_0,
                  salary_recommendation_0,
                  timestamp_0)
  {
    __compactRuntime.assert(!_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                       partialProofData,
                                                                                       [
                                                                                        { dup: { n: 0 } },
                                                                                        { idx: { cached: false,
                                                                                                 pushPath: false,
                                                                                                 path: [
                                                                                                        { tag: 'value',
                                                                                                          value: { value: _descriptor_1.toValue(0n),
                                                                                                                   alignment: _descriptor_1.alignment() } }] } },
                                                                                        { push: { storage: false,
                                                                                                  value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                                                                               alignment: _descriptor_0.alignment() }).encode() } },
                                                                                        'member',
                                                                                        { popeq: { cached: true,
                                                                                                   result: undefined } }]).value),
                            'review already exists');
    const commitment_0 = this._persistentHash_0({ rating: rating_0,
                                                  strengths: strengths_0,
                                                  areas_for_improvement:
                                                    areas_for_improvement_0,
                                                  comments: comments_0,
                                                  goals: goals_0,
                                                  promotion_recommendation:
                                                    promotion_recommendation_0,
                                                  salary_recommendation:
                                                    salary_recommendation_0 });
    const tmp_0 = { employee_hash: employee_hash_0,
                    reviewer_hash: reviewer_hash_0,
                    status: 1n,
                    timestamp: timestamp_0,
                    commitment: commitment_0,
                    exists: true };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _acknowledgeReview_0(context,
                       partialProofData,
                       review_id_0,
                       rating_0,
                       strengths_0,
                       areas_for_improvement_0,
                       comments_0,
                       goals_0,
                       promotion_recommendation_0,
                       salary_recommendation_0)
  {
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(0n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'review does not exist');
    const review_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(0n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(review_id_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    __compactRuntime.assert(this._equal_0(review_0.status, 1n),
                            'review must be in Submitted status to acknowledge');
    const computed_commitment_0 = this._persistentHash_0({ rating: rating_0,
                                                           strengths:
                                                             strengths_0,
                                                           areas_for_improvement:
                                                             areas_for_improvement_0,
                                                           comments: comments_0,
                                                           goals: goals_0,
                                                           promotion_recommendation:
                                                             promotion_recommendation_0,
                                                           salary_recommendation:
                                                             salary_recommendation_0 });
    __compactRuntime.assert(this._equal_1(computed_commitment_0,
                                          review_0.commitment),
                            'witness verification failed (commitment mismatch)');
    const tmp_0 = { employee_hash: review_0.employee_hash,
                    reviewer_hash: review_0.reviewer_hash,
                    status: 2n,
                    timestamp: review_0.timestamp,
                    commitment: review_0.commitment,
                    exists: review_0.exists };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _submitAppeal_0(context,
                  partialProofData,
                  review_id_0,
                  rating_0,
                  strengths_0,
                  areas_for_improvement_0,
                  comments_0,
                  goals_0,
                  promotion_recommendation_0,
                  salary_recommendation_0,
                  appeal_message_0)
  {
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(0n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'review does not exist');
    const review_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(0n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(review_id_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    __compactRuntime.assert(this._equal_2(review_0.status, 2n),
                            'review must be in Acknowledged status to appeal');
    const computed_commitment_0 = this._persistentHash_0({ rating: rating_0,
                                                           strengths:
                                                             strengths_0,
                                                           areas_for_improvement:
                                                             areas_for_improvement_0,
                                                           comments: comments_0,
                                                           goals: goals_0,
                                                           promotion_recommendation:
                                                             promotion_recommendation_0,
                                                           salary_recommendation:
                                                             salary_recommendation_0 });
    __compactRuntime.assert(this._equal_3(computed_commitment_0,
                                          review_0.commitment),
                            'witness verification failed (commitment mismatch)');
    const tmp_0 = { employee_hash: review_0.employee_hash,
                    reviewer_hash: review_0.reviewer_hash,
                    status: 3n,
                    timestamp: review_0.timestamp,
                    commitment: review_0.commitment,
                    exists: review_0.exists };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _getReviewStatus_0(context, partialProofData, review_id_0) {
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(0n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'review does not exist');
    return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                     partialProofData,
                                                                     [
                                                                      { dup: { n: 0 } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_1.toValue(0n),
                                                                                                 alignment: _descriptor_1.alignment() } }] } },
                                                                      { idx: { cached: false,
                                                                               pushPath: false,
                                                                               path: [
                                                                                      { tag: 'value',
                                                                                        value: { value: _descriptor_0.toValue(review_id_0),
                                                                                                 alignment: _descriptor_0.alignment() } }] } },
                                                                      { popeq: { cached: false,
                                                                                 result: undefined } }]).value).status;
  }
  _updateReviewStatus_0(context, partialProofData, review_id_0, new_status_0) {
    __compactRuntime.assert(_descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                                      partialProofData,
                                                                                      [
                                                                                       { dup: { n: 0 } },
                                                                                       { idx: { cached: false,
                                                                                                pushPath: false,
                                                                                                path: [
                                                                                                       { tag: 'value',
                                                                                                         value: { value: _descriptor_1.toValue(0n),
                                                                                                                  alignment: _descriptor_1.alignment() } }] } },
                                                                                       { push: { storage: false,
                                                                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                                                                       'member',
                                                                                       { popeq: { cached: true,
                                                                                                  result: undefined } }]).value),
                            'review does not exist');
    const review_0 = _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                               partialProofData,
                                                                               [
                                                                                { dup: { n: 0 } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_1.toValue(0n),
                                                                                                           alignment: _descriptor_1.alignment() } }] } },
                                                                                { idx: { cached: false,
                                                                                         pushPath: false,
                                                                                         path: [
                                                                                                { tag: 'value',
                                                                                                  value: { value: _descriptor_0.toValue(review_id_0),
                                                                                                           alignment: _descriptor_0.alignment() } }] } },
                                                                                { popeq: { cached: false,
                                                                                           result: undefined } }]).value);
    const tmp_0 = { employee_hash: review_0.employee_hash,
                    reviewer_hash: review_0.reviewer_hash,
                    status: new_status_0,
                    timestamp: review_0.timestamp,
                    commitment: review_0.commitment,
                    exists: review_0.exists };
    __compactRuntime.queryLedgerState(context,
                                      partialProofData,
                                      [
                                       { idx: { cached: false,
                                                pushPath: true,
                                                path: [
                                                       { tag: 'value',
                                                         value: { value: _descriptor_1.toValue(0n),
                                                                  alignment: _descriptor_1.alignment() } }] } },
                                       { push: { storage: false,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(review_id_0),
                                                                                              alignment: _descriptor_0.alignment() }).encode() } },
                                       { push: { storage: true,
                                                 value: __compactRuntime.StateValue.newCell({ value: _descriptor_4.toValue(tmp_0),
                                                                                              alignment: _descriptor_4.alignment() }).encode() } },
                                       { ins: { cached: false, n: 1 } },
                                       { ins: { cached: true, n: 1 } }]);
    return [];
  }
  _equal_0(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_1(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
  _equal_2(x0, y0) {
    if (x0 !== y0) { return false; }
    return true;
  }
  _equal_3(x0, y0) {
    if (!x0.every((x, i) => y0[i] === x)) { return false; }
    return true;
  }
}
export function ledger(stateOrChargedState) {
  const state = stateOrChargedState instanceof __compactRuntime.StateValue ? stateOrChargedState : stateOrChargedState.state;
  const chargedState = stateOrChargedState instanceof __compactRuntime.StateValue ? new __compactRuntime.ChargedState(stateOrChargedState) : stateOrChargedState;
  const context = {
    currentQueryContext: new __compactRuntime.QueryContext(chargedState, __compactRuntime.dummyContractAddress()),
    costModel: __compactRuntime.CostModel.initialCostModel()
  };
  const partialProofData = {
    input: { value: [], alignment: [] },
    output: undefined,
    publicTranscript: [],
    privateTranscriptOutputs: []
  };
  return {
    reviews: {
      isEmpty(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`isEmpty: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_2.toValue(0n),
                                                                                                                                 alignment: _descriptor_2.alignment() }).encode() } },
                                                                          'eq',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      size(...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`size: expected 0 arguments, received ${args_0.length}`);
        }
        return _descriptor_2.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          'size',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      member(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`member: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('member',
                                     'argument 1',
                                     'hello-world.compact line 24 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_3.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { push: { storage: false,
                                                                                    value: __compactRuntime.StateValue.newCell({ value: _descriptor_0.toValue(key_0),
                                                                                                                                 alignment: _descriptor_0.alignment() }).encode() } },
                                                                          'member',
                                                                          { popeq: { cached: true,
                                                                                     result: undefined } }]).value);
      },
      lookup(...args_0) {
        if (args_0.length !== 1) {
          throw new __compactRuntime.CompactError(`lookup: expected 1 argument, received ${args_0.length}`);
        }
        const key_0 = args_0[0];
        if (!(key_0.buffer instanceof ArrayBuffer && key_0.BYTES_PER_ELEMENT === 1 && key_0.length === 32)) {
          __compactRuntime.typeError('lookup',
                                     'argument 1',
                                     'hello-world.compact line 24 char 1',
                                     'Bytes<32>',
                                     key_0)
        }
        return _descriptor_4.fromValue(__compactRuntime.queryLedgerState(context,
                                                                         partialProofData,
                                                                         [
                                                                          { dup: { n: 0 } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_1.toValue(0n),
                                                                                                     alignment: _descriptor_1.alignment() } }] } },
                                                                          { idx: { cached: false,
                                                                                   pushPath: false,
                                                                                   path: [
                                                                                          { tag: 'value',
                                                                                            value: { value: _descriptor_0.toValue(key_0),
                                                                                                     alignment: _descriptor_0.alignment() } }] } },
                                                                          { popeq: { cached: false,
                                                                                     result: undefined } }]).value);
      },
      [Symbol.iterator](...args_0) {
        if (args_0.length !== 0) {
          throw new __compactRuntime.CompactError(`iter: expected 0 arguments, received ${args_0.length}`);
        }
        const self_0 = state.asArray()[0];
        return self_0.asMap().keys().map(  (key) => {    const value = self_0.asMap().get(key).asCell();    return [      _descriptor_0.fromValue(key.value),      _descriptor_4.fromValue(value.value)    ];  })[Symbol.iterator]();
      }
    }
  };
}
const _emptyContext = {
  currentQueryContext: new __compactRuntime.QueryContext(new __compactRuntime.ContractState().data, __compactRuntime.dummyContractAddress())
};
const _dummyContract = new Contract({ });
export const pureCircuits = {};
export const contractReferenceLocations =
  { tag: 'publicLedgerArray', indices: { } };
//# sourceMappingURL=index.js.map
