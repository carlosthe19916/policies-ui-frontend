import Config from '../config/Config';
import { PagedServerPolicyResponse, Policy } from '../types/Policy/Policy';
import { useBulkMutation, useMutation, useQuery } from 'react-fetching-library';
import { Fact } from '../types/Fact';
import { Page } from '../types/Page';
import { toPolicies, toServerPolicy } from '../utils/PolicyAdapter';
import { UsePaginatedQueryResponse, useTransformQueryResponse } from '../utils/ApiUtils';
import { DeepPartial } from 'ts-essentials';
import { useNewPaginatedQuery } from '../hooks/usePaginated';
import { actionBuilder } from './Api/ActionBuilder';
import { paginatedActionBuilder } from './Api/PaginatedActionBuilder';

const urls = Config.apis.urls;

export const useGetFactsQuery = (initFetch?: boolean) => useQuery<Fact[]>(actionBuilder('GET', urls.facts).build(), initFetch);

export const useGetPoliciesQuery = (page?: Page, initFetch?: boolean): UsePaginatedQueryResponse<Policy[]> => {
    return useTransformQueryResponse(
        useNewPaginatedQuery<PagedServerPolicyResponse>(paginatedActionBuilder('GET', urls.policies).page(page).build(), initFetch),
        toPolicies
    );
};

export const useVerifyPolicyMutation = () => {
    return useMutation((policy: DeepPartial<Policy>) => {
        return actionBuilder('POST', urls.validateCondition).data(toServerPolicy(policy)).build();
    });
};

export const useBulkDeletePolicyMutation = () => {
    return useBulkMutation((policy: Policy) => {
        return actionBuilder('DELETE', urls.policy(policy.id)).build();
    });
};

export const useGetPolicyQuery = (policyId: string, initFetch?: boolean) =>
    useQuery<Policy>(actionBuilder('GET', urls.policy(policyId)).build(), initFetch);
