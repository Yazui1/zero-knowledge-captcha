# Zero knowledge captcha

Traditional captcha systems expose users to privacy risks, because they
require users to connect to a third-party service allowing the service
to link the user to the website.

Zero knowledge captcha challenges users without exposing them to this privacy risk.

## Demo

Visit [zero-knowledge-captcha.aerobicpeppermint.workers.dev](https://zero-knowledge-captcha.aerobicpeppermint.workers.dev/) to see a demo.

A test page is available at [zero-knowledge-captcha.aerobicpeppermint.workers.dev/test](https://zero-knowledge-captcha.aerobicpeppermint.workers.dev/test).

## Setup

1. Clone the repository and install dependencies:
  
    ```sh
    git clone git@github.com:yazui1/zero-knowledge-captcha.git && cd zero-knowledge-captcha
    npm install
    ```

2. Copy `example.dev.vars` to `.dev.vars` and fill in the required values.  
   Refer to the [Turnstile documentation](https://developers.cloudflare.com/turnstile/get-started/#get-a-sitekey-and-secret-key) to get a site key and secret key and [RSA Key Generator](https://emn178.github.io/online-tools/rsa/key-generator/) to generate a public and private key pair.

## Run locally

```sh
npm run dev
```

## Deploy

```sh
npm run deploy
```

## License

This project is licensed under GNU General Public License v3.0.
