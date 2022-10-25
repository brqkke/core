import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
};

export type BityLinkStatus = {
  __typename?: 'BityLinkStatus';
  linkStatus?: Maybe<TokenStatus>;
  linked: Scalars['Boolean'];
};

export type BityPaymentDetails = {
  __typename?: 'BityPaymentDetails';
  account_number?: Maybe<Scalars['String']>;
  bank_address?: Maybe<Scalars['String']>;
  bank_code?: Maybe<Scalars['String']>;
  iban?: Maybe<Scalars['String']>;
  recipient?: Maybe<Scalars['String']>;
  swift_bic?: Maybe<Scalars['String']>;
};

export type CreateOrderInput = {
  amount: Scalars['Int'];
  cryptoAddress?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addVault: Vault;
  createOrder: OrderTemplate;
  deleteOrderTemplate: OrderTemplate;
  deleteVault: Vault;
  linkBity: User;
  unlinkBity: User;
  updateLocale: User;
  updateOrderTemplate: OrderTemplate;
};


export type MutationAddVaultArgs = {
  data: VaultInput;
};


export type MutationCreateOrderArgs = {
  data: CreateOrderInput;
  vaultId: Scalars['ID'];
};


export type MutationDeleteOrderTemplateArgs = {
  orderTemplateId: Scalars['ID'];
};


export type MutationDeleteVaultArgs = {
  vaultId: Scalars['ID'];
};


export type MutationLinkBityArgs = {
  redirectedFrom: Scalars['String'];
};


export type MutationUpdateLocaleArgs = {
  locale: Scalars['String'];
};


export type MutationUpdateOrderTemplateArgs = {
  data: OrderInput;
  orderTemplateId: Scalars['ID'];
};

export type Order = {
  __typename?: 'Order';
  amount: Scalars['Float'];
  bankDetails?: Maybe<BityPaymentDetails>;
  currency: OrderCurrency;
  id: Scalars['String'];
  orderTemplateId?: Maybe<Scalars['String']>;
  redactedCryptoAddress?: Maybe<Scalars['String']>;
  status: Scalars['String'];
  transferLabel: Scalars['String'];
};

export enum OrderCurrency {
  Chf = 'CHF',
  Eur = 'EUR'
}

export type OrderInput = {
  amount: Scalars['Int'];
  cryptoAddress?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type OrderTemplate = {
  __typename?: 'OrderTemplate';
  activeOrder?: Maybe<Order>;
  amount: Scalars['Float'];
  id: Scalars['ID'];
  name: Scalars['String'];
  vault: Vault;
  vaultId: Scalars['ID'];
};

export type Query = {
  __typename?: 'Query';
  linkUrl: Scalars['String'];
  me: User;
  orderTemplate: OrderTemplate;
  vault: Vault;
};


export type QueryOrderTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryVaultArgs = {
  id: Scalars['ID'];
};

export enum TokenStatus {
  Active = 'ACTIVE',
  Broken = 'BROKEN',
  NeedRefreshRetry = 'NEED_REFRESH_RETRY'
}

export type User = {
  __typename?: 'User';
  bityTokenStatus: BityLinkStatus;
  email: Scalars['String'];
  id: Scalars['ID'];
  locale: Scalars['String'];
  vaults: Array<Vault>;
};

export type Vault = {
  __typename?: 'Vault';
  createdAt: Scalars['DateTime'];
  currency: Scalars['String'];
  id: Scalars['String'];
  name: Scalars['String'];
  orderTemplates: Array<OrderTemplate>;
  userId: Scalars['String'];
};

export type VaultInput = {
  currency: OrderCurrency;
  name: Scalars['String'];
};

export type VaultShortInfosFragment = { __typename?: 'Vault', id: string, currency: string, name: string };

export type BityStatusFragment = { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } };

export type UserProfileFragment = { __typename?: 'User', id: string, locale: string, email: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } };

export type VaultInfosFragment = { __typename?: 'Vault', id: string, currency: string, name: string, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null }> };

export type BankDetailsFragment = { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null };

export type OrderInfosFragment = { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null };

export type OrderTemplateInfosFragment = { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null };

export type UnlinkBityMutationVariables = Exact<{ [key: string]: never; }>;


export type UnlinkBityMutation = { __typename?: 'Mutation', unlinkBity: { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type LinkBityMutationVariables = Exact<{
  redirectedFrom: Scalars['String'];
}>;


export type LinkBityMutation = { __typename?: 'Mutation', linkBity: { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type BityLinkUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type BityLinkUrlQuery = { __typename?: 'Query', linkUrl: string };

export type UpdateLocaleMutationVariables = Exact<{
  locale: Scalars['String'];
}>;


export type UpdateLocaleMutation = { __typename?: 'Mutation', updateLocale: { __typename?: 'User', locale: string, id: string } };

export type AddVaultMutationVariables = Exact<{
  data: VaultInput;
}>;


export type AddVaultMutation = { __typename?: 'Mutation', addVault: { __typename?: 'Vault', id: string, currency: string, name: string, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null }> } };

export type DeleteVaultMutationVariables = Exact<{
  vaultId: Scalars['ID'];
}>;


export type DeleteVaultMutation = { __typename?: 'Mutation', deleteVault: { __typename?: 'Vault', id: string } };

export type VaultsQueryVariables = Exact<{ [key: string]: never; }>;


export type VaultsQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, vaults: Array<{ __typename?: 'Vault', id: string, currency: string, name: string, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null }> }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, locale: string, email: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type BityStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type BityStatusQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type VaultQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VaultQuery = { __typename?: 'Query', vault: { __typename?: 'Vault', id: string, currency: string, name: string } };

export type AddOrderMutationVariables = Exact<{
  data: CreateOrderInput;
  vaultId: Scalars['ID'];
}>;


export type AddOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, vault: { __typename?: 'Vault', id: string, currency: string, name: string, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string }> }, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null } };

export type UpdateOrderMutationVariables = Exact<{
  data: OrderInput;
  orderTemplateId: Scalars['ID'];
}>;


export type UpdateOrderMutation = { __typename?: 'Mutation', updateOrderTemplate: { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null } };

export type DeleteOrderMutationVariables = Exact<{
  orderTemplateId: Scalars['ID'];
}>;


export type DeleteOrderMutation = { __typename?: 'Mutation', deleteOrderTemplate: { __typename?: 'OrderTemplate', id: string } };

export type OrderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderQuery = { __typename?: 'Query', orderTemplate: { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: string, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null } };

export const VaultShortInfosFragmentDoc = gql`
    fragment VaultShortInfos on Vault {
  id
  currency
  name
}
    `;
export const BityStatusFragmentDoc = gql`
    fragment BityStatus on User {
  id
  bityTokenStatus {
    linked
    linkStatus
  }
}
    `;
export const UserProfileFragmentDoc = gql`
    fragment UserProfile on User {
  ...BityStatus
  id
  locale
  email
}
    ${BityStatusFragmentDoc}`;
export const BankDetailsFragmentDoc = gql`
    fragment BankDetails on BityPaymentDetails {
  account_number
  bank_address
  bank_code
  iban
  recipient
  swift_bic
}
    `;
export const OrderInfosFragmentDoc = gql`
    fragment OrderInfos on Order {
  id
  amount
  currency
  bankDetails {
    ...BankDetails
  }
  redactedCryptoAddress
  status
  transferLabel
  orderTemplateId
}
    ${BankDetailsFragmentDoc}`;
export const OrderTemplateInfosFragmentDoc = gql`
    fragment OrderTemplateInfos on OrderTemplate {
  id
  name
  amount
  vaultId
  activeOrder {
    ...OrderInfos
  }
}
    ${OrderInfosFragmentDoc}`;
export const VaultInfosFragmentDoc = gql`
    fragment VaultInfos on Vault {
  id
  currency
  name
  orderTemplates {
    ...OrderTemplateInfos
  }
}
    ${OrderTemplateInfosFragmentDoc}`;
export const UnlinkBityDocument = gql`
    mutation unlinkBity {
  unlinkBity {
    ...BityStatus
  }
}
    ${BityStatusFragmentDoc}`;
export type UnlinkBityMutationFn = Apollo.MutationFunction<UnlinkBityMutation, UnlinkBityMutationVariables>;

/**
 * __useUnlinkBityMutation__
 *
 * To run a mutation, you first call `useUnlinkBityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUnlinkBityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [unlinkBityMutation, { data, loading, error }] = useUnlinkBityMutation({
 *   variables: {
 *   },
 * });
 */
export function useUnlinkBityMutation(baseOptions?: Apollo.MutationHookOptions<UnlinkBityMutation, UnlinkBityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UnlinkBityMutation, UnlinkBityMutationVariables>(UnlinkBityDocument, options);
      }
export type UnlinkBityMutationHookResult = ReturnType<typeof useUnlinkBityMutation>;
export type UnlinkBityMutationResult = Apollo.MutationResult<UnlinkBityMutation>;
export type UnlinkBityMutationOptions = Apollo.BaseMutationOptions<UnlinkBityMutation, UnlinkBityMutationVariables>;
export const LinkBityDocument = gql`
    mutation linkBity($redirectedFrom: String!) {
  linkBity(redirectedFrom: $redirectedFrom) {
    ...BityStatus
  }
}
    ${BityStatusFragmentDoc}`;
export type LinkBityMutationFn = Apollo.MutationFunction<LinkBityMutation, LinkBityMutationVariables>;

/**
 * __useLinkBityMutation__
 *
 * To run a mutation, you first call `useLinkBityMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLinkBityMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [linkBityMutation, { data, loading, error }] = useLinkBityMutation({
 *   variables: {
 *      redirectedFrom: // value for 'redirectedFrom'
 *   },
 * });
 */
export function useLinkBityMutation(baseOptions?: Apollo.MutationHookOptions<LinkBityMutation, LinkBityMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LinkBityMutation, LinkBityMutationVariables>(LinkBityDocument, options);
      }
export type LinkBityMutationHookResult = ReturnType<typeof useLinkBityMutation>;
export type LinkBityMutationResult = Apollo.MutationResult<LinkBityMutation>;
export type LinkBityMutationOptions = Apollo.BaseMutationOptions<LinkBityMutation, LinkBityMutationVariables>;
export const BityLinkUrlDocument = gql`
    query bityLinkUrl {
  linkUrl
}
    `;

/**
 * __useBityLinkUrlQuery__
 *
 * To run a query within a React component, call `useBityLinkUrlQuery` and pass it any options that fit your needs.
 * When your component renders, `useBityLinkUrlQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBityLinkUrlQuery({
 *   variables: {
 *   },
 * });
 */
export function useBityLinkUrlQuery(baseOptions?: Apollo.QueryHookOptions<BityLinkUrlQuery, BityLinkUrlQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BityLinkUrlQuery, BityLinkUrlQueryVariables>(BityLinkUrlDocument, options);
      }
export function useBityLinkUrlLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BityLinkUrlQuery, BityLinkUrlQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BityLinkUrlQuery, BityLinkUrlQueryVariables>(BityLinkUrlDocument, options);
        }
export type BityLinkUrlQueryHookResult = ReturnType<typeof useBityLinkUrlQuery>;
export type BityLinkUrlLazyQueryHookResult = ReturnType<typeof useBityLinkUrlLazyQuery>;
export type BityLinkUrlQueryResult = Apollo.QueryResult<BityLinkUrlQuery, BityLinkUrlQueryVariables>;
export const UpdateLocaleDocument = gql`
    mutation updateLocale($locale: String!) {
  updateLocale(locale: $locale) {
    locale
    id
  }
}
    `;
export type UpdateLocaleMutationFn = Apollo.MutationFunction<UpdateLocaleMutation, UpdateLocaleMutationVariables>;

/**
 * __useUpdateLocaleMutation__
 *
 * To run a mutation, you first call `useUpdateLocaleMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateLocaleMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateLocaleMutation, { data, loading, error }] = useUpdateLocaleMutation({
 *   variables: {
 *      locale: // value for 'locale'
 *   },
 * });
 */
export function useUpdateLocaleMutation(baseOptions?: Apollo.MutationHookOptions<UpdateLocaleMutation, UpdateLocaleMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateLocaleMutation, UpdateLocaleMutationVariables>(UpdateLocaleDocument, options);
      }
export type UpdateLocaleMutationHookResult = ReturnType<typeof useUpdateLocaleMutation>;
export type UpdateLocaleMutationResult = Apollo.MutationResult<UpdateLocaleMutation>;
export type UpdateLocaleMutationOptions = Apollo.BaseMutationOptions<UpdateLocaleMutation, UpdateLocaleMutationVariables>;
export const AddVaultDocument = gql`
    mutation addVault($data: VaultInput!) {
  addVault(data: $data) {
    ...VaultInfos
  }
}
    ${VaultInfosFragmentDoc}`;
export type AddVaultMutationFn = Apollo.MutationFunction<AddVaultMutation, AddVaultMutationVariables>;

/**
 * __useAddVaultMutation__
 *
 * To run a mutation, you first call `useAddVaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddVaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addVaultMutation, { data, loading, error }] = useAddVaultMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useAddVaultMutation(baseOptions?: Apollo.MutationHookOptions<AddVaultMutation, AddVaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddVaultMutation, AddVaultMutationVariables>(AddVaultDocument, options);
      }
export type AddVaultMutationHookResult = ReturnType<typeof useAddVaultMutation>;
export type AddVaultMutationResult = Apollo.MutationResult<AddVaultMutation>;
export type AddVaultMutationOptions = Apollo.BaseMutationOptions<AddVaultMutation, AddVaultMutationVariables>;
export const DeleteVaultDocument = gql`
    mutation deleteVault($vaultId: ID!) {
  deleteVault(vaultId: $vaultId) {
    id
  }
}
    `;
export type DeleteVaultMutationFn = Apollo.MutationFunction<DeleteVaultMutation, DeleteVaultMutationVariables>;

/**
 * __useDeleteVaultMutation__
 *
 * To run a mutation, you first call `useDeleteVaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteVaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteVaultMutation, { data, loading, error }] = useDeleteVaultMutation({
 *   variables: {
 *      vaultId: // value for 'vaultId'
 *   },
 * });
 */
export function useDeleteVaultMutation(baseOptions?: Apollo.MutationHookOptions<DeleteVaultMutation, DeleteVaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteVaultMutation, DeleteVaultMutationVariables>(DeleteVaultDocument, options);
      }
export type DeleteVaultMutationHookResult = ReturnType<typeof useDeleteVaultMutation>;
export type DeleteVaultMutationResult = Apollo.MutationResult<DeleteVaultMutation>;
export type DeleteVaultMutationOptions = Apollo.BaseMutationOptions<DeleteVaultMutation, DeleteVaultMutationVariables>;
export const VaultsDocument = gql`
    query vaults {
  me {
    id
    vaults {
      ...VaultInfos
    }
  }
}
    ${VaultInfosFragmentDoc}`;

/**
 * __useVaultsQuery__
 *
 * To run a query within a React component, call `useVaultsQuery` and pass it any options that fit your needs.
 * When your component renders, `useVaultsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVaultsQuery({
 *   variables: {
 *   },
 * });
 */
export function useVaultsQuery(baseOptions?: Apollo.QueryHookOptions<VaultsQuery, VaultsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VaultsQuery, VaultsQueryVariables>(VaultsDocument, options);
      }
export function useVaultsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VaultsQuery, VaultsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VaultsQuery, VaultsQueryVariables>(VaultsDocument, options);
        }
export type VaultsQueryHookResult = ReturnType<typeof useVaultsQuery>;
export type VaultsLazyQueryHookResult = ReturnType<typeof useVaultsLazyQuery>;
export type VaultsQueryResult = Apollo.QueryResult<VaultsQuery, VaultsQueryVariables>;
export const MeDocument = gql`
    query me {
  me {
    ...UserProfile
  }
}
    ${UserProfileFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const BityStatusDocument = gql`
    query bityStatus {
  me {
    ...BityStatus
  }
}
    ${BityStatusFragmentDoc}`;

/**
 * __useBityStatusQuery__
 *
 * To run a query within a React component, call `useBityStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useBityStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useBityStatusQuery({
 *   variables: {
 *   },
 * });
 */
export function useBityStatusQuery(baseOptions?: Apollo.QueryHookOptions<BityStatusQuery, BityStatusQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<BityStatusQuery, BityStatusQueryVariables>(BityStatusDocument, options);
      }
export function useBityStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<BityStatusQuery, BityStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<BityStatusQuery, BityStatusQueryVariables>(BityStatusDocument, options);
        }
export type BityStatusQueryHookResult = ReturnType<typeof useBityStatusQuery>;
export type BityStatusLazyQueryHookResult = ReturnType<typeof useBityStatusLazyQuery>;
export type BityStatusQueryResult = Apollo.QueryResult<BityStatusQuery, BityStatusQueryVariables>;
export const VaultDocument = gql`
    query vault($id: ID!) {
  vault(id: $id) {
    ...VaultShortInfos
  }
}
    ${VaultShortInfosFragmentDoc}`;

/**
 * __useVaultQuery__
 *
 * To run a query within a React component, call `useVaultQuery` and pass it any options that fit your needs.
 * When your component renders, `useVaultQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useVaultQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useVaultQuery(baseOptions: Apollo.QueryHookOptions<VaultQuery, VaultQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<VaultQuery, VaultQueryVariables>(VaultDocument, options);
      }
export function useVaultLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<VaultQuery, VaultQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<VaultQuery, VaultQueryVariables>(VaultDocument, options);
        }
export type VaultQueryHookResult = ReturnType<typeof useVaultQuery>;
export type VaultLazyQueryHookResult = ReturnType<typeof useVaultLazyQuery>;
export type VaultQueryResult = Apollo.QueryResult<VaultQuery, VaultQueryVariables>;
export const AddOrderDocument = gql`
    mutation addOrder($data: CreateOrderInput!, $vaultId: ID!) {
  createOrder(vaultId: $vaultId, data: $data) {
    ...OrderTemplateInfos
    vault {
      ...VaultShortInfos
      orderTemplates {
        id
      }
    }
  }
}
    ${OrderTemplateInfosFragmentDoc}
${VaultShortInfosFragmentDoc}`;
export type AddOrderMutationFn = Apollo.MutationFunction<AddOrderMutation, AddOrderMutationVariables>;

/**
 * __useAddOrderMutation__
 *
 * To run a mutation, you first call `useAddOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOrderMutation, { data, loading, error }] = useAddOrderMutation({
 *   variables: {
 *      data: // value for 'data'
 *      vaultId: // value for 'vaultId'
 *   },
 * });
 */
export function useAddOrderMutation(baseOptions?: Apollo.MutationHookOptions<AddOrderMutation, AddOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddOrderMutation, AddOrderMutationVariables>(AddOrderDocument, options);
      }
export type AddOrderMutationHookResult = ReturnType<typeof useAddOrderMutation>;
export type AddOrderMutationResult = Apollo.MutationResult<AddOrderMutation>;
export type AddOrderMutationOptions = Apollo.BaseMutationOptions<AddOrderMutation, AddOrderMutationVariables>;
export const UpdateOrderDocument = gql`
    mutation updateOrder($data: OrderInput!, $orderTemplateId: ID!) {
  updateOrderTemplate(orderTemplateId: $orderTemplateId, data: $data) {
    ...OrderTemplateInfos
  }
}
    ${OrderTemplateInfosFragmentDoc}`;
export type UpdateOrderMutationFn = Apollo.MutationFunction<UpdateOrderMutation, UpdateOrderMutationVariables>;

/**
 * __useUpdateOrderMutation__
 *
 * To run a mutation, you first call `useUpdateOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateOrderMutation, { data, loading, error }] = useUpdateOrderMutation({
 *   variables: {
 *      data: // value for 'data'
 *      orderTemplateId: // value for 'orderTemplateId'
 *   },
 * });
 */
export function useUpdateOrderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateOrderMutation, UpdateOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateOrderMutation, UpdateOrderMutationVariables>(UpdateOrderDocument, options);
      }
export type UpdateOrderMutationHookResult = ReturnType<typeof useUpdateOrderMutation>;
export type UpdateOrderMutationResult = Apollo.MutationResult<UpdateOrderMutation>;
export type UpdateOrderMutationOptions = Apollo.BaseMutationOptions<UpdateOrderMutation, UpdateOrderMutationVariables>;
export const DeleteOrderDocument = gql`
    mutation deleteOrder($orderTemplateId: ID!) {
  deleteOrderTemplate(orderTemplateId: $orderTemplateId) {
    id
  }
}
    `;
export type DeleteOrderMutationFn = Apollo.MutationFunction<DeleteOrderMutation, DeleteOrderMutationVariables>;

/**
 * __useDeleteOrderMutation__
 *
 * To run a mutation, you first call `useDeleteOrderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOrderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOrderMutation, { data, loading, error }] = useDeleteOrderMutation({
 *   variables: {
 *      orderTemplateId: // value for 'orderTemplateId'
 *   },
 * });
 */
export function useDeleteOrderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOrderMutation, DeleteOrderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOrderMutation, DeleteOrderMutationVariables>(DeleteOrderDocument, options);
      }
export type DeleteOrderMutationHookResult = ReturnType<typeof useDeleteOrderMutation>;
export type DeleteOrderMutationResult = Apollo.MutationResult<DeleteOrderMutation>;
export type DeleteOrderMutationOptions = Apollo.BaseMutationOptions<DeleteOrderMutation, DeleteOrderMutationVariables>;
export const OrderDocument = gql`
    query order($id: ID!) {
  orderTemplate(id: $id) {
    ...OrderTemplateInfos
  }
}
    ${OrderTemplateInfosFragmentDoc}`;

/**
 * __useOrderQuery__
 *
 * To run a query within a React component, call `useOrderQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrderQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrderQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useOrderQuery(baseOptions: Apollo.QueryHookOptions<OrderQuery, OrderQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrderQuery, OrderQueryVariables>(OrderDocument, options);
      }
export function useOrderLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrderQuery, OrderQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrderQuery, OrderQueryVariables>(OrderDocument, options);
        }
export type OrderQueryHookResult = ReturnType<typeof useOrderQuery>;
export type OrderLazyQueryHookResult = ReturnType<typeof useOrderLazyQuery>;
export type OrderQueryResult = Apollo.QueryResult<OrderQuery, OrderQueryVariables>;