
File acp-config.json contains all configuration and setting that belongs to the **CognitoUserPool** and **CognitoIdentityPool**.
It has structure like this:

    {
    "userPoolProperties": {...},
    "userPoolClientProperties": {},
    "userGroups": [{}]
    "cognitoAdminApiSecuritySetting": {...}
    "notificationApiSecuritySetting": {...},
    "userPreferencesApiSecuritySetting": {...}
    "notificationMessagesApiSecuritySetting": {...}
    }

## userPoolProperties

A user pool is a user directory in Amazon Cognito. With a user pool, your users can sign in to your web or mobile app through Amazon Cognito. Your users can also sign in through social identity providers like Google, Facebook, Amazon, or Apple, and through SAML identity providers. Whether your users sign in directly or through a third party, all members of the user pool have a directory profile that you can access through a Software Development Kit (SDK).

User pools provide:

- Sign-up and sign-in services.
- A built-in, customizable web UI to sign in users.
- Social sign-in with Facebook, Google, Login with Amazon, and Sign in with Apple, as well as sign-in with SAML identity providers from your user pool
- User directory management and user profiles.
- Security features such as multi-factor authentication (MFA), checks for compromised credentials, account takeover protection, and phone and email verification.
- Customized workflows and user migration through AWS Lambda triggers.

It has structure like this:

    {
    	"AccountRecoverySetting" : Object
        "AdminCreateUserConfig": Object
    	"AutoVerifiedAttributes" : [ String, ... ],
    	"EmailVerificationMessage" : String,
    	"EmailVerificationSubject" : String,
    	"MfaConfiguration" : String,
    	"Policies" : Policies,
    	"Schema" : [ SchemaAttribute, ... ],
    	"SmsAuthenticationMessage" : String,
    	"SmsVerificationMessage" : String,
    	"UsernameAttributes" : [ String, ... ],
    	"UsernameConfiguration" : UsernameConfiguration,
    }

**Schema**
The schema attributes for the user pool. These attributes can be standard or custom attributes.

> During a user pool update, you can add new schema attributes but you cannot modify or delete an existing schema attribute.

- Required: No
- Type: List of objects
- Maximum: `50`

`Schema` has following structure :

    [
    	{
    	  "AttributeDataType" : String,
    	  "Mutable" : Boolean,
    	  "Name" : String,
    	  "NumberAttributeConstraints" : NumberAttributeConstraints,
    	  "Required" : Boolean,
    	  "StringAttributeConstraints" : StringAttributeConstraints
    	}
    ]

`AttributeDataType`
The attribute data type.

- Required: No
- Type: String
- Allowed values: `Boolean | DateTime | Number | String`

`Mutable`
Specifies whether the value of the attribute can be changed.
For any user pool attribute that's mapped to an identity provider attribute, you must set this parameter to `true`. Amazon Cognito updates mapped attributes when users sign in to your application through an identity provider. If an attribute is immutable, Amazon Cognito throws an error when it attempts to update the attribute.

- Required: No
- Type: Boolean

`Name`
A schema attribute of the name type.

- Required: No
- Type: String
- Minimum: `1`
- Maximum: `20`
- Pattern: `[\p{L}\p{M}\p{S}\p{N}\p{P}]+`

`NumberAttributeConstraints`
Specifies the constraints for an attribute of the number type.

- Required: No
- Type: Object

NumberAttributeConstraints has following structure :

     "NumberAttributeConstraints": {
          MaxValue: string
          MinValue: string
     }

`StringAttributeConstraints`
Specifies the constraints for an attribute of the string type.

- Required: No
- Type: Object

StringAttributeConstraints has following structure :

     "StringAttributeConstraints": {
          MaxLength: string
          MinLength: string
     }

`Required`
Specifies whether a user pool attribute is required. If the attribute is required and the user does not provide a value, registration or sign-in will fail.

- Required: No
- Type: Boolean

This is an example of schema:

    "Schema": [
          {
            "Name": "email",
            "AttributeDataType": "String",
            "Mutable": false,
            "Required": true
          },
          {
            "Name": "phone_number",
            "AttributeDataType": "String",
            "Mutable": false,
            "Required": false
          }
        ]

**AccountRecoverySetting**
Use this setting to define which verified available method a user can use to recover their password when they call `ForgotPassword`. It allows you to define a preferred method when a user has more than one method available. With this setting, SMS does not qualify for a valid password recovery mechanism if the user also has SMS MFA enabled. In the absence of this setting, Cognito uses the legacy behavior to determine the recovery method where SMS is preferred over email.

- Required: No
- Type: Object with this structure:

`AccountRecoverySetting` has following structure :

    {
        "RecoveryMechanisms": [
    		{
    			"Name" : `String`,
    			"Priority": `Integer`
    	   	}
       ]
    }

This is an example of account recovery setting:

    "RecoveryMechanisms": {
         [
            {
                 "Name": "verified_email",
                 "Priority": 1
            },
            {
                "Name": "verified_phone_number",
                "Priority": 2
            }
        ]
    }

**AutoVerifiedAttributes**
The attributes to be auto-verified. Possible values: **email**, **phone_number**.

- Required: No
- Type: List of String

**EmailVerificationMessage**
A string representing the email verification message.

- Required: No
- Type: String
- Minimum: `6`
- Maximum: `20000`
- Pattern: `[\p{L}\p{M}\p{S}\p{N}\p{P}\s*]*\{####\}[\p{L}\p{M}\p{S}\p{N}\p{P}\s*]*`

**EmailVerificationSubject**
A string representing the email verification subject.

- Required: No
- Type: String
- Minimum: `1`
- Maximum: `140`
- Pattern: `[\p{L}\p{M}\p{S}\p{N}\p{P}\s]+`

**MfaConfiguration**
The multi-factor (MFA) configuration. Valid values include:

- Required: No
- Type: String
- Allowed values: `OFF | ON | OPTIONAL`

This is short description about each allowd values:

- `OFF` MFA will not be used for any users.
- `ON` MFA is required for all users to sign in.
- `OPTIONAL` MFA will be required only for individual users who have an MFA factor enabled.

**Policies**
The policy associated with a user pool.

- Required: No
- Type: Object

Policy property holds object with following strucrue:

    "Policies": {
        "PasswordPolicy": {
    		    "MinimumLength": 8,
    		    "RequireLowercase": false,
    		    "RequireNumbers": false,
    		    "RequireSymbols": false,
    		    "RequireUppercase": false,
    		    "TemporaryPasswordValidityDays": 365
    	    }
        }

**SmsAuthenticationMessage**
A string representing the SMS authentication message.

- Required: No
- Type: String
- Minimum: `6`
- Maximum: `140`
- Pattern:`.*\{####\}.*`

**SmsVerificationMessage**
A string representing the SMS verification message.

- Required: No
- Type: String
- Minimum: `6`
- Maximum: `140`
- Pattern: `.*\{####\}.*`

**UsernameAttributes**
Determines whether email addresses or phone numbers can be specified as user names when a user signs up. Possible values: `phone_number` or `email`.
This user pool property cannot be updated.

- Required: No
- Type: List of String

**UsernameConfiguration**
You can choose to set case sensitivity on the username input for the selected sign-in option. For example, when this is set to `False`, users will be able to sign in using either "username" or "Username". This configuration is immutable once it has been set.

- Required: No
- Type: Object

UsernameConfiguration property holds object with following strucrue:

    "UsernameConfiguration":{
        "CaseSensitive": false
    }

**AdminCreateUserConfig**
The configuration for AdminCreateUser requests. If you want to disable user sign up, you can use this setting.

- Required: No
- Type: Object

`AdminCreateUserConfig` property holds object with following strucrue:

    AdminCreateUserConfig: {
        AllowAdminCreateUserOnly: boolean
        InviteMessageTemplate?: {
            EmailMessage?: string
            EmailSubject?: string
            SMSMessage?: string
        }
    }

`AllowAdminCreateUserOnly`
Set to `True` if only the administrator is allowed to create user profiles. Set to `False` if users can sign themselves up via an app.

- Required: No
- Type: boolean

`EmailMessage`
The message template for email messages. EmailMessage is allowed only if EmailSendingAccount is DEVELOPER.

- Required: No
- Type: number
- Minimum: 6
- Maximum: 20000
- Pattern: [\p{L}\p{M}\p{S}\p{N}\p{P}\s*]_\{####\}[\p{L}\p{M}\p{S}\p{N}\p{P}\s_]\*

`EmailMessage`
The subject line for email messages. EmailSubject is allowed only if EmailSendingAccount is DEVELOPER.

- Required: No
- Type: number
- Minimum: 1
- Maximum: 140
- Pattern: [\p{L}\p{M}\p{S}\p{N}\p{P}\s]+

`EmailMessage`
The message template for SMS messages.

- Required: No
- Type: number
- Minimum: 6
- Maximum: 140
- Pattern: ._\{####\}._

## userPoolClientProperties

A **Cognito User Pool Client** is a resource that provides a way to generate authentication tokens used to authorize a user for an application. Configuring a User Pool Client then connecting it to a User Pool will generate to a User Pool client ID. An application will need this client ID in order for it to access the User Pool, in addition to the necessary User Pool's identifiers.
For now, It contains following properties:

    {
          "AccessTokenValidity" : Integer,
          "AllowedOAuthFlows" : [ String, ... ],
          "AllowedOAuthScopes" : [ String, ... ],
          "CallbackURLs" : [ String, ... ],
          "LogoutURLs" : [ String, ... ],
          "ReadAttributes" : [ String, ... ],
          "WriteAttributes" : [ String, ... ]
          "GenerateSecret" : Boolean,
          "RefreshTokenValidity" : Integer
    }

**AccessTokenValidity**
The time limit, after which the access token is no longer valid and cannot be used.

- Required: No
- Type: Integer

AllowedOAuthFlows
The allowed OAuth flows.
Set to `code` to initiate a code grant flow, which provides an authorization code as the response. This code can be exchanged for access tokens with the token endpoint.
Set to `implicit` to specify that the client should get the access token (and, optionally, ID token, based on scopes) directly.
Set to `client_credentials` to specify that the client should get the access token (and, optionally, ID token, based on scopes) from the token endpoint using a combination of client and client_secret.

- Required\_: No
- Type*: List of String Maximum*: `3`

**AllowedOAuthScopes**
The allowed OAuth scopes. Possible values provided by OAuth are: `phone`, `email`, `openid`, and `profile`. Possible values provided by AWS are: `aws.cognito.signin.user.admin`. Custom scopes created in Resource Servers are also supported.

- Required: No
- Type: List of String
- Maximum: `50`

**CallbackURLs**
A list of allowed redirect (callback) URLs for the identity providers.
A redirect URI must:

- Be an absolute URI.
- Be registered with the authorization server.
- Not
  include a fragment component.

Amazon Cognito requires HTTPS over HTTP except for http://localhost for testing purposes only.
App callback URLs such as myapp://example are also supported.

- Required: No
- Type: List of String
- Maximum: `100`

**LogoutURLs**
A list of allowed logout URLs for the identity providers.

- Required: No
- Type: List of String
- Maximum: `100`

**WriteAttributes**
The user pool attributes that the app client can write to. You propbly define some properties for each user in Cognito User Pool. In this WriteAttributes you can specify properties of user that this client can rean

- Required: No
- Type: List of String

**ReadAttributes**
The user pool attributes that the app client can read. You propbly define some properties for each user in Cognito User Pool. In this ReadAttributes you can specify properties of user that this client can rean

- Required: No
- Type: List of String

**GenerateSecret**
Boolean to specify whether you want to generate a secret for the user pool client being created.

- Required: No
- Type: Boolean

**RefreshTokenValidity**
The time limit, in days, after which the refresh token is no longer valid and cannot be used.

- Required: No
- Type: Integer
- Minimum: `0`
- Maximum: `315360000`

## userGroups

If you want to define different groups for users, you can define them in **userGroups** property if acp-config.json file.
It is an array of objects that defined groups if UserPool and its structure is like bellow:

    [
    	{
    		"GroupName": string,
    		"Precedence": number
    	}
    ]

**GroupName**
The name of the group. Must be unique.

- Type: String
- Required: Yes
- Minimum: `1`
- Maximum: `128`
- Pattern: `[\p{L}\p{M}\p{S}\p{N}\p{P}]+`

**Precedence**
A nonnegative integer value that specifies the precedence of this group relative to the other groups that a user can belong to in the user pool. Zero is the highest precedence value. Groups with lower `Precedence` values take precedence over groups with higher or null `Precedence` values.
Two groups can have the same `Precedence` value. If this happens, neither group takes precedence over the other.

- Required: No
- Type: Double
- Minimum: `0`

This is an example if user group definition:

    "userGroups": [
    	{ "GroupName": "Admins", "Precedence": 1 },
    	{ "GroupName": "Editors", "Precedence": 2 },
    	{ "GroupName": "Users", "Precedence": 3 }
    ]

## cognitoAdminApiSecuritySetting

For user management of application we create API gateway that provide all required service for managing user pool. For now these APIs are available:

- **listUsers**: Get list of all users. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_ListUsers.html).
- **adminCreateUser**: Create new user. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminCreateUser.html).
- **adminDeleteUser**: Delete existing user. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminDeleteUser.html).
- **adminGetUser**: Get specific user by id. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminGetUser.html)
- **adminUpdateUserAttributes**: Update attributes of specific user. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminUpdateUserAttributes.html).
- **adminDisableUser**: Disable user by id. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminDisableUser.html).
- **adminEnableUser**: Enable user by id. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminEnableUser.html).
- **adminSetUserPassword**: Change password of user by id. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminSetUserPassword.html).
- **adminRemoveUserFromGroup**: Remove specific group from user groups. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminRemoveUserFromGroup.html).
- **adminListGroupsForUser**: Get all user groups. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminListGroupsForUser.html).
- **adminAddUserToGroup**: Add specific group to user groups. More information [here](https://docs.aws.amazon.com/cognito-user-identity-pools/latest/APIReference/API_AdminAddUserToGroup.html).

Security each endpoint of these APIs can be deteminded seperately. you can assign following object to each property of **_cognitoAdminApiSecuritySetting_**

        {
    	  "authenticated": false,
    	  "authorized": []
      }

If you want specific API to be available for all user (Auheticated or unauthenticated) you must assign the following object to that API

      {
    	  "authenticated": false
      }

If you want specific API to be available for all Auheticated users, you must assign the following object to that API

      {
    	  "authenticated": true
      }

If you want specific API to be available for all users if specific **group(s)** you must assign the following object to that API

      {
    	  "authenticated": true
    	  "authorized": ["GroupName1", "GroupName2"]
      }




## notificationApiSecuritySetting

If you have notification-enabled entities that set to `notification` notification API will be created by the system. As a developer, you should specify the security for these APIs.

- **delete**: Delete notification info from system.
- **post**: Update notification or insert new one.
- **put**: Insert notification or update existing.
- **get**: Get one item with key.
- **scan**: Scan DynamoDB table.

Security each endpoint of these APIs can be determined separately by following structure

      {
    	  "authenticated": false,
    	  "authorized": []
      }

If you want specific API to be available for all user (Auheticated or unauthenticated) you must assign the following object to that API

      {
    	  "authenticated": false
      }

If you want specific API to be available for all Auheticated users, you must assign the following object to that API

      {
    	  "authenticated": true
      }

If you want specific API to be available for all users if specific **group(s)** you must assign the following object to that API

      {
    	  "authenticated": true
    	  "authorized": ["GroupName1", "GroupName2"]
      }




## userPreferencesApiSecuritySetting

If you have notification enabled entities that set to `notification` user preferences API will be created by system. As a developer, you should specifiy security for these APIs.

- **delete**: Delete user preference info from system.
- **post**: Update user preference or insert new one.
- **put**: Insert user preference or update existing.
- **get**: Get one item with key.
- **scan**: NOT SUPPORTED.

Security each endpoint of these APIs can be deteminded seperately by following structure

      {
    	  "authenticated": false,
    	  "authorized": []
      }

If you want specifc API be available for all user (Auheticated or unauthenticated) you must assign following object to that API

      {
    	  "authenticated": false
      }

If you want specifc API be available for all Auheticated users, you must assign following object to that API

      {
    	  "authenticated": true
      }

If you want specifc API be available for all users if spoecific **group(s)** you must assign following object to that API

      {
    	  "authenticated": true
    	  "authorized": ["GroupName1", "GroupName2"]
      }



## userPreferencesApiSecuritySetting

If you have notification enabled entities that set to `notification`, notification messages API will be created by system. As a developer, you should specifiy security for these APIs.

- **delete**: NOT SUPPORTED.
- **post**: NOT SUPPORTED.
- **put**: NOT SUPPORTED.
- **get**: Get one item with key.
- **scan**: NOT SUPPORTED.

Security each endpoint of these APIs can be deteminded seperately by following structure

      {
    	  "authenticated": false,
    	  "authorized": []
      }

If you want specifc API be available for all user (Auheticated or unauthenticated) you must assign following object to that API

      {
    	  "authenticated": false
      }

If you want specifc API be available for all Auheticated users, you must assign following object to that API

      {
    	  "authenticated": true
      }

If you want specifc API be available for all users if spoecific **group(s)** you must assign following object to that API

      {
    	  "authenticated": true
    	  "authorized": ["GroupName1", "GroupName2"]
      }


# notification-config.json

If you have an entity that is **userNotfication** value in the **getNotificationInfo** method, the you must configure notification config file. This file has structure lie below

```
{
    activeChannels: {
        channelName: string
        activePlugins: string[]
    }[]
    categoryConfig: {
        title: string
        notificationType: "OPT-IN" | "OPT-OUT"
    }[]
}
```

## activeChannels

Defines active communication channels between project and users. each channel has a name and active plugins.
each channel can have multiple active plugin because there is more than one service provider for each channel. For example Email can be sent by SES, MainGun, ...

- **channelName**: For now just **SMS** and **Email** channels are active.
- **activePlugins**: For now just **SES** is active for **Email** and **twilio** is active for **SMS**.

## categoryConfig

Each active notification must have a category. With category definition you can categorize notifications of your software and have better control on them. 

- **title**: Name of category. for example `supprt`, `sales`
- **notificationType**: Defined that notifications of this group must be sent by default of not if user not define anything in user-preferences table. Possible values  are `OPT-IN` or `OPT-OUT`

