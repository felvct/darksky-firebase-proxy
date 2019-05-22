# darksky-firebase-proxy

A [Firebase Cloud Functions](https://firebase.google.com/docs/functions/) Proxy for [DarkSky](https://darksky.net/poweredby/) which resolves CORS and secures your API key in the back-end as an environment variable.

## Getting Started

### Clone the repository
```bash
$ git clone https://github.com/felvct/darksky-firebase-proxy
```

### Get your DarkSky API Key
You will need to sign-up in order to get a [DarkSky](https://darksky.net/dev) API Key. You will be allowed to make up to 1000 free API calls per day, more than enough for your own personal project.

### Create your Firebase Project - if needed
If your project is not already generated, head to the the [Firebase Console](https://console.firebase.google.com) and create it.
> Since the proxy is making a request outside of Googles' network, you will need to setup a [billing account](https://firebase.googleblog.com/2018/03/adding-free-usage-to-blaze-pricing-plan.html). If you select the Blaze Plan (pay-as-you-go) you will have the same free usage limits as the Spark (free) plan.

### Install the Firebase CLI - if needed
If this is your first time using Firebase Cloud Functions, you will have to install Firebase Tools:
```bash
$ npm i -g firebase-tools
```

### Initialize your Firebase Project
```bash
# sign into Firebase using your Google account
$ firebase login

# select your project ID
$ firebase use --add

# initalize your selected project
$ firebase init functions
```

### Store your API Key as an Environment Variable
Since we do not want that our API Key gets exposed in our frontend code, we will securely keep it on the server, moreover, we will store it as an environment variable.
```bash
$ firebase functions:config:set darksky.key="YOUR_API_KEY"
```

### Deploy the proxy function
In `functions/src/index.ts` you will find a cloud function which deals with CORS, proxies your API requests and protects your API Key. To use this endpoint, you will have to deploy it.

*Note: the current region is set to `europe-west1` (Belgium). If you prefer another region due to latency issues, please take a look at the different [Cloud Functions locations](https://firebase.google.com/docs/functions/locations) and select the one that suits you the most*

```bash
# install dependencies
$ npm run init
$ firebase deploy --only functions
```

After the first deploy you should get a URL that looks similar to this one: `https://<function-region>-<your-project-id>.cloundfunctions.net/darkSkyProxy`. This is the URL that will be used in your frontend code to make the request again DarkSky. The response body is the one from the main API.
