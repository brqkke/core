## Description

[Butanuki](https://butanuki.com) core source code

## Installation

```bash
$ npm install
```

## Running the app

```bash
# start api dev
$ cd butanuki-api && npm run start:dev

# start background processor dev
$ cd butanuki-api && npm run start-scheduler:dev

# start front dev
$ cd butanuki-front && npm run dev
```

## Test

```bash
# unit tests
$ cd butanuki-api && npm run test
```

## Background process flowchart
```mermaid
stateDiagram-v2
    [*] --> Logged: Login to butanuki
    Logged --> Linked: Link Bity account
    state Linked {
        [*] --> VALID_TOKEN: Bity auth server gives us\na Access/Refresh tokens pair
        VALID_TOKEN --> ACCESS_TOKEN_EXPIRED: Token expired\n(401 when trying to talk to bity)
        ACCESS_TOKEN_EXPIRED --> VALID_TOKEN: Refreshed token with refresh token
        ACCESS_TOKEN_EXPIRED --> BROKEN_TOKEN: Renew attempts failed        
        BROKEN_TOKEN --> VALID_TOKEN: User manually links back bity account
        VALID_TOKEN --> [*]
        
    }
    Linked --> HasPiggyBank: User creates Piggy Bank
    HasPiggyBank --> BityOrderCreated: User creates order, Bity order is created by butanuki
    state BityOrderCreated {
        [*] --> OPEN: BityOrder is created
        OPEN --> CANCELLED: Order is checked by background process and expired
        CANCELLED --> OPEN: User recreates an order
        OPEN --> FILLED_NEED_RENEW: Order was checked by bg process\n and was detected as executed
        FILLED_NEED_RENEW --> FILLED: Order is renewed by background process
        FILLED_NEED_RENEW --> OPEN: New order is created by background process
    } 
    
  
```

## Stay in touch
- Website - [https://butanuki.com](https://butanuki.com)
- Twitter - [@Butanuki21](https://twitter.com/Butanuki21)

## License

Butanuki is licensed [CC BY-NC-ND 4.0](LICENSE)
