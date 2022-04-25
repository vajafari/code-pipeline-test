export type CognitoUserPoolSchema =
  | `address`
  | `birthdate`
  | `email`
  | `email_verified`
  | `family_name`
  | `gender`
  | `given_name`
  | `locale`
  | `middle_name`
  | `name`
  | `nickname`
  | `phone_number`
  | `phone_number_verified`
  | `picture`
  | `preferred_username`
  | `profile`
  | `updated_at`
  | `website`
  | `zoneinfo`

export interface ApiInfo {
  apiName: string
  httpMethod?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH"
  pathParameter?: string
}

export interface EntityApiInfo {
  name: string
  provider: "DynamoDB" | "MongoDB" | "cognito"
  api: ApiInfo[]
}

export interface CognitoUserPoolAuthConfigSchemaProperties {
  Name: CognitoUserPoolSchema | string
  AttributeDataType: `Boolean` | `DateTime` | `Number` | `String`
  Mutable: boolean
  Required: boolean
  DeveloperOnlyAttribute?: boolean
  NumberAttributeConstraints?: {
    MaxValue: string
    MinValue: string
  }
  StringAttributeConstraints?: {
    MaxLength: string
    MinLength: string
  }
  Label?: string
  Placeholder?: string
}

export interface AcpExport {
  defaultApiName: string
  entities: EntityApiInfo[]
  signUpFields: CognitoUserPoolAuthConfigSchemaProperties[]
}

export interface CognitoUserPoolProperties {
  UserPoolName?: string
  AccountRecoverySetting: {
    RecoveryMechanisms: {
      Name: string
      Priority: number
    }[]
  }
  AdminCreateUserConfig?: {
    AllowAdminCreateUserOnly: boolean
    InviteMessageTemplate?: {
      EmailMessage?: string
      EmailSubject?: string
      SMSMessage?: string
    }
  }
  Schema: CognitoUserPoolAuthConfigSchemaProperties[]
  UsernameAttributes: (`phone_number` | `email`)[]
  AliasAttributes?: (`phone_number` | `email` | `preferred_username`)[]
  UsernameConfiguration: {
    CaseSensitive: boolean
  }
  AutoVerifiedAttributes?: (`email` | `phone_number`)[]
  RecoveryMechanisms?: {
    Name: `admin_only` | `verified_email` | `verified_phone_number`
    Priority: 1 | 2
  }[]
  EmailVerificationMessage: string
  EmailVerificationSubject: string
  SmsAuthenticationMessage: string
  SmsVerificationMessage: string

  MfaConfiguration: `OFF` | `ON` | `OPTIONAL`
  EnabledMfas?: (`SMS_MFA` | `SOFTWARE_TOKEN_MFA`)[]
  Policies: {
    PasswordPolicy: {
      MinimumLength: number
      RequireLowercase: boolean
      RequireNumbers: boolean
      RequireSymbols: boolean
      RequireUppercase: boolean
      TemporaryPasswordValidityDays: number
    }
  }
  SmsConfiguration?: {
    ExternalId: string
    SnsCallerArn: "string"
  }
}

export const acpExports: AcpExport = {
  defaultApiName: "ApiGatewayRestApi",
  entities: [
    {
      name: "address",
      provider: "DynamoDB",
      api: [
        {
          apiName: "ApiGatewayRestApi",
          httpMethod: "GET",
        },
        {
          apiName: "ApiGatewayRestApi",
          httpMethod: "POST",
        },
        {
          apiName: "ApiGatewayRestApi",
          httpMethod: "PUT",
        },
        {
          apiName: "ApiGatewayRestApi",
          httpMethod: "DELETE",
        },
        {
          apiName: "ApiGatewayRestApi",
          httpMethod: "GET",
          pathParameter: "key",
        },
      ],
    },
    {
      name: "user",
      provider: "cognito",
      api: [
        {
          apiName: "codepipelinetestcognitoadminapi",
        },
      ],
    },
  ],
  signUpFields: [
    {
      Name: "email",
      AttributeDataType: "String",
      Mutable: false,
      Required: true,
      Label: "Email",
      Placeholder: "Enter your email",
    },
    {
      Name: "phone_number",
      AttributeDataType: "String",
      Mutable: false,
      Required: false,
      Label: "Phone Number",
      Placeholder: "Enter your phone number",
    },
  ],
}
