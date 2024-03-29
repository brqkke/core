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
  frequency: OrderFrequency;
  name?: InputMaybe<Scalars['String']>;
};

export type DcaConfig = {
  __typename?: 'DCAConfig';
  emojis: Scalars['String'];
  interval: DcaInterval;
  price: Scalars['Float'];
  slug: Scalars['String'];
  type: ItemType;
};

export enum DcaInterval {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY'
}

/** Error type */
export enum ErrorType {
  ButanukiAccountPreviouslyLinkedToOtherBityAccount = 'ButanukiAccountPreviouslyLinkedToOtherBityAccount',
  CantRefreshBityToken = 'CantRefreshBityToken',
  NeedVerifiedBityAccount = 'NeedVerifiedBityAccount',
  TooManyOrdersInVault = 'TooManyOrdersInVault',
  TooManyVaults = 'TooManyVaults',
  Unknown = 'Unknown',
  UnknownBityError = 'UnknownBityError'
}

export type EstimatorResult = {
  __typename?: 'EstimatorResult';
  averageBtcPrice?: Maybe<Scalars['Float']>;
  transactionCount: Scalars['Int'];
};

export enum ItemType {
  Beer = 'BEER',
  Cigarettes = 'CIGARETTES',
  Coffee = 'COFFEE',
  Fastfood = 'FASTFOOD',
  Other = 'OTHER'
}

export type Mutation = {
  __typename?: 'Mutation';
  addVault: Vault;
  createOrder: OrderTemplate;
  deleteOrderTemplate: OrderTemplate;
  deleteVault: Vault;
  disableMfa: User;
  enableMfa: User;
  linkBity: User;
  setupMfa: Scalars['String'];
  unlinkBity: User;
  updateLocale: User;
  updateOrderTemplate: OrderTemplate;
  updateVault: Vault;
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


export type MutationDisableMfaArgs = {
  code: Scalars['String'];
};


export type MutationEnableMfaArgs = {
  code: Scalars['String'];
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


export type MutationUpdateVaultArgs = {
  data: UpdateVaultInput;
  id: Scalars['ID'];
};

export type Order = {
  __typename?: 'Order';
  amount: Scalars['Float'];
  bankDetails?: Maybe<BityPaymentDetails>;
  createdAt: Scalars['DateTime'];
  currency: OrderCurrency;
  filledAmount?: Maybe<Scalars['Float']>;
  id: Scalars['String'];
  orderTemplateId?: Maybe<Scalars['String']>;
  redactedCryptoAddress?: Maybe<Scalars['String']>;
  remoteId: Scalars['String'];
  status: OrderStatus;
  transferLabel: Scalars['String'];
};

export enum OrderCurrency {
  Chf = 'CHF',
  Eur = 'EUR'
}

export enum OrderFrequency {
  Monthly = 'MONTHLY',
  Unique = 'UNIQUE',
  Weekly = 'WEEKLY'
}

export type OrderInput = {
  amount: Scalars['Int'];
  cryptoAddress?: InputMaybe<Scalars['String']>;
  frequency: OrderFrequency;
  name?: InputMaybe<Scalars['String']>;
};

export enum OrderSortFields {
  CreatedAt = 'CREATED_AT'
}

export type OrderSortInput = {
  order?: InputMaybe<Sort>;
  sortBy: OrderSortFields;
};

export enum OrderStatus {
  Cancelled = 'CANCELLED',
  CancelledNeedRenew = 'CANCELLED_NEED_RENEW',
  Filled = 'FILLED',
  FilledNeedRenew = 'FILLED_NEED_RENEW',
  Open = 'OPEN',
  ToCancel = 'TO_CANCEL'
}

export type OrderTemplate = {
  __typename?: 'OrderTemplate';
  activeOrder?: Maybe<Order>;
  amount: Scalars['Float'];
  frequency: OrderFrequency;
  id: Scalars['ID'];
  name: Scalars['String'];
  vault: Vault;
  vaultId: Scalars['ID'];
};

export type PaginatedOrder = {
  __typename?: 'PaginatedOrder';
  items: Array<Order>;
  pagination: Pagination;
};

export type PaginatedUser = {
  __typename?: 'PaginatedUser';
  items: Array<User>;
  pagination: Pagination;
};

export type Pagination = {
  __typename?: 'Pagination';
  count: Scalars['Int'];
  firstPage: Scalars['Int'];
  lastPage: Scalars['Int'];
  nextPage: Scalars['Int'];
  page: Scalars['Int'];
  pages: Scalars['Int'];
  previousPage: Scalars['Int'];
};

export type PaginationInput = {
  count: Scalars['Int'];
  page: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  averageCostEstimator: EstimatorResult;
  currentPrice: Scalars['Float'];
  dcaEstimatorConfigs: Array<DcaConfig>;
  errors: Array<ErrorType>;
  linkUrl: Scalars['String'];
  me: User;
  orderTemplate: OrderTemplate;
  orders: PaginatedOrder;
  user: User;
  users: PaginatedUser;
  vault: Vault;
};


export type QueryAverageCostEstimatorArgs = {
  currency: OrderCurrency;
  end: Scalars['String'];
  interval: DcaInterval;
  start: Scalars['String'];
};


export type QueryCurrentPriceArgs = {
  currency: OrderCurrency;
};


export type QueryOrderTemplateArgs = {
  id: Scalars['ID'];
};


export type QueryOrdersArgs = {
  pagination: PaginationInput;
  reference?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<OrderSortInput>>;
  userId: Scalars['ID'];
};


export type QueryUserArgs = {
  id: Scalars['ID'];
};


export type QueryUsersArgs = {
  filters?: InputMaybe<UserFilterInput>;
  pagination: PaginationInput;
  query?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<UserSortInput>>;
};


export type QueryVaultArgs = {
  id: Scalars['ID'];
};

export enum Sort {
  Asc = 'ASC',
  Desc = 'DESC'
}

export enum TokenStatus {
  Active = 'ACTIVE',
  Broken = 'BROKEN',
  NeedRefreshRetry = 'NEED_REFRESH_RETRY'
}

export type UpdateVaultInput = {
  name: Scalars['String'];
};

export type User = {
  __typename?: 'User';
  bityTokenStatus: BityLinkStatus;
  createdAt: Scalars['DateTime'];
  customPartnerFee?: Maybe<Scalars['Float']>;
  email: Scalars['String'];
  hasOpenOrders: Scalars['Boolean'];
  id: Scalars['ID'];
  locale: Scalars['String'];
  mfaEnabled: Scalars['Boolean'];
  role: UserRole;
  vaults: Array<Vault>;
};

export type UserFilterInput = {
  hasActiveBityToken?: InputMaybe<Scalars['Boolean']>;
  hasOrders?: InputMaybe<Scalars['Boolean']>;
};

export enum UserRole {
  Admin = 'ADMIN',
  User = 'USER'
}

export enum UserSortFields {
  BityStatus = 'BITY_STATUS',
  CreatedAt = 'CREATED_AT',
  Email = 'EMAIL',
  HasOpenOrders = 'HAS_OPEN_ORDERS',
  Role = 'ROLE'
}

export type UserSortInput = {
  order?: InputMaybe<Sort>;
  sortBy: UserSortFields;
};

export type Vault = {
  __typename?: 'Vault';
  bitcoinPrice?: Maybe<Scalars['Float']>;
  createdAt: Scalars['DateTime'];
  currency: OrderCurrency;
  id: Scalars['String'];
  name: Scalars['String'];
  orderTemplates: Array<OrderTemplate>;
  statistics: VaultStatistics;
  userId: Scalars['String'];
};

export type VaultInput = {
  currency: OrderCurrency;
  name: Scalars['String'];
};

export type VaultStatistics = {
  __typename?: 'VaultStatistics';
  totalReceived: Scalars['Float'];
  totalSpent: Scalars['Float'];
};

export type UserProfileFragment = { __typename?: 'User', id: string, locale: string, email: string, role: UserRole, mfaEnabled: boolean, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } };

export type BityStatusFragment = { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } };

export type UserDetailsFragment = { __typename?: 'User', id: string, email: string, hasOpenOrders: boolean, customPartnerFee?: number | null, createdAt: any, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } };

export type VaultShortInfosFragment = { __typename?: 'Vault', id: string, currency: OrderCurrency, name: string };

export type VaultInfosFragment = { __typename?: 'Vault', id: string, currency: OrderCurrency, name: string, bitcoinPrice?: number | null, statistics: { __typename?: 'VaultStatistics', totalSpent: number, totalReceived: number }, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, frequency: OrderFrequency, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null }> };

export type BankDetailsFragment = { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null };

export type OrderInfosFragment = { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null };

export type OrderTemplateInfosFragment = { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, frequency: OrderFrequency, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null };

export type PaginationInfosFragment = { __typename?: 'Pagination', firstPage: number, previousPage: number, page: number, nextPage: number, lastPage: number, count: number };

export type EstimationQueryVariables = Exact<{
  currency: OrderCurrency;
  start: Scalars['String'];
  end: Scalars['String'];
  interval: DcaInterval;
}>;


export type EstimationQuery = { __typename?: 'Query', currentPrice: number, averageCostEstimator: { __typename?: 'EstimatorResult', averageBtcPrice?: number | null, transactionCount: number } };

export type DcaEstimatorConfigFragment = { __typename?: 'DCAConfig', slug: string, type: ItemType, price: number, interval: DcaInterval, emojis: string };

export type SavingEstimatorQueryVariables = Exact<{ [key: string]: never; }>;


export type SavingEstimatorQuery = { __typename?: 'Query', dcaEstimatorConfigs: Array<{ __typename?: 'DCAConfig', slug: string, type: ItemType, price: number, interval: DcaInterval, emojis: string }> };

export type UpdateLocaleMutationVariables = Exact<{
  locale: Scalars['String'];
}>;


export type UpdateLocaleMutation = { __typename?: 'Mutation', updateLocale: { __typename?: 'User', locale: string, id: string } };

export type DeleteOrderMutationVariables = Exact<{
  orderTemplateId: Scalars['ID'];
}>;


export type DeleteOrderMutation = { __typename?: 'Mutation', deleteOrderTemplate: { __typename?: 'OrderTemplate', id: string, vault: { __typename?: 'Vault', id: string, statistics: { __typename?: 'VaultStatistics', totalSpent: number, totalReceived: number } } } };

export type DeleteVaultMutationVariables = Exact<{
  vaultId: Scalars['ID'];
}>;


export type DeleteVaultMutation = { __typename?: 'Mutation', deleteVault: { __typename?: 'Vault', id: string } };

export type UnlinkBityMutationVariables = Exact<{ [key: string]: never; }>;


export type UnlinkBityMutation = { __typename?: 'Mutation', unlinkBity: { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type BityLinkUrlQueryVariables = Exact<{ [key: string]: never; }>;


export type BityLinkUrlQuery = { __typename?: 'Query', linkUrl: string };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, locale: string, email: string, role: UserRole, mfaEnabled: boolean, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type OrdersQueryVariables = Exact<{
  pagination: PaginationInput;
  userId: Scalars['ID'];
  sort?: InputMaybe<Array<OrderSortInput> | OrderSortInput>;
  reference?: InputMaybe<Scalars['String']>;
}>;


export type OrdersQuery = { __typename?: 'Query', orders: { __typename?: 'PaginatedOrder', pagination: { __typename?: 'Pagination', firstPage: number, previousPage: number, page: number, nextPage: number, lastPage: number, count: number }, items: Array<{ __typename?: 'Order', id: string, status: OrderStatus, amount: number, transferLabel: string, redactedCryptoAddress?: string | null, createdAt: any, filledAmount?: number | null, currency: OrderCurrency, remoteId: string }> } };

export type UserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', id: string, email: string, hasOpenOrders: boolean, customPartnerFee?: number | null, createdAt: any, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type UsersQueryVariables = Exact<{
  pagination: PaginationInput;
  query?: InputMaybe<Scalars['String']>;
  sort?: InputMaybe<Array<UserSortInput> | UserSortInput>;
  filters?: InputMaybe<UserFilterInput>;
}>;


export type UsersQuery = { __typename?: 'Query', users: { __typename?: 'PaginatedUser', pagination: { __typename?: 'Pagination', firstPage: number, previousPage: number, page: number, nextPage: number, lastPage: number, count: number }, items: Array<{ __typename?: 'User', id: string, email: string, role: UserRole, hasOpenOrders: boolean, createdAt: any, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } }> } };

export type AddVaultMutationVariables = Exact<{
  data: VaultInput;
}>;


export type AddVaultMutation = { __typename?: 'Mutation', addVault: { __typename?: 'Vault', id: string, currency: OrderCurrency, name: string, bitcoinPrice?: number | null, statistics: { __typename?: 'VaultStatistics', totalSpent: number, totalReceived: number }, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, frequency: OrderFrequency, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null }> } };

export type VaultsQueryVariables = Exact<{ [key: string]: never; }>;


export type VaultsQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, vaults: Array<{ __typename?: 'Vault', id: string, currency: OrderCurrency, name: string, bitcoinPrice?: number | null, statistics: { __typename?: 'VaultStatistics', totalSpent: number, totalReceived: number }, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, frequency: OrderFrequency, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null }> }> } };

export type LinkBityMutationVariables = Exact<{
  redirectedFrom: Scalars['String'];
}>;


export type LinkBityMutation = { __typename?: 'Mutation', linkBity: { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type BityStatusQueryVariables = Exact<{ [key: string]: never; }>;


export type BityStatusQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, bityTokenStatus: { __typename?: 'BityLinkStatus', linked: boolean, linkStatus?: TokenStatus | null } } };

export type VaultQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type VaultQuery = { __typename?: 'Query', vault: { __typename?: 'Vault', id: string, currency: OrderCurrency, name: string } };

export type AddOrderMutationVariables = Exact<{
  data: CreateOrderInput;
  vaultId: Scalars['ID'];
}>;


export type AddOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, frequency: OrderFrequency, vault: { __typename?: 'Vault', id: string, currency: OrderCurrency, name: string, orderTemplates: Array<{ __typename?: 'OrderTemplate', id: string }> }, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null } };

export type UpdateOrderMutationVariables = Exact<{
  data: OrderInput;
  orderTemplateId: Scalars['ID'];
}>;


export type UpdateOrderMutation = { __typename?: 'Mutation', updateOrderTemplate: { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, frequency: OrderFrequency, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null } };

export type OrderQueryVariables = Exact<{
  id: Scalars['ID'];
}>;


export type OrderQuery = { __typename?: 'Query', orderTemplate: { __typename?: 'OrderTemplate', id: string, name: string, amount: number, vaultId: string, frequency: OrderFrequency, activeOrder?: { __typename?: 'Order', id: string, amount: number, currency: OrderCurrency, redactedCryptoAddress?: string | null, status: OrderStatus, transferLabel: string, orderTemplateId?: string | null, bankDetails?: { __typename?: 'BityPaymentDetails', account_number?: string | null, bank_address?: string | null, bank_code?: string | null, iban?: string | null, recipient?: string | null, swift_bic?: string | null } | null } | null } };

export type SetupMfaMutationVariables = Exact<{ [key: string]: never; }>;


export type SetupMfaMutation = { __typename?: 'Mutation', setupMfa: string };

export type EnableMfaMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type EnableMfaMutation = { __typename?: 'Mutation', enableMfa: { __typename?: 'User', id: string, mfaEnabled: boolean } };

export type DisableMfaMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type DisableMfaMutation = { __typename?: 'Mutation', disableMfa: { __typename?: 'User', id: string, mfaEnabled: boolean } };

export type UpdateVaultMutationVariables = Exact<{
  id: Scalars['ID'];
  data: UpdateVaultInput;
}>;


export type UpdateVaultMutation = { __typename?: 'Mutation', updateVault: { __typename?: 'Vault', id: string, currency: OrderCurrency, name: string } };

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
  role
  mfaEnabled
}
    ${BityStatusFragmentDoc}`;
export const UserDetailsFragmentDoc = gql`
    fragment UserDetails on User {
  id
  ...BityStatus
  email
  hasOpenOrders
  customPartnerFee
  createdAt
}
    ${BityStatusFragmentDoc}`;
export const VaultShortInfosFragmentDoc = gql`
    fragment VaultShortInfos on Vault {
  id
  currency
  name
}
    `;
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
  frequency
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
  statistics {
    totalSpent
    totalReceived
  }
  orderTemplates {
    ...OrderTemplateInfos
  }
  bitcoinPrice
}
    ${OrderTemplateInfosFragmentDoc}`;
export const PaginationInfosFragmentDoc = gql`
    fragment PaginationInfos on Pagination {
  firstPage
  previousPage
  page
  nextPage
  lastPage
  count
}
    `;
export const DcaEstimatorConfigFragmentDoc = gql`
    fragment dcaEstimatorConfig on DCAConfig {
  slug
  type
  price
  interval
  emojis
}
    `;
export const EstimationDocument = gql`
    query estimation($currency: OrderCurrency!, $start: String!, $end: String!, $interval: DCAInterval!) {
  averageCostEstimator(
    currency: $currency
    start: $start
    end: $end
    interval: $interval
  ) {
    averageBtcPrice
    transactionCount
  }
  currentPrice(currency: $currency)
}
    `;

/**
 * __useEstimationQuery__
 *
 * To run a query within a React component, call `useEstimationQuery` and pass it any options that fit your needs.
 * When your component renders, `useEstimationQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useEstimationQuery({
 *   variables: {
 *      currency: // value for 'currency'
 *      start: // value for 'start'
 *      end: // value for 'end'
 *      interval: // value for 'interval'
 *   },
 * });
 */
export function useEstimationQuery(baseOptions: Apollo.QueryHookOptions<EstimationQuery, EstimationQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<EstimationQuery, EstimationQueryVariables>(EstimationDocument, options);
      }
export function useEstimationLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<EstimationQuery, EstimationQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<EstimationQuery, EstimationQueryVariables>(EstimationDocument, options);
        }
export type EstimationQueryHookResult = ReturnType<typeof useEstimationQuery>;
export type EstimationLazyQueryHookResult = ReturnType<typeof useEstimationLazyQuery>;
export type EstimationQueryResult = Apollo.QueryResult<EstimationQuery, EstimationQueryVariables>;
export const SavingEstimatorDocument = gql`
    query savingEstimator {
  dcaEstimatorConfigs {
    ...dcaEstimatorConfig
  }
}
    ${DcaEstimatorConfigFragmentDoc}`;

/**
 * __useSavingEstimatorQuery__
 *
 * To run a query within a React component, call `useSavingEstimatorQuery` and pass it any options that fit your needs.
 * When your component renders, `useSavingEstimatorQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSavingEstimatorQuery({
 *   variables: {
 *   },
 * });
 */
export function useSavingEstimatorQuery(baseOptions?: Apollo.QueryHookOptions<SavingEstimatorQuery, SavingEstimatorQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SavingEstimatorQuery, SavingEstimatorQueryVariables>(SavingEstimatorDocument, options);
      }
export function useSavingEstimatorLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SavingEstimatorQuery, SavingEstimatorQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SavingEstimatorQuery, SavingEstimatorQueryVariables>(SavingEstimatorDocument, options);
        }
export type SavingEstimatorQueryHookResult = ReturnType<typeof useSavingEstimatorQuery>;
export type SavingEstimatorLazyQueryHookResult = ReturnType<typeof useSavingEstimatorLazyQuery>;
export type SavingEstimatorQueryResult = Apollo.QueryResult<SavingEstimatorQuery, SavingEstimatorQueryVariables>;
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
export const DeleteOrderDocument = gql`
    mutation deleteOrder($orderTemplateId: ID!) {
  deleteOrderTemplate(orderTemplateId: $orderTemplateId) {
    id
    vault {
      id
      statistics {
        totalSpent
        totalReceived
      }
    }
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
export const OrdersDocument = gql`
    query orders($pagination: PaginationInput!, $userId: ID!, $sort: [OrderSortInput!], $reference: String) {
  orders(
    pagination: $pagination
    userId: $userId
    sort: $sort
    reference: $reference
  ) {
    pagination {
      ...PaginationInfos
    }
    items {
      id
      status
      amount
      transferLabel
      redactedCryptoAddress
      createdAt
      filledAmount
      currency
      remoteId
    }
  }
}
    ${PaginationInfosFragmentDoc}`;

/**
 * __useOrdersQuery__
 *
 * To run a query within a React component, call `useOrdersQuery` and pass it any options that fit your needs.
 * When your component renders, `useOrdersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOrdersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      userId: // value for 'userId'
 *      sort: // value for 'sort'
 *      reference: // value for 'reference'
 *   },
 * });
 */
export function useOrdersQuery(baseOptions: Apollo.QueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
      }
export function useOrdersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OrdersQuery, OrdersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<OrdersQuery, OrdersQueryVariables>(OrdersDocument, options);
        }
export type OrdersQueryHookResult = ReturnType<typeof useOrdersQuery>;
export type OrdersLazyQueryHookResult = ReturnType<typeof useOrdersLazyQuery>;
export type OrdersQueryResult = Apollo.QueryResult<OrdersQuery, OrdersQueryVariables>;
export const UserDocument = gql`
    query user($id: ID!) {
  user(id: $id) {
    ...UserDetails
  }
}
    ${UserDetailsFragmentDoc}`;

/**
 * __useUserQuery__
 *
 * To run a query within a React component, call `useUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useUserQuery(baseOptions: Apollo.QueryHookOptions<UserQuery, UserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserQuery, UserQueryVariables>(UserDocument, options);
      }
export function useUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserQuery, UserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserQuery, UserQueryVariables>(UserDocument, options);
        }
export type UserQueryHookResult = ReturnType<typeof useUserQuery>;
export type UserLazyQueryHookResult = ReturnType<typeof useUserLazyQuery>;
export type UserQueryResult = Apollo.QueryResult<UserQuery, UserQueryVariables>;
export const UsersDocument = gql`
    query users($pagination: PaginationInput!, $query: String, $sort: [UserSortInput!], $filters: UserFilterInput) {
  users(pagination: $pagination, query: $query, sort: $sort, filters: $filters) {
    pagination {
      ...PaginationInfos
    }
    items {
      id
      email
      role
      bityTokenStatus {
        linked
        linkStatus
      }
      hasOpenOrders
      createdAt
    }
  }
}
    ${PaginationInfosFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *      pagination: // value for 'pagination'
 *      query: // value for 'query'
 *      sort: // value for 'sort'
 *      filters: // value for 'filters'
 *   },
 * });
 */
export function useUsersQuery(baseOptions: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, options);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;
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
export const SetupMfaDocument = gql`
    mutation setupMfa {
  setupMfa
}
    `;
export type SetupMfaMutationFn = Apollo.MutationFunction<SetupMfaMutation, SetupMfaMutationVariables>;

/**
 * __useSetupMfaMutation__
 *
 * To run a mutation, you first call `useSetupMfaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetupMfaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setupMfaMutation, { data, loading, error }] = useSetupMfaMutation({
 *   variables: {
 *   },
 * });
 */
export function useSetupMfaMutation(baseOptions?: Apollo.MutationHookOptions<SetupMfaMutation, SetupMfaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetupMfaMutation, SetupMfaMutationVariables>(SetupMfaDocument, options);
      }
export type SetupMfaMutationHookResult = ReturnType<typeof useSetupMfaMutation>;
export type SetupMfaMutationResult = Apollo.MutationResult<SetupMfaMutation>;
export type SetupMfaMutationOptions = Apollo.BaseMutationOptions<SetupMfaMutation, SetupMfaMutationVariables>;
export const EnableMfaDocument = gql`
    mutation enableMfa($code: String!) {
  enableMfa(code: $code) {
    id
    mfaEnabled
  }
}
    `;
export type EnableMfaMutationFn = Apollo.MutationFunction<EnableMfaMutation, EnableMfaMutationVariables>;

/**
 * __useEnableMfaMutation__
 *
 * To run a mutation, you first call `useEnableMfaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEnableMfaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [enableMfaMutation, { data, loading, error }] = useEnableMfaMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useEnableMfaMutation(baseOptions?: Apollo.MutationHookOptions<EnableMfaMutation, EnableMfaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EnableMfaMutation, EnableMfaMutationVariables>(EnableMfaDocument, options);
      }
export type EnableMfaMutationHookResult = ReturnType<typeof useEnableMfaMutation>;
export type EnableMfaMutationResult = Apollo.MutationResult<EnableMfaMutation>;
export type EnableMfaMutationOptions = Apollo.BaseMutationOptions<EnableMfaMutation, EnableMfaMutationVariables>;
export const DisableMfaDocument = gql`
    mutation disableMfa($code: String!) {
  disableMfa(code: $code) {
    id
    mfaEnabled
  }
}
    `;
export type DisableMfaMutationFn = Apollo.MutationFunction<DisableMfaMutation, DisableMfaMutationVariables>;

/**
 * __useDisableMfaMutation__
 *
 * To run a mutation, you first call `useDisableMfaMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDisableMfaMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [disableMfaMutation, { data, loading, error }] = useDisableMfaMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useDisableMfaMutation(baseOptions?: Apollo.MutationHookOptions<DisableMfaMutation, DisableMfaMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DisableMfaMutation, DisableMfaMutationVariables>(DisableMfaDocument, options);
      }
export type DisableMfaMutationHookResult = ReturnType<typeof useDisableMfaMutation>;
export type DisableMfaMutationResult = Apollo.MutationResult<DisableMfaMutation>;
export type DisableMfaMutationOptions = Apollo.BaseMutationOptions<DisableMfaMutation, DisableMfaMutationVariables>;
export const UpdateVaultDocument = gql`
    mutation updateVault($id: ID!, $data: UpdateVaultInput!) {
  updateVault(id: $id, data: $data) {
    ...VaultShortInfos
  }
}
    ${VaultShortInfosFragmentDoc}`;
export type UpdateVaultMutationFn = Apollo.MutationFunction<UpdateVaultMutation, UpdateVaultMutationVariables>;

/**
 * __useUpdateVaultMutation__
 *
 * To run a mutation, you first call `useUpdateVaultMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateVaultMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateVaultMutation, { data, loading, error }] = useUpdateVaultMutation({
 *   variables: {
 *      id: // value for 'id'
 *      data: // value for 'data'
 *   },
 * });
 */
export function useUpdateVaultMutation(baseOptions?: Apollo.MutationHookOptions<UpdateVaultMutation, UpdateVaultMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateVaultMutation, UpdateVaultMutationVariables>(UpdateVaultDocument, options);
      }
export type UpdateVaultMutationHookResult = ReturnType<typeof useUpdateVaultMutation>;
export type UpdateVaultMutationResult = Apollo.MutationResult<UpdateVaultMutation>;
export type UpdateVaultMutationOptions = Apollo.BaseMutationOptions<UpdateVaultMutation, UpdateVaultMutationVariables>;