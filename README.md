```
nvm install
npm install
npm run dev
```

http://localhost:3000

Simulating a "mid-tier mobile" (a 4x CPU slowdown) it takes ~200ms to switch between the Dashboard and Plan pages.

It also always renders twice (for some reason) and the react profiler reports that the hook (`useQuery`) has changed.

To run in production mode:

```
npm run prod
```
