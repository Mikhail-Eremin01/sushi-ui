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
};

export type Address = {
  __typename?: 'Address';
  address?: Maybe<Scalars['String']>;
  instruction?: Maybe<Scalars['String']>;
};

export type AddressInput = {
  address?: InputMaybe<Scalars['String']>;
  instruction?: InputMaybe<Scalars['String']>;
};

export type CharityFund = {
  __typename?: 'CharityFund';
  address?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  iban?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  message?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  reference?: Maybe<Scalars['String']>;
};

export type Companies = {
  __typename?: 'Companies';
  companies?: Maybe<Array<Maybe<Company>>>;
  total?: Maybe<Scalars['Int']>;
};

export type Company = {
  __typename?: 'Company';
  addresses?: Maybe<Array<Maybe<Address>>>;
  funds?: Maybe<Array<Maybe<CompanyFund>>>;
  id?: Maybe<Scalars['ID']>;
  isDevShop?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  registerDate?: Maybe<Scalars['String']>;
  users?: Maybe<Array<Maybe<UserInfo>>>;
};

export type CompanyFund = {
  __typename?: 'CompanyFund';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type CompanyInfo = {
  __typename?: 'CompanyInfo';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
};

export type CompanyStatistic = {
  __typename?: 'CompanyStatistic';
  companyAddress?: Maybe<Scalars['String']>;
  companyId?: Maybe<Scalars['ID']>;
  companyName?: Maybe<Scalars['String']>;
  funds?: Maybe<Array<Maybe<Fund>>>;
  lastMonthAmount?: Maybe<Scalars['Float']>;
  totalAmount?: Maybe<Scalars['Float']>;
};

export type Event = {
  __typename?: 'Event';
  address?: Maybe<Scalars['String']>;
  amount?: Maybe<Scalars['String']>;
  comment?: Maybe<Scalars['String']>;
  companyId?: Maybe<Scalars['ID']>;
  companyInfo?: Maybe<CompanyInfo>;
  endTime?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isBox?: Maybe<Scalars['Boolean']>;
  period?: Maybe<Scalars['String']>;
  startDate?: Maybe<Scalars['String']>;
  startTime?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
};

export type File = {
  __typename?: 'File';
  fileId?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Float']>;
  type?: Maybe<Scalars['String']>;
  typeProof?: Maybe<Scalars['String']>;
  urlGet?: Maybe<Scalars['String']>;
  urlPut?: Maybe<Scalars['String']>;
};

export type FileInput = {
  fileId?: InputMaybe<Scalars['ID']>;
  name?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Float']>;
  type?: InputMaybe<Scalars['String']>;
  typeProof?: InputMaybe<Scalars['String']>;
};

export type Fund = {
  __typename?: 'Fund';
  amount?: Maybe<Scalars['Float']>;
  lastDate?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  _?: Maybe<Scalars['Boolean']>;
  acceptNewFeature?: Maybe<OkMessage>;
  addAddress?: Maybe<OkMessage>;
  addEvent?: Maybe<Event>;
  addFund?: Maybe<CharityFund>;
  addOperation?: Maybe<Statistic>;
  addUser?: Maybe<User>;
  deleteEvent?: Maybe<OkMessage>;
  deleteFund?: Maybe<OkMessage>;
  deleteOperation?: Maybe<OkMessage>;
  deleteUser?: Maybe<OkMessage>;
  editAddresses?: Maybe<OkMessage>;
  editBox?: Maybe<Event>;
  editCompany?: Maybe<OkMessage>;
  editEvent?: Maybe<Event>;
  editFund?: Maybe<CharityFund>;
  editFunds?: Maybe<OkMessage>;
  editOperation?: Maybe<Statistic>;
  editPermissions?: Maybe<OkMessage>;
  editUser?: Maybe<User>;
  orderBox?: Maybe<OkMessage>;
  register?: Maybe<OkMessage>;
  sendLetterOperationInfo?: Maybe<OkMessage>;
  sendMoney?: Maybe<TransactionResponse>;
  suggestOrganization?: Maybe<OkMessage>;
};


export type MutationAcceptNewFeatureArgs = {
  message?: InputMaybe<Scalars['String']>;
};


export type MutationAddAddressArgs = {
  address: Scalars['String'];
  instruction: Scalars['String'];
};


export type MutationAddEventArgs = {
  address?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  companyId?: InputMaybe<Scalars['ID']>;
  endTime: Scalars['String'];
  period?: InputMaybe<Scalars['String']>;
  startDate: Scalars['String'];
  startTime: Scalars['String'];
  type: Scalars['String'];
};


export type MutationAddFundArgs = {
  address: Scalars['String'];
  country: Scalars['String'];
  iban: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  reference?: InputMaybe<Scalars['String']>;
};


export type MutationAddOperationArgs = {
  amount: Scalars['Float'];
  amountKept: Scalars['Float'];
  amountPaid: Scalars['Float'];
  companyId: Scalars['ID'];
  date: Scalars['String'];
  distanceDriven: Scalars['Float'];
  files?: InputMaybe<Array<InputMaybe<FileInput>>>;
  funds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  payout: Scalars['Float'];
  status: Scalars['String'];
  timeSpent: Scalars['Float'];
  total: Scalars['Float'];
};


export type MutationAddUserArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  phone: Scalars['String'];
};


export type MutationDeleteEventArgs = {
  deleteDate?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
};


export type MutationDeleteFundArgs = {
  fundId: Scalars['ID'];
};


export type MutationDeleteOperationArgs = {
  operationId: Scalars['ID'];
};


export type MutationDeleteUserArgs = {
  userId: Scalars['ID'];
};


export type MutationEditAddressesArgs = {
  addresses?: InputMaybe<Array<InputMaybe<AddressInput>>>;
};


export type MutationEditBoxArgs = {
  address: Scalars['String'];
  amount: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  endTime: Scalars['String'];
  id: Scalars['ID'];
  startDate: Scalars['String'];
  startTime: Scalars['String'];
};


export type MutationEditCompanyArgs = {
  name: Scalars['String'];
};


export type MutationEditEventArgs = {
  address?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  deleteDate?: InputMaybe<Scalars['String']>;
  endTime: Scalars['String'];
  id: Scalars['ID'];
  period?: InputMaybe<Scalars['String']>;
  startDate: Scalars['String'];
  startTime: Scalars['String'];
  type: Scalars['String'];
};


export type MutationEditFundArgs = {
  address: Scalars['String'];
  country: Scalars['String'];
  fundId: Scalars['ID'];
  iban: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  name: Scalars['String'];
  reference?: InputMaybe<Scalars['String']>;
};


export type MutationEditFundsArgs = {
  funds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationEditOperationArgs = {
  amount: Scalars['Float'];
  amountKept: Scalars['Float'];
  amountPaid: Scalars['Float'];
  companyId: Scalars['ID'];
  date: Scalars['String'];
  distanceDriven: Scalars['Float'];
  files?: InputMaybe<Array<InputMaybe<FileInput>>>;
  funds?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  operationId: Scalars['ID'];
  payout: Scalars['Float'];
  status: Scalars['String'];
  timeSpent: Scalars['Float'];
  total: Scalars['Float'];
};


export type MutationEditPermissionsArgs = {
  emailNotifications?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  mentionCompany?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationEditUserArgs = {
  email: Scalars['String'];
  name: Scalars['String'];
  phone: Scalars['String'];
  userId: Scalars['ID'];
};


export type MutationOrderBoxArgs = {
  address: Scalars['String'];
  amount: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  endTime: Scalars['String'];
  startDate: Scalars['String'];
  startTime: Scalars['String'];
};


export type MutationRegisterArgs = {
  address?: InputMaybe<Scalars['String']>;
  company: Scalars['String'];
  email: Scalars['String'];
  name: Scalars['String'];
  phone: Scalars['String'];
};


export type MutationSendLetterOperationInfoArgs = {
  operationId: Scalars['ID'];
  userEmails?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};


export type MutationSendMoneyArgs = {
  operationId: Scalars['ID'];
};


export type MutationSuggestOrganizationArgs = {
  name: Scalars['String'];
  url?: InputMaybe<Scalars['String']>;
};

export type OkMessage = {
  __typename?: 'OkMessage';
  id?: Maybe<Scalars['ID']>;
  message?: Maybe<Scalars['String']>;
};

export type Permissions = {
  __typename?: 'Permissions';
  emailNotifications?: Maybe<Array<Maybe<Scalars['String']>>>;
  mentionCompany?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Point = {
  __typename?: 'Point';
  amount?: Maybe<Scalars['String']>;
  companyAddress?: Maybe<Scalars['String']>;
  companyName?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  eventComment?: Maybe<Scalars['String']>;
  instruction?: Maybe<Scalars['String']>;
  num?: Maybe<Scalars['Int']>;
  person?: Maybe<Scalars['String']>;
};

export type PointsWithMap = {
  __typename?: 'PointsWithMap';
  map?: Maybe<Scalars['String']>;
  points?: Maybe<Array<Maybe<Point>>>;
};

export type Query = {
  __typename?: 'Query';
  _?: Maybe<Scalars['Boolean']>;
  auth?: Maybe<UserCredentials>;
  charityFunds?: Maybe<Array<Maybe<CharityFund>>>;
  companies?: Maybe<Companies>;
  company?: Maybe<Company>;
  companyInfo?: Maybe<CompanyInfo>;
  companyStatistic?: Maybe<CompanyStatistic>;
  event?: Maybe<Event>;
  permissions?: Maybe<Permissions>;
  refreshAuth?: Maybe<UserCredentials>;
  requestAuth?: Maybe<OkMessage>;
  route?: Maybe<PointsWithMap>;
  schedule?: Maybe<Array<Maybe<Array<Maybe<Schedule>>>>>;
  sendOperationEmailInfo?: Maybe<SendEmailInfo>;
  statistics?: Maybe<Statistics>;
  statisticsDownload?: Maybe<Array<Maybe<Statistic>>>;
  transactionDetails?: Maybe<TransactionDetails>;
  userFunds?: Maybe<Array<Maybe<UserFund>>>;
  userInfo?: Maybe<User>;
  users?: Maybe<Array<Maybe<User>>>;
};


export type QueryAuthArgs = {
  email: Scalars['String'];
  tempPassword: Scalars['String'];
};


export type QueryCompaniesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryCompanyArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompanyInfoArgs = {
  companyId: Scalars['ID'];
};


export type QueryCompanyStatisticArgs = {
  companyId: Scalars['ID'];
};


export type QueryEventArgs = {
  id: Scalars['ID'];
};


export type QueryRefreshAuthArgs = {
  accessToken: Scalars['String'];
};


export type QueryRequestAuthArgs = {
  email: Scalars['String'];
};


export type QueryRouteArgs = {
  date: Scalars['String'];
};


export type QueryScheduleArgs = {
  date: Scalars['String'];
};


export type QuerySendOperationEmailInfoArgs = {
  operationId: Scalars['ID'];
};


export type QueryStatisticsArgs = {
  endDate?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
};


export type QueryStatisticsDownloadArgs = {
  endDate?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['String']>;
};


export type QueryTransactionDetailsArgs = {
  operationId: Scalars['ID'];
};

export type Schedule = {
  __typename?: 'Schedule';
  available?: Maybe<Scalars['Int']>;
  date?: Maybe<Scalars['String']>;
  events?: Maybe<Array<Maybe<ScheduleEvent>>>;
};

export type ScheduleEvent = {
  __typename?: 'ScheduleEvent';
  eventId?: Maybe<Scalars['ID']>;
  info?: Maybe<Event>;
  time?: Maybe<Scalars['String']>;
};

export type SendEmailInfo = {
  __typename?: 'SendEmailInfo';
  id?: Maybe<Scalars['ID']>;
  suggestFunds?: Maybe<Scalars['Boolean']>;
  userEmails?: Maybe<Array<Maybe<Scalars['String']>>>;
};

export type Statistic = {
  __typename?: 'Statistic';
  amount?: Maybe<Scalars['Float']>;
  amountKept?: Maybe<Scalars['Float']>;
  amountPaid?: Maybe<Scalars['Float']>;
  companyAddress?: Maybe<Scalars['String']>;
  companyFunds?: Maybe<Array<Maybe<Scalars['String']>>>;
  companyId?: Maybe<Scalars['ID']>;
  companyName?: Maybe<Scalars['String']>;
  date?: Maybe<Scalars['String']>;
  distanceDriven?: Maybe<Scalars['Float']>;
  files?: Maybe<Array<Maybe<File>>>;
  funds?: Maybe<Array<Maybe<StatisticFund>>>;
  id?: Maybe<Scalars['ID']>;
  letterSent?: Maybe<Scalars['String']>;
  paymentDate?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<Scalars['String']>;
  payout?: Maybe<Scalars['Float']>;
  status?: Maybe<Scalars['String']>;
  timeSpent?: Maybe<Scalars['Float']>;
  total?: Maybe<Scalars['Float']>;
};

export type StatisticFund = {
  __typename?: 'StatisticFund';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

export type Statistics = {
  __typename?: 'Statistics';
  amount?: Maybe<Scalars['Float']>;
  operations?: Maybe<Array<Maybe<Statistic>>>;
  total?: Maybe<Scalars['Int']>;
};

export type TransactionDetails = {
  __typename?: 'TransactionDetails';
  amount?: Maybe<Scalars['String']>;
  fund?: Maybe<CharityFund>;
  hasCheck?: Maybe<Scalars['Boolean']>;
  operationId?: Maybe<Scalars['String']>;
  paymentStatus?: Maybe<Scalars['String']>;
};

export type TransactionResponse = {
  __typename?: 'TransactionResponse';
  amount?: Maybe<Scalars['String']>;
  archiveId?: Maybe<Scalars['String']>;
  bookingDate?: Maybe<Scalars['String']>;
  companyFromId?: Maybe<Scalars['String']>;
  creditorIban?: Maybe<Scalars['String']>;
  creditorName?: Maybe<Scalars['String']>;
  currency?: Maybe<Scalars['String']>;
  debtorIban?: Maybe<Scalars['String']>;
  endToEndId?: Maybe<Scalars['String']>;
  operationId?: Maybe<Scalars['String']>;
  paymentType?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['String']>;
  transactionDate?: Maybe<Scalars['String']>;
  transactionId?: Maybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  acceptNewFeature?: Maybe<Scalars['Boolean']>;
  companyId?: Maybe<Scalars['ID']>;
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  isAdmin?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type UserCredentials = {
  __typename?: 'UserCredentials';
  accessToken?: Maybe<Scalars['String']>;
};

export type UserFund = {
  __typename?: 'UserFund';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  selected?: Maybe<Scalars['Boolean']>;
};

export type UserInfo = {
  __typename?: 'UserInfo';
  email?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
};

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  phone: Scalars['String'];
  name: Scalars['String'];
  company: Scalars['String'];
  address?: InputMaybe<Scalars['String']>;
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type AddUserMutationVariables = Exact<{
  name: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
}>;


export type AddUserMutation = (
  { __typename?: 'Mutation' }
  & { addUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'companyId' | 'name' | 'email' | 'phone' | 'isAdmin'>
  )> }
);

export type EditUserMutationVariables = Exact<{
  userId: Scalars['ID'];
  name: Scalars['String'];
  email: Scalars['String'];
  phone: Scalars['String'];
}>;


export type EditUserMutation = (
  { __typename?: 'Mutation' }
  & { editUser?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'companyId' | 'name' | 'email' | 'phone' | 'isAdmin'>
  )> }
);

export type DeleteUserMutationVariables = Exact<{
  userId: Scalars['ID'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & { deleteUser?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'id'>
  )> }
);

export type AddOperationMutationVariables = Exact<{
  date: Scalars['String'];
  companyId: Scalars['ID'];
  status: Scalars['String'];
  total: Scalars['Float'];
  amount: Scalars['Float'];
  payout: Scalars['Float'];
  amountPaid: Scalars['Float'];
  amountKept: Scalars['Float'];
  timeSpent: Scalars['Float'];
  distanceDriven: Scalars['Float'];
  funds?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  files?: InputMaybe<Array<InputMaybe<FileInput>> | InputMaybe<FileInput>>;
}>;


export type AddOperationMutation = (
  { __typename?: 'Mutation' }
  & { addOperation?: Maybe<(
    { __typename?: 'Statistic' }
    & Pick<Statistic, 'id' | 'date' | 'companyId' | 'companyName' | 'status' | 'total' | 'amount' | 'payout' | 'amountPaid' | 'amountKept' | 'timeSpent' | 'distanceDriven'>
    & { funds?: Maybe<Array<Maybe<(
      { __typename?: 'StatisticFund' }
      & Pick<StatisticFund, 'id' | 'name'>
    )>>>, files?: Maybe<Array<Maybe<(
      { __typename?: 'File' }
      & Pick<File, 'name' | 'size' | 'type' | 'typeProof' | 'fileId' | 'urlPut' | 'urlGet'>
    )>>> }
  )> }
);

export type EditOperationMutationVariables = Exact<{
  operationId: Scalars['ID'];
  date: Scalars['String'];
  companyId: Scalars['ID'];
  status: Scalars['String'];
  total: Scalars['Float'];
  amount: Scalars['Float'];
  payout: Scalars['Float'];
  amountPaid: Scalars['Float'];
  amountKept: Scalars['Float'];
  timeSpent: Scalars['Float'];
  distanceDriven: Scalars['Float'];
  funds?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  files?: InputMaybe<Array<InputMaybe<FileInput>> | InputMaybe<FileInput>>;
}>;


export type EditOperationMutation = (
  { __typename?: 'Mutation' }
  & { editOperation?: Maybe<(
    { __typename?: 'Statistic' }
    & Pick<Statistic, 'id' | 'date' | 'companyId' | 'companyName' | 'status' | 'total' | 'amount' | 'payout' | 'amountPaid' | 'amountKept' | 'timeSpent' | 'distanceDriven'>
    & { funds?: Maybe<Array<Maybe<(
      { __typename?: 'StatisticFund' }
      & Pick<StatisticFund, 'id' | 'name'>
    )>>>, files?: Maybe<Array<Maybe<(
      { __typename?: 'File' }
      & Pick<File, 'name' | 'size' | 'type' | 'typeProof' | 'fileId' | 'urlPut' | 'urlGet'>
    )>>> }
  )> }
);

export type DeleteOperationMutationVariables = Exact<{
  operationId: Scalars['ID'];
}>;


export type DeleteOperationMutation = (
  { __typename?: 'Mutation' }
  & { deleteOperation?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'id'>
  )> }
);

export type EditCompanyMutationVariables = Exact<{
  name: Scalars['String'];
}>;


export type EditCompanyMutation = (
  { __typename?: 'Mutation' }
  & { editCompany?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'id'>
  )> }
);

export type SuggestOrganizationMutationVariables = Exact<{
  name: Scalars['String'];
  url?: InputMaybe<Scalars['String']>;
}>;


export type SuggestOrganizationMutation = (
  { __typename?: 'Mutation' }
  & { suggestOrganization?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'id' | 'message'>
  )> }
);

export type AddEventMutationVariables = Exact<{
  type: Scalars['String'];
  startDate: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  period?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  companyId?: InputMaybe<Scalars['ID']>;
  address?: InputMaybe<Scalars['String']>;
}>;


export type AddEventMutation = (
  { __typename?: 'Mutation' }
  & { addEvent?: Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
  )> }
);

export type EditEventMutationVariables = Exact<{
  editEventId: Scalars['ID'];
  startDate: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  type: Scalars['String'];
  period?: InputMaybe<Scalars['String']>;
  comment?: InputMaybe<Scalars['String']>;
  deleteDate?: InputMaybe<Scalars['String']>;
  address?: InputMaybe<Scalars['String']>;
  amount?: InputMaybe<Scalars['String']>;
}>;


export type EditEventMutation = (
  { __typename?: 'Mutation' }
  & { editEvent?: Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
  )> }
);

export type DeleteEventMutationVariables = Exact<{
  deleteEventId: Scalars['ID'];
  deleteDate?: InputMaybe<Scalars['String']>;
}>;


export type DeleteEventMutation = (
  { __typename?: 'Mutation' }
  & { deleteEvent?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'id'>
  )> }
);

export type AddAddressMutationVariables = Exact<{
  address: Scalars['String'];
  instruction: Scalars['String'];
}>;


export type AddAddressMutation = (
  { __typename?: 'Mutation' }
  & { addAddress?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type EditAddressesMutationVariables = Exact<{
  addresses?: InputMaybe<Array<InputMaybe<AddressInput>> | InputMaybe<AddressInput>>;
}>;


export type EditAddressesMutation = (
  { __typename?: 'Mutation' }
  & { editAddresses?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type EditFundsMutationVariables = Exact<{
  funds?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type EditFundsMutation = (
  { __typename?: 'Mutation' }
  & { editFunds?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type EditPermissionsMutationVariables = Exact<{
  emailNotifications?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
  mentionCompany?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type EditPermissionsMutation = (
  { __typename?: 'Mutation' }
  & { editPermissions?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type AcceptNewFeatureMutationVariables = Exact<{
  message?: InputMaybe<Scalars['String']>;
}>;


export type AcceptNewFeatureMutation = (
  { __typename?: 'Mutation' }
  & { acceptNewFeature?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type OrderBoxMutationVariables = Exact<{
  amount: Scalars['String'];
  startDate: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  address: Scalars['String'];
}>;


export type OrderBoxMutation = (
  { __typename?: 'Mutation' }
  & { orderBox?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type EditBoxMutationVariables = Exact<{
  id: Scalars['ID'];
  amount: Scalars['String'];
  startDate: Scalars['String'];
  startTime: Scalars['String'];
  endTime: Scalars['String'];
  comment?: InputMaybe<Scalars['String']>;
  address: Scalars['String'];
}>;


export type EditBoxMutation = (
  { __typename?: 'Mutation' }
  & { editBox?: Maybe<(
    { __typename?: 'Event' }
    & Pick<Event, 'id'>
  )> }
);

export type SendLetterOperationInfoMutationVariables = Exact<{
  operationId: Scalars['ID'];
  userEmails?: InputMaybe<Array<InputMaybe<Scalars['String']>> | InputMaybe<Scalars['String']>>;
}>;


export type SendLetterOperationInfoMutation = (
  { __typename?: 'Mutation' }
  & { sendLetterOperationInfo?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type AddFundMutationVariables = Exact<{
  name: Scalars['String'];
  iban: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  reference?: InputMaybe<Scalars['String']>;
  address: Scalars['String'];
  country: Scalars['String'];
}>;


export type AddFundMutation = (
  { __typename?: 'Mutation' }
  & { addFund?: Maybe<(
    { __typename?: 'CharityFund' }
    & Pick<CharityFund, 'id' | 'name' | 'iban' | 'message' | 'reference' | 'country' | 'address' | 'createdAt'>
  )> }
);

export type EditFundMutationVariables = Exact<{
  fundId: Scalars['ID'];
  name: Scalars['String'];
  iban: Scalars['String'];
  message?: InputMaybe<Scalars['String']>;
  reference?: InputMaybe<Scalars['String']>;
  address: Scalars['String'];
  country: Scalars['String'];
}>;


export type EditFundMutation = (
  { __typename?: 'Mutation' }
  & { editFund?: Maybe<(
    { __typename?: 'CharityFund' }
    & Pick<CharityFund, 'id' | 'name' | 'iban' | 'message' | 'reference' | 'country' | 'address' | 'createdAt'>
  )> }
);

export type DeleteFundMutationVariables = Exact<{
  fundId: Scalars['ID'];
}>;


export type DeleteFundMutation = (
  { __typename?: 'Mutation' }
  & { deleteFund?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'id' | 'message'>
  )> }
);

export type SendMoneyMutationVariables = Exact<{
  operationId: Scalars['ID'];
}>;


export type SendMoneyMutation = (
  { __typename?: 'Mutation' }
  & { sendMoney?: Maybe<(
    { __typename?: 'TransactionResponse' }
    & Pick<TransactionResponse, 'operationId' | 'companyFromId' | 'archiveId' | 'amount' | 'bookingDate' | 'currency' | 'creditorName' | 'creditorIban' | 'debtorIban' | 'transactionId' | 'transactionDate' | 'paymentType' | 'status' | 'endToEndId'>
  )> }
);

export type RequestAuthQueryVariables = Exact<{
  email: Scalars['String'];
}>;


export type RequestAuthQuery = (
  { __typename?: 'Query' }
  & { requestAuth?: Maybe<(
    { __typename?: 'OkMessage' }
    & Pick<OkMessage, 'message'>
  )> }
);

export type AuthQueryVariables = Exact<{
  email: Scalars['String'];
  tempPassword: Scalars['String'];
}>;


export type AuthQuery = (
  { __typename?: 'Query' }
  & { auth?: Maybe<(
    { __typename?: 'UserCredentials' }
    & Pick<UserCredentials, 'accessToken'>
  )> }
);

export type UserInfoQueryVariables = Exact<{ [key: string]: never; }>;


export type UserInfoQuery = (
  { __typename?: 'Query' }
  & { userInfo?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'companyId' | 'name' | 'email' | 'phone' | 'isAdmin' | 'acceptNewFeature'>
  )> }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'id' | 'companyId' | 'name' | 'email' | 'phone' | 'isAdmin'>
  )>>> }
);

export type SendOperationEmailInfoQueryVariables = Exact<{
  operationId: Scalars['ID'];
}>;


export type SendOperationEmailInfoQuery = (
  { __typename?: 'Query' }
  & { sendOperationEmailInfo?: Maybe<(
    { __typename?: 'SendEmailInfo' }
    & Pick<SendEmailInfo, 'id' | 'userEmails' | 'suggestFunds'>
  )> }
);

export type StatisticsQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
  startDate?: InputMaybe<Scalars['String']>;
  endDate?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['String']>;
}>;


export type StatisticsQuery = (
  { __typename?: 'Query' }
  & { statistics?: Maybe<(
    { __typename?: 'Statistics' }
    & Pick<Statistics, 'total' | 'amount'>
    & { operations?: Maybe<Array<Maybe<(
      { __typename?: 'Statistic' }
      & Pick<Statistic, 'id' | 'date' | 'companyId' | 'companyName' | 'status' | 'total' | 'amount' | 'payout' | 'amountPaid' | 'amountKept' | 'timeSpent' | 'distanceDriven' | 'letterSent' | 'companyFunds' | 'paymentStatus' | 'paymentDate'>
      & { funds?: Maybe<Array<Maybe<(
        { __typename?: 'StatisticFund' }
        & Pick<StatisticFund, 'id' | 'name'>
      )>>>, files?: Maybe<Array<Maybe<(
        { __typename?: 'File' }
        & Pick<File, 'name' | 'size' | 'type' | 'typeProof' | 'fileId' | 'urlPut' | 'urlGet'>
      )>>> }
    )>>> }
  )> }
);

export type StatisticsDownloadQueryVariables = Exact<{
  startDate: Scalars['String'];
  endDate: Scalars['String'];
}>;


export type StatisticsDownloadQuery = (
  { __typename?: 'Query' }
  & { statisticsDownload?: Maybe<Array<Maybe<(
    { __typename?: 'Statistic' }
    & Pick<Statistic, 'id' | 'date' | 'companyId' | 'companyName' | 'companyAddress' | 'status' | 'total' | 'amount' | 'payout' | 'amountPaid' | 'amountKept' | 'timeSpent' | 'distanceDriven'>
    & { funds?: Maybe<Array<Maybe<(
      { __typename?: 'StatisticFund' }
      & Pick<StatisticFund, 'id' | 'name'>
    )>>>, files?: Maybe<Array<Maybe<(
      { __typename?: 'File' }
      & Pick<File, 'name' | 'size' | 'type' | 'typeProof' | 'fileId' | 'urlPut' | 'urlGet'>
    )>>> }
  )>>> }
);

export type CompanyQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyQuery = (
  { __typename?: 'Query' }
  & { company?: Maybe<(
    { __typename?: 'Company' }
    & Pick<Company, 'id' | 'name' | 'isDevShop'>
    & { funds?: Maybe<Array<Maybe<(
      { __typename?: 'CompanyFund' }
      & Pick<CompanyFund, 'id' | 'name'>
    )>>>, addresses?: Maybe<Array<Maybe<(
      { __typename?: 'Address' }
      & Pick<Address, 'address' | 'instruction'>
    )>>> }
  )> }
);

export type CompaniesQueryVariables = Exact<{
  offset?: InputMaybe<Scalars['Int']>;
  limit?: InputMaybe<Scalars['Int']>;
}>;


export type CompaniesQuery = (
  { __typename?: 'Query' }
  & { companies?: Maybe<(
    { __typename?: 'Companies' }
    & Pick<Companies, 'total'>
    & { companies?: Maybe<Array<Maybe<(
      { __typename?: 'Company' }
      & Pick<Company, 'id' | 'name' | 'registerDate'>
      & { addresses?: Maybe<Array<Maybe<(
        { __typename?: 'Address' }
        & Pick<Address, 'address' | 'instruction'>
      )>>>, funds?: Maybe<Array<Maybe<(
        { __typename?: 'CompanyFund' }
        & Pick<CompanyFund, 'id' | 'name'>
      )>>>, users?: Maybe<Array<Maybe<(
        { __typename?: 'UserInfo' }
        & Pick<UserInfo, 'id' | 'name' | 'email' | 'phone'>
      )>>> }
    )>>> }
  )> }
);

export type RouteQueryVariables = Exact<{
  date: Scalars['String'];
}>;


export type RouteQuery = (
  { __typename?: 'Query' }
  & { route?: Maybe<(
    { __typename?: 'PointsWithMap' }
    & Pick<PointsWithMap, 'map'>
    & { points?: Maybe<Array<Maybe<(
      { __typename?: 'Point' }
      & Pick<Point, 'num' | 'date' | 'companyName' | 'companyAddress' | 'person' | 'instruction' | 'eventComment' | 'amount'>
    )>>> }
  )> }
);

export type ScheduleQueryVariables = Exact<{
  date: Scalars['String'];
}>;


export type ScheduleQuery = (
  { __typename?: 'Query' }
  & { schedule?: Maybe<Array<Maybe<Array<Maybe<(
    { __typename?: 'Schedule' }
    & Pick<Schedule, 'date' | 'available'>
    & { events?: Maybe<Array<Maybe<(
      { __typename?: 'ScheduleEvent' }
      & Pick<ScheduleEvent, 'eventId' | 'time'>
      & { info?: Maybe<(
        { __typename?: 'Event' }
        & Pick<Event, 'id' | 'type' | 'startDate' | 'startTime' | 'endTime' | 'period' | 'comment' | 'address' | 'isBox' | 'amount'>
        & { companyInfo?: Maybe<(
          { __typename?: 'CompanyInfo' }
          & Pick<CompanyInfo, 'id' | 'name'>
        )> }
      )> }
    )>>> }
  )>>>>> }
);

export type CompanyStatisticQueryVariables = Exact<{
  companyId: Scalars['ID'];
}>;


export type CompanyStatisticQuery = (
  { __typename?: 'Query' }
  & { companyStatistic?: Maybe<(
    { __typename?: 'CompanyStatistic' }
    & Pick<CompanyStatistic, 'companyId' | 'companyName' | 'companyAddress' | 'totalAmount' | 'lastMonthAmount'>
    & { funds?: Maybe<Array<Maybe<(
      { __typename?: 'Fund' }
      & Pick<Fund, 'amount' | 'lastDate' | 'name'>
    )>>> }
  )> }
);

export type UserFundsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserFundsQuery = (
  { __typename?: 'Query' }
  & { userFunds?: Maybe<Array<Maybe<(
    { __typename?: 'UserFund' }
    & Pick<UserFund, 'id' | 'name' | 'selected'>
  )>>> }
);

export type PermissionsQueryVariables = Exact<{ [key: string]: never; }>;


export type PermissionsQuery = (
  { __typename?: 'Query' }
  & { permissions?: Maybe<(
    { __typename?: 'Permissions' }
    & Pick<Permissions, 'emailNotifications' | 'mentionCompany'>
  )> }
);

export type CharityFundsQueryVariables = Exact<{ [key: string]: never; }>;


export type CharityFundsQuery = (
  { __typename?: 'Query' }
  & { charityFunds?: Maybe<Array<Maybe<(
    { __typename?: 'CharityFund' }
    & Pick<CharityFund, 'id' | 'name' | 'iban' | 'message' | 'reference' | 'country' | 'address' | 'createdAt'>
  )>>> }
);

export type TransactionDetailsQueryVariables = Exact<{
  operationId: Scalars['ID'];
}>;


export type TransactionDetailsQuery = (
  { __typename?: 'Query' }
  & { transactionDetails?: Maybe<(
    { __typename?: 'TransactionDetails' }
    & Pick<TransactionDetails, 'operationId' | 'amount' | 'hasCheck' | 'paymentStatus'>
    & { fund?: Maybe<(
      { __typename?: 'CharityFund' }
      & Pick<CharityFund, 'id' | 'name' | 'iban' | 'message' | 'reference' | 'country' | 'address'>
    )> }
  )> }
);


export const RegisterDocument = gql`
    mutation register($email: String!, $phone: String!, $name: String!, $company: String!, $address: String) {
  register(
    email: $email
    phone: $phone
    name: $name
    company: $company
    address: $address
  ) {
    message
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      phone: // value for 'phone'
 *      name: // value for 'name'
 *      company: // value for 'company'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const AddUserDocument = gql`
    mutation addUser($name: String!, $email: String!, $phone: String!) {
  addUser(name: $name, email: $email, phone: $phone) {
    id
    companyId
    name
    email
    phone
    isAdmin
  }
}
    `;
export type AddUserMutationFn = Apollo.MutationFunction<AddUserMutation, AddUserMutationVariables>;

/**
 * __useAddUserMutation__
 *
 * To run a mutation, you first call `useAddUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addUserMutation, { data, loading, error }] = useAddUserMutation({
 *   variables: {
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      phone: // value for 'phone'
 *   },
 * });
 */
export function useAddUserMutation(baseOptions?: Apollo.MutationHookOptions<AddUserMutation, AddUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddUserMutation, AddUserMutationVariables>(AddUserDocument, options);
      }
export type AddUserMutationHookResult = ReturnType<typeof useAddUserMutation>;
export type AddUserMutationResult = Apollo.MutationResult<AddUserMutation>;
export type AddUserMutationOptions = Apollo.BaseMutationOptions<AddUserMutation, AddUserMutationVariables>;
export const EditUserDocument = gql`
    mutation editUser($userId: ID!, $name: String!, $email: String!, $phone: String!) {
  editUser(userId: $userId, name: $name, email: $email, phone: $phone) {
    id
    companyId
    name
    email
    phone
    isAdmin
  }
}
    `;
export type EditUserMutationFn = Apollo.MutationFunction<EditUserMutation, EditUserMutationVariables>;

/**
 * __useEditUserMutation__
 *
 * To run a mutation, you first call `useEditUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editUserMutation, { data, loading, error }] = useEditUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      name: // value for 'name'
 *      email: // value for 'email'
 *      phone: // value for 'phone'
 *   },
 * });
 */
export function useEditUserMutation(baseOptions?: Apollo.MutationHookOptions<EditUserMutation, EditUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditUserMutation, EditUserMutationVariables>(EditUserDocument, options);
      }
export type EditUserMutationHookResult = ReturnType<typeof useEditUserMutation>;
export type EditUserMutationResult = Apollo.MutationResult<EditUserMutation>;
export type EditUserMutationOptions = Apollo.BaseMutationOptions<EditUserMutation, EditUserMutationVariables>;
export const DeleteUserDocument = gql`
    mutation deleteUser($userId: ID!) {
  deleteUser(userId: $userId) {
    id
  }
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, options);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const AddOperationDocument = gql`
    mutation addOperation($date: String!, $companyId: ID!, $status: String!, $total: Float!, $amount: Float!, $payout: Float!, $amountPaid: Float!, $amountKept: Float!, $timeSpent: Float!, $distanceDriven: Float!, $funds: [String], $files: [FileInput]) {
  addOperation(
    date: $date
    companyId: $companyId
    status: $status
    total: $total
    amount: $amount
    payout: $payout
    amountPaid: $amountPaid
    amountKept: $amountKept
    timeSpent: $timeSpent
    distanceDriven: $distanceDriven
    funds: $funds
    files: $files
  ) {
    id
    date
    companyId
    companyName
    status
    total
    amount
    payout
    amountPaid
    amountKept
    timeSpent
    distanceDriven
    funds {
      id
      name
    }
    files {
      name
      size
      type
      typeProof
      fileId
      urlPut
      urlGet
    }
  }
}
    `;
export type AddOperationMutationFn = Apollo.MutationFunction<AddOperationMutation, AddOperationMutationVariables>;

/**
 * __useAddOperationMutation__
 *
 * To run a mutation, you first call `useAddOperationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOperationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOperationMutation, { data, loading, error }] = useAddOperationMutation({
 *   variables: {
 *      date: // value for 'date'
 *      companyId: // value for 'companyId'
 *      status: // value for 'status'
 *      total: // value for 'total'
 *      amount: // value for 'amount'
 *      payout: // value for 'payout'
 *      amountPaid: // value for 'amountPaid'
 *      amountKept: // value for 'amountKept'
 *      timeSpent: // value for 'timeSpent'
 *      distanceDriven: // value for 'distanceDriven'
 *      funds: // value for 'funds'
 *      files: // value for 'files'
 *   },
 * });
 */
export function useAddOperationMutation(baseOptions?: Apollo.MutationHookOptions<AddOperationMutation, AddOperationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddOperationMutation, AddOperationMutationVariables>(AddOperationDocument, options);
      }
export type AddOperationMutationHookResult = ReturnType<typeof useAddOperationMutation>;
export type AddOperationMutationResult = Apollo.MutationResult<AddOperationMutation>;
export type AddOperationMutationOptions = Apollo.BaseMutationOptions<AddOperationMutation, AddOperationMutationVariables>;
export const EditOperationDocument = gql`
    mutation editOperation($operationId: ID!, $date: String!, $companyId: ID!, $status: String!, $total: Float!, $amount: Float!, $payout: Float!, $amountPaid: Float!, $amountKept: Float!, $timeSpent: Float!, $distanceDriven: Float!, $funds: [String], $files: [FileInput]) {
  editOperation(
    operationId: $operationId
    date: $date
    companyId: $companyId
    status: $status
    total: $total
    amount: $amount
    payout: $payout
    amountPaid: $amountPaid
    amountKept: $amountKept
    timeSpent: $timeSpent
    distanceDriven: $distanceDriven
    funds: $funds
    files: $files
  ) {
    id
    date
    companyId
    companyName
    status
    total
    amount
    payout
    amountPaid
    amountKept
    timeSpent
    distanceDriven
    funds {
      id
      name
    }
    files {
      name
      size
      type
      typeProof
      fileId
      urlPut
      urlGet
    }
  }
}
    `;
export type EditOperationMutationFn = Apollo.MutationFunction<EditOperationMutation, EditOperationMutationVariables>;

/**
 * __useEditOperationMutation__
 *
 * To run a mutation, you first call `useEditOperationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditOperationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editOperationMutation, { data, loading, error }] = useEditOperationMutation({
 *   variables: {
 *      operationId: // value for 'operationId'
 *      date: // value for 'date'
 *      companyId: // value for 'companyId'
 *      status: // value for 'status'
 *      total: // value for 'total'
 *      amount: // value for 'amount'
 *      payout: // value for 'payout'
 *      amountPaid: // value for 'amountPaid'
 *      amountKept: // value for 'amountKept'
 *      timeSpent: // value for 'timeSpent'
 *      distanceDriven: // value for 'distanceDriven'
 *      funds: // value for 'funds'
 *      files: // value for 'files'
 *   },
 * });
 */
export function useEditOperationMutation(baseOptions?: Apollo.MutationHookOptions<EditOperationMutation, EditOperationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditOperationMutation, EditOperationMutationVariables>(EditOperationDocument, options);
      }
export type EditOperationMutationHookResult = ReturnType<typeof useEditOperationMutation>;
export type EditOperationMutationResult = Apollo.MutationResult<EditOperationMutation>;
export type EditOperationMutationOptions = Apollo.BaseMutationOptions<EditOperationMutation, EditOperationMutationVariables>;
export const DeleteOperationDocument = gql`
    mutation deleteOperation($operationId: ID!) {
  deleteOperation(operationId: $operationId) {
    id
  }
}
    `;
export type DeleteOperationMutationFn = Apollo.MutationFunction<DeleteOperationMutation, DeleteOperationMutationVariables>;

/**
 * __useDeleteOperationMutation__
 *
 * To run a mutation, you first call `useDeleteOperationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteOperationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteOperationMutation, { data, loading, error }] = useDeleteOperationMutation({
 *   variables: {
 *      operationId: // value for 'operationId'
 *   },
 * });
 */
export function useDeleteOperationMutation(baseOptions?: Apollo.MutationHookOptions<DeleteOperationMutation, DeleteOperationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteOperationMutation, DeleteOperationMutationVariables>(DeleteOperationDocument, options);
      }
export type DeleteOperationMutationHookResult = ReturnType<typeof useDeleteOperationMutation>;
export type DeleteOperationMutationResult = Apollo.MutationResult<DeleteOperationMutation>;
export type DeleteOperationMutationOptions = Apollo.BaseMutationOptions<DeleteOperationMutation, DeleteOperationMutationVariables>;
export const EditCompanyDocument = gql`
    mutation editCompany($name: String!) {
  editCompany(name: $name) {
    id
  }
}
    `;
export type EditCompanyMutationFn = Apollo.MutationFunction<EditCompanyMutation, EditCompanyMutationVariables>;

/**
 * __useEditCompanyMutation__
 *
 * To run a mutation, you first call `useEditCompanyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditCompanyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editCompanyMutation, { data, loading, error }] = useEditCompanyMutation({
 *   variables: {
 *      name: // value for 'name'
 *   },
 * });
 */
export function useEditCompanyMutation(baseOptions?: Apollo.MutationHookOptions<EditCompanyMutation, EditCompanyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditCompanyMutation, EditCompanyMutationVariables>(EditCompanyDocument, options);
      }
export type EditCompanyMutationHookResult = ReturnType<typeof useEditCompanyMutation>;
export type EditCompanyMutationResult = Apollo.MutationResult<EditCompanyMutation>;
export type EditCompanyMutationOptions = Apollo.BaseMutationOptions<EditCompanyMutation, EditCompanyMutationVariables>;
export const SuggestOrganizationDocument = gql`
    mutation suggestOrganization($name: String!, $url: String) {
  suggestOrganization(name: $name, url: $url) {
    id
    message
  }
}
    `;
export type SuggestOrganizationMutationFn = Apollo.MutationFunction<SuggestOrganizationMutation, SuggestOrganizationMutationVariables>;

/**
 * __useSuggestOrganizationMutation__
 *
 * To run a mutation, you first call `useSuggestOrganizationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSuggestOrganizationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [suggestOrganizationMutation, { data, loading, error }] = useSuggestOrganizationMutation({
 *   variables: {
 *      name: // value for 'name'
 *      url: // value for 'url'
 *   },
 * });
 */
export function useSuggestOrganizationMutation(baseOptions?: Apollo.MutationHookOptions<SuggestOrganizationMutation, SuggestOrganizationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SuggestOrganizationMutation, SuggestOrganizationMutationVariables>(SuggestOrganizationDocument, options);
      }
export type SuggestOrganizationMutationHookResult = ReturnType<typeof useSuggestOrganizationMutation>;
export type SuggestOrganizationMutationResult = Apollo.MutationResult<SuggestOrganizationMutation>;
export type SuggestOrganizationMutationOptions = Apollo.BaseMutationOptions<SuggestOrganizationMutation, SuggestOrganizationMutationVariables>;
export const AddEventDocument = gql`
    mutation addEvent($type: String!, $startDate: String!, $startTime: String!, $endTime: String!, $period: String, $comment: String, $companyId: ID, $address: String) {
  addEvent(
    type: $type
    startDate: $startDate
    startTime: $startTime
    endTime: $endTime
    period: $period
    comment: $comment
    companyId: $companyId
    address: $address
  ) {
    id
  }
}
    `;
export type AddEventMutationFn = Apollo.MutationFunction<AddEventMutation, AddEventMutationVariables>;

/**
 * __useAddEventMutation__
 *
 * To run a mutation, you first call `useAddEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addEventMutation, { data, loading, error }] = useAddEventMutation({
 *   variables: {
 *      type: // value for 'type'
 *      startDate: // value for 'startDate'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *      period: // value for 'period'
 *      comment: // value for 'comment'
 *      companyId: // value for 'companyId'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useAddEventMutation(baseOptions?: Apollo.MutationHookOptions<AddEventMutation, AddEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddEventMutation, AddEventMutationVariables>(AddEventDocument, options);
      }
export type AddEventMutationHookResult = ReturnType<typeof useAddEventMutation>;
export type AddEventMutationResult = Apollo.MutationResult<AddEventMutation>;
export type AddEventMutationOptions = Apollo.BaseMutationOptions<AddEventMutation, AddEventMutationVariables>;
export const EditEventDocument = gql`
    mutation editEvent($editEventId: ID!, $startDate: String!, $startTime: String!, $endTime: String!, $type: String!, $period: String, $comment: String, $deleteDate: String, $address: String, $amount: String) {
  editEvent(
    id: $editEventId
    startDate: $startDate
    startTime: $startTime
    endTime: $endTime
    type: $type
    period: $period
    comment: $comment
    deleteDate: $deleteDate
    address: $address
    amount: $amount
  ) {
    id
  }
}
    `;
export type EditEventMutationFn = Apollo.MutationFunction<EditEventMutation, EditEventMutationVariables>;

/**
 * __useEditEventMutation__
 *
 * To run a mutation, you first call `useEditEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editEventMutation, { data, loading, error }] = useEditEventMutation({
 *   variables: {
 *      editEventId: // value for 'editEventId'
 *      startDate: // value for 'startDate'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *      type: // value for 'type'
 *      period: // value for 'period'
 *      comment: // value for 'comment'
 *      deleteDate: // value for 'deleteDate'
 *      address: // value for 'address'
 *      amount: // value for 'amount'
 *   },
 * });
 */
export function useEditEventMutation(baseOptions?: Apollo.MutationHookOptions<EditEventMutation, EditEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditEventMutation, EditEventMutationVariables>(EditEventDocument, options);
      }
export type EditEventMutationHookResult = ReturnType<typeof useEditEventMutation>;
export type EditEventMutationResult = Apollo.MutationResult<EditEventMutation>;
export type EditEventMutationOptions = Apollo.BaseMutationOptions<EditEventMutation, EditEventMutationVariables>;
export const DeleteEventDocument = gql`
    mutation deleteEvent($deleteEventId: ID!, $deleteDate: String) {
  deleteEvent(id: $deleteEventId, deleteDate: $deleteDate) {
    id
  }
}
    `;
export type DeleteEventMutationFn = Apollo.MutationFunction<DeleteEventMutation, DeleteEventMutationVariables>;

/**
 * __useDeleteEventMutation__
 *
 * To run a mutation, you first call `useDeleteEventMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteEventMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteEventMutation, { data, loading, error }] = useDeleteEventMutation({
 *   variables: {
 *      deleteEventId: // value for 'deleteEventId'
 *      deleteDate: // value for 'deleteDate'
 *   },
 * });
 */
export function useDeleteEventMutation(baseOptions?: Apollo.MutationHookOptions<DeleteEventMutation, DeleteEventMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteEventMutation, DeleteEventMutationVariables>(DeleteEventDocument, options);
      }
export type DeleteEventMutationHookResult = ReturnType<typeof useDeleteEventMutation>;
export type DeleteEventMutationResult = Apollo.MutationResult<DeleteEventMutation>;
export type DeleteEventMutationOptions = Apollo.BaseMutationOptions<DeleteEventMutation, DeleteEventMutationVariables>;
export const AddAddressDocument = gql`
    mutation addAddress($address: String!, $instruction: String!) {
  addAddress(address: $address, instruction: $instruction) {
    message
  }
}
    `;
export type AddAddressMutationFn = Apollo.MutationFunction<AddAddressMutation, AddAddressMutationVariables>;

/**
 * __useAddAddressMutation__
 *
 * To run a mutation, you first call `useAddAddressMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddAddressMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addAddressMutation, { data, loading, error }] = useAddAddressMutation({
 *   variables: {
 *      address: // value for 'address'
 *      instruction: // value for 'instruction'
 *   },
 * });
 */
export function useAddAddressMutation(baseOptions?: Apollo.MutationHookOptions<AddAddressMutation, AddAddressMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddAddressMutation, AddAddressMutationVariables>(AddAddressDocument, options);
      }
export type AddAddressMutationHookResult = ReturnType<typeof useAddAddressMutation>;
export type AddAddressMutationResult = Apollo.MutationResult<AddAddressMutation>;
export type AddAddressMutationOptions = Apollo.BaseMutationOptions<AddAddressMutation, AddAddressMutationVariables>;
export const EditAddressesDocument = gql`
    mutation editAddresses($addresses: [AddressInput]) {
  editAddresses(addresses: $addresses) {
    message
  }
}
    `;
export type EditAddressesMutationFn = Apollo.MutationFunction<EditAddressesMutation, EditAddressesMutationVariables>;

/**
 * __useEditAddressesMutation__
 *
 * To run a mutation, you first call `useEditAddressesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditAddressesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editAddressesMutation, { data, loading, error }] = useEditAddressesMutation({
 *   variables: {
 *      addresses: // value for 'addresses'
 *   },
 * });
 */
export function useEditAddressesMutation(baseOptions?: Apollo.MutationHookOptions<EditAddressesMutation, EditAddressesMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditAddressesMutation, EditAddressesMutationVariables>(EditAddressesDocument, options);
      }
export type EditAddressesMutationHookResult = ReturnType<typeof useEditAddressesMutation>;
export type EditAddressesMutationResult = Apollo.MutationResult<EditAddressesMutation>;
export type EditAddressesMutationOptions = Apollo.BaseMutationOptions<EditAddressesMutation, EditAddressesMutationVariables>;
export const EditFundsDocument = gql`
    mutation editFunds($funds: [String]) {
  editFunds(funds: $funds) {
    message
  }
}
    `;
export type EditFundsMutationFn = Apollo.MutationFunction<EditFundsMutation, EditFundsMutationVariables>;

/**
 * __useEditFundsMutation__
 *
 * To run a mutation, you first call `useEditFundsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditFundsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editFundsMutation, { data, loading, error }] = useEditFundsMutation({
 *   variables: {
 *      funds: // value for 'funds'
 *   },
 * });
 */
export function useEditFundsMutation(baseOptions?: Apollo.MutationHookOptions<EditFundsMutation, EditFundsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditFundsMutation, EditFundsMutationVariables>(EditFundsDocument, options);
      }
export type EditFundsMutationHookResult = ReturnType<typeof useEditFundsMutation>;
export type EditFundsMutationResult = Apollo.MutationResult<EditFundsMutation>;
export type EditFundsMutationOptions = Apollo.BaseMutationOptions<EditFundsMutation, EditFundsMutationVariables>;
export const EditPermissionsDocument = gql`
    mutation editPermissions($emailNotifications: [String], $mentionCompany: [String]) {
  editPermissions(
    emailNotifications: $emailNotifications
    mentionCompany: $mentionCompany
  ) {
    message
  }
}
    `;
export type EditPermissionsMutationFn = Apollo.MutationFunction<EditPermissionsMutation, EditPermissionsMutationVariables>;

/**
 * __useEditPermissionsMutation__
 *
 * To run a mutation, you first call `useEditPermissionsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditPermissionsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editPermissionsMutation, { data, loading, error }] = useEditPermissionsMutation({
 *   variables: {
 *      emailNotifications: // value for 'emailNotifications'
 *      mentionCompany: // value for 'mentionCompany'
 *   },
 * });
 */
export function useEditPermissionsMutation(baseOptions?: Apollo.MutationHookOptions<EditPermissionsMutation, EditPermissionsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditPermissionsMutation, EditPermissionsMutationVariables>(EditPermissionsDocument, options);
      }
export type EditPermissionsMutationHookResult = ReturnType<typeof useEditPermissionsMutation>;
export type EditPermissionsMutationResult = Apollo.MutationResult<EditPermissionsMutation>;
export type EditPermissionsMutationOptions = Apollo.BaseMutationOptions<EditPermissionsMutation, EditPermissionsMutationVariables>;
export const AcceptNewFeatureDocument = gql`
    mutation acceptNewFeature($message: String) {
  acceptNewFeature(message: $message) {
    message
  }
}
    `;
export type AcceptNewFeatureMutationFn = Apollo.MutationFunction<AcceptNewFeatureMutation, AcceptNewFeatureMutationVariables>;

/**
 * __useAcceptNewFeatureMutation__
 *
 * To run a mutation, you first call `useAcceptNewFeatureMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAcceptNewFeatureMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [acceptNewFeatureMutation, { data, loading, error }] = useAcceptNewFeatureMutation({
 *   variables: {
 *      message: // value for 'message'
 *   },
 * });
 */
export function useAcceptNewFeatureMutation(baseOptions?: Apollo.MutationHookOptions<AcceptNewFeatureMutation, AcceptNewFeatureMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AcceptNewFeatureMutation, AcceptNewFeatureMutationVariables>(AcceptNewFeatureDocument, options);
      }
export type AcceptNewFeatureMutationHookResult = ReturnType<typeof useAcceptNewFeatureMutation>;
export type AcceptNewFeatureMutationResult = Apollo.MutationResult<AcceptNewFeatureMutation>;
export type AcceptNewFeatureMutationOptions = Apollo.BaseMutationOptions<AcceptNewFeatureMutation, AcceptNewFeatureMutationVariables>;
export const OrderBoxDocument = gql`
    mutation orderBox($amount: String!, $startDate: String!, $startTime: String!, $endTime: String!, $comment: String, $address: String!) {
  orderBox(
    amount: $amount
    startDate: $startDate
    startTime: $startTime
    endTime: $endTime
    comment: $comment
    address: $address
  ) {
    message
  }
}
    `;
export type OrderBoxMutationFn = Apollo.MutationFunction<OrderBoxMutation, OrderBoxMutationVariables>;

/**
 * __useOrderBoxMutation__
 *
 * To run a mutation, you first call `useOrderBoxMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useOrderBoxMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [orderBoxMutation, { data, loading, error }] = useOrderBoxMutation({
 *   variables: {
 *      amount: // value for 'amount'
 *      startDate: // value for 'startDate'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *      comment: // value for 'comment'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useOrderBoxMutation(baseOptions?: Apollo.MutationHookOptions<OrderBoxMutation, OrderBoxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<OrderBoxMutation, OrderBoxMutationVariables>(OrderBoxDocument, options);
      }
export type OrderBoxMutationHookResult = ReturnType<typeof useOrderBoxMutation>;
export type OrderBoxMutationResult = Apollo.MutationResult<OrderBoxMutation>;
export type OrderBoxMutationOptions = Apollo.BaseMutationOptions<OrderBoxMutation, OrderBoxMutationVariables>;
export const EditBoxDocument = gql`
    mutation editBox($id: ID!, $amount: String!, $startDate: String!, $startTime: String!, $endTime: String!, $comment: String, $address: String!) {
  editBox(
    id: $id
    amount: $amount
    startDate: $startDate
    startTime: $startTime
    endTime: $endTime
    comment: $comment
    address: $address
  ) {
    id
  }
}
    `;
export type EditBoxMutationFn = Apollo.MutationFunction<EditBoxMutation, EditBoxMutationVariables>;

/**
 * __useEditBoxMutation__
 *
 * To run a mutation, you first call `useEditBoxMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditBoxMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editBoxMutation, { data, loading, error }] = useEditBoxMutation({
 *   variables: {
 *      id: // value for 'id'
 *      amount: // value for 'amount'
 *      startDate: // value for 'startDate'
 *      startTime: // value for 'startTime'
 *      endTime: // value for 'endTime'
 *      comment: // value for 'comment'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useEditBoxMutation(baseOptions?: Apollo.MutationHookOptions<EditBoxMutation, EditBoxMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditBoxMutation, EditBoxMutationVariables>(EditBoxDocument, options);
      }
export type EditBoxMutationHookResult = ReturnType<typeof useEditBoxMutation>;
export type EditBoxMutationResult = Apollo.MutationResult<EditBoxMutation>;
export type EditBoxMutationOptions = Apollo.BaseMutationOptions<EditBoxMutation, EditBoxMutationVariables>;
export const SendLetterOperationInfoDocument = gql`
    mutation sendLetterOperationInfo($operationId: ID!, $userEmails: [String]) {
  sendLetterOperationInfo(operationId: $operationId, userEmails: $userEmails) {
    message
  }
}
    `;
export type SendLetterOperationInfoMutationFn = Apollo.MutationFunction<SendLetterOperationInfoMutation, SendLetterOperationInfoMutationVariables>;

/**
 * __useSendLetterOperationInfoMutation__
 *
 * To run a mutation, you first call `useSendLetterOperationInfoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendLetterOperationInfoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendLetterOperationInfoMutation, { data, loading, error }] = useSendLetterOperationInfoMutation({
 *   variables: {
 *      operationId: // value for 'operationId'
 *      userEmails: // value for 'userEmails'
 *   },
 * });
 */
export function useSendLetterOperationInfoMutation(baseOptions?: Apollo.MutationHookOptions<SendLetterOperationInfoMutation, SendLetterOperationInfoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendLetterOperationInfoMutation, SendLetterOperationInfoMutationVariables>(SendLetterOperationInfoDocument, options);
      }
export type SendLetterOperationInfoMutationHookResult = ReturnType<typeof useSendLetterOperationInfoMutation>;
export type SendLetterOperationInfoMutationResult = Apollo.MutationResult<SendLetterOperationInfoMutation>;
export type SendLetterOperationInfoMutationOptions = Apollo.BaseMutationOptions<SendLetterOperationInfoMutation, SendLetterOperationInfoMutationVariables>;
export const AddFundDocument = gql`
    mutation addFund($name: String!, $iban: String!, $message: String, $reference: String, $address: String!, $country: String!) {
  addFund(
    name: $name
    iban: $iban
    message: $message
    reference: $reference
    address: $address
    country: $country
  ) {
    id
    name
    iban
    message
    reference
    country
    address
    createdAt
  }
}
    `;
export type AddFundMutationFn = Apollo.MutationFunction<AddFundMutation, AddFundMutationVariables>;

/**
 * __useAddFundMutation__
 *
 * To run a mutation, you first call `useAddFundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddFundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addFundMutation, { data, loading, error }] = useAddFundMutation({
 *   variables: {
 *      name: // value for 'name'
 *      iban: // value for 'iban'
 *      message: // value for 'message'
 *      reference: // value for 'reference'
 *      address: // value for 'address'
 *      country: // value for 'country'
 *   },
 * });
 */
export function useAddFundMutation(baseOptions?: Apollo.MutationHookOptions<AddFundMutation, AddFundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<AddFundMutation, AddFundMutationVariables>(AddFundDocument, options);
      }
export type AddFundMutationHookResult = ReturnType<typeof useAddFundMutation>;
export type AddFundMutationResult = Apollo.MutationResult<AddFundMutation>;
export type AddFundMutationOptions = Apollo.BaseMutationOptions<AddFundMutation, AddFundMutationVariables>;
export const EditFundDocument = gql`
    mutation editFund($fundId: ID!, $name: String!, $iban: String!, $message: String, $reference: String, $address: String!, $country: String!) {
  editFund(
    fundId: $fundId
    name: $name
    iban: $iban
    message: $message
    reference: $reference
    address: $address
    country: $country
  ) {
    id
    name
    iban
    message
    reference
    country
    address
    createdAt
  }
}
    `;
export type EditFundMutationFn = Apollo.MutationFunction<EditFundMutation, EditFundMutationVariables>;

/**
 * __useEditFundMutation__
 *
 * To run a mutation, you first call `useEditFundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useEditFundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [editFundMutation, { data, loading, error }] = useEditFundMutation({
 *   variables: {
 *      fundId: // value for 'fundId'
 *      name: // value for 'name'
 *      iban: // value for 'iban'
 *      message: // value for 'message'
 *      reference: // value for 'reference'
 *      address: // value for 'address'
 *      country: // value for 'country'
 *   },
 * });
 */
export function useEditFundMutation(baseOptions?: Apollo.MutationHookOptions<EditFundMutation, EditFundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<EditFundMutation, EditFundMutationVariables>(EditFundDocument, options);
      }
export type EditFundMutationHookResult = ReturnType<typeof useEditFundMutation>;
export type EditFundMutationResult = Apollo.MutationResult<EditFundMutation>;
export type EditFundMutationOptions = Apollo.BaseMutationOptions<EditFundMutation, EditFundMutationVariables>;
export const DeleteFundDocument = gql`
    mutation deleteFund($fundId: ID!) {
  deleteFund(fundId: $fundId) {
    id
    message
  }
}
    `;
export type DeleteFundMutationFn = Apollo.MutationFunction<DeleteFundMutation, DeleteFundMutationVariables>;

/**
 * __useDeleteFundMutation__
 *
 * To run a mutation, you first call `useDeleteFundMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFundMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFundMutation, { data, loading, error }] = useDeleteFundMutation({
 *   variables: {
 *      fundId: // value for 'fundId'
 *   },
 * });
 */
export function useDeleteFundMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFundMutation, DeleteFundMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFundMutation, DeleteFundMutationVariables>(DeleteFundDocument, options);
      }
export type DeleteFundMutationHookResult = ReturnType<typeof useDeleteFundMutation>;
export type DeleteFundMutationResult = Apollo.MutationResult<DeleteFundMutation>;
export type DeleteFundMutationOptions = Apollo.BaseMutationOptions<DeleteFundMutation, DeleteFundMutationVariables>;
export const SendMoneyDocument = gql`
    mutation sendMoney($operationId: ID!) {
  sendMoney(operationId: $operationId) {
    operationId
    companyFromId
    archiveId
    amount
    bookingDate
    currency
    creditorName
    creditorIban
    debtorIban
    transactionId
    transactionDate
    paymentType
    status
    endToEndId
  }
}
    `;
export type SendMoneyMutationFn = Apollo.MutationFunction<SendMoneyMutation, SendMoneyMutationVariables>;

/**
 * __useSendMoneyMutation__
 *
 * To run a mutation, you first call `useSendMoneyMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMoneyMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMoneyMutation, { data, loading, error }] = useSendMoneyMutation({
 *   variables: {
 *      operationId: // value for 'operationId'
 *   },
 * });
 */
export function useSendMoneyMutation(baseOptions?: Apollo.MutationHookOptions<SendMoneyMutation, SendMoneyMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMoneyMutation, SendMoneyMutationVariables>(SendMoneyDocument, options);
      }
export type SendMoneyMutationHookResult = ReturnType<typeof useSendMoneyMutation>;
export type SendMoneyMutationResult = Apollo.MutationResult<SendMoneyMutation>;
export type SendMoneyMutationOptions = Apollo.BaseMutationOptions<SendMoneyMutation, SendMoneyMutationVariables>;
export const RequestAuthDocument = gql`
    query requestAuth($email: String!) {
  requestAuth(email: $email) {
    message
  }
}
    `;

/**
 * __useRequestAuthQuery__
 *
 * To run a query within a React component, call `useRequestAuthQuery` and pass it any options that fit your needs.
 * When your component renders, `useRequestAuthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRequestAuthQuery({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useRequestAuthQuery(baseOptions: Apollo.QueryHookOptions<RequestAuthQuery, RequestAuthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RequestAuthQuery, RequestAuthQueryVariables>(RequestAuthDocument, options);
      }
export function useRequestAuthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RequestAuthQuery, RequestAuthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RequestAuthQuery, RequestAuthQueryVariables>(RequestAuthDocument, options);
        }
export type RequestAuthQueryHookResult = ReturnType<typeof useRequestAuthQuery>;
export type RequestAuthLazyQueryHookResult = ReturnType<typeof useRequestAuthLazyQuery>;
export type RequestAuthQueryResult = Apollo.QueryResult<RequestAuthQuery, RequestAuthQueryVariables>;
export const AuthDocument = gql`
    query auth($email: String!, $tempPassword: String!) {
  auth(email: $email, tempPassword: $tempPassword) {
    accessToken
  }
}
    `;

/**
 * __useAuthQuery__
 *
 * To run a query within a React component, call `useAuthQuery` and pass it any options that fit your needs.
 * When your component renders, `useAuthQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useAuthQuery({
 *   variables: {
 *      email: // value for 'email'
 *      tempPassword: // value for 'tempPassword'
 *   },
 * });
 */
export function useAuthQuery(baseOptions: Apollo.QueryHookOptions<AuthQuery, AuthQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<AuthQuery, AuthQueryVariables>(AuthDocument, options);
      }
export function useAuthLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<AuthQuery, AuthQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<AuthQuery, AuthQueryVariables>(AuthDocument, options);
        }
export type AuthQueryHookResult = ReturnType<typeof useAuthQuery>;
export type AuthLazyQueryHookResult = ReturnType<typeof useAuthLazyQuery>;
export type AuthQueryResult = Apollo.QueryResult<AuthQuery, AuthQueryVariables>;
export const UserInfoDocument = gql`
    query userInfo {
  userInfo {
    id
    companyId
    name
    email
    phone
    isAdmin
    acceptNewFeature
  }
}
    `;

/**
 * __useUserInfoQuery__
 *
 * To run a query within a React component, call `useUserInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserInfoQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserInfoQuery(baseOptions?: Apollo.QueryHookOptions<UserInfoQuery, UserInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserInfoQuery, UserInfoQueryVariables>(UserInfoDocument, options);
      }
export function useUserInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserInfoQuery, UserInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserInfoQuery, UserInfoQueryVariables>(UserInfoDocument, options);
        }
export type UserInfoQueryHookResult = ReturnType<typeof useUserInfoQuery>;
export type UserInfoLazyQueryHookResult = ReturnType<typeof useUserInfoLazyQuery>;
export type UserInfoQueryResult = Apollo.QueryResult<UserInfoQuery, UserInfoQueryVariables>;
export const UsersDocument = gql`
    query users {
  users {
    id
    companyId
    name
    email
    phone
    isAdmin
  }
}
    `;

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
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
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
export const SendOperationEmailInfoDocument = gql`
    query sendOperationEmailInfo($operationId: ID!) {
  sendOperationEmailInfo(operationId: $operationId) {
    id
    userEmails
    suggestFunds
  }
}
    `;

/**
 * __useSendOperationEmailInfoQuery__
 *
 * To run a query within a React component, call `useSendOperationEmailInfoQuery` and pass it any options that fit your needs.
 * When your component renders, `useSendOperationEmailInfoQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSendOperationEmailInfoQuery({
 *   variables: {
 *      operationId: // value for 'operationId'
 *   },
 * });
 */
export function useSendOperationEmailInfoQuery(baseOptions: Apollo.QueryHookOptions<SendOperationEmailInfoQuery, SendOperationEmailInfoQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SendOperationEmailInfoQuery, SendOperationEmailInfoQueryVariables>(SendOperationEmailInfoDocument, options);
      }
export function useSendOperationEmailInfoLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SendOperationEmailInfoQuery, SendOperationEmailInfoQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SendOperationEmailInfoQuery, SendOperationEmailInfoQueryVariables>(SendOperationEmailInfoDocument, options);
        }
export type SendOperationEmailInfoQueryHookResult = ReturnType<typeof useSendOperationEmailInfoQuery>;
export type SendOperationEmailInfoLazyQueryHookResult = ReturnType<typeof useSendOperationEmailInfoLazyQuery>;
export type SendOperationEmailInfoQueryResult = Apollo.QueryResult<SendOperationEmailInfoQuery, SendOperationEmailInfoQueryVariables>;
export const StatisticsDocument = gql`
    query statistics($offset: Int, $limit: Int, $startDate: String, $endDate: String, $status: String) {
  statistics(
    offset: $offset
    limit: $limit
    startDate: $startDate
    endDate: $endDate
    status: $status
  ) {
    operations {
      id
      date
      companyId
      companyName
      status
      total
      amount
      payout
      amountPaid
      amountKept
      timeSpent
      distanceDriven
      funds {
        id
        name
      }
      files {
        name
        size
        type
        typeProof
        fileId
        urlPut
        urlGet
      }
      letterSent
      companyFunds
      paymentStatus
      paymentDate
    }
    total
    amount
  }
}
    `;

/**
 * __useStatisticsQuery__
 *
 * To run a query within a React component, call `useStatisticsQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatisticsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatisticsQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useStatisticsQuery(baseOptions?: Apollo.QueryHookOptions<StatisticsQuery, StatisticsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatisticsQuery, StatisticsQueryVariables>(StatisticsDocument, options);
      }
export function useStatisticsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatisticsQuery, StatisticsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatisticsQuery, StatisticsQueryVariables>(StatisticsDocument, options);
        }
export type StatisticsQueryHookResult = ReturnType<typeof useStatisticsQuery>;
export type StatisticsLazyQueryHookResult = ReturnType<typeof useStatisticsLazyQuery>;
export type StatisticsQueryResult = Apollo.QueryResult<StatisticsQuery, StatisticsQueryVariables>;
export const StatisticsDownloadDocument = gql`
    query statisticsDownload($startDate: String!, $endDate: String!) {
  statisticsDownload(startDate: $startDate, endDate: $endDate) {
    id
    date
    companyId
    companyName
    companyAddress
    status
    total
    amount
    payout
    amountPaid
    amountKept
    timeSpent
    distanceDriven
    funds {
      id
      name
    }
    files {
      name
      size
      type
      typeProof
      fileId
      urlPut
      urlGet
    }
  }
}
    `;

/**
 * __useStatisticsDownloadQuery__
 *
 * To run a query within a React component, call `useStatisticsDownloadQuery` and pass it any options that fit your needs.
 * When your component renders, `useStatisticsDownloadQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useStatisticsDownloadQuery({
 *   variables: {
 *      startDate: // value for 'startDate'
 *      endDate: // value for 'endDate'
 *   },
 * });
 */
export function useStatisticsDownloadQuery(baseOptions: Apollo.QueryHookOptions<StatisticsDownloadQuery, StatisticsDownloadQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<StatisticsDownloadQuery, StatisticsDownloadQueryVariables>(StatisticsDownloadDocument, options);
      }
export function useStatisticsDownloadLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<StatisticsDownloadQuery, StatisticsDownloadQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<StatisticsDownloadQuery, StatisticsDownloadQueryVariables>(StatisticsDownloadDocument, options);
        }
export type StatisticsDownloadQueryHookResult = ReturnType<typeof useStatisticsDownloadQuery>;
export type StatisticsDownloadLazyQueryHookResult = ReturnType<typeof useStatisticsDownloadLazyQuery>;
export type StatisticsDownloadQueryResult = Apollo.QueryResult<StatisticsDownloadQuery, StatisticsDownloadQueryVariables>;
export const CompanyDocument = gql`
    query company($companyId: ID!) {
  company(companyId: $companyId) {
    id
    name
    funds {
      id
      name
    }
    addresses {
      address
      instruction
    }
    isDevShop
  }
}
    `;

/**
 * __useCompanyQuery__
 *
 * To run a query within a React component, call `useCompanyQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *   },
 * });
 */
export function useCompanyQuery(baseOptions: Apollo.QueryHookOptions<CompanyQuery, CompanyQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompanyQuery, CompanyQueryVariables>(CompanyDocument, options);
      }
export function useCompanyLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompanyQuery, CompanyQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompanyQuery, CompanyQueryVariables>(CompanyDocument, options);
        }
export type CompanyQueryHookResult = ReturnType<typeof useCompanyQuery>;
export type CompanyLazyQueryHookResult = ReturnType<typeof useCompanyLazyQuery>;
export type CompanyQueryResult = Apollo.QueryResult<CompanyQuery, CompanyQueryVariables>;
export const CompaniesDocument = gql`
    query companies($offset: Int, $limit: Int) {
  companies(offset: $offset, limit: $limit) {
    companies {
      id
      name
      addresses {
        address
        instruction
      }
      funds {
        id
        name
      }
      users {
        id
        name
        email
        phone
      }
      registerDate
    }
    total
  }
}
    `;

/**
 * __useCompaniesQuery__
 *
 * To run a query within a React component, call `useCompaniesQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompaniesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompaniesQuery({
 *   variables: {
 *      offset: // value for 'offset'
 *      limit: // value for 'limit'
 *   },
 * });
 */
export function useCompaniesQuery(baseOptions?: Apollo.QueryHookOptions<CompaniesQuery, CompaniesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompaniesQuery, CompaniesQueryVariables>(CompaniesDocument, options);
      }
export function useCompaniesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompaniesQuery, CompaniesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompaniesQuery, CompaniesQueryVariables>(CompaniesDocument, options);
        }
export type CompaniesQueryHookResult = ReturnType<typeof useCompaniesQuery>;
export type CompaniesLazyQueryHookResult = ReturnType<typeof useCompaniesLazyQuery>;
export type CompaniesQueryResult = Apollo.QueryResult<CompaniesQuery, CompaniesQueryVariables>;
export const RouteDocument = gql`
    query route($date: String!) {
  route(date: $date) {
    points {
      num
      date
      companyName
      companyAddress
      person
      instruction
      eventComment
      amount
    }
    map
  }
}
    `;

/**
 * __useRouteQuery__
 *
 * To run a query within a React component, call `useRouteQuery` and pass it any options that fit your needs.
 * When your component renders, `useRouteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useRouteQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useRouteQuery(baseOptions: Apollo.QueryHookOptions<RouteQuery, RouteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<RouteQuery, RouteQueryVariables>(RouteDocument, options);
      }
export function useRouteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<RouteQuery, RouteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<RouteQuery, RouteQueryVariables>(RouteDocument, options);
        }
export type RouteQueryHookResult = ReturnType<typeof useRouteQuery>;
export type RouteLazyQueryHookResult = ReturnType<typeof useRouteLazyQuery>;
export type RouteQueryResult = Apollo.QueryResult<RouteQuery, RouteQueryVariables>;
export const ScheduleDocument = gql`
    query schedule($date: String!) {
  schedule(date: $date) {
    date
    events {
      eventId
      time
      info {
        id
        type
        startDate
        startTime
        endTime
        period
        comment
        companyInfo {
          id
          name
        }
        address
        isBox
        amount
      }
    }
    available
  }
}
    `;

/**
 * __useScheduleQuery__
 *
 * To run a query within a React component, call `useScheduleQuery` and pass it any options that fit your needs.
 * When your component renders, `useScheduleQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useScheduleQuery({
 *   variables: {
 *      date: // value for 'date'
 *   },
 * });
 */
export function useScheduleQuery(baseOptions: Apollo.QueryHookOptions<ScheduleQuery, ScheduleQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<ScheduleQuery, ScheduleQueryVariables>(ScheduleDocument, options);
      }
export function useScheduleLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<ScheduleQuery, ScheduleQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<ScheduleQuery, ScheduleQueryVariables>(ScheduleDocument, options);
        }
export type ScheduleQueryHookResult = ReturnType<typeof useScheduleQuery>;
export type ScheduleLazyQueryHookResult = ReturnType<typeof useScheduleLazyQuery>;
export type ScheduleQueryResult = Apollo.QueryResult<ScheduleQuery, ScheduleQueryVariables>;
export const CompanyStatisticDocument = gql`
    query companyStatistic($companyId: ID!) {
  companyStatistic(companyId: $companyId) {
    companyId
    companyName
    companyAddress
    funds {
      amount
      lastDate
      name
    }
    totalAmount
    lastMonthAmount
  }
}
    `;

/**
 * __useCompanyStatisticQuery__
 *
 * To run a query within a React component, call `useCompanyStatisticQuery` and pass it any options that fit your needs.
 * When your component renders, `useCompanyStatisticQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCompanyStatisticQuery({
 *   variables: {
 *      companyId: // value for 'companyId'
 *   },
 * });
 */
export function useCompanyStatisticQuery(baseOptions: Apollo.QueryHookOptions<CompanyStatisticQuery, CompanyStatisticQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CompanyStatisticQuery, CompanyStatisticQueryVariables>(CompanyStatisticDocument, options);
      }
export function useCompanyStatisticLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CompanyStatisticQuery, CompanyStatisticQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CompanyStatisticQuery, CompanyStatisticQueryVariables>(CompanyStatisticDocument, options);
        }
export type CompanyStatisticQueryHookResult = ReturnType<typeof useCompanyStatisticQuery>;
export type CompanyStatisticLazyQueryHookResult = ReturnType<typeof useCompanyStatisticLazyQuery>;
export type CompanyStatisticQueryResult = Apollo.QueryResult<CompanyStatisticQuery, CompanyStatisticQueryVariables>;
export const UserFundsDocument = gql`
    query userFunds {
  userFunds {
    id
    name
    selected
  }
}
    `;

/**
 * __useUserFundsQuery__
 *
 * To run a query within a React component, call `useUserFundsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserFundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserFundsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserFundsQuery(baseOptions?: Apollo.QueryHookOptions<UserFundsQuery, UserFundsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<UserFundsQuery, UserFundsQueryVariables>(UserFundsDocument, options);
      }
export function useUserFundsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserFundsQuery, UserFundsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<UserFundsQuery, UserFundsQueryVariables>(UserFundsDocument, options);
        }
export type UserFundsQueryHookResult = ReturnType<typeof useUserFundsQuery>;
export type UserFundsLazyQueryHookResult = ReturnType<typeof useUserFundsLazyQuery>;
export type UserFundsQueryResult = Apollo.QueryResult<UserFundsQuery, UserFundsQueryVariables>;
export const PermissionsDocument = gql`
    query permissions {
  permissions {
    emailNotifications
    mentionCompany
  }
}
    `;

/**
 * __usePermissionsQuery__
 *
 * To run a query within a React component, call `usePermissionsQuery` and pass it any options that fit your needs.
 * When your component renders, `usePermissionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = usePermissionsQuery({
 *   variables: {
 *   },
 * });
 */
export function usePermissionsQuery(baseOptions?: Apollo.QueryHookOptions<PermissionsQuery, PermissionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<PermissionsQuery, PermissionsQueryVariables>(PermissionsDocument, options);
      }
export function usePermissionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<PermissionsQuery, PermissionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<PermissionsQuery, PermissionsQueryVariables>(PermissionsDocument, options);
        }
export type PermissionsQueryHookResult = ReturnType<typeof usePermissionsQuery>;
export type PermissionsLazyQueryHookResult = ReturnType<typeof usePermissionsLazyQuery>;
export type PermissionsQueryResult = Apollo.QueryResult<PermissionsQuery, PermissionsQueryVariables>;
export const CharityFundsDocument = gql`
    query charityFunds {
  charityFunds {
    id
    name
    iban
    message
    reference
    country
    address
    createdAt
  }
}
    `;

/**
 * __useCharityFundsQuery__
 *
 * To run a query within a React component, call `useCharityFundsQuery` and pass it any options that fit your needs.
 * When your component renders, `useCharityFundsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useCharityFundsQuery({
 *   variables: {
 *   },
 * });
 */
export function useCharityFundsQuery(baseOptions?: Apollo.QueryHookOptions<CharityFundsQuery, CharityFundsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<CharityFundsQuery, CharityFundsQueryVariables>(CharityFundsDocument, options);
      }
export function useCharityFundsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<CharityFundsQuery, CharityFundsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<CharityFundsQuery, CharityFundsQueryVariables>(CharityFundsDocument, options);
        }
export type CharityFundsQueryHookResult = ReturnType<typeof useCharityFundsQuery>;
export type CharityFundsLazyQueryHookResult = ReturnType<typeof useCharityFundsLazyQuery>;
export type CharityFundsQueryResult = Apollo.QueryResult<CharityFundsQuery, CharityFundsQueryVariables>;
export const TransactionDetailsDocument = gql`
    query transactionDetails($operationId: ID!) {
  transactionDetails(operationId: $operationId) {
    operationId
    amount
    hasCheck
    paymentStatus
    fund {
      id
      name
      iban
      message
      reference
      country
      address
    }
  }
}
    `;

/**
 * __useTransactionDetailsQuery__
 *
 * To run a query within a React component, call `useTransactionDetailsQuery` and pass it any options that fit your needs.
 * When your component renders, `useTransactionDetailsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useTransactionDetailsQuery({
 *   variables: {
 *      operationId: // value for 'operationId'
 *   },
 * });
 */
export function useTransactionDetailsQuery(baseOptions: Apollo.QueryHookOptions<TransactionDetailsQuery, TransactionDetailsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<TransactionDetailsQuery, TransactionDetailsQueryVariables>(TransactionDetailsDocument, options);
      }
export function useTransactionDetailsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<TransactionDetailsQuery, TransactionDetailsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<TransactionDetailsQuery, TransactionDetailsQueryVariables>(TransactionDetailsDocument, options);
        }
export type TransactionDetailsQueryHookResult = ReturnType<typeof useTransactionDetailsQuery>;
export type TransactionDetailsLazyQueryHookResult = ReturnType<typeof useTransactionDetailsLazyQuery>;
export type TransactionDetailsQueryResult = Apollo.QueryResult<TransactionDetailsQuery, TransactionDetailsQueryVariables>;