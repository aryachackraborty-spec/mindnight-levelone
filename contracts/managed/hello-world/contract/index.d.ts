import type * as __compactRuntime from '@midnight-ntwrk/compact-runtime';

export type Witnesses<PS> = {
}

export type ImpureCircuits<PS> = {
  submitReview(context: __compactRuntime.CircuitContext<PS>,
               review_id_0: Uint8Array,
               employee_hash_0: Uint8Array,
               reviewer_hash_0: Uint8Array,
               rating_0: bigint,
               strengths_0: Uint8Array,
               areas_for_improvement_0: Uint8Array,
               comments_0: Uint8Array,
               goals_0: Uint8Array,
               promotion_recommendation_0: boolean,
               salary_recommendation_0: bigint,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  acknowledgeReview(context: __compactRuntime.CircuitContext<PS>,
                    review_id_0: Uint8Array,
                    rating_0: bigint,
                    strengths_0: Uint8Array,
                    areas_for_improvement_0: Uint8Array,
                    comments_0: Uint8Array,
                    goals_0: Uint8Array,
                    promotion_recommendation_0: boolean,
                    salary_recommendation_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitAppeal(context: __compactRuntime.CircuitContext<PS>,
               review_id_0: Uint8Array,
               rating_0: bigint,
               strengths_0: Uint8Array,
               areas_for_improvement_0: Uint8Array,
               comments_0: Uint8Array,
               goals_0: Uint8Array,
               promotion_recommendation_0: boolean,
               salary_recommendation_0: bigint,
               appeal_message_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getReviewStatus(context: __compactRuntime.CircuitContext<PS>,
                  review_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  updateReviewStatus(context: __compactRuntime.CircuitContext<PS>,
                     review_id_0: Uint8Array,
                     new_status_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type ProvableCircuits<PS> = {
  submitReview(context: __compactRuntime.CircuitContext<PS>,
               review_id_0: Uint8Array,
               employee_hash_0: Uint8Array,
               reviewer_hash_0: Uint8Array,
               rating_0: bigint,
               strengths_0: Uint8Array,
               areas_for_improvement_0: Uint8Array,
               comments_0: Uint8Array,
               goals_0: Uint8Array,
               promotion_recommendation_0: boolean,
               salary_recommendation_0: bigint,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  acknowledgeReview(context: __compactRuntime.CircuitContext<PS>,
                    review_id_0: Uint8Array,
                    rating_0: bigint,
                    strengths_0: Uint8Array,
                    areas_for_improvement_0: Uint8Array,
                    comments_0: Uint8Array,
                    goals_0: Uint8Array,
                    promotion_recommendation_0: boolean,
                    salary_recommendation_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitAppeal(context: __compactRuntime.CircuitContext<PS>,
               review_id_0: Uint8Array,
               rating_0: bigint,
               strengths_0: Uint8Array,
               areas_for_improvement_0: Uint8Array,
               comments_0: Uint8Array,
               goals_0: Uint8Array,
               promotion_recommendation_0: boolean,
               salary_recommendation_0: bigint,
               appeal_message_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getReviewStatus(context: __compactRuntime.CircuitContext<PS>,
                  review_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  updateReviewStatus(context: __compactRuntime.CircuitContext<PS>,
                     review_id_0: Uint8Array,
                     new_status_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type PureCircuits = {
}

export type Circuits<PS> = {
  submitReview(context: __compactRuntime.CircuitContext<PS>,
               review_id_0: Uint8Array,
               employee_hash_0: Uint8Array,
               reviewer_hash_0: Uint8Array,
               rating_0: bigint,
               strengths_0: Uint8Array,
               areas_for_improvement_0: Uint8Array,
               comments_0: Uint8Array,
               goals_0: Uint8Array,
               promotion_recommendation_0: boolean,
               salary_recommendation_0: bigint,
               timestamp_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  acknowledgeReview(context: __compactRuntime.CircuitContext<PS>,
                    review_id_0: Uint8Array,
                    rating_0: bigint,
                    strengths_0: Uint8Array,
                    areas_for_improvement_0: Uint8Array,
                    comments_0: Uint8Array,
                    goals_0: Uint8Array,
                    promotion_recommendation_0: boolean,
                    salary_recommendation_0: bigint): __compactRuntime.CircuitResults<PS, []>;
  submitAppeal(context: __compactRuntime.CircuitContext<PS>,
               review_id_0: Uint8Array,
               rating_0: bigint,
               strengths_0: Uint8Array,
               areas_for_improvement_0: Uint8Array,
               comments_0: Uint8Array,
               goals_0: Uint8Array,
               promotion_recommendation_0: boolean,
               salary_recommendation_0: bigint,
               appeal_message_0: Uint8Array): __compactRuntime.CircuitResults<PS, []>;
  getReviewStatus(context: __compactRuntime.CircuitContext<PS>,
                  review_id_0: Uint8Array): __compactRuntime.CircuitResults<PS, bigint>;
  updateReviewStatus(context: __compactRuntime.CircuitContext<PS>,
                     review_id_0: Uint8Array,
                     new_status_0: bigint): __compactRuntime.CircuitResults<PS, []>;
}

export type Ledger = {
  reviews: {
    isEmpty(): boolean;
    size(): bigint;
    member(key_0: Uint8Array): boolean;
    lookup(key_0: Uint8Array): { employee_hash: Uint8Array,
                                 reviewer_hash: Uint8Array,
                                 status: bigint,
                                 timestamp: bigint,
                                 commitment: Uint8Array,
                                 exists: boolean
                               };
    [Symbol.iterator](): Iterator<[Uint8Array, { employee_hash: Uint8Array,
  reviewer_hash: Uint8Array,
  status: bigint,
  timestamp: bigint,
  commitment: Uint8Array,
  exists: boolean
}]>
  };
}

export type ContractReferenceLocations = any;

export declare const contractReferenceLocations : ContractReferenceLocations;

export declare class Contract<PS = any, W extends Witnesses<PS> = Witnesses<PS>> {
  witnesses: W;
  circuits: Circuits<PS>;
  impureCircuits: ImpureCircuits<PS>;
  provableCircuits: ProvableCircuits<PS>;
  constructor(witnesses: W);
  initialState(context: __compactRuntime.ConstructorContext<PS>): __compactRuntime.ConstructorResult<PS>;
}

export declare function ledger(state: __compactRuntime.StateValue | __compactRuntime.ChargedState): Ledger;
export declare const pureCircuits: PureCircuits;
